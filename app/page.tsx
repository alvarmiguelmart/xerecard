import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import { ServiceCard } from "@/components/service-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { listServices } from "@/lib/marketplace-db";
import { businessProof, categoryStories, plans } from "@/lib/marketplace-data";

const featuredCategories = [
  "Packs digitais",
  "Conteúdo premium",
  "Lives privadas",
  "Segurança e privacidade",
  "Divulgação adulta",
  "Comunidades privadas"
];

export default async function Home() {
  const services = await listServices();
  const featuredServices = services.slice(0, 6);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-paper py-10 md:py-16">
          <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full bg-ink px-3 py-1 text-xs font-black uppercase text-white">
                Xerecard
              </p>
              <h1 className="mt-5 max-w-4xl text-5xl font-black leading-none text-ink md:text-7xl">
                Publique, descubra e libere contatos privados.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-ink/62">
                Uma vitrine simples para pedidos, ofertas, conteúdos, serviços
                e comunidades com conversa direta por assinatura.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="/servicos"
                  size="lg"
                  icon={<ArrowRight size={18} aria-hidden="true" />}
                >
                  Explorar
                </ButtonLink>
                <ButtonLink href="/servicos/novo?tipo=oferecendo" variant="secondary" size="lg">
                  Publicar
                </ButtonLink>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {businessProof.map((item) => (
                  <div key={item.label} className="border-t border-ink/10 pt-3">
                    <p className="text-2xl font-black text-ink">{item.value}</p>
                    <p className="mt-1 text-xs font-bold uppercase leading-5 text-ink/48">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-ink/10 bg-white p-6 premium-shadow">
              <Image
                src="/brand/xerecard.png"
                alt="Arte visual Xerecard"
                width={1440}
                height={1024}
                className="h-full max-h-[34rem] w-full object-contain"
                priority
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-10">
          <div className="container-page">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black uppercase text-sky">Categorias</p>
                <h2 className="mt-2 text-3xl font-black text-ink">
                  Entre pelo que você procura.
                </h2>
              </div>
              <ButtonLink href="/servicos" variant="secondary">
                Ver tudo
              </ButtonLink>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {featuredCategories.map((category) => (
                <ButtonLink
                  key={category}
                  href={`/servicos?categoria=${encodeURIComponent(category)}`}
                  variant="secondary"
                  size="sm"
                >
                  {category}
                </ButtonLink>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-paper py-10">
          <div className="container-page">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black uppercase text-sky">Vitrine</p>
                <h2 className="mt-2 text-3xl font-black text-ink">
                  Destaques.
                </h2>
              </div>
              <ButtonLink href="/servicos" variant="secondary">
                Explorar
              </ButtonLink>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-10">
          <div className="container-page grid gap-4 md:grid-cols-3">
            {categoryStories.map((story, index) => (
              <article key={story.name} className="border-t border-ink/10 pt-5">
                {index === 0 ? (
                  <Sparkles size={22} className="text-sky" aria-hidden="true" />
                ) : index === 1 ? (
                  <ShieldCheck size={22} className="text-sky" aria-hidden="true" />
                ) : (
                  <LockKeyhole size={22} className="text-sky" aria-hidden="true" />
                )}
                <h3 className="mt-4 text-xl font-black text-ink">{story.name}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/58">{story.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="planos" className="bg-paper py-10">
          <div className="container-page">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black uppercase text-sky">Planos</p>
                <h2 className="mt-2 text-3xl font-black text-ink">
                  Libere contato privado.
                </h2>
              </div>
              <ButtonLink href="/minha-conta#assinatura" variant="dark">
                Assinar
              </ButtonLink>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {plans.map((plan) => (
                <article key={plan.id} className="rounded-xl border border-ink/10 bg-white p-5">
                  <h3 className="text-xl font-black text-ink">{plan.name}</h3>
                  <p className="mt-3 text-3xl font-black text-ink">{plan.price}</p>
                  <p className="mt-3 text-sm leading-6 text-ink/58">{plan.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
