import { BadgeCheck, Heart, Star } from "lucide-react";
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

  const requests = profile.services.filter((service) => service.mode === "request");
  const offers = profile.services.filter((service) => service.mode === "offer");

  return (
    <>
      <SiteHeader />
      <main className="bg-paper py-10">
        <section className="container-page">
          <div className="rounded-2xl border border-ink/10 bg-white p-6 premium-shadow">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <UserAvatar
                  name={profile.name}
                  image={profile.image}
                  size="xl"
                />
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-cloud px-3 py-1 text-xs font-black uppercase text-sky">
                    {profile.role === "PROFESSIONAL" ? (
                      <BadgeCheck size={14} aria-hidden="true" />
                    ) : null}
                    {profile.role === "PROFESSIONAL" ? "Profissional" : "Cliente"}
                  </p>
                  <h1 className="mt-3 text-4xl font-black text-ink">
                    {profile.name}
                  </h1>
                </div>
              </div>

              <ButtonLink href="/servicos" variant="secondary">
                Ver marketplace
              </ButtonLink>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-cloud p-4">
                <p className="text-3xl font-black text-ink">{profile.serviceCount}</p>
                <p className="mt-1 text-sm font-bold text-ink/56">publicações</p>
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
                <p className="mt-1 text-sm font-bold text-ink/56">avaliações recebidas</p>
              </div>
            </div>
          </div>

          {requests.length > 0 ? (
            <ServiceRail title="Pedidos publicados" services={requests} />
          ) : null}
          {offers.length > 0 ? (
            <ServiceRail title="Serviços oferecidos" services={offers} />
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
