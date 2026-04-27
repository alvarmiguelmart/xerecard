import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAuthRateLimit } from "@/lib/rate-limit";

type RegisterPayload = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minPasswordLength = 10;
const duplicateSafeResponse = {
  ok: true,
  message: "Se os dados forem válidos, a conta será criada."
};

export async function POST(request: Request) {
  const limit = checkAuthRateLimit(request);

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
  const role = body?.role === "PROFESSIONAL" ? "PROFESSIONAL" : "CLIENT";

  if (name.length < 2 || !emailPattern.test(email) || password.length < minPasswordLength) {
    return NextResponse.json(
      { message: `Informe nome, email válido e senha com pelo menos ${minPasswordLength} caracteres.` },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return NextResponse.json(duplicateSafeResponse);
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        role,
        passwordHash: await hash(password, 12),
        plan: "FREE"
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(duplicateSafeResponse);
    }

    throw error;
  }

  return NextResponse.json({ ok: true });
}
