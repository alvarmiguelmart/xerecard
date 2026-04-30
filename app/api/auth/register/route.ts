import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
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

type RegisterPayload = {
  name?: string;
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minPasswordLength = 8;
const maxPasswordLength = 128;
const maxNameLength = 80;
const maxEmailLength = 254;
const duplicateSafeResponse = {
  ok: true,
  message: "Se os dados forem válidos, a conta será criada."
};

export async function POST(request: Request) {
  const limit = await checkAuthRateLimit(request, "register");

  if (!limit.success) {
    return NextResponse.json(
      { message: "Muitas tentativas. Tente novamente em instantes." },
      {
        status: 429,
        headers: {
          "retry-after": String(limit.retryAfter)
        }
      }
    );
  }

  const body = (await request.json().catch(() => null)) as RegisterPayload | null;
  const name = body?.name?.trim() ?? "";
  const email = body?.email?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";

  if (
    name.length < 2 ||
    name.length > maxNameLength ||
    email.length > maxEmailLength ||
    !emailPattern.test(email) ||
    password.length < minPasswordLength ||
    password.length > maxPasswordLength
  ) {
    return NextResponse.json(
      {
        message:
          "Informe nome, email válido e senha com 8 a 128 caracteres."
      },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return NextResponse.json(duplicateSafeResponse);
  }

  if (process.env.NODE_ENV === "production" && !hasEmailDeliveryConfig()) {
    return NextResponse.json(
      { message: "Confirmação por email indisponível. Tente novamente mais tarde." },
      { status: 503 }
    );
  }

  try {
    const { token, tokenHash } = createEmailVerificationToken();
    const identifier = getEmailVerificationIdentifier(email);

    await prisma.$transaction([
      prisma.user.create({
        data: {
          name,
          email,
          role: "CLIENT",
          passwordHash: await hash(password, 12),
          plan: "FREE"
        }
      }),
      prisma.verificationToken.deleteMany({ where: { identifier } }),
      prisma.verificationToken.create({
        data: {
          identifier,
          token: tokenHash,
          expires: new Date(Date.now() + emailVerificationTtlMs)
        }
      })
    ]);

    const verifyUrl = getEmailVerificationUrl(email, token);
    const sent = await sendSignupVerificationEmail({ email, verifyUrl });

    return NextResponse.json({
      ok: true,
      message: "Conta criada. Confirme seu email antes de entrar.",
      verifyUrl: process.env.NODE_ENV === "production" || sent ? undefined : verifyUrl
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(duplicateSafeResponse);
    }

    throw error;
  }

  return NextResponse.json({ ok: true });
}

