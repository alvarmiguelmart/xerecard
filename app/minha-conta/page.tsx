import {
  BadgeCheck,
  Camera,
  Crown,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  UserRound
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { ProfilePhotoForm } from "@/components/profile-photo-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SubscribeButton } from "@/components/subscribe-button";
import { ButtonLink } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { auth } from "@/lib/auth";
import { plans } from "@/lib/marketplace-data";

export default async function AccountPage() {
  const session = await auth();
  const activePlan = plans.find((plan) => plan.id === session?.user.plan) ?? plans[0];
  const hasPaidPlan =
    session?.user.plan === "ESSENTIAL" || session?.user.plan === "PROFESSIONAL";
  const profileName = session?.user.name ?? "Usuário Xerecard";
  const profileRole = session?.user.role === "PROFESSIONAL" ? "profissional" : "cliente";

  return (
    <>
      <SiteHeader />
      <main className="bg-paper py-12">
        <section className="container-page">
          <div>
            <p className="section-label">Minha conta</p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-ink md:text-5xl">
              Perfil, assinatura e contatos.
            </h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-ink/58">
              Mantenha seu perfil apresentável, acompanhe o plano ativo e deixe
              seus anúncios prontos para receber conversas.
            </p>
          </div>

          {session ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <aside className="overflow-hidden rounded-xl border border-ink/10 bg-white premium-shadow">
                <div className="h-24 bg-[linear-gradient(135deg,#76f28f_0%,#f5f8f1_55%,#12231b_100%)]" />
                <div className="p-6 pt-0">
                  <UserAvatar
                    name={profileName}
                    image={session.user.image}
                    size="xl"
                    className="-mt-12 ring-4 ring-white"
                  />
                  <h2 className="mt-5 text-2xl font-black text-ink">
                    {profileName}
                  </h2>
                  <p className="mt-1 break-all text-sm font-semibold text-ink/56">
                    {session.user.email}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <p className="inline-flex items-center gap-2 rounded-full bg-cloud px-3 py-2 text-sm font-black capitalize text-ink">
                      <UserRound size={16} aria-hidden="true" />
                      {profileRole}
                    </p>
                    <p className="inline-flex items-center gap-2 rounded-full bg-mint px-3 py-2 text-sm font-black text-ink">
                      {hasPaidPlan ? (
                        <BadgeCheck size={16} aria-hidden="true" />
                      ) : (
                        <ShieldCheck size={16} aria-hidden="true" />
                      )}
                      {hasPaidPlan ? "Contato ativo" : "Plano grátis"}
                    </p>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-xl bg-cloud p-4">
                      <p className="flex items-center gap-2 text-sm font-black uppercase text-ink/50">
                        <Camera size={16} aria-hidden="true" />
                        Qualidade do perfil
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-ink/62">
                        Foto e nome atualizados aumentam a confiança antes do
                        contato.
                      </p>
                    </div>
                    <LogoutButton />
                  </div>
                </div>

                <div className="mt-6 border-t border-ink/10 pt-6">
                  <div className="px-6 pb-6">
                    <ProfilePhotoForm
                      name={profileName}
                      image={session.user.image}
                    />
                  </div>
                </div>
              </aside>

              <div id="assinatura" className="grid gap-5">
                <article className="rounded-xl border border-ink/10 bg-white p-6 premium-shadow">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase text-ink/48">
                        Seu plano
                      </p>
                      <h2 className="mt-2 text-4xl font-black text-ink">
                        {activePlan.name}
                      </h2>
                      <p className="mt-2 text-lg font-black text-sky">
                        {activePlan.price}
                      </p>
                      <p className="mt-4 max-w-xl text-base leading-7 text-ink/62">
                        {activePlan.description}
                      </p>
                    </div>
                    {!hasPaidPlan ? (
                      <div className="grid gap-3">
                        <SubscribeButton plan="ESSENTIAL" method="card" />
                        <SubscribeButton plan="ESSENTIAL" method="pix" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-lg bg-mint px-4 py-3 text-sm font-black text-ink">
                        <Crown size={17} aria-hidden="true" />
                        Contatos liberados
                      </div>
                    )}
                  </div>
                </article>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-ink/10 bg-mint p-4 text-ink">
                    <MessageCircle size={20} aria-hidden="true" />
                    <p className="mt-3 text-sm font-black">WhatsApp</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-ink/64">
                      {hasPaidPlan
                        ? "Você pode abrir contatos dos anúncios."
                        : "Ative um plano para conversar pelo WhatsApp."}
                    </p>
                  </div>
                  <div className="rounded-xl border border-ink/10 bg-white p-4">
                    <ShieldCheck size={20} className="text-sky" aria-hidden="true" />
                    <p className="mt-3 text-sm font-black text-ink">Confiança</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-ink/58">
                      Perfil completo ajuda outros usuários a responderem mais rápido.
                    </p>
                  </div>
                  <div className="rounded-xl border border-ink/10 bg-white p-4">
                    <Crown size={20} className="text-sky" aria-hidden="true" />
                    <p className="mt-3 text-sm font-black text-ink">Plano atual</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-ink/58">
                      {activePlan.name} mantém seus recursos de contato organizados.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  {plans.map((plan) => (
                    <article
                      key={plan.id}
                      className="rounded-xl border border-ink/10 bg-white p-5"
                    >
                      <h3 className="text-xl font-black text-ink">{plan.name}</h3>
                      <p className="mt-3 text-2xl font-black text-ink">{plan.price}</p>
                      <ul className="mt-4 grid gap-2 text-sm font-semibold text-ink/62">
                        {plan.features.map((feature) => (
                          <li key={feature}>• {feature}</li>
                        ))}
                      </ul>
                      {plan.id !== "FREE" ? (
                        <div className="mt-5 grid gap-2">
                          <SubscribeButton plan={plan.id} method="card" />
                          <SubscribeButton plan={plan.id} method="pix" />
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-ink/10 bg-white p-6 premium-shadow">
              <div className="grid size-14 place-items-center rounded-xl bg-cloud text-ink">
                <LockKeyhole size={25} aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-2xl font-black text-ink">
                Entre para gerenciar sua conta
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-ink/62">
                Ative o plano Essencial para desbloquear contatos por R$ 5,99/mês.
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
