import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findRawService, updateService } from "@/lib/marketplace-db";
import { normalizeBrazilianWhatsApp } from "@/lib/phone";
import { prisma } from "@/lib/prisma";
import { deleteUpload, saveUpload } from "@/lib/upload";
import { createServiceSchema } from "@/lib/validations";
import type { ServiceMode } from "@prisma/client";

type ServiceRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: ServiceRouteContext) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Entre para editar seu anúncio." }, { status: 401 });
  }

  const { id } = await context.params;
  const currentService = await findRawService(id);

  if (!currentService || currentService.ownerId !== session.user.id) {
    return NextResponse.json({ message: "Anúncio não encontrado." }, { status: 404 });
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

  let imageUrl: string | undefined;

  if (photo instanceof File && photo.size > 0) {
    try {
      imageUrl = await saveUpload(photo, "services");
    } catch (error) {
      return NextResponse.json(
        {
          message:
            error instanceof Error ? error.message : "Não conseguimos salvar a imagem."
        },
        { status: 400 }
      );
    }
  }

  try {
    const service = await updateService({
      id,
      ownerId: session.user.id,
      mode: parsed.data.mode,
      title: parsed.data.title,
      category: parsed.data.category,
      location: parsed.data.location,
      priceLabel: parsed.data.priceLabel,
      description: parsed.data.description,
      whatsapp: parsed.data.whatsapp,
      imageUrl
    });

    if (imageUrl && currentService.imageUrl !== imageUrl) {
      await deleteUpload(currentService.imageUrl);
    }

    return NextResponse.json({ ok: true, service });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Anúncio não encontrado." }, { status: 404 });
    }

    throw error;
  }
}

export async function DELETE(_request: Request, context: ServiceRouteContext) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Entre para excluir seu anúncio." }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const service = await prisma.service.update({
      where: {
        id,
        ownerId: session.user.id,
        published: true
      },
      data: { published: false },
      select: { imageUrl: true }
    });

    await deleteUpload(service.imageUrl);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Anúncio não encontrado." }, { status: 404 });
    }

    throw error;
  }
}
