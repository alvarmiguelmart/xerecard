import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RegisterPayload = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RegisterPayload | null;
  const name = body?.name?.trim() ?? "";
  const email = body?.email?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";
  const role = body?.role === "profissional" ? "PROFESSIONAL" : "CLIENT";

  if (name.length < 2 || !emailPattern.test(email) || password.length < 6) {
    return NextResponse.json(
      { message: "Informe nome, email válido e senha com pelo menos 6 caracteres." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return NextResponse.json(
      { message: "Já existe uma conta com este email." },
      { status: 409 }
    );
  }

  await prisma.user.create({
    data: {
      name,
      email,
      role,
      passwordHash: await hash(password, 12),
      plan: "FREE"
    }
  });

  return NextResponse.json({ ok: true });
}
