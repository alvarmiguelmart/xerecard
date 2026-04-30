import type { Notification, Prisma, Service, ServiceMode } from "@prisma/client";
import {
  AppNotification,
  categories,
  MarketplaceService
} from "@/lib/marketplace-data";
import { getDatabaseConfigIssue } from "@/lib/env";
import { normalizeBrazilianWhatsApp } from "@/lib/phone";
import { ensureProfileBioColumn } from "@/lib/profile-schema";
import { prisma } from "@/lib/prisma";

type ServiceWithRelations = Service & {
  owner?: {
    id: string;
    name: string | null;
    image: string | null;
    verifiedAt?: Date | null;
  };
  _count?: {
    likes?: number;
    ratings?: number;
  };
  ratings?: Array<{
    score: number;
  }>;
};

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

function assertDatabaseReady() {
  const issue = getDatabaseConfigIssue();

  if (issue) {
    throw new DatabaseError(issue);
  }
}

export function mapService(service: ServiceWithRelations): MarketplaceService {
  const ratingCount = service._count?.ratings ?? service.ratings?.length ?? 0;
  const ratingTotal = service.ratings?.reduce((total, rating) => total + rating.score, 0) ?? 0;

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
    image: service.imageUrl,
    whatsapp: service.whatsapp,
    tags: [service.category, service.location, service.mode === "REQUEST" ? "Pedido" : "Oferta"],
    verified: Boolean(service.owner?.verifiedAt),
    contentType: service.mode === "REQUEST" ? "Pedido" : "Serviço",
    likeCount: service._count?.likes ?? 0,
    ratingCount,
    rating: ratingCount > 0 ? ratingTotal / ratingCount : 0
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
  owner: { select: { id: true, name: true, image: true, verifiedAt: true } },
  ratings: { select: { score: true } },
  _count: { select: { likes: true, ratings: true } }
} satisfies Prisma.ServiceInclude;

export type ListServicesOptions = {
  query?: string;
  mode?: ServiceMode | "all";
  category?: string;
  location?: string;
  verifiedOnly?: boolean;
  cursor?: string;
  take?: number;
};

function buildServiceWhere(options: ListServicesOptions = {}): Prisma.ServiceWhereInput {
  const query = options.query?.trim();
  const location = options.location?.trim();
  const category =
    options.category && categories.includes(options.category as (typeof categories)[number])
      ? options.category
      : undefined;

  return {
    published: true,
    mode: options.mode && options.mode !== "all" ? options.mode : undefined,
    category,
    owner: options.verifiedOnly ? { verifiedAt: { not: null } } : undefined,
    location: location ? { contains: location, mode: "insensitive" } : undefined,
    OR: query
      ? [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
          { owner: { name: { contains: query, mode: "insensitive" } } }
        ]
      : undefined
  };
}

export async function listServices(options: ListServicesOptions = {}) {
  try {
    assertDatabaseReady();

    const take = Math.min(Math.max(options.take ?? 60, 1), 100);
    const services = await prisma.service.findMany({
      where: buildServiceWhere(options),
      include: serviceInclude,
      take,
      skip: options.cursor ? 1 : 0,
      cursor: options.cursor ? { id: options.cursor } : undefined,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }]
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
    assertDatabaseReady();

    const service = await prisma.service.findFirst({
      where: { id, published: true },
      include: serviceInclude
    });

    if (!service) {
      return null;
    }

    const aggregate = await prisma.rating.aggregate({
      where: { serviceId: service.id },
      _avg: { score: true },
      _count: { score: true }
    });

    return {
      ...mapService(service),
      rating: aggregate._avg.score ?? 0,
      ratingCount: aggregate._count.score
    };
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : "Não foi possível carregar o serviço."
    );
  }
}

export async function findRawService(id: string) {
  try {
    assertDatabaseReady();

    return await prisma.service.findFirst({
      where: { id, published: true },
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
  assertDatabaseReady();

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

export async function updateService(input: {
  id: string;
  ownerId: string;
  mode: ServiceMode;
  title: string;
  category: string;
  location: string;
  priceLabel: string;
  description: string;
  whatsapp: string;
  imageUrl?: string;
}) {
  assertDatabaseReady();

  const whatsapp = normalizeBrazilianWhatsApp(input.whatsapp);

  if (!whatsapp) {
    throw new Error("WhatsApp inválido.");
  }

  const service = await prisma.service.update({
    where: {
      id: input.id,
      ownerId: input.ownerId,
      published: true
    },
    data: {
      mode: input.mode,
      title: input.title,
      category: input.category,
      location: input.location,
      priceLabel: input.priceLabel,
      description: input.description,
      whatsapp,
      ...(input.imageUrl ? { imageUrl: input.imageUrl } : {})
    },
    include: serviceInclude
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
    assertDatabaseReady();

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
    assertDatabaseReady();
    await ensureProfileBioColumn();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        bannerImage: true,
        bio: true,
        role: true,
        createdAt: true,
        services: {
          where: { published: true },
          include: serviceInclude,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }]
        },
        _count: {
          select: { services: { where: { published: true } } }
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
      bannerImage: user.bannerImage,
      bio: user.bio,
      role: user.role,
      createdAt: user.createdAt,
      serviceCount: user._count.services,
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
