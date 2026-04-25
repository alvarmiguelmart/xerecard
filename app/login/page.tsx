import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function LoginPage() {
  const googleEnabled = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
  );

  return (
    <>
      <SiteHeader />
      <main className="bg-cloud py-12">
        <section className="container-page grid gap-10 lg:grid-cols-[0.9fr_0.7fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-sky">Login</p>
            <h1 className="mt-3 text-5xl font-black leading-tight text-ink">
              Entre para gerenciar serviços e contatos.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink/64">
              O acesso mantém suas publicações, assinatura, notificações e ações
              de WhatsApp em um fluxo único.
            </p>
            <p className="mt-6 text-sm font-semibold text-ink/58">
              Ainda não tem conta?{" "}
              <Link className="font-black text-sky hover:underline" href="/cadastrar">
                Criar cadastro
              </Link>
            </p>
          </div>
          <AuthForm mode="login" googleEnabled={googleEnabled} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
