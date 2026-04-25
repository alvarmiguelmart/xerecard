import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/upload";

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Entre para atualizar o perfil." }, { status: 401 });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const image = formData.get("image");
  const data: { name?: string; image?: string } = {};

  if (name.length >= 2) {
    data.name = name;
  }

  if (image instanceof File && image.size > 0) {
    data.image = await saveUpload(image, "profiles");
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { image: true, name: true }
  });

  return NextResponse.json({ ok: true, image: user.image, name: user.name });
}
