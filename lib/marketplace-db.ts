import type { Notification, Prisma, Service, ServiceMode } from "@prisma/client";
import {
  AppNotification,
  MarketplaceService
} from "@/lib/marketplace-data";
import { normalizeBrazilianWhatsApp } from "@/lib/phone";
import { prisma } from "@/lib/prisma";

type ServiceWithRelations = Service & {
  owner?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count?: {
    likes: number;
  };
};

const adultCategoryHints = [
  "+18",
  "Perfis verificados",
  "Packs digitais",
  "Conteúdo premium",
  "Lives privadas",
  "Ensaios sensuais",
  "Fotografia adulta",
  "Divulgação adulta",
  "Social media privado",
  "Loja de conteúdo",
  "Assinaturas e fãs",
  "Comunidades privadas",
  "Atendimento personalizado",
  "Verificação de perfil",
  "Segurança e privacidade"
];

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

function isAdultCategory(category: string) {
  return adultCategoryHints.some((hint) => category.includes(hint));
}

export function mapService(service: ServiceWithRelations): MarketplaceService {
  return {
    id: service.id,
    mode: service.mode,
    title: service.title,
    category: service.category,
    location: service.location,
    priceLabel: service.priceLabel,
    description: service.description,
    ownerId: service.owner?.id ?? service.ownerId,
    ownerName: service.owner?.name ?? "Usuário Xerecard",
    ownerImage: service.owner?.image ?? null,
    rating: 0,
    ratingCount: 0,
    likeCount: service._count?.likes ?? 0,
    image: service.imageUrl,
    whatsapp: service.whatsapp,
    tags: [service.category, service.location, service.mode === "REQUEST" ? "Pedido" : "Oferta"],
    verified: false,
    isAdult: isAdultCategory(service.category),
    contentType: service.mode === "REQUEST" ? "Pedido" : "Serviço"
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

const serviceInclude = {
  owner: { select: { id: true, name: true, image: true } },
  _count: { select: { likes: true } }
} satisfies Prisma.ServiceInclude;

export async function listServices() {
  try {
    const services = await prisma.service.findMany({
      include: serviceInclude,
      orderBy: { createdAt: "desc" }
    });

    return services.map(mapService);
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : "Não foi possível carregar os serviços."
    );
  }
}

export async function findService(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: serviceInclude
    });

    return service ? mapService(service) : null;
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : "Não foi possível carregar o serviço."
    );
  }
}

export async function findRawService(id: string) {
  try {
    return await prisma.service.findUnique({
      where: { id },
      include: { owner: true }
    });
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : "Não foi possível carregar o serviço."
    );
  }
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
  const whatsapp = normalizeBrazilianWhatsApp(input.whatsapp);

  if (!whatsapp) {
    throw new Error("WhatsApp inválido.");
  }

  const service = await prisma.service.create({
    data: {
      mode: input.mode,
      title: input.title,
      category: input.category,
      location: input.location,
      priceLabel: input.priceLabel,
      description: input.description,
      whatsapp,
      ownerId: input.ownerId,
      imageUrl: input.imageUrl
    },
    include: serviceInclude
  });

  await createNotification({
    recipientId: input.ownerId,
    type: "SERVICE_PUBLISHED",
    title: "Seu anúncio está no ar",
    message: `${service.title} já aparece no marketplace.`
  });

  return mapService(service);
}

export async function listNotifications({
  userId,
  cursor,
  take = 20
}: {
  userId: string;
  cursor?: string;
  take?: number;
}) {
  try {
    const notifications = await prisma.notification.findMany({
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: { recipientId: userId },
      orderBy: { createdAt: "desc" }
    });

    return {
      notifications: notifications.map(mapNotification),
      nextCursor: notifications.length === take ? notifications.at(-1)?.id ?? null : null
    };
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : "Não foi possível carregar as notificações."
    );
  }
}

export async function findPublicProfile(userId: string) {
  try {
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
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : "Não foi possível carregar o perfil."
    );
  }
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
