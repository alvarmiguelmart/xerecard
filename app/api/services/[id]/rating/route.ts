import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createNotification, findRawService } from "@/lib/marketplace-db";
import { prisma } from "@/lib/prisma";
import { createRatingSchema } from "@/lib/validations";

type RatingRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type RatingPayload = {
  score?: number;
};

export async function POST(request: Request, context: RatingRouteContext) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Entre para dar uma nota." }, { status: 401 });
  }

  const { id } = await context.params;
  const service = await findRawService(id);

  if (!service) {
    return NextResponse.json({ message: "Serviço não encontrado." }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as RatingPayload | null;
  const parsed = createRatingSchema.safeParse({
    serviceId: id,
    rating: Number(body?.score)
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Informe uma nota de 1 a 5.",
        errors: parsed.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  const score = parsed.data.rating;

  await prisma.rating.upsert({
    where: {
      userId_serviceId: {
        userId: session.user.id,
        serviceId: service.id
      }
    },
    update: { score },
    create: {
      score,
      userId: session.user.id,
      serviceId: service.id
    }
  });

  if (service.ownerId !== session.user.id) {
    await createNotification({
      recipientId: service.ownerId,
      actorId: session.user.id,
      serviceId: service.id,
      type: "SERVICE_RATING",
      title: "Sua publicação recebeu uma nota",
      message: `${session.user.name ?? "Um usuário"} avaliou "${service.title}" com ${score} estrelas.`
    });
  }

  const aggregate = await prisma.rating.aggregate({
    where: { serviceId: service.id },
    _avg: { score: true },
    _count: { score: true }
  });

  return NextResponse.json({
    ok: true,
    rating: aggregate._avg.score ?? 0,
    ratingCount: aggregate._count.score
  });
}
