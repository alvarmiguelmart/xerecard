import { NextResponse } from "next/server";
import {
  createEmailVerificationToken,
  emailVerificationTtlMs,
  getEmailVerificationIdentifier,
  getEmailVerificationUrl,
  hasEmailDeliveryConfig,
  sendSignupVerificationEmail
} from "@/lib/email-verification";
import { prisma } from "@/lib/prisma";
import { checkAuthRateLimit } from "@/lib/rate-limit";

type ResendVerificationPayload = {
  email?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const genericResponse = {
  ok: true,
  message: "Se este email precisar de confirmação, enviaremos um novo link."
};

export async function POST(request: Request) {
  const limit = await checkAuthRateLimit(request, "resend-verification");

  if (!limit.success) {
    return NextResponse.json(
      { message: "Muitas tentativas. Tente novamente em instantes." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } }
    );
  }

  if (process.env.NODE_ENV === "production" && !hasEmailDeliveryConfig()) {
    return NextResponse.json(
      { message: "Confirmação por email indisponível. Tente novamente mais tarde." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as ResendVerificationPayload | null;
  const email = body?.email?.trim().toLowerCase() ?? "";

  if (!emailPattern.test(email) || email.length > 254) {
    return NextResponse.json(genericResponse);
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { emailVerified: true, passwordHash: true }
  });

  if (!user?.passwordHash || user.emailVerified) {
    return NextResponse.json(genericResponse);
  }

  const { token, tokenHash } = createEmailVerificationToken();
  const identifier = getEmailVerificationIdentifier(email);
  const verifyUrl = getEmailVerificationUrl(email, token);

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

  const sent = await sendSignupVerificationEmail({ email, verifyUrl });

  return NextResponse.json({
    ...genericResponse,
    verifyUrl: process.env.NODE_ENV === "production" || sent ? undefined : verifyUrl
  });
}
