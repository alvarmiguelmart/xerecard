import { createHash, randomBytes } from "node:crypto";
import { getAppUrl } from "@/lib/env";

export const emailVerificationTtlMs = 24 * 60 * 60 * 1000;

export function hasEmailDeliveryConfig() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export function createEmailVerificationToken() {
  const token = randomBytes(32).toString("base64url");

  return {
    token,
    tokenHash: hashEmailVerificationToken(token)
  };
}

export function hashEmailVerificationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getEmailVerificationIdentifier(email: string) {
  return `email-verification:${email.toLowerCase()}`;
}

export function getEmailChangeIdentifier(userId: string, email: string) {
  return `email-change:${userId}:${email.toLowerCase()}`;
}

export function getEmailVerificationUrl(email: string, token: string) {
  const url = new URL("/api/auth/verify-email", getAppUrl());
  url.searchParams.set("email", email);
  url.searchParams.set("token", token);
  return url.toString();
}

export function getEmailChangeUrl(userId: string, email: string, token: string) {
  const url = new URL("/api/account/verify-email-change", getAppUrl());
  url.searchParams.set("userId", userId);
  url.searchParams.set("email", email);
  url.searchParams.set("token", token);
  return url.toString();
}

async function sendEmail({
  email,
  html,
  subject
}: {
  email: string;
  html: string;
  subject: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!hasEmailDeliveryConfig() || !apiKey || !from) {
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
      subject,
      html
    })
  });

  return response.ok;
}

export function sendSignupVerificationEmail({
  email,
  verifyUrl
}: {
  email: string;
  verifyUrl: string;
}) {
  return sendEmail({
    email,
    subject: "Confirme seu email no Xerecard",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0d1712">
        <h1>Confirmar email</h1>
        <p>Use o link abaixo para ativar sua conta no Xerecard. Ele expira em 24 horas.</p>
        <p><a href="${verifyUrl}">Confirmar meu email</a></p>
        <p>Se você não criou uma conta, ignore este email.</p>
      </div>
    `
  });
}

export function sendEmailChangeEmail({
  email,
  verifyUrl
}: {
  email: string;
  verifyUrl: string;
}) {
  return sendEmail({
    email,
    subject: "Confirme o novo email no Xerecard",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0d1712">
        <h1>Confirmar novo email</h1>
        <p>Use o link abaixo para trocar o email da sua conta. Ele expira em 24 horas.</p>
        <p><a href="${verifyUrl}">Confirmar novo email</a></p>
        <p>Se você não pediu isso, ignore este email.</p>
      </div>
    `
  });
}
