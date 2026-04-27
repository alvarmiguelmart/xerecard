import { PrismaClient } from "@prisma/client";
import { seedNotifications, seedServices } from "../lib/marketplace-data";
import { normalizeBrazilianWhatsApp } from "../lib/phone";

const prisma = new PrismaClient();

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@xerecard.local" },
    update: {
      name: "Equipe Xerecard",
      image: "/generated/marketplace-hero.png"
    },
    create: {
      name: "Equipe Xerecard",
      email: "demo@xerecard.local",
      role: "PROFESSIONAL",
      plan: "PROFESSIONAL",
      image: "/generated/marketplace-hero.png"
    }
  });

  const existingServices = await prisma.service.findMany({
    where: { ownerId: demoUser.id },
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

        if (!whatsapp) {
          throw new Error(`Invalid seed WhatsApp number for service: ${service.title}`);
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
          ownerId: demoUser.id
        };
      })
    });
  }

  const notificationCount = await prisma.notification.count({
    where: { recipientId: demoUser.id }
  });

  if (notificationCount === 0) {
    await prisma.notification.createMany({
      data: seedNotifications.map((notification) => ({
        type: notification.unread ? "SERVICE_INTEREST" : "SUBSCRIPTION",
        title: notification.title,
        message: notification.description,
        recipientId: demoUser.id
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
