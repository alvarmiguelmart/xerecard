"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/http";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setResetUrl("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await readJsonResponse<{ message?: string; resetUrl?: string }>(response);

      if (!response.ok) {
        throw new Error(data.message ?? "Não conseguimos iniciar a redefinição.");
      }

      setMessage(data.message ?? "Verifique seu email.");
      setResetUrl(data.resetUrl ?? "");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não conseguimos iniciar a redefinição.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="glass-panel motion-rise grid gap-5 rounded-xl p-5 md:p-6" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="email">
        Email da conta
        <span className="relative">
          <Mail
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/38"
            aria-hidden="true"
          />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="field-control field-control-icon w-full text-base"
            placeholder="voce@email.com"
            required
            maxLength={254}
            disabled={isLoading}
          />
        </span>
      </label>

      <Button
        type="submit"
        size="lg"
        icon={<ArrowRight size={18} aria-hidden="true" />}
        disabled={isLoading}
      >
        {isLoading ? "Enviando" : "Enviar link"}
      </Button>

      <p className="min-h-6 text-sm font-semibold text-white" role="status" aria-live="polite">
        {message}
      </p>

      {resetUrl ? (
        <Link className="text-sm font-black text-white hover:underline" href={resetUrl}>
          Abrir link de redefinição local
        </Link>
      ) : null}
    </form>
  );
}

