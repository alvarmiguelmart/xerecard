import {
  BadgeCheck,
  CalendarDays,
  Grid3X3,
  MessageCircle,
  ShieldCheck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { findPublicProfile } from "@/lib/marketplace-db";
import type { MarketplaceService } from "@/lib/marketplace-data";

type UserProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

function ListingTile({ service }: { service: MarketplaceService }) {
  return (
    <Link
      href={`/servicos/${service.id}`}
      className="focus-ring group block"
      aria-label={`Abrir anúncio ${service.title}`}
    >
      <article className="spatial-card overflow-hidden rounded-xl border border-ink/10 bg-white transition hover:border-sky/35">
        <div className="relative aspect-[4/3] bg-cloud sm:aspect-square">
          <Image
            src={service.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          <span className="absolute left-2 top-2 rounded-full bg-white/92 px-2.5 py-1 text-[0.68rem] font-black uppercase text-ink backdrop-blur">
            {service.mode === "REQUEST" ? "Pedido" : "Oferta"}
          </span>
        </div>
        <div className="p-3">
          <h3 className="line-clamp-2 min-h-10 text-sm font-black leading-5 text-ink">
            {service.title}
          </h3>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="truncate text-xs font-bold text-ink/48">{service.category}</p>
            <p className="price-display whitespace-nowrap text-xs font-black text-ink">
              {service.priceLabel}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}

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

  return (
    <>
      <SiteHeader />
      <main className="page-depth py-10 md:py-14">
        <section className="container-page">
          <div className="glass-panel-strong motion-rise rounded-xl p-6 md:p-8">
            <div className="relative -m-6 mb-6 min-h-44 overflow-hidden rounded-t-xl md:-m-8 md:mb-8">
              {profile.bannerImage ? (
                <Image
                  src={profile.bannerImage}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.34),transparent_34%),linear-gradient(135deg,#050505_0%,#0a0a0a_58%,rgba(56,189,248,0.22)_160%)]" />
              )}
              <div className="absolute inset-0 bg-black/24" />
            </div>
            <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
              <UserAvatar
                name={profile.name}
                image={profile.image}
                size="xl"
                className="rounded-full"
              />

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-4xl font-black leading-tight text-ink">
                    {profile.name}
                  </h1>
                  <span className="badge-success inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase">
                    {profile.role === "PROFESSIONAL" ? (
                      <BadgeCheck size={13} aria-hidden="true" />
                    ) : (
                      <ShieldCheck size={13} aria-hidden="true" />
                    )}
                    {profileType}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm font-black text-ink">
                  <p className="data-chip">
                    <span className="text-xl">{profile.serviceCount}</span>{" "}
                    anúncios
                  </p>
                  <p className="data-chip">
                    <span className="text-xl">{offers.length}</span> ofertas
                  </p>
                  <p className="data-chip">
                    <span className="text-xl">{requests.length}</span> pedidos
                  </p>
                </div>

                <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-ink/62">
                  {profile.bio?.trim() ||
                    "Perfil sem bio pública ainda. Confira os anúncios publicados antes de conversar."}
                </p>
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-black text-ink/46">
                  <CalendarDays size={15} aria-hidden="true" />
                  Desde {memberSince}
                </p>
              </div>

              <ButtonLink
                href="/servicos"
                variant="secondary"
                icon={<MessageCircle size={17} aria-hidden="true" />}
              >
                Marketplace
              </ButtonLink>
            </div>
          </div>

          <section className="mt-8" aria-labelledby="profile-listings">
            <div className="flex items-center gap-3 border-b border-ink/10 pb-3">
              <Grid3X3 size={18} className="text-ink/54" aria-hidden="true" />
              <h2 id="profile-listings" className="text-sm font-black uppercase text-ink">
                Anúncios
              </h2>
            </div>

            {profile.services.length > 0 ? (
              <div className="stagger-list mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {profile.services.map((service) => (
                  <ListingTile key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="glass-panel mt-5 rounded-xl p-8 text-center">
                <h3 className="text-2xl font-black text-ink">
                  Nenhum anúncio publicado ainda
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-ink/56">
                  Quando este perfil publicar ofertas ou pedidos, eles aparecem aqui em
                  formato de grade.
                </p>
              </div>
            )}
          </section>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

