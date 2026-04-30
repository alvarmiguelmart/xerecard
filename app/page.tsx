import {
  ArrowRight,
  CheckCircle2,
  Crown,
  Search,
  Sparkles,
  TimerReset
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { EmptyStateCTA } from "@/components/empty-state-cta";
import { ServiceCard } from "@/components/service-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { subscriptionTrialDays } from "@/lib/billing";
import { DatabaseError, listServices } from "@/lib/marketplace-db";
import { MarketplaceService, plans } from "@/lib/marketplace-data";

export const revalidate = 60;

async function FeaturedServices() {
  let services: MarketplaceService[] = [];
  let servicesUnavailable = false;

  try {
    services = (await listServices({ take: 12 }))
      .filter((service) => service.ownerName !== "Equipe Xerecard")
      .slice(0, 8);
  } catch (error) {
    if (!(error instanceof DatabaseError)) {
      throw error;
    }

    servicesUnavailable = true;
  }

  if (servicesUnavailable) {
    return (
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-ink/10 bg-paper p-6 lg:col-span-3">
          <h3 className="text-2xl font-black text-ink">
            Serviços temporariamente indisponíveis
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-ink/62">
            Não conseguimos carregar os anúncios agora. Tente novamente em instantes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      {services.length === 0 ? (
        <EmptyStateCTA />
      ) : (
        <>
          <div className="hidden items-center justify-end gap-2 text-sm font-black text-ink/45 md:flex">
            deslize para ver mais
            <ArrowRight size={19} aria-hidden="true" />
          </div>
          <div className="marketplace-scrollbar stagger-list mt-4 flex snap-x items-stretch gap-5 overflow-x-auto pb-5 pr-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex w-[min(86vw,22rem)] shrink-0 snap-start lg:w-[calc((100%_-_2.5rem)/3)]"
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default async function Home() {
  return (
    <>
      <SiteHeader />
      <main className="page-depth">
        <section className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-0 opacity-72">
            <Image
              src="/generated/marketplace-hero.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 hero-backdrop" />
          </div>
          <div className="container-page relative z-10 flex min-h-[calc(100svh-10rem)] items-center py-14 md:py-20">
            <div className="motion-rise max-w-4xl py-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-panel/72 px-4 py-2 text-sm font-black uppercase text-white shadow-sm backdrop-blur">
                <Sparkles size={16} aria-hidden="true" />
                1 mês grátis
              </p>
              <h1 className="mt-5 max-w-5xl text-5xl font-black leading-none text-ink md:text-7xl">
                Encontre serviços e converse direto pelo WhatsApp.
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-ink/72">
                Publique pedidos, anuncie seu trabalho e acompanhe interessados em
                um marketplace simples, direto e feito para gerar conversa real. Teste
                por {subscriptionTrialDays} dias grátis antes da primeira cobrança.
              </p>
              <form
                action="/servicos"
                className="glass-panel mt-7 grid max-w-2xl gap-3 rounded-xl p-3 sm:grid-cols-[1fr_auto]"
              >
                <label className="flex min-h-12 items-center gap-3 rounded-lg bg-panel/72 px-4 text-sm font-bold text-ink/52">
                  <Search size={18} aria-hidden="true" />
                  <input
                    type="search"
                    name="busca"
                    aria-label="Buscar serviços"
                    placeholder="Buscar diarista, manutenção, fotografia..."
                    className="w-full bg-transparent text-base font-bold text-ink outline-none placeholder:text-ink/42"
                  />
                </label>
                <button
                  type="submit"
                  className="focus-ring action-primary group relative inline-flex min-h-12 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-lg px-5 text-sm font-black transition duration-200 hover:-translate-y-0.5"
                >
                  <span className="absolute inset-y-0 -left-8 w-7 skew-x-[-18deg] bg-white/45 opacity-0 transition duration-300 group-hover:left-[115%] group-hover:opacity-100" />
                  <Search size={17} className="relative" aria-hidden="true" />
                  <span className="relative">Buscar serviços</span>
                </button>
              </form>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="/cadastrar"
                  size="lg"
                  icon={<ArrowRight size={18} aria-hidden="true" />}
                >
                  Começar teste grátis
                </ButtonLink>
                <ButtonLink href="/servicos" variant="secondary" size="lg">
                  Ver marketplace
                </ButtonLink>
              </div>
              <div className="stagger-list mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: <TimerReset size={17} className="text-white" aria-hidden="true" />,
                    label: "30 dias grátis",
                    tone: "border-sky/20"
                  },
                  {
                    icon: <CheckCircle2 size={17} className="text-white" aria-hidden="true" />,
                    label: "Publique grátis",
                    tone: "border-sky/20"
                  },
                  {
                    icon: <WhatsAppIcon className="size-[1.125rem]" />,
                    label: "WhatsApp liberado",
                    tone: "border-sky/20"
                  }
                ].map((item) => (
                  <p
                    key={item.label}
                    className={`glass-panel spatial-card flex min-h-16 items-center gap-2 rounded-xl px-4 text-sm font-black text-ink/76 ${item.tone}`}
                  >
                    {item.icon}
                    {item.label}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="container-page">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-label">Serviços</p>
                <h2 className="mt-3 max-w-4xl text-5xl font-black leading-tight text-ink md:text-6xl">
                  Anúncios em destaque para contratar ou oferecer.
                </h2>
                <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-ink/62">
                  Veja pedidos e ofertas com contato direto, valores claros e detalhes para decidir rápido.
                </p>
              </div>
              <Link
                href="/servicos"
                className="focus-ring action-primary group relative inline-flex min-h-14 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-lg px-6 text-base font-black transition duration-200 hover:-translate-y-0.5"
              >
                <span className="absolute inset-y-0 -left-8 w-7 skew-x-[-18deg] bg-white/35 opacity-0 transition duration-300 group-hover:left-[115%] group-hover:opacity-100" />
                <Sparkles size={18} className="relative" aria-hidden="true" />
                <span className="relative">Ver todos</span>
              </Link>
            </div>
            <Suspense fallback={<div className="mt-10 h-[34rem] rounded-xl bg-cloud" />}>
              <FeaturedServices />
            </Suspense>
          </div>
        </section>

        <section id="planos" className="border-t border-ink/10 py-16 md:py-20">
          <div className="container-page">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-label">Planos</p>
                <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-ink md:text-5xl">
                  Comece grátis. Pague quando precisar conversar.
                </h2>
                <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-ink/62">
                  Planos pensados para separar descoberta, contato e crescimento. Cartão
                  libera {subscriptionTrialDays} dias de teste nos planos pagos.
                </p>
              </div>
              <div className="rounded-xl border border-ink/10 bg-cloud px-4 py-3 text-sm font-black text-ink/64">
                <span className="inline-flex items-center gap-2">
                  <TimerReset size={16} className="text-white" aria-hidden="true" />
                  Cartão com teste grátis
                </span>
              </div>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {plans.map((plan) => {
                const isFree = plan.id === "FREE";
                const isEssential = plan.id === "ESSENTIAL";
                const highlightLabel = isFree ? "Explorar" : isEssential ? "Recomendado" : "Pro";

                return (
                  <article
                    key={plan.id}
                    className={`flex h-full flex-col rounded-xl border ${
                      isEssential
                        ? "essential-card border-sky/35 bg-panel text-white premium-shadow"
                        : "border-ink/10 bg-paper"
                    }`}
                  >
                    <div className="border-b border-current/10 p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={
                            isEssential
                              ? "badge-success inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase"
                              : "inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-ink/54"
                          }
                        >
                          {isEssential ? <Crown size={12} aria-hidden="true" /> : null}
                          {highlightLabel}
                        </span>
                      </div>

                      <h3
                        className={
                          isEssential
                            ? "mt-5 text-3xl font-black text-white"
                            : "mt-5 text-3xl font-black text-ink"
                        }
                      >
                        {plan.name}
                      </h3>
                      <p
                        className={
                          isEssential
                            ? "mt-3 text-sm font-semibold leading-6 text-white/64"
                            : "mt-3 text-sm font-semibold leading-6 text-ink/62"
                        }
                      >
                        {plan.description}
                      </p>

                      <div className="mt-4 flex items-center gap-2">
                        <p
                          className={
                            isEssential
                              ? "price-display whitespace-nowrap text-4xl font-black leading-none text-white"
                              : "price-display whitespace-nowrap text-4xl font-black leading-none text-ink"
                          }
                        >
                          {plan.price}
                        </p>
                      </div>
                      <p
                        className={
                          isEssential
                            ? "mt-3 text-xs font-black uppercase text-white/54"
                            : "mt-3 text-xs font-black uppercase text-ink/45"
                        }
                      >
                        {isFree ? "Sem cartão" : `${subscriptionTrialDays} dias grátis no cartão`}
                      </p>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <p
                        className={
                          isEssential
                            ? "text-sm font-black uppercase text-white/48"
                            : "text-sm font-black uppercase text-ink/42"
                        }
                      >
                        Inclui
                      </p>
                      <ul
                        className={
                          isEssential
                            ? "mt-4 grid gap-3 text-sm font-semibold leading-6 text-white/82"
                            : "mt-4 grid gap-3 text-sm font-semibold leading-6 text-ink/68"
                        }
                      >
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className={
                              isEssential
                                ? "flex gap-3 font-bold"
                                : "flex gap-3"
                            }
                          >
                            <CheckCircle2
                              size={17}
                              className={
                                isEssential
                                  ? "mt-0.5 shrink-0 text-white"
                                  : "mt-0.5 shrink-0 text-ink"
                              }
                              aria-hidden="true"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-8">
                        <ButtonLink
                          href={isFree ? "/cadastrar" : "/minha-conta?tab=assinatura"}
                          variant={isEssential ? "primary" : isFree ? "secondary" : "dark"}
                          size="lg"
                          className="w-full"
                          icon={!isFree ? <ArrowRight size={17} aria-hidden="true" /> : undefined}
                        >
                          {isFree ? "Criar conta grátis" : "Começar teste"}
                        </ButtonLink>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

