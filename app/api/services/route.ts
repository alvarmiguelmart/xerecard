import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createService, listServices } from "@/lib/marketplace-db";
import { ServiceMode } from "@/lib/marketplace-data";
import { normalizeBrazilianWhatsApp } from "@/lib/phone";
import { saveUpload } from "@/lib/upload";

export async function GET() {
  return NextResponse.json({ services: await listServices() });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { message: "Entre para cadastrar um serviço." },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const mode: ServiceMode = formData.get("mode") === "offer" ? "offer" : "request";
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const priceLabel = String(formData.get("priceLabel") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const whatsappDigits = normalizeBrazilianWhatsApp(whatsapp);
  const photo = formData.get("photos");

  if (
    title.length < 6 ||
    category.length < 2 ||
    location.length < 2 ||
    priceLabel.length < 2 ||
    description.length < 20 ||
    whatsappDigits.length < 10 ||
    whatsappDigits.length > 11
  ) {
    return NextResponse.json(
      { message: "Preencha todos os campos. No WhatsApp, informe DDD e número, sem código do país." },
      { status: 400 }
    );
  }

  let imageUrl =
    mode === "request" ? "/generated/service-request.png" : "/generated/service-offer.png";

  if (photo instanceof File && photo.size > 0) {
    imageUrl = await saveUpload(photo, "services");
  }

  const service = await createService({
    mode,
    title,
    category,
    location,
    priceLabel,
    description,
    whatsapp,
    ownerId: session.user.id,
    imageUrl
  });

  return NextResponse.json({ ok: true, service });
}
