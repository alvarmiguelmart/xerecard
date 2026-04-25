"use client";

import { ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/marketplace-data";

type AuthMode = "login" | "register";

export function AuthForm({
  mode,
  googleEnabled
}: {
  mode: AuthMode;
  googleEnabled: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    try {
      if (mode === "register") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(formData))
        });
        const data = (await response.json()) as { message?: string };

        if (!response.ok) {
          throw new Error(data.message ?? "Não foi possível criar sua conta.");
        }
      }

      const loginResult = await signIn("credentials", {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        redirect: false
      });

      if (loginResult?.error) {
        throw new Error("Email ou senha inválidos.");
      }

      router.push("/servicos");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível autenticar.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-4 rounded-xl border border-ink/10 bg-white p-5 premium-shadow">
      {googleEnabled ? (
        <>
          <button
            type="button"
            className="focus-ring flex h-12 items-center justify-center rounded-lg border border-ink/12 bg-white px-4 text-sm font-black text-ink hover:bg-cloud"
            onClick={() => signIn("google", { callbackUrl: "/servicos" })}
          >
            Entrar com Google
          </button>

          <div className="flex items-center gap-3 text-xs font-black uppercase text-ink/40">
            <span className="h-px flex-1 bg-ink/10" />
            Email e senha
            <span className="h-px flex-1 bg-ink/10" />
          </div>
        </>
      ) : null}

      <form className="grid gap-4" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="name">
            Nome
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className="focus-ring h-12 rounded-lg border border-ink/12 bg-cloud px-4 text-base"
              placeholder="Seu nome"
              required
              minLength={2}
            />
          </label>
        ) : null}

        <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="email">
          Email
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="focus-ring h-12 rounded-lg border border-ink/12 bg-cloud px-4 text-base"
            placeholder="voce@email.com"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="password">
          Senha
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="focus-ring h-12 rounded-lg border border-ink/12 bg-cloud px-4 text-base"
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />
        </label>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-bold text-ink">Perfil</legend>
          <div className="grid grid-cols-2 gap-3">
            {(["cliente", "profissional"] satisfies UserRole[]).map((role) => (
              <label key={role} className="group cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value={role}
                  className="peer sr-only"
                  defaultChecked={role === "cliente"}
                />
                <span className="focus-ring flex items-center justify-center rounded-lg border border-ink/12 bg-white px-3 py-3 text-sm font-black capitalize text-ink transition peer-checked:border-sky peer-checked:bg-mint peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-acid group-hover:bg-cloud">
                  {role}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Button
          type="submit"
          size="lg"
          icon={<ArrowRight size={18} aria-hidden="true" />}
          disabled={isLoading}
        >
          {isLoading ? "Enviando" : mode === "login" ? "Entrar" : "Criar conta"}
        </Button>

        <p className="min-h-6 text-sm font-semibold text-coral" role="status">
          {message}
        </p>
      </form>
    </div>
  );
}
