import { ArrowRight, BriefcaseBusiness, SearchCheck } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";

export default function ChooseServiceTypePage() {
  return (
    <>
      <SiteHeader />
      <main className="page-depth py-12 md:py-16">
        <section className="container-page">
          <div className="motion-rise max-w-2xl">
            <p className="page-kicker">
              <ArrowRight size={14} aria-hidden="true" />
              Criar anúncio
            </p>
            <h1 className="mt-2 text-5xl font-black text-ink">
              Você quer contratar ou anunciar?
            </h1>
          </div>

          <div className="stagger-list mt-8 grid gap-5 md:grid-cols-2">
            <article className="choice-card spatial-card p-6">
              <div className="grid size-14 place-items-center rounded-xl bg-sky/15 text-white">
                <SearchCheck size={30} aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-3xl font-black text-ink">
                Quero contratar
              </h2>
              <p className="mt-3 text-base leading-7 text-ink/62">
                Conte o que precisa e receba contatos de pessoas disponíveis
                para ajudar.
              </p>
              <ButtonLink
                href="/servicos/novo?tipo=precisando"
                className="mt-6"
                icon={<ArrowRight size={17} aria-hidden="true" />}
              >
                Criar pedido
              </ButtonLink>
            </article>

            <article className="choice-card spatial-card p-6">
              <div className="surface-panel grid size-14 place-items-center rounded-xl">
                <BriefcaseBusiness size={30} aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-3xl font-black text-ink">
                Quero anunciar
              </h2>
              <p className="mt-3 text-base leading-7 text-ink/62">
                Mostre seu serviço com preço, região de atendimento e um caminho
                direto para contato.
              </p>
              <ButtonLink
                href="/servicos/novo?tipo=oferecendo"
                className="mt-6"
                icon={<ArrowRight size={17} aria-hidden="true" />}
              >
                Criar oferta
              </ButtonLink>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

