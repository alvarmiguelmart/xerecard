import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  Crown,
  Eye,
  LockKeyhole,
  Mail,
  Megaphone,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TimerReset,
  UserRound
} from "lucide-react";
import Image from "next/image";
import { AccountSecurityForm } from "@/components/account-security-form";
import { LogoutButton } from "@/components/logout-button";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";
import { ProfilePhotoForm } from "@/components/profile-photo-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SubscribeButton } from "@/components/subscribe-button";
import { ButtonLink } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { auth } from "@/lib/auth";
import { hasActiveContactAccess, subscriptionTrialDays } from "@/lib/billing";
import { plans } from "@/lib/marketplace-data";
import { prisma } from "@/lib/prisma";
import { ensureProfileBioColumn } from "@/lib/profile-schema";
import { cn } from "@/lib/utils";

type AccountPageProps = {
  searchParams?: Promise<{
    tab?: string;
    mensagem?: string;
  }>;
};

function formatJoinDate(date?: Date | null) {
  if (!date) {
    return "Conta recente";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric"
  }).format(date);
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams;
  const activeTab = params?.tab === "assinatura" ? "assinatura" : "perfil";
  const session = await auth();
  const profileName = session?.user.name ?? "Usuário Xerecard";
  const profileRole = session?.user.role === "PROFESSIONAL" ? "profissional" : "cliente";

  if (session) {
    await ensureProfileBioColumn();
  }

  const accountStats = session
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          createdAt: true,
          bannerImage: true,
          bio: true,
          plan: true,
          planExpiresAt: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          stripeSubscriptionStatus: true,
          services: {
            select: { mode: true, published: true }
          },
          notifications: {
            where: { readAt: null },
            select: { id: true }
          }
        }
      })
    : null;

  const hasPaidPlan = hasActiveContactAccess(accountStats);
  const activePlan = plans.find((plan) => plan.id === accountStats?.plan) ?? plans[0];

  const publishedServices =
    accountStats?.services.filter((service) => service.published).length ?? 0;
  const offers =
    accountStats?.services.filter((service) => service.mode === "OFFER" && service.published)
      .length ?? 0;
  const requests =
    accountStats?.services.filter((service) => service.mode === "REQUEST" && service.published)
      .length ?? 0;
  const unreadNotifications = accountStats?.notifications.length ?? 0;

  const completionItems = session
    ? [
        { label: "Nome público", done: Boolean(session.user.name) },
        { label: "Foto de perfil", done: Boolean(session.user.image) },
        { label: "Tipo de usuário", done: Boolean(session.user.role) },
        { label: "Primeiro anúncio", done: publishedServices > 0 },
        { label: "Contato liberado", done: hasPaidPlan }
      ]
    : [];
  const completionScore = completionItems.length
    ? Math.round(
        (completionItems.filter((item) => item.done).length / completionItems.length) * 100
      )
    : 0;

  return (
    <>
      <SiteHeader />
      <main className="page-depth py-12 md:py-16">
        <section className="container-page">
          <div className="motion-rise">
            <p className="page-kicker">
              <UserRound size={14} aria-hidden="true" />
              Minha conta
            </p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-ink md:text-5xl">
              Seu perfil no marketplace.
            </h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-ink/58">
              Mostre quem você é, mantenha seus anúncios prontos e construa confiança
              antes da conversa no WhatsApp.
            </p>
          </div>

          {session ? (
            <div className="mt-8 grid gap-8">
              {params?.mensagem ? (
                <p className="glass-panel rounded-xl p-4 text-sm font-bold text-ink">
                  {params.mensagem}
                </p>
              ) : null}

              <nav
                className="inline-flex w-fit rounded-xl border border-ink/10 bg-white p-1"
                aria-label="Abas da conta"
              >
                <ButtonLink
                  href="/minha-conta"
                  variant={activeTab === "perfil" ? "primary" : "secondary"}
                  size="sm"
                >
                  Perfil
                </ButtonLink>
                <ButtonLink
                  href="/minha-conta?tab=assinatura"
                  variant={activeTab === "assinatura" ? "primary" : "secondary"}
                  size="sm"
                >
                  Assinatura
                </ButtonLink>
              </nav>

              {activeTab === "perfil" ? (
              <section className="glass-panel-strong overflow-hidden rounded-xl">
                <div className="relative min-h-44 bg-panel md:min-h-48">
                  {accountStats?.bannerImage ? (
                    <Image
                      src={accountStats.bannerImage}
                      alt=""
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="account-banner-fallback absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.36),transparent_34%),linear-gradient(135deg,#050505_0%,#0a0a0a_52%,rgba(56,189,248,0.24)_160%)]" />
                  )}
                  <div className="account-banner-overlay absolute inset-0 bg-black/28" />
                  <div className="relative grid gap-4 p-5 md:grid-cols-[auto_1fr_auto] md:items-end md:p-6">
                    <UserAvatar
                      name={profileName}
                      image={session.user.image}
                      size="xl"
                      frameless
                    />
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase text-white/72">
                          <UserRound size={14} aria-hidden="true" />
                          {profileRole}
                        </p>
                        <p className="badge-success inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase">
                          {hasPaidPlan ? (
                            <BadgeCheck size={14} aria-hidden="true" />
                          ) : (
                            <ShieldCheck size={14} aria-hidden="true" />
                          )}
                          {hasPaidPlan ? "Contato ativo" : "Plano grátis"}
                        </p>
                      </div>
                      <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-4xl">
                        {profileName}
                      </h2>
                      <p className="mt-2 flex max-w-2xl items-center gap-2 break-all text-sm font-semibold text-white/58">
                        <Mail size={15} aria-hidden="true" />
                        {session.user.email}
                      </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 md:min-w-52 md:grid-cols-1">
                      <ButtonLink
                        href={`/usuarios/${session.user.id}`}
                        variant="secondary"
                        icon={<Eye size={17} aria-hidden="true" />}
                      >
                        Ver perfil público
                      </ButtonLink>
                      <ButtonLink
                        href="/servicos/novo"
                        icon={<ArrowRight size={17} aria-hidden="true" />}
                      >
                        Criar anúncio
                      </ButtonLink>
                      <div className="[&>button]:w-full">
                        <LogoutButton />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-4 lg:grid-cols-2 lg:items-stretch lg:p-5">
                  <div className="grid gap-4 lg:order-2 lg:h-full">
                    <article className="glass-panel rounded-xl p-4 lg:h-full">
                      <div className="flex items-center gap-3">
                        <div className="surface-panel grid size-11 place-items-center rounded-lg">
                          <Camera size={20} aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-ink">
                            Identidade do perfil
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-ink/56">
                            Nome, foto e tipo aparecem nos anúncios.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <ProfilePhotoForm
                          bannerImage={accountStats?.bannerImage}
                          bio={accountStats?.bio}
                          name={profileName}
                          image={session.user.image}
                          role={session.user.role}
                        />
                      </div>
                    </article>

                  </div>

                  <aside className="grid gap-4 lg:order-1 lg:h-full lg:grid-rows-[auto_auto_1fr]">
                    <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-2">
                      {[
                        {
                          label: "Anúncios",
                          value: publishedServices,
                          icon: <BriefcaseBusiness size={15} aria-hidden="true" />
                        },
                        {
                          label: "Ofertas",
                          value: offers,
                          icon: <Megaphone size={15} aria-hidden="true" />
                        },
                        {
                          label: "Pedidos",
                          value: requests,
                          icon: <MessageCircle size={15} aria-hidden="true" />
                        },
                        {
                          label: "Avisos",
                          value: unreadNotifications,
                          icon: <Sparkles size={15} aria-hidden="true" />
                        }
                      ].map((stat) => (
                        <div key={stat.label} className="rounded-lg bg-cloud p-3">
                          <div className="flex items-center justify-between gap-3 text-white">
                            {stat.icon}
                            <p className="text-2xl font-black text-ink">{stat.value}</p>
                          </div>
                          <p className="mt-1 text-xs font-black uppercase text-ink/46">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <article className="glass-panel rounded-xl p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-black uppercase text-ink/46">
                            Força do perfil
                          </p>
                          <h3 className="mt-1 text-xl font-black text-ink">
                            {completionScore}% completo
                          </h3>
                        </div>
                        <p className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-ink/56">
                          Desde {formatJoinDate(accountStats?.createdAt)}
                        </p>
                      </div>
                      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-line">
                        <div
                          className="h-full rounded-full bg-sky"
                          style={{ width: `${completionScore}%` }}
                        />
                      </div>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {completionItems.map((item) => (
                          <p
                            key={item.label}
                            className={cn(
                              "flex items-center gap-2 text-xs font-semibold",
                              item.done ? "text-ink" : "text-ink/44"
                            )}
                          >
                            <CheckCircle2
                              size={16}
                              className={item.done ? "text-white" : "text-ink/24"}
                              aria-hidden="true"
                            />
                            {item.label}
                          </p>
                        ))}
                      </div>
                    </article>

                    <article className="glass-panel rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="surface-panel grid size-11 place-items-center rounded-lg">
                          <LockKeyhole size={20} aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-ink">
                            Segurança da conta
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-ink/56">
                            Troque email e senha com confirmação.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <AccountSecurityForm currentEmail={session.user.email} />
                      </div>
                    </article>
                  </aside>
                </div>
              </section>
              ) : null}

              {activeTab === "assinatura" ? (
              <section id="assinatura" className="grid gap-5">
                <div>
                  <p className="page-kicker">
                    <Crown size={14} aria-hidden="true" />
                    Assinatura
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-ink md:text-4xl">
                    Plano e pagamentos.
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-ink/58">
                    Área separada para liberar contatos, acompanhar seu plano e trocar
                    forma de pagamento sem misturar com edição de perfil.
                  </p>
                </div>

                <article
                  className={cn(
                    "rounded-xl border p-6",
                    activePlan.id === "ESSENTIAL"
                      ? "essential-card border-sky/35 bg-panel text-white premium-shadow"
                      : "border-ink/10 bg-white"
                  )}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p
                        className={cn(
                          "text-sm font-black uppercase",
                          activePlan.id === "ESSENTIAL" ? "text-white/48" : "text-ink/48"
                        )}
                      >
                        Seu plano
                      </p>
                      <h3
                        className={cn(
                          "mt-2 text-4xl font-black",
                          activePlan.id === "ESSENTIAL" ? "text-white" : "text-ink"
                        )}
                      >
                        {activePlan.name}
                      </h3>
                      <p
                        className={cn(
                          "price-display mt-2 whitespace-nowrap text-lg font-black",
                          activePlan.id === "ESSENTIAL" ? "premium-text" : "text-ink"
                        )}
                      >
                        {activePlan.price}
                      </p>
                      <p
                        className={cn(
                          "mt-4 max-w-xl text-base leading-7",
                          activePlan.id === "ESSENTIAL" ? "text-white/62" : "text-ink/62"
                        )}
                      >
                        {hasPaidPlan
                          ? activePlan.description
                          : `Comece com ${subscriptionTrialDays} dias grátis. Depois, mantenha o plano ativo para abrir contatos.`}
                      </p>
                    </div>
                    {!hasPaidPlan ? (
                      <div className="grid gap-3">
                        <SubscribeButton
                          plan="ESSENTIAL"
                          method="card"
                          trialDays={subscriptionTrialDays}
                        />
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        <div className="badge-success inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-black">
                          <Crown size={17} aria-hidden="true" />
                          Contatos liberados
                        </div>
                        {accountStats?.stripeCustomerId ? <ManageSubscriptionButton /> : null}
                      </div>
                    )}
                  </div>
                </article>

                <div className="grid gap-5 md:grid-cols-3">
                  {plans.map((plan) => {
                    const isEssential = plan.id === "ESSENTIAL";

                    return (
                      <article
                        key={plan.id}
                        className={cn(
                          "rounded-xl border p-5",
                          isEssential
                            ? "essential-card border-sky/35 bg-panel text-white premium-shadow"
                            : "border-ink/10 bg-white"
                        )}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={cn(
                              "text-xl font-black",
                              isEssential ? "text-white" : "text-ink"
                            )}
                          >
                            {plan.name}
                          </h3>
                          {isEssential ? (
                            <span className="badge-success inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-black">
                              <Crown size={12} aria-hidden="true" />
                              Mais popular
                            </span>
                          ) : null}
                        </div>
                        <p
                          className={cn(
                            "price-display mt-3 whitespace-nowrap text-xl font-black md:text-2xl",
                            isEssential ? "premium-text" : "text-ink"
                          )}
                        >
                          {plan.price}
                        </p>
                        {plan.id !== "FREE" ? (
                          <p
                            className={cn(
                              "mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase",
                              isEssential ? "bg-white/8 text-white" : "bg-cloud text-ink"
                            )}
                          >
                            <TimerReset size={13} aria-hidden="true" />
                            1 mês grátis
                          </p>
                        ) : null}
                        <p
                          className={cn(
                            "mt-3 min-h-16 text-sm font-semibold leading-6",
                            isEssential ? "text-white/62" : "text-ink/62"
                          )}
                        >
                          {plan.description}
                        </p>
                        <ul
                          className={cn(
                            "mt-4 grid gap-2 text-sm font-semibold",
                            isEssential ? "text-white/82" : "text-ink/62"
                          )}
                        >
                          {plan.features.map((feature) => (
                            <li
                              key={feature}
                              className={cn(
                                "flex gap-2",
                                isEssential
                                  ? "font-bold"
                                  : ""
                              )}
                            >
                              <CheckCircle2
                                size={16}
                                className={cn(
                                  "mt-0.5 shrink-0",
                                  isEssential ? "text-white" : "text-ink"
                                )}
                                aria-hidden="true"
                              />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        {plan.id !== "FREE" ? (
                          <div className="mt-5 grid gap-2">
                            <SubscribeButton
                              plan={plan.id}
                              method="card"
                              trialDays={subscriptionTrialDays}
                            />
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </section>
              ) : null}
            </div>
          ) : (
            <div className="glass-panel-strong motion-rise mt-8 rounded-xl p-6 text-white">
              <div className="surface-panel grid size-14 place-items-center rounded-xl">
                <LockKeyhole size={25} aria-hidden="true" />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-black text-white">
                  Entre para gerenciar sua conta
                </h2>
                <span className="badge-success inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-black">
                  <TimerReset size={12} aria-hidden="true" />
                  1 mês grátis
                </span>
              </div>
              <p className="mt-3 max-w-xl text-base leading-7 text-white/62">
                Crie sua conta, ative o teste e desbloqueie contatos por
                {` ${subscriptionTrialDays} `}dias antes da primeira cobrança.
              </p>
              <ul className="mt-4 grid max-w-xl gap-2 text-sm font-semibold text-white/72 sm:grid-cols-2">
                <li className="flex gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-white" aria-hidden="true" />
                  Abrir WhatsApp dos anúncios
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-white" aria-hidden="true" />
                  Receber avisos de interesse
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
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

