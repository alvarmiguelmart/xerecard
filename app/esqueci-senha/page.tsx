import Link from "next/link";
import { KeyRound } from "lucide-react";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ForgotPasswordPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-depth py-12 md:py-16">
        <section className="container-page grid gap-10 lg:grid-cols-[0.9fr_0.7fr] lg:items-center">
          <div className="motion-rise">
            <p className="page-kicker">
              <KeyRound size={14} aria-hidden="true" />
              Recuperar acesso
            </p>
            <h1 className="mt-3 text-5xl font-black leading-tight text-ink">
              Redefina sua senha.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink/64">
              Informe o email da conta. Se existir uma conta com senha, enviaremos
              um link seguro para criar uma nova senha.
            </p>
            <p className="mt-6 text-sm font-semibold text-ink/58">
              Lembrou a senha?{" "}
              <Link className="font-black text-white hover:underline" href="/login">
                Entrar
              </Link>
            </p>
          </div>
          <ForgotPasswordForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

