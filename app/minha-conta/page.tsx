import { Crown, LockKeyhole } from "lucide-react";
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

  return (
    <>
      <SiteHeader />
      <main className="bg-paper py-12">
        <section className="container-page">
          <div>
            <p className="text-sm font-black uppercase text-sky">Minha conta</p>
            <h1 className="mt-2 text-5xl font-black text-ink">
              Assinatura e perfil.
            </h1>
          </div>

          {session ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <aside className="rounded-xl border border-ink/10 bg-white p-6 premium-shadow">
                <UserAvatar
                  name={session.user.name ?? "Usuário Xerecard"}
                  image={session.user.image}
                  size="lg"
                />
                <h2 className="mt-5 text-2xl font-black text-ink">
                  {session.user.name ?? "Usuário Xerecard"}
                </h2>
                <p className="mt-1 text-sm font-semibold text-ink/56">
                  {session.user.email}
                </p>
                <p className="mt-4 rounded-full bg-cloud px-3 py-2 text-sm font-black capitalize text-ink">
                  Perfil: {session.user.role === "PROFESSIONAL" ? "profissional" : "cliente"}
                </p>
                <div className="mt-6">
                  <LogoutButton />
                </div>
                <div className="mt-6 border-t border-ink/10 pt-6">
                  <ProfilePhotoForm
                    name={session.user.name ?? "Usuário Xerecard"}
                    image={session.user.image}
                  />
                </div>
              </aside>

              <div id="assinatura" className="grid gap-5">
                <article className="rounded-xl border border-ink/10 bg-white p-6 premium-shadow">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase text-ink/48">
                        Plano atual
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
                    {session.user.plan === "FREE" ? (
                      <div className="grid gap-3">
                        <SubscribeButton plan="ESSENTIAL" method="card" />
                        <SubscribeButton plan="ESSENTIAL" method="pix" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-lg bg-mint px-4 py-3 text-sm font-black text-ink">
                        <Crown size={17} aria-hidden="true" />
                        WhatsApp liberado
                      </div>
                    )}
                  </div>
                </article>

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
                Entre para gerenciar assinatura
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-ink/62">
                O plano Essencial libera links de WhatsApp por R$ 6,99/mês.
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
