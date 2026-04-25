import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function RegisterPage() {
  const googleEnabled = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
  );

  return (
    <>
      <SiteHeader />
      <main className="bg-cloud py-12">
        <section className="container-page grid gap-10 lg:grid-cols-[0.9fr_0.7fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-sky">Cadastro</p>
            <h1 className="mt-3 text-5xl font-black leading-tight text-ink">
              Crie sua conta para publicar e receber contatos.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink/64">
              Clientes publicam pedidos. Profissionais oferecem serviços. A
              assinatura libera o botão de WhatsApp e organiza notificações.
            </p>
            <p className="mt-6 text-sm font-semibold text-ink/58">
              Já tem conta?{" "}
              <Link className="font-black text-sky hover:underline" href="/login">
                Entrar agora
              </Link>
            </p>
          </div>
          <AuthForm mode="register" googleEnabled={googleEnabled} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
