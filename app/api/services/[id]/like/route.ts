import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createNotification, findRawService } from "@/lib/marketplace-db";
import { prisma } from "@/lib/prisma";

type LikeRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, context: LikeRouteContext) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Entre para curtir." }, { status: 401 });
  }

  const { id } = await context.params;
  const service = await findRawService(id);

  if (!service) {
    return NextResponse.json({ message: "Serviço não encontrado." }, { status: 404 });
  }

  const like = await prisma.like.upsert({
    where: {
      userId_serviceId: {
        userId: session.user.id,
        serviceId: service.id
      }
    },
    update: {},
    create: {
      userId: session.user.id,
      serviceId: service.id
    }
  });

  if (service.ownerId !== session.user.id) {
    await createNotification({
      recipientId: service.ownerId,
      actorId: session.user.id,
      serviceId: service.id,
      type: "SERVICE_LIKE",
      title: "Sua publicação recebeu uma curtida",
      message: `${session.user.name ?? "Um usuário"} curtiu "${service.title}".`
    });
  }

  const likeCount = await prisma.like.count({ where: { serviceId: service.id } });

  return NextResponse.json({ ok: true, like, likeCount });
}
