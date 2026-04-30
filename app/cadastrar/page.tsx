import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, LockKeyhole, Megaphone } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { auth } from "@/lib/auth";
import { getSafeAuthRedirect } from "@/lib/auth-redirect";

type RegisterPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = getSafeAuthRedirect(params?.callbackUrl);

  if (session) {
    redirect(callbackUrl);
  }

  const providers = [
    {
      id: "google",
      label: "Google",
      enabled: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)
    },
    {
      id: "discord",
      label: "Discord",
      enabled: Boolean(process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET)
    }
  ] as const;

  return (
    <>
      <SiteHeader />
      <main className="page-depth py-12 md:py-16">
        <section className="container-page grid gap-10 lg:grid-cols-[0.9fr_0.7fr] lg:items-center">
          <div className="motion-rise">
            <p className="page-kicker">
              <LockKeyhole size={14} aria-hidden="true" />
              Cadastro seguro
            </p>
            <h1 className="mt-3 text-5xl font-black leading-tight text-ink">
              Crie sua conta com email, Google ou Discord.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink/64">
              Publique o que você precisa, anuncie seu trabalho e centralize os
              contatos interessados em um só lugar.
            </p>
            <p className="mt-6 text-sm font-semibold text-ink/58">
              Já tem conta?{" "}
              <Link className="font-black text-white hover:underline" href="/login">
                Entrar
              </Link>
            </p>
            <div className="stagger-list mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
              <p className="glass-panel spatial-card flex min-h-16 items-center gap-3 rounded-xl px-4 text-sm font-black text-ink/72">
                <Megaphone size={18} className="text-white" aria-hidden="true" />
                Publique pedidos e ofertas
              </p>
              <p className="glass-panel spatial-card flex min-h-16 items-center gap-3 rounded-xl px-4 text-sm font-black text-ink/72">
                <BadgeCheck size={18} className="text-white" aria-hidden="true" />
                Perfil público para confiança
              </p>
            </div>
          </div>
          <AuthForm mode="register" providers={providers} callbackUrl={callbackUrl} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

