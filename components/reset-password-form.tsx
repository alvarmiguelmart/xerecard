"use client";

import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/http";

export function ResetPasswordForm({
  email,
  token
}: {
  email: string;
  token: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    try {
      if (password !== confirmPassword) {
        throw new Error("As senhas não conferem.");
      }

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password })
      });
      const data = await readJsonResponse<{ message?: string }>(response);

      if (!response.ok) {
        throw new Error(data.message ?? "Não conseguimos redefinir sua senha.");
      }

      router.push("/login?reset=success");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não conseguimos redefinir sua senha.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="glass-panel motion-rise grid gap-5 rounded-xl p-5 md:p-6" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="password">
        Nova senha
        <span className="relative">
          <LockKeyhole
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/38"
            aria-hidden="true"
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            className="field-control field-control-icon w-full pr-12 text-base"
            placeholder="Use pelo menos 8 caracteres"
            required
            minLength={8}
            maxLength={128}
            disabled={isLoading}
          />
          <button
            type="button"
            className="focus-ring absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-ink/54 hover:bg-cloud hover:text-ink"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            onClick={() => setShowPassword((visible) => !visible)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
          </button>
        </span>
      </label>

      <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="confirmPassword">
        Confirmar nova senha
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          className="field-control w-full text-base"
          placeholder="Repita sua senha"
          required
          minLength={8}
          maxLength={128}
          disabled={isLoading}
        />
      </label>

      <Button
        type="submit"
        size="lg"
        icon={<ArrowRight size={18} aria-hidden="true" />}
        disabled={isLoading}
      >
        {isLoading ? "Salvando" : "Redefinir senha"}
      </Button>

      <p className="min-h-6 text-sm font-semibold text-coral" role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}

