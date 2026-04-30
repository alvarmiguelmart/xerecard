import { PrismaClient } from "@prisma/client";
import { seedNotifications, seedServices } from "../lib/marketplace-data";
import { normalizeBrazilianWhatsApp } from "../lib/phone";

const prisma = new PrismaClient();

async function main() {
  const seedUsers = new Map<string, Awaited<ReturnType<typeof prisma.user.upsert>>>();

  for (const service of seedServices) {
    const email = `${service.ownerId}@xerecard.local`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: service.ownerName,
        image: service.ownerImage,
        verifiedAt: service.verified ? new Date() : null
      },
      create: {
        name: service.ownerName,
        email,
        role: "PROFESSIONAL",
        plan: "PROFESSIONAL",
        image: service.ownerImage,
        verifiedAt: service.verified ? new Date() : null
      }
    });

    seedUsers.set(service.ownerId, user);
  }

  const existingServices = await prisma.service.findMany({
    where: { title: { in: seedServices.map((service) => service.title) } },
    select: { title: true }
  });
  const existingTitles = new Set(existingServices.map((service) => service.title));
  const missingServices = seedServices.filter(
    (service) => !existingTitles.has(service.title)
  );

  if (missingServices.length > 0) {
    await prisma.service.createMany({
      data: missingServices.map((service) => {
        const whatsapp = normalizeBrazilianWhatsApp(service.whatsapp);
        const owner = seedUsers.get(service.ownerId);

        if (!whatsapp) {
          throw new Error(`Invalid seed WhatsApp number for service: ${service.title}`);
        }

        if (!owner) {
          throw new Error(`Missing seed owner for service: ${service.title}`);
        }

        return {
          mode: service.mode,
          title: service.title,
          category: service.category,
          location: service.location,
          priceLabel: service.priceLabel,
          description: service.description,
          whatsapp,
          imageUrl: service.image,
          ownerId: owner.id
        };
      })
    });
  }

  await Promise.all(
    seedServices.map((service) => {
      const owner = seedUsers.get(service.ownerId);

      if (!owner) {
        throw new Error(`Missing seed owner for service: ${service.title}`);
      }

      return prisma.service.updateMany({
        where: { title: service.title },
        data: {
          ownerId: owner.id,
          imageUrl: service.image
        }
      });
    })
  );

  const notificationUser = seedUsers.get(seedServices[0].ownerId);

  if (!notificationUser) {
    throw new Error("Missing notification seed user.");
  }

  const notificationCount = await prisma.notification.count({
    where: { recipientId: notificationUser.id }
  });

  if (notificationCount === 0) {
    await prisma.notification.createMany({
      data: seedNotifications.map((notification) => ({
        type: notification.unread ? "SERVICE_INTEREST" : "SUBSCRIPTION",
        title: notification.title,
        message: notification.description,
        recipientId: notificationUser.id
      }))
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
