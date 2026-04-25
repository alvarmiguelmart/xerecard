import type { Notification, Prisma, Service } from "@prisma/client";
import {
  AppNotification,
  MarketplaceService,
  seedNotifications,
  seedServices,
  ServiceMode
} from "@/lib/marketplace-data";
import { normalizeBrazilianWhatsApp } from "@/lib/phone";
import { prisma } from "@/lib/prisma";

type ServiceWithRelations = Service & {
  owner?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  ratings?: Array<{ score: number }>;
  _count?: {
    likes: number;
    ratings: number;
  };
};

function mapService(service: ServiceWithRelations): MarketplaceService {
  const ratingCount = service._count?.ratings ?? service.ratings?.length ?? 0;
  const ratingTotal =
    service.ratings?.reduce((total, rating) => total + rating.score, 0) ?? 0;
  const averageRating = ratingCount > 0 ? ratingTotal / ratingCount : 0;

  return {
    id: service.id,
    mode: service.mode === "REQUEST" ? "request" : "offer",
    title: service.title,
    category: service.category,
    location: service.location,
    priceLabel: service.priceLabel,
    description: service.description,
    ownerId: service.owner?.id ?? service.ownerId,
    ownerName: service.owner?.name ?? "Usuário Xerecard",
    ownerImage: service.owner?.image ?? null,
    rating: averageRating,
    ratingCount,
    likeCount: service._count?.likes ?? 0,
    image: service.imageUrl,
    whatsapp: service.whatsapp,
    tags: [service.category, service.location, service.mode === "REQUEST" ? "Pedido" : "Oferta"],
    verified: false
  };
}

function mapNotification(notification: Notification): AppNotification {
  return {
    id: notification.id,
    title: notification.title,
    description: notification.message,
    createdAt: new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" }).format(
      Math.max(-7, Math.round((notification.createdAt.getTime() - Date.now()) / 86400000)),
      "day"
    ),
    unread: !notification.readAt
  };
}

async function ensureSeedData() {
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
      data: missingServices.map((service) => ({
        mode: service.mode === "request" ? "REQUEST" : "OFFER",
        title: service.title,
        category: service.category,
        location: service.location,
        priceLabel: service.priceLabel,
        description: service.description,
        whatsapp: normalizeBrazilianWhatsApp(service.whatsapp),
        imageUrl: service.image,
        ownerId: demoUser.id
      }))
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

const serviceInclude = {
  owner: { select: { id: true, name: true, image: true } },
  ratings: { select: { score: true } },
  _count: { select: { likes: true, ratings: true } }
} satisfies Prisma.ServiceInclude;

export async function listServices() {
  await ensureSeedData();

  const services = await prisma.service.findMany({
    include: serviceInclude,
    orderBy: { createdAt: "desc" }
  });

  return services.map(mapService);
}

export async function findService(id: string) {
  await ensureSeedData();

  const service = await prisma.service.findUnique({
    where: { id },
    include: serviceInclude
  });

  return service ? mapService(service) : null;
}

export async function findRawService(id: string) {
  await ensureSeedData();

  return prisma.service.findUnique({
    where: { id },
    include: { owner: true }
  });
}

export async function createService(input: {
  mode: ServiceMode;
  title: string;
  category: string;
  location: string;
  priceLabel: string;
  description: string;
  whatsapp: string;
  ownerId: string;
  imageUrl: string;
}) {
  const service = await prisma.service.create({
    data: {
      mode: input.mode === "request" ? "REQUEST" : "OFFER",
      title: input.title,
      category: input.category,
      location: input.location,
      priceLabel: input.priceLabel,
      description: input.description,
      whatsapp: normalizeBrazilianWhatsApp(input.whatsapp),
      ownerId: input.ownerId,
      imageUrl: input.imageUrl
    },
    include: serviceInclude
  });

  await createNotification({
    recipientId: input.ownerId,
    type: "SERVICE_PUBLISHED",
    title: "Sua publicação está no ar",
    message: `${service.title} já aparece no marketplace.`
  });

  return mapService(service);
}

export async function listNotifications(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { recipientId: userId },
    orderBy: { createdAt: "desc" }
  });

  return notifications.map(mapNotification);
}

export async function findPublicProfile(userId: string) {
  await ensureSeedData();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      image: true,
      role: true,
      createdAt: true,
      services: {
        include: serviceInclude,
        orderBy: { createdAt: "desc" }
      },
      _count: {
        select: { services: true }
      }
    }
  });

  if (!user) {
    return null;
  }

  const services = user.services.map(mapService);

  return {
    id: user.id,
    name: user.name ?? "Usuário Xerecard",
    image: user.image,
    role: user.role,
    createdAt: user.createdAt,
    serviceCount: user._count.services,
    likeCount: services.reduce((total, service) => total + service.likeCount, 0),
    ratingCount: services.reduce((total, service) => total + service.ratingCount, 0),
    services
  };
}

export async function createNotification(input: {
  recipientId: string;
  type:
    | "SERVICE_PUBLISHED"
    | "SERVICE_INTEREST"
    | "SERVICE_LIKE"
    | "SERVICE_RATING"
    | "SUBSCRIPTION";
  title: string;
  message: string;
  actorId?: string;
  serviceId?: string;
}) {
  return prisma.notification.create({
    data: input
  });
}
