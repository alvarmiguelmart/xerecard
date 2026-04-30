import Link from "next/link";
import { KeyRound } from "lucide-react";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    email?: string;
    token?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const email = params?.email ?? "";
  const token = params?.token ?? "";
  const hasLink = Boolean(email && token);

  return (
    <>
      <SiteHeader />
      <main className="page-depth py-12 md:py-16">
        <section className="container-page grid gap-10 lg:grid-cols-[0.9fr_0.7fr] lg:items-center">
          <div className="motion-rise">
            <p className="page-kicker">
              <KeyRound size={14} aria-hidden="true" />
              Nova senha
            </p>
            <h1 className="mt-3 text-5xl font-black leading-tight text-ink">
              Crie uma nova senha.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink/64">
              Use uma senha com pelo menos 8 caracteres. O link expira em 1 hora
              e só pode ser usado uma vez.
            </p>
          </div>
          {hasLink ? (
            <ResetPasswordForm email={email} token={token} />
          ) : (
            <div className="glass-panel rounded-xl p-6">
              <h2 className="text-2xl font-black text-ink">Link inválido</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-ink/58">
                Peça um novo link para redefinir sua senha.
              </p>
              <Link className="mt-5 inline-flex text-sm font-black text-white hover:underline" href="/esqueci-senha">
                Enviar novo link
              </Link>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

