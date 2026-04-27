import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  Car,
  CheckCircle2,
  Code2,
  Crown,
  HeartPulse,
  Handshake,
  Home as HomeIcon,
  LockKeyhole,
  MessageCircle,
  Package,
  Palette,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Truck,
  Utensils,
  TrendingUp
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { EmptyStateCTA } from "@/components/empty-state-cta";
import { ServiceCard } from "@/components/service-card";
import { ServicesSkeleton } from "@/components/services-skeleton";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { DatabaseError, listServices } from "@/lib/marketplace-db";
import { MarketplaceService, categoryMeta, plans } from "@/lib/marketplace-data";

export const revalidate = 60;

const benefits = [
  {
    icon: <LockKeyhole size={22} />,
    title: "Contato liberado só para assinantes",
    text: "Qualquer pessoa pode explorar os anúncios. O WhatsApp fica reservado para quem tem plano ativo."
  },
  {
    icon: <Bell size={22} />,
    title: "Avisos quando alguém demonstra interesse",
    text: "Curtidas, contatos e novas interações ficam reunidos para você não perder oportunidade."
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Perfis e anúncios mais confiáveis",
    text: "Cada anúncio tem responsável, categoria, localização, avaliação e detalhes para facilitar a decisão."
  }
];

const journeys = [
  {
    icon: <Handshake size={24} />,
    title: "Quero contratar",
    description: "Explore ofertas ou publique um pedido com prazo, local e orçamento.",
    cta: "Buscar serviços",
    href: "/servicos"
  },
  {
    icon: <BriefcaseBusiness size={24} />,
    title: "Quero vender",
    description: "Anuncie seu trabalho e converta interessados em clientes pelo WhatsApp.",
    cta: "Criar anúncio",
    href: "/servicos/novo?tipo=oferecendo"
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Quero crescer",
    description: "Use avaliações, curtidas e perfil público para ganhar confiança.",
    cta: "Ver oportunidades",
    href: "/servicos"
  }
];

const trustSignals = [
  { value: "2.400+", label: "anúncios ativos" },
  { value: "850+", label: "profissionais" },
  { value: "4.8", label: "nota média" },
  { value: "R$ 5,99", label: "para começar" }
];

const howItWorks = [
  {
    step: "01",
    title: "Explore ou publique",
    text: "Navegue por categoria ou crie um anúncio dizendo o que precisa ou oferece.",
    icon: <Search size={20} />
  },
  {
    step: "02",
    title: "Avalie antes",
    text: "Veja perfil, avaliações, fotos e detalhes antes de decidir com quem conversar.",
    icon: <Star size={20} />
  },
  {
    step: "03",
    title: "Converse no WhatsApp",
    text: "Assinantes abrem contato direto. Sem intermediários e sem fricção.",
    icon: <MessageCircle size={20} />
  }
];

const categoryIcons: Record<string, LucideIcon> = {
  home: HomeIcon,
  calendar: CalendarDays,
  heart: HeartPulse,
  code: Code2,
  book: BookOpen,
  truck: Truck,
  hammer: BriefcaseBusiness,
  sparkles: Sparkles,
  shield: Stethoscope,
  paw: HeartPulse,
  palette: Palette,
  wrench: Car,
  scale: Scale,
  utensils: Utensils,
  camera: Camera,
  package: Package
};

async function FeaturedServices() {
  let services: MarketplaceService[] = [];
  let servicesUnavailable = false;

  try {
    services = (await listServices()).slice(0, 3);
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
    <div className="mt-8 grid gap-5 lg:grid-cols-3">
      {services.length === 0 ? (
        <EmptyStateCTA />
      ) : (
        services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))
      )}
    </div>
  );
}

export default async function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="surface-grid bg-paper py-10 md:py-16">
          <div className="container-page grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-sm font-black uppercase text-ink shadow-sm">
                <Sparkles size={16} aria-hidden="true" />
                Contatos diretos por assinatura
              </p>
              <h1 className="mt-5 max-w-4xl text-5xl font-black leading-none text-ink md:text-7xl">
                Encontre serviços e converse direto pelo WhatsApp.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/64">
                Publique pedidos, anuncie seu trabalho e acompanhe interessados em
                um marketplace simples, direto e feito para gerar conversa real.
              </p>
              <form
                action="/servicos"
                className="mt-6 grid max-w-2xl gap-3 rounded-xl border border-ink/10 bg-white/82 p-3 shadow-sm sm:grid-cols-[1fr_auto]"
              >
                <label className="flex min-h-12 items-center gap-3 rounded-lg bg-cloud px-4 text-sm font-bold text-ink/52">
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
                  className="focus-ring inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-black text-white shadow-[0_10px_22px_rgba(7,16,20,0.16)] transition hover:bg-panel"
                >
                  Buscar serviços
                </button>
              </form>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="/cadastrar"
                  size="lg"
                  icon={<ArrowRight size={18} aria-hidden="true" />}
                >
                  Começar agora
                </ButtonLink>
                <ButtonLink href="/servicos" variant="secondary" size="lg">
                  Ver marketplace
                </ButtonLink>
              </div>
              <div className="mt-7 grid max-w-2xl gap-3 text-sm font-black text-ink/62 sm:grid-cols-3">
                {["Publique grátis", "Contato qualificado", "Planos desde R$ 5,99"].map(
                  (item) => (
                    <p key={item} className="flex items-center gap-2">
                      <CheckCircle2 size={17} className="text-sky" aria-hidden="true" />
                      {item}
                    </p>
                  )
                )}
              </div>
            </div>

            <div className="relative">
              <aside className="relative overflow-hidden rounded-2xl border border-ink/10 bg-panel premium-shadow">
                <div className="relative">
                  <Image
                    src="/generated/marketplace-hero.png"
                    alt=""
                    width={760}
                    height={760}
                    className="h-[30rem] w-full object-cover object-center opacity-90"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/72 to-transparent p-5 pt-28 text-white">
                    <p className="inline-flex items-center gap-2 rounded-full bg-mint px-3 py-1 text-xs font-black uppercase text-ink">
                      <MessageCircle size={14} aria-hidden="true" />
                      Contato desbloqueado
                    </p>
                    <p className="mt-4 text-4xl font-black leading-none">R$ 5,99</p>
                    <p className="mt-2 max-w-xs text-sm font-semibold leading-6 text-white/68">
                      Abra conversas no WhatsApp e acompanhe novos interessados.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 border-t border-white/10 bg-ink p-4 text-white sm:grid-cols-2">
                  <div className="rounded-xl border border-white/12 bg-white/8 p-4">
                    <p className="text-xs font-black uppercase text-white/42">
                      Interesse recebido
                    </p>
                    <p className="mt-2 text-sm font-black leading-5">
                      Marina quer falar sobre seu anúncio.
                    </p>
                  </div>
                  <div className="rounded-xl bg-mint p-4 text-panel">
                    <p className="text-xs font-black uppercase text-panel/60">Hoje</p>
                    <p className="mt-1 text-2xl font-black">8 contatos</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-y border-ink/10 bg-white py-8">
          <div className="container-page grid grid-cols-2 gap-4 md:grid-cols-4">
            {trustSignals.map((signal) => (
              <div key={signal.label} className="text-center">
                <p className="text-3xl font-black text-ink">{signal.value}</p>
                <p className="mt-1 text-sm font-bold text-ink/52">{signal.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white py-14">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center">
              <p className="section-label">Para todos os perfis</p>
              <h2 className="mt-2 text-4xl font-black text-ink">
                Três jeitos de usar o Xerecard.
              </h2>
              <p className="mt-3 text-base leading-7 text-ink/62">
                Contrate, venda ou fortaleça seu perfil com anúncios claros e contato direto.
              </p>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {journeys.map((journey) => (
                <article
                  key={journey.title}
                  className="rounded-xl border border-ink/10 bg-paper p-6 transition hover:-translate-y-1 hover:border-sky/35 hover:shadow-[0_20px_52px_rgba(7,16,20,0.12)]"
                >
                  <div className="grid size-12 place-items-center rounded-lg bg-mint text-ink">
                    {journey.icon}
                  </div>
                  <h3 className="mt-5 text-xl font-black text-ink">{journey.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/62">{journey.description}</p>
                  <div className="mt-5">
                    <ButtonLink href={journey.href} variant="dark" size="sm">
                      {journey.cta}
                    </ButtonLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-cloud py-14">
          <div className="container-page">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-label">Categorias</p>
                <h2 className="mt-2 text-4xl font-black text-ink">
                  Encontre pelo tipo de necessidade.
                </h2>
              </div>
              <ButtonLink href="/servicos" variant="secondary">
                Ver todas
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(categoryMeta).slice(0, 8).map(([name, meta]) => {
                const Icon = categoryIcons[meta.icon] ?? Sparkles;

                return (
                  <Link
                    key={name}
                    href={`/servicos?categoria=${encodeURIComponent(name)}`}
                    className="focus-ring group rounded-xl border border-ink/10 bg-white p-5 transition hover:-translate-y-1 hover:border-sky/35 hover:shadow-[0_20px_52px_rgba(7,16,20,0.12)]"
                  >
                    <div className="grid size-10 place-items-center rounded-lg bg-acid text-panel">
                      <Icon size={20} strokeWidth={2.6} aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-lg font-black text-ink">{name}</h3>
                    <p className="mt-1 text-sm font-semibold text-ink/52">{meta.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-14">
          <div className="container-page">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-label">Serviços</p>
                <h2 className="mt-2 text-4xl font-black text-ink">
                  Anúncios em destaque para contratar ou oferecer.
                </h2>
              </div>
              <ButtonLink href="/servicos" variant="secondary">
                Ver todos
              </ButtonLink>
            </div>
            <Suspense fallback={<ServicesSkeleton />}>
              <FeaturedServices />
            </Suspense>
          </div>
        </section>

        <section className="bg-cloud py-14">
          <div className="container-page grid gap-5 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-xl border border-ink/10 bg-white p-6 soft-shadow"
              >
                <div className="grid size-11 place-items-center rounded-lg bg-mint text-ink">
                  {benefit.icon}
                </div>
                <h3 className="mt-5 text-xl font-black text-ink">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/62">{benefit.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white py-14">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center">
              <p className="section-label">Como funciona</p>
              <h2 className="mt-2 text-4xl font-black text-ink">
                Três passos para conversar.
              </h2>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {howItWorks.map((item) => (
                <article
                  key={item.step}
                  className="rounded-xl border border-ink/10 bg-paper p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-lg bg-acid text-ink">
                      {item.icon}
                    </div>
                    <span className="text-sm font-black text-ink/32">{item.step}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-black text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/62">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="planos" className="bg-white py-14">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center">
              <p className="section-label">Planos</p>
              <h2 className="mt-2 text-4xl font-black text-ink">
                Publique grátis. Desbloqueie contatos quando precisar.
              </h2>
              <p className="mt-3 text-base leading-7 text-ink/62">
                Crie anúncios sem pagar. Ative um plano quando quiser abrir conversas.
              </p>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.id}
                  className={`rounded-xl border p-6 ${
                    plan.id === "ESSENTIAL"
                      ? "border-sky/35 bg-panel text-white premium-shadow"
                      : "border-ink/10 bg-paper"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={plan.id === "ESSENTIAL" ? "text-2xl font-black text-white" : "text-2xl font-black text-ink"}>{plan.name}</h3>
                    {plan.id === "ESSENTIAL" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2 py-1 text-xs font-black text-ink">
                        <Crown size={12} aria-hidden="true" />
                        Mais popular
                      </span>
                    ) : null}
                  </div>
                  <p className={plan.id === "ESSENTIAL" ? "mt-4 text-4xl font-black text-mint" : "mt-4 text-4xl font-black text-ink"}>{plan.price}</p>
                  <p className={plan.id === "ESSENTIAL" ? "mt-4 min-h-14 text-sm leading-6 text-white/62" : "mt-4 min-h-14 text-sm leading-6 text-ink/62"}>
                    {plan.description}
                  </p>
                  <ul className={plan.id === "ESSENTIAL" ? "mt-5 grid gap-2 text-sm font-semibold text-white/72" : "mt-5 grid gap-2 text-sm font-semibold text-ink/68"}>
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <CheckCircle2 size={16} className={plan.id === "ESSENTIAL" ? "mt-0.5 shrink-0 text-mint" : "mt-0.5 shrink-0 text-sky"} aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    {plan.id === "FREE" ? (
                      <ButtonLink href="/cadastrar" variant="secondary" className="w-full">
                        Criar conta grátis
                      </ButtonLink>
                    ) : (
                      <ButtonLink
                        href="/minha-conta#assinatura"
                        variant={plan.id === "ESSENTIAL" ? "primary" : "dark"}
                        className="w-full"
                      >
                        Ativar {plan.name}
                      </ButtonLink>
                    )}
                  </div>
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
