import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createEmailVerificationToken,
  emailVerificationTtlMs,
  getEmailChangeIdentifier,
  getEmailChangeUrl,
  sendEmailChangeEmail
} from "@/lib/email-verification";
import { prisma } from "@/lib/prisma";

type ChangeEmailPayload = {
  newEmail?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Entre para trocar seu email." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as ChangeEmailPayload | null;
  const newEmail = body?.newEmail?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";

  if (!emailPattern.test(newEmail) || newEmail.length > 254) {
    return NextResponse.json({ message: "Informe um email válido." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, passwordHash: true }
  });

  if (!user) {
    return NextResponse.json({ message: "Conta não encontrada." }, { status: 404 });
  }

  if (user.email === newEmail) {
    return NextResponse.json({ message: "Este email já está na sua conta." }, { status: 400 });
  }

  if (user.passwordHash) {
    const passwordMatches = await compare(password, user.passwordHash);

    if (!passwordMatches) {
      return NextResponse.json({ message: "Senha incorreta." }, { status: 400 });
    }
  }

  const emailInUse = await prisma.user.findUnique({
    where: { email: newEmail },
    select: { id: true }
  });

  if (emailInUse) {
    return NextResponse.json({ message: "Este email já está em uso." }, { status: 400 });
  }

  const { token, tokenHash } = createEmailVerificationToken();
  const identifier = getEmailChangeIdentifier(session.user.id, newEmail);
  const verifyUrl = getEmailChangeUrl(session.user.id, newEmail, token);

  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier } }),
    prisma.verificationToken.create({
      data: {
        identifier,
        token: tokenHash,
        expires: new Date(Date.now() + emailVerificationTtlMs)
      }
    })
  ]);

  const sent = await sendEmailChangeEmail({ email: newEmail, verifyUrl });

  return NextResponse.json({
    ok: true,
    message: "Enviamos um link de confirmação para o novo email.",
    verifyUrl: process.env.NODE_ENV === "production" || sent ? undefined : verifyUrl
  });
}
