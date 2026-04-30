import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, LockKeyhole } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { auth } from "@/lib/auth";
import { getSafeAuthRedirect } from "@/lib/auth-redirect";

type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
    mensagem?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
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
              Login seguro
            </p>
            <h1 className="mt-3 text-5xl font-black leading-tight text-ink">
              Entre com email, Google ou Discord.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink/64">
              Veja seus anúncios, receba avisos de interesse e desbloqueie
              conversas no WhatsApp quando tiver um plano ativo.
            </p>
            <p className="mt-6 text-sm font-semibold text-ink/58">
              Ainda não tem conta?{" "}
              <Link className="font-black text-white hover:underline" href="/cadastrar">
                Criar uma conta
              </Link>
            </p>
            <p className="mt-3 text-sm font-semibold text-ink/58">
              Esqueceu a senha?{" "}
              <Link className="font-black text-white hover:underline" href="/esqueci-senha">
                Redefinir acesso
              </Link>
            </p>
            <div className="stagger-list mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
              <p className="glass-panel spatial-card flex min-h-16 items-center gap-3 rounded-xl px-4 text-sm font-black text-ink/72">
                <Bell size={18} className="text-white" aria-hidden="true" />
                Avisos privados no painel
              </p>
              <p className="glass-panel spatial-card flex min-h-16 items-center gap-3 rounded-xl px-4 text-sm font-black text-ink/72">
                <WhatsAppIcon className="size-5" />
                Contato protegido por plano
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            {params?.mensagem ? (
              <p className="glass-panel rounded-xl p-4 text-sm font-bold text-ink">
                {params.mensagem}
              </p>
            ) : null}
            <AuthForm mode="login" providers={providers} callbackUrl={callbackUrl} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

