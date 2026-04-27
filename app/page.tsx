import {
  ArrowRight,
  Bell,
  CheckCircle2,
  LockKeyhole,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import { ServiceCard } from "@/components/service-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { listServices } from "@/lib/marketplace-db";
import { plans } from "@/lib/marketplace-data";

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

export default async function Home() {
  const services = (await listServices()).slice(0, 3);

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
              <div className="mt-6 grid max-w-2xl gap-3 rounded-xl border border-ink/10 bg-white/82 p-3 shadow-sm sm:grid-cols-[1fr_auto]">
                <div className="flex min-h-12 items-center gap-3 rounded-lg bg-cloud px-4 text-sm font-bold text-ink/52">
                  <Search size={18} aria-hidden="true" />
                  Buscar diarista, manutenção, fotografia...
                </div>
                <ButtonLink href="/servicos" variant="dark">
                  Buscar serviços
                </ButtonLink>
              </div>
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
                  <div className="rounded-xl bg-mint p-4 text-ink">
                    <p className="text-xs font-black uppercase text-ink/52">Hoje</p>
                    <p className="mt-1 text-2xl font-black">8 contatos</p>
                  </div>
                </div>
              </aside>
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
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
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

        <section id="planos" className="bg-white py-14">
          <div className="container-page">
            <div className="max-w-2xl">
              <p className="section-label">Planos</p>
              <h2 className="mt-2 text-4xl font-black text-ink">
                Publique grátis. Desbloqueie contatos quando precisar.
              </h2>
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
                  <h3 className={plan.id === "ESSENTIAL" ? "text-2xl font-black text-white" : "text-2xl font-black text-ink"}>{plan.name}</h3>
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
