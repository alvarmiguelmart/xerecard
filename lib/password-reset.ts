import { createHash, randomBytes } from "node:crypto";
import { getAppUrl } from "@/lib/env";

export const passwordResetTtlMs = 60 * 60 * 1000;

export function createPasswordResetToken() {
  const token = randomBytes(32).toString("base64url");

  return {
    token,
    tokenHash: hashPasswordResetToken(token)
  };
}

export function hashPasswordResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getPasswordResetIdentifier(email: string) {
  return `password-reset:${email.toLowerCase()}`;
}

export function getPasswordResetUrl(email: string, token: string) {
  const url = new URL("/redefinir-senha", getAppUrl());
  url.searchParams.set("email", email);
  url.searchParams.set("token", token);
  return url.toString();
}

export async function sendPasswordResetEmail({
  email,
  resetUrl
}: {
  email: string;
  resetUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "Redefina sua senha no Xerecard",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0d1712">
          <h1>Redefinir senha</h1>
          <p>Use o link abaixo para criar uma nova senha. Ele expira em 1 hora.</p>
          <p><a href="${resetUrl}">Redefinir minha senha</a></p>
          <p>Se você não pediu isso, ignore este email.</p>
        </div>
      `
    })
  });

  return response.ok;
}
