import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createService, DatabaseError, listServices } from "@/lib/marketplace-db";
import { normalizeBrazilianWhatsApp } from "@/lib/phone";
import { saveUpload } from "@/lib/upload";
import { createServiceSchema } from "@/lib/validations";
import type { ServiceMode } from "@prisma/client";

export async function GET() {
  try {
    return NextResponse.json({ services: await listServices() });
  } catch (error) {
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { message: "Serviços temporariamente indisponíveis." },
        { status: 503 }
      );
    }

    throw error;
  }
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
  const mode: ServiceMode = formData.get("mode") === "OFFER" ? "OFFER" : "REQUEST";
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const priceLabel = String(formData.get("priceLabel") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const whatsappDigits = normalizeBrazilianWhatsApp(whatsapp);
  const photo = formData.get("photos");

  const parsed = createServiceSchema.safeParse({
    mode,
    title,
    category,
    categories: [category],
    location,
    priceLabel,
    description,
    whatsapp: whatsappDigits ?? ""
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Preencha todos os campos com dados válidos.",
        errors: parsed.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  let imageUrl =
    mode === "REQUEST" ? "/generated/service-request.png" : "/generated/service-offer.png";

  if (photo instanceof File && photo.size > 0) {
    imageUrl = await saveUpload(photo, "services");
  }

  const service = await createService({
    mode: parsed.data.mode,
    title: parsed.data.title,
    category: parsed.data.category,
    location: parsed.data.location,
    priceLabel: parsed.data.priceLabel,
    description: parsed.data.description,
    whatsapp: parsed.data.whatsapp,
    ownerId: session.user.id,
    imageUrl
  });

  return NextResponse.json({ ok: true, service }, { status: 201 });
}
