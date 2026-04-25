import { ArrowRight, Bell, LockKeyhole, MessageCircle, ShieldCheck } from "lucide-react";
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
    title: "WhatsApp protegido por assinatura",
    text: "O usuário navega livremente, mas só abre o contato quando tem plano ativo."
  },
  {
    icon: <Bell size={22} />,
    title: "Notificações de interessados",
    text: "Toda ação relevante gera aviso para o dono do serviço acompanhar oportunidades."
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Perfis e serviços organizados",
    text: "Login, cadastro e publicação já estão separados para virar backend real."
  }
];

export default async function Home() {
  const services = (await listServices()).slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="surface-grid bg-paper py-12 md:py-20">
          <div className="container-page grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full bg-mint px-4 py-2 text-sm font-black uppercase text-ink">
                Assinatura barata para liberar contatos
              </p>
              <h1 className="mt-5 text-5xl font-black leading-none text-ink md:text-7xl">
                Marketplace de serviços com contato por WhatsApp.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/64">
                O Xerecard conecta quem precisa contratar com quem oferece serviços.
                Cadastre, publique, receba notificações e libere o WhatsApp por assinatura.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="/cadastrar"
                  size="lg"
                  icon={<ArrowRight size={18} aria-hidden="true" />}
                >
                  Criar conta
                </ButtonLink>
                <ButtonLink href="/servicos" variant="secondary" size="lg">
                  Ver serviços
                </ButtonLink>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-mint/55 blur-2xl" />
              <div className="relative grid gap-4 rounded-2xl border border-ink/10 bg-white p-4 premium-shadow">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Image
                    src="/generated/marketplace-hero.png"
                    alt=""
                    width={188}
                    height={235}
                    className="h-64 w-full rounded-xl object-cover"
                    priority
                  />
                  <div className="rounded-xl bg-panel p-5 text-white">
                    <MessageCircle size={26} aria-hidden="true" />
                    <p className="mt-6 text-3xl font-black">R$ 9,90</p>
                    <p className="mt-2 text-sm leading-6 text-white/68">
                      Plano Essencial para abrir WhatsApp e receber notificações.
                    </p>
                  </div>
                </div>
                <div className="rounded-xl bg-cloud p-4">
                  <p className="text-sm font-black uppercase text-ink/48">
                    Notificação
                  </p>
                  <p className="mt-2 font-black text-ink">
                    Juninho tem interesse no seu serviço.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-14">
          <div className="container-page">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black uppercase text-sky">Serviços</p>
                <h2 className="mt-2 text-4xl font-black text-ink">
                  Pedidos e ofertas em destaque.
                </h2>
              </div>
              <ButtonLink href="/servicos" variant="secondary">
                Abrir marketplace
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
                className="rounded-xl border border-ink/10 bg-white p-6"
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
              <p className="text-sm font-black uppercase text-sky">Planos</p>
              <h2 className="mt-2 text-4xl font-black text-ink">
                Comece grátis. Libere contatos por R$ 9,90.
              </h2>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.id}
                  className="rounded-xl border border-ink/10 bg-paper p-6"
                >
                  <h3 className="text-2xl font-black text-ink">{plan.name}</h3>
                  <p className="mt-4 text-4xl font-black text-ink">{plan.price}</p>
                  <p className="mt-4 min-h-14 text-sm leading-6 text-ink/62">
                    {plan.description}
                  </p>
                  <ul className="mt-5 grid gap-2 text-sm font-semibold text-ink/68">
                    {plan.features.map((feature) => (
                      <li key={feature}>• {feature}</li>
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
