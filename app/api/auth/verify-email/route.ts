import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getEmailVerificationIdentifier,
  hashEmailVerificationToken
} from "@/lib/email-verification";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email")?.trim().toLowerCase() ?? "";
  const token = url.searchParams.get("token") ?? "";
  const redirectUrl = new URL("/login", url.origin);

  if (!emailPattern.test(email) || !token) {
    redirectUrl.searchParams.set("mensagem", "Link de confirmação inválido.");
    return NextResponse.redirect(redirectUrl);
  }

  const identifier = getEmailVerificationIdentifier(email);
  const tokenHash = hashEmailVerificationToken(token);
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier, token: tokenHash } }
  });

  if (!verificationToken || verificationToken.expires < new Date()) {
    redirectUrl.searchParams.set("mensagem", "Link de confirmação expirado.");
    return NextResponse.redirect(redirectUrl);
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() }
    }),
    prisma.verificationToken.delete({
      where: { identifier_token: { identifier, token: tokenHash } }
    })
  ]);

  redirectUrl.searchParams.set("mensagem", "Email confirmado. Entre para continuar.");
  return NextResponse.redirect(redirectUrl);
}
