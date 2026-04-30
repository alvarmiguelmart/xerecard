import { compare, hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ChangePasswordPayload = {
  currentPassword?: string;
  newPassword?: string;
};

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Entre para trocar sua senha." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as ChangePasswordPayload | null;
  const currentPassword = body?.currentPassword ?? "";
  const newPassword = body?.newPassword ?? "";

  if (newPassword.length < 8 || newPassword.length > 128) {
    return NextResponse.json(
      { message: "A nova senha deve ter 8 a 128 caracteres." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true }
  });

  if (!user?.passwordHash) {
    return NextResponse.json(
      { message: "Esta conta usa login social. Redefina o acesso pelo provedor." },
      { status: 400 }
    );
  }

  const passwordMatches = await compare(currentPassword, user.passwordHash);

  if (!passwordMatches) {
    return NextResponse.json({ message: "Senha atual incorreta." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash: await hash(newPassword, 12) }
  });

  return NextResponse.json({ ok: true, message: "Senha alterada." });
}
