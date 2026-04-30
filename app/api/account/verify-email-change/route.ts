import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  getEmailChangeIdentifier,
  hashEmailVerificationToken
} from "@/lib/email-verification";
import { prisma } from "@/lib/prisma";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") ?? "";
  const email = url.searchParams.get("email")?.trim().toLowerCase() ?? "";
  const token = url.searchParams.get("token") ?? "";
  const redirectUrl = new URL("/minha-conta", url.origin);

  if (!userId || !emailPattern.test(email) || !token) {
    redirectUrl.searchParams.set("mensagem", "Link de troca de email inválido.");
    return NextResponse.redirect(redirectUrl);
  }

  const identifier = getEmailChangeIdentifier(userId, email);
  const tokenHash = hashEmailVerificationToken(token);
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier, token: tokenHash } }
  });

  if (!verificationToken || verificationToken.expires < new Date()) {
    redirectUrl.searchParams.set("mensagem", "Link de troca de email expirado.");
    return NextResponse.redirect(redirectUrl);
  }

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { email, emailVerified: new Date() }
      }),
      prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token: tokenHash } }
      })
    ]);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      redirectUrl.searchParams.set("mensagem", "Este email já está em uso.");
      return NextResponse.redirect(redirectUrl);
    }

    throw error;
  }

  redirectUrl.searchParams.set("mensagem", "Email alterado.");
  return NextResponse.redirect(redirectUrl);
}
