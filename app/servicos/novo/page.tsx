import { ArrowRight, BriefcaseBusiness, Handshake, LockKeyhole } from "lucide-react";
import { ServiceForm } from "@/components/service-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import type { ServiceMode } from "@prisma/client";

type NewServicePageProps = {
  searchParams?: Promise<{
    tipo?: string;
  }>;
};

export default async function NewServicePage({ searchParams }: NewServicePageProps) {
  const session = await auth();
  const params = await searchParams;
  const initialMode: ServiceMode = params?.tipo === "oferecendo" ? "OFFER" : "REQUEST";

  return (
    <>
      <SiteHeader />
      <main className="page-depth py-12 md:py-16">
        <section className="container-page grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-start">
          <div className="motion-rise">
            <p className="page-kicker">
              <ArrowRight size={14} aria-hidden="true" />
              Publicação
            </p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-ink md:text-5xl">
              Crie um anúncio claro e receba contatos melhores.
            </h1>
            <p className="mt-4 text-base leading-7 text-ink/62">
              Diga se você quer contratar ou oferecer, informe localização,
              preço e detalhes. Quanto mais específico, melhor a conversa.
            </p>
            <div className="stagger-list mt-6 grid gap-3 text-sm font-black text-ink/66">
              <p className="surface-panel spatial-card flex items-center gap-3 rounded-xl p-4">
                <Handshake size={18} aria-hidden="true" />
                Pedido: quando você precisa encontrar alguém para resolver.
              </p>
              <p className="surface-panel spatial-card flex items-center gap-3 rounded-xl p-4">
                <BriefcaseBusiness size={18} aria-hidden="true" />
                Oferta: quando você quer anunciar seu trabalho.
              </p>
            </div>
          </div>

          {session ? (
            <ServiceForm initialMode={initialMode} />
          ) : (
            <div className="glass-panel-strong motion-rise rounded-xl p-6">
              <div className="surface-panel grid size-12 place-items-center rounded-xl">
                <LockKeyhole size={22} aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-black text-ink">Entre para criar seu anúncio</h2>
              <p className="mt-3 text-base leading-7 text-ink/62">
                O anúncio fica vinculado ao seu perfil para que interessados
                saibam com quem estão falando.
              </p>
              <div className="mt-6 flex gap-3">
                <ButtonLink href="/login" variant="secondary">
                  Entrar
                </ButtonLink>
                <ButtonLink href="/cadastrar">Criar conta</ButtonLink>
              </div>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

