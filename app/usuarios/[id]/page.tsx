import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Heart,
  MessageCircle,
  ShieldCheck,
  Star
} from "lucide-react";
import { notFound } from "next/navigation";
import { ServiceRail } from "@/components/service-rail";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { findPublicProfile } from "@/lib/marketplace-db";

type UserProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params;
  const profile = await findPublicProfile(id);

  if (!profile) {
    notFound();
  }

  const requests = profile.services.filter((service) => service.mode === "REQUEST");
  const offers = profile.services.filter((service) => service.mode === "OFFER");
  const memberSince = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric"
  }).format(profile.createdAt);
  const profileType = profile.role === "PROFESSIONAL" ? "Profissional" : "Cliente";
  const primaryCategory =
    offers[0]?.category ?? requests[0]?.category ?? "Serviços variados";

  return (
    <>
      <SiteHeader />
      <main className="bg-paper py-10">
        <section className="container-page">
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white premium-shadow">
            <div className="h-28 bg-[linear-gradient(135deg,#76f28f_0%,#f5f8f1_52%,#12231b_100%)]" />
            <div className="p-5 md:p-6">
              <div className="-mt-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <UserAvatar
                    name={profile.name}
                    image={profile.image}
                    size="xl"
                    className="ring-4 ring-white"
                  />
                  <div className="pb-1">
                    <div className="flex flex-wrap gap-2">
                      <p className="inline-flex items-center gap-2 rounded-full bg-mint px-3 py-1 text-xs font-black uppercase text-ink">
                        {profile.role === "PROFESSIONAL" ? (
                          <BadgeCheck size={14} aria-hidden="true" />
                        ) : (
                          <ShieldCheck size={14} aria-hidden="true" />
                        )}
                        {profileType}
                      </p>
                      <p className="inline-flex items-center gap-2 rounded-full bg-cloud px-3 py-1 text-xs font-black uppercase text-ink/62">
                        <CalendarDays size={14} aria-hidden="true" />
                        Desde {memberSince}
                      </p>
                    </div>
                    <h1 className="mt-3 text-4xl font-black text-ink">
                      {profile.name}
                    </h1>
                    <p className="mt-2 max-w-2xl text-base font-semibold leading-7 text-ink/62">
                      {profileType} no Xerecard com foco em {primaryCategory.toLowerCase()}.
                      Confira os anúncios, avaliações e sinais de interesse antes de conversar.
                    </p>
                  </div>
                </div>

                <ButtonLink href="/servicos" variant="secondary">
                  Ver marketplace
                </ButtonLink>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-cloud p-4">
                  <p className="flex items-center gap-2 text-3xl font-black text-ink">
                    <BriefcaseBusiness size={24} className="text-sky" aria-hidden="true" />
                    {profile.serviceCount}
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink/56">anúncios ativos</p>
                </div>
                <div className="rounded-xl bg-cloud p-4">
                  <p className="flex items-center gap-2 text-3xl font-black text-ink">
                    <Heart size={24} className="text-rose" aria-hidden="true" />
                    {profile.likeCount}
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink/56">curtidas recebidas</p>
                </div>
                <div className="rounded-xl bg-cloud p-4">
                  <p className="flex items-center gap-2 text-3xl font-black text-ink">
                    <Star size={24} className="fill-gold text-gold" aria-hidden="true" />
                    {profile.ratingCount}
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink/56">avaliações</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <p className="rounded-xl border border-ink/10 bg-white p-4 text-sm font-black text-ink/66">
                  Perfil com anúncios vinculados e histórico público no marketplace.
                </p>
                <p className="rounded-xl border border-ink/10 bg-white p-4 text-sm font-black text-ink/66">
                  Avaliações e curtidas ajudam a medir reputação antes do contato.
                </p>
                <p className="rounded-xl border border-ink/10 bg-white p-4 text-sm font-black text-ink/66">
                  <MessageCircle size={16} className="mr-2 inline text-sky" aria-hidden="true" />
                  Abra o WhatsApp pelo anúncio quando quiser conversar.
                </p>
              </div>
            </div>
          </div>

          {requests.length > 0 ? (
            <ServiceRail title="Pedidos deste perfil" services={requests} />
          ) : null}
          {offers.length > 0 ? (
            <ServiceRail title="Ofertas deste perfil" services={offers} />
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
