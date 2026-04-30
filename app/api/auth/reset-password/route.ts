import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAuthRateLimit } from "@/lib/rate-limit";
import {
  getPasswordResetIdentifier,
  hashPasswordResetToken
} from "@/lib/password-reset";

type ResetPasswordPayload = {
  email?: string;
  token?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const limit = await checkAuthRateLimit(request, "reset-password");

  if (!limit.success) {
    return NextResponse.json(
      { message: "Muitas tentativas. Tente novamente em instantes." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } }
    );
  }

  const body = (await request.json().catch(() => null)) as ResetPasswordPayload | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  const token = body?.token ?? "";
  const password = body?.password ?? "";

  if (
    !emailPattern.test(email) ||
    token.length < 20 ||
    password.length < 8 ||
    password.length > 128
  ) {
    return NextResponse.json(
      { message: "Link inválido ou senha fora do padrão." },
      { status: 400 }
    );
  }

  const identifier = getPasswordResetIdentifier(email);
  const tokenHash = hashPasswordResetToken(token);
  const resetToken = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier, token: tokenHash } }
  });

  if (!resetToken || resetToken.expires.getTime() <= Date.now()) {
    return NextResponse.json(
      { message: "Link expirado ou inválido. Peça um novo link." },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { passwordHash: await hash(password, 12) }
    }),
    prisma.verificationToken.deleteMany({ where: { identifier } })
  ]);

  return NextResponse.json({ ok: true });
}

