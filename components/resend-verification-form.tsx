"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/http";

export function ResendVerificationForm() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(formData.get("email") ?? "") })
      });
      const data = await readJsonResponse<{ message?: string; verifyUrl?: string }>(response);

      if (!response.ok) {
        throw new Error(data.message ?? "Não conseguimos reenviar o email.");
      }

      setMessage(
        data.verifyUrl
          ? `Confirme seu email: ${data.verifyUrl}`
          : (data.message ?? "Se este email precisar de confirmação, enviaremos um novo link.")
      );
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não conseguimos reenviar o email.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="glass-panel grid gap-3 rounded-xl p-4" onSubmit={submit}>
      <p className="text-sm font-black text-ink">Não recebeu o email de confirmação?</p>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          name="email"
          type="email"
          className="field-control"
          placeholder="voce@email.com"
          maxLength={254}
          required
          disabled={isLoading}
        />
        <Button type="submit" variant="secondary" disabled={isLoading}>
          {isLoading ? "Enviando" : "Reenviar"}
        </Button>
      </div>
      <p className="min-h-5 text-sm font-semibold text-ink" role="status">
        {message}
      </p>
    </form>
  );
}
