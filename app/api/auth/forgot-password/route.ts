import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAuthRateLimit } from "@/lib/rate-limit";
import {
  createPasswordResetToken,
  getPasswordResetIdentifier,
  getPasswordResetUrl,
  passwordResetTtlMs,
  sendPasswordResetEmail
} from "@/lib/password-reset";

type ForgotPasswordPayload = {
  email?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const genericResponse = {
  ok: true,
  message: "Se este email existir, enviaremos um link para redefinir a senha."
};

export async function POST(request: Request) {
  const limit = await checkAuthRateLimit(request, "forgot-password");

  if (!limit.success) {
    return NextResponse.json(
      { message: "Muitas tentativas. Tente novamente em instantes." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } }
    );
  }

  const body = (await request.json().catch(() => null)) as ForgotPasswordPayload | null;
  const email = body?.email?.trim().toLowerCase() ?? "";

  if (!emailPattern.test(email) || email.length > 254) {
    return NextResponse.json(genericResponse);
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true }
  });

  if (!user?.passwordHash) {
    return NextResponse.json(genericResponse);
  }

  const { token, tokenHash } = createPasswordResetToken();
  const identifier = getPasswordResetIdentifier(email);
  const resetUrl = getPasswordResetUrl(email, token);

  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier } }),
    prisma.verificationToken.create({
      data: {
        identifier,
        token: tokenHash,
        expires: new Date(Date.now() + passwordResetTtlMs)
      }
    })
  ]);

  const sent = await sendPasswordResetEmail({ email, resetUrl });

  return NextResponse.json({
    ...genericResponse,
    resetUrl: process.env.NODE_ENV === "production" || sent ? undefined : resetUrl
  });
}

