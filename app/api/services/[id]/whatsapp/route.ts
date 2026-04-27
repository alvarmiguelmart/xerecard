import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createNotification, findRawService } from "@/lib/marketplace-db";
import { toWhatsAppDialNumber } from "@/lib/phone";

type ContactRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, context: ContactRouteContext) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { message: "Entre para chamar no WhatsApp." },
      { status: 401 }
    );
  }

  if (session.user.plan === "FREE") {
    return NextResponse.json(
      { message: "Assine o plano Essencial para abrir contatos no WhatsApp." },
      { status: 402 }
    );
  }

  const { id } = await context.params;
  const service = await findRawService(id);

  if (!service) {
    return NextResponse.json({ message: "Serviço não encontrado." }, { status: 404 });
  }

  if (service.ownerId !== session.user.id) {
    await createNotification({
      recipientId: service.ownerId,
      actorId: session.user.id,
      serviceId: service.id,
      type: "SERVICE_INTEREST",
      title: `${session.user.name ?? "Alguém"} tem interesse`,
      message: `${session.user.name ?? "Um usuário"} abriu o WhatsApp do anúncio "${service.title}".`
    });
  }

  const dialNumber = toWhatsAppDialNumber(service.whatsapp);

  if (!dialNumber) {
    return NextResponse.json(
      { message: "WhatsApp do anúncio está inválido." },
      { status: 422 }
    );
  }

  const text = encodeURIComponent(`Olá, vi seu anúncio no Xerecard: ${service.title}`);
  return NextResponse.json({
    ok: true,
    url: `https://wa.me/${dialNumber}?text=${text}`
  });
}
