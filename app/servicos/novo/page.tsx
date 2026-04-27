import { ServiceForm } from "@/components/service-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { ServiceMode } from "@/lib/marketplace-data";

type NewServicePageProps = {
  searchParams?: Promise<{
    tipo?: string;
  }>;
};

export default async function NewServicePage({ searchParams }: NewServicePageProps) {
  const session = await auth();
  const params = await searchParams;
  const initialMode: ServiceMode = params?.tipo === "oferecendo" ? "offer" : "request";

  return (
    <>
      <SiteHeader />
      <main className="surface-grid bg-cloud py-12">
        <section className="container-page grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-start">
          <div>
            <p className="section-label">Publicação</p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-ink md:text-5xl">
              Crie um anúncio claro e receba contatos melhores.
            </h1>
            <p className="mt-4 text-base leading-7 text-ink/62">
              Diga se você quer contratar ou oferecer, informe localização,
              preço e detalhes. Quanto mais específico, melhor a conversa.
            </p>
            <div className="mt-6 grid gap-3 text-sm font-black text-ink/66">
              <p className="rounded-xl border border-ink/10 bg-white/80 p-4">
                Pedido: quando você precisa encontrar alguém para resolver.
              </p>
              <p className="rounded-xl border border-ink/10 bg-white/80 p-4">
                Oferta: quando você quer anunciar seu trabalho.
              </p>
            </div>
          </div>

          {session ? (
            <ServiceForm initialMode={initialMode} />
          ) : (
            <div className="rounded-xl border border-ink/10 bg-white p-6 premium-shadow">
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
