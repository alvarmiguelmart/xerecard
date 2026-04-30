"use client";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Globe2,
  LockKeyhole,
  Mail,
  MessagesSquare,
  ShieldCheck,
  UserRound
} from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/http";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register";
type ProviderId = "google" | "discord";
type AuthProvider = {
  id: ProviderId;
  label: string;
  enabled: boolean;
};

const providerIcons: Record<ProviderId, ReactNode> = {
  google: <Globe2 size={18} aria-hidden="true" />,
  discord: <MessagesSquare size={18} aria-hidden="true" />
};

function hasStrongEnoughPassword(password: string) {
  return password.length >= 8;
}

export function AuthForm({
  mode,
  providers,
  callbackUrl
}: {
  mode: AuthMode;
  providers: readonly AuthProvider[];
  callbackUrl: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState<ProviderId | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleProviderSignIn(provider: AuthProvider) {
    if (!provider.enabled) {
      setMessage(`Configure AUTH_${provider.id.toUpperCase()}_ID e AUTH_${provider.id.toUpperCase()}_SECRET.`);
      return;
    }

    setMessage("");
    setProviderLoading(provider.id);
    await signIn(provider.id, { callbackUrl });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const rawPassword = String(formData.get("password") ?? "");

    try {
      if (mode === "register") {
        const name = String(formData.get("name") ?? "").trim();
        const confirmPassword = String(formData.get("confirmPassword") ?? "");

        if (name.length < 2) {
          throw new Error("Informe seu nome.");
        }

        if (!hasStrongEnoughPassword(rawPassword)) {
          throw new Error("Use uma senha com pelo menos 8 caracteres.");
        }

        if (rawPassword !== confirmPassword) {
          throw new Error("As senhas não conferem.");
        }

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password: rawPassword })
        });
        const data = await readJsonResponse<{ message?: string; verifyUrl?: string }>(response);

        if (!response.ok) {
          throw new Error(data.message ?? "Não conseguimos criar sua conta.");
        }

        setMessage(
          data.verifyUrl
            ? `Conta criada. Confirme seu email: ${data.verifyUrl}`
            : (data.message ?? "Conta criada. Confirme seu email antes de entrar.")
        );
        return;
      }

      const loginResult = await signIn("credentials", {
        email,
        password: rawPassword,
        callbackUrl,
        redirect: false
      });

      if (loginResult?.error) {
        throw new Error("Email ou senha inválidos.");
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não conseguimos entrar agora.");
    } finally {
      setIsLoading(false);
    }
  }

  const isBusy = isLoading || Boolean(providerLoading);

  return (
    <div className="glass-panel motion-rise grid gap-5 rounded-xl p-5 md:p-6">
      <div className="rounded-xl border border-sky/35 bg-panel/90 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="surface-panel grid size-11 place-items-center rounded-lg">
            <ShieldCheck size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-black uppercase text-white/48">
              {mode === "login" ? "Autenticação por email" : "Conta por email"}
            </p>
            <p className="mt-1 text-sm font-semibold leading-6 text-white/68">
              Email e senha usam autenticação real com senha criptografada.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className={cn(
              "focus-ring flex min-h-12 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-black transition",
              provider.enabled
                ? "action-secondary"
                : "cursor-not-allowed border-ink/8 bg-cloud text-ink/34"
            )}
            disabled={isBusy}
            onClick={() => handleProviderSignIn(provider)}
          >
            {providerLoading === provider.id ? (
              "Abrindo..."
            ) : (
              <>
                {providerIcons[provider.id]}
                {mode === "login" ? "Entrar" : "Continuar"} com {provider.label}
              </>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 text-xs font-black uppercase text-ink/40">
        <span className="h-px flex-1 bg-ink/10" />
        Email e senha
        <span className="h-px flex-1 bg-ink/10" />
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="name">
            Nome
            <span className="relative">
              <UserRound
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/38"
                aria-hidden="true"
              />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="field-control field-control-icon w-full text-base"
                placeholder="Nome para exibir no perfil"
                required
                minLength={2}
                maxLength={80}
                disabled={isBusy}
              />
            </span>
          </label>
        ) : null}

        <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="email">
          Email
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
              disabled={isBusy}
            />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="password">
          Senha
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
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="field-control field-control-icon w-full pr-12 text-base"
              placeholder="Use pelo menos 8 caracteres"
              required
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              disabled={isBusy}
            />
            <button
              type="button"
              className="focus-ring absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-ink/54 hover:bg-cloud hover:text-ink"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShowPassword((visible) => !visible)}
              disabled={isBusy}
            >
              {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
            </button>
          </span>
        </label>

        {mode === "register" ? (
          <>
            <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="confirmPassword">
              Confirmar senha
              <span className="relative">
                <LockKeyhole
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/38"
                  aria-hidden="true"
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="field-control field-control-icon w-full pr-12 text-base"
                  placeholder="Repita sua senha"
                  required
                  minLength={8}
                  maxLength={128}
                  disabled={isBusy}
                />
                <button
                  type="button"
                  className="focus-ring absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-ink/54 hover:bg-cloud hover:text-ink"
                  aria-label={showConfirmPassword ? "Ocultar confirmação" : "Mostrar confirmação"}
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  disabled={isBusy}
                >
                  {showConfirmPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                </button>
              </span>
            </label>
          </>
        ) : null}

        <Button
          type="submit"
          size="lg"
          icon={<ArrowRight size={18} aria-hidden="true" />}
          disabled={isBusy}
        >
          {isLoading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
        </Button>

        <p className="min-h-6 text-sm font-semibold text-coral" role="status" aria-live="polite">
          {message}
        </p>
      </form>
    </div>
  );
}

