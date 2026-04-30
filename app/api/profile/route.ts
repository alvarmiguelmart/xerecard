import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureProfileBioColumn } from "@/lib/profile-schema";
import { deleteUpload, saveUpload } from "@/lib/upload";

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Entre para atualizar o perfil." }, { status: 401 });
  }

  await ensureProfileBioColumn();

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "");
  const bio = String(formData.get("bio") ?? "").trim();
  const image = formData.get("image");
  const bannerImage = formData.get("bannerImage");
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { bannerImage: true, image: true }
  });
  const data: {
    name?: string;
    image?: string;
    bannerImage?: string;
    bio?: string;
    role?: "CLIENT" | "PROFESSIONAL";
  } = {};

  if (name.length >= 2 && name.length <= 80) {
    data.name = name;
  }

  if (role === "CLIENT" || role === "PROFESSIONAL") {
    data.role = role;
  }

  if (bio.length <= 220) {
    data.bio = bio;
  }

  if (image instanceof File && image.size > 0) {
    try {
      data.image = await saveUpload(image, "profiles");
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

  if (bannerImage instanceof File && bannerImage.size > 0) {
    try {
      data.bannerImage = await saveUpload(bannerImage, "profiles");
    } catch (error) {
      return NextResponse.json(
        {
          message:
            error instanceof Error ? error.message : "Não conseguimos salvar o banner."
        },
        { status: 400 }
      );
    }
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { bannerImage: true, image: true, name: true, bio: true }
  });

  if (data.image && currentUser?.image && currentUser.image !== data.image) {
    await deleteUpload(currentUser.image);
  }

  if (
    data.bannerImage &&
    currentUser?.bannerImage &&
    currentUser.bannerImage !== data.bannerImage
  ) {
    await deleteUpload(currentUser.bannerImage);
  }

  return NextResponse.json({
    ok: true,
    bannerImage: user.bannerImage,
    image: user.image,
    name: user.name,
    bio: user.bio
  });
}

