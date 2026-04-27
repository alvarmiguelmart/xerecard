import { BriefcaseBusiness, SearchCheck } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";

export default function ChooseServiceTypePage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-cloud py-12">
        <section className="container-page">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase text-sky">Criar anúncio</p>
            <h1 className="mt-2 text-5xl font-black text-ink">
              Você quer contratar ou anunciar?
            </h1>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="rounded-xl border border-ink/10 bg-white p-6 premium-shadow">
              <SearchCheck size={32} className="text-sky" aria-hidden="true" />
              <h2 className="mt-6 text-3xl font-black text-ink">
                Quero contratar
              </h2>
              <p className="mt-3 text-base leading-7 text-ink/62">
                Conte o que precisa e receba contatos de pessoas disponíveis
                para ajudar.
              </p>
              <ButtonLink href="/servicos/novo?tipo=precisando" className="mt-6">
                Criar pedido
              </ButtonLink>
            </article>

            <article className="rounded-xl border border-ink/10 bg-white p-6 premium-shadow">
              <BriefcaseBusiness size={32} className="text-sky" aria-hidden="true" />
              <h2 className="mt-6 text-3xl font-black text-ink">
                Quero anunciar
              </h2>
              <p className="mt-3 text-base leading-7 text-ink/62">
                Mostre seu serviço com preço, região de atendimento e um caminho
                direto para contato.
              </p>
              <ButtonLink href="/servicos/novo?tipo=oferecendo" className="mt-6">
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
