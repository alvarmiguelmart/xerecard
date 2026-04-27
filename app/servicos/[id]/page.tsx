import { BadgeCheck, Heart, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LikeButton } from "@/components/like-button";
import { RatingForm } from "@/components/rating-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { WhatsAppContactButton } from "@/components/whatsapp-contact-button";
import { findService } from "@/lib/marketplace-db";

type ServiceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const service = await findService(id);

  if (!service) {
    notFound();
  }

  const ratingLabel =
    service.ratingCount > 0
      ? `${service.rating.toFixed(1)} · ${service.ratingCount.toLocaleString("pt-BR")} avaliações`
      : "Sem avaliações";

  return (
    <>
      <SiteHeader />
      <main className="bg-paper py-10">
        <section className="container-page grid gap-8 lg:grid-cols-[0.85fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white premium-shadow">
            <div className="relative aspect-[4/3] bg-cloud">
              <Image
                src={service.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-6 premium-shadow">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-mint px-3 py-1 text-xs font-black uppercase text-ink">
                {service.mode === "request" ? "Pedido de serviço" : "Oferta de serviço"}
              </span>
              {service.verified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-cloud px-3 py-1 text-xs font-black text-sky">
                  <BadgeCheck size={14} aria-hidden="true" />
                  Verificado
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 text-4xl font-black leading-tight text-ink">
              {service.title}
            </h1>

            <div className="mt-5 flex flex-col gap-4 rounded-xl bg-cloud p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={service.ownerName}
                  image={service.ownerImage}
                  size="md"
                />
                <div>
                  <p className="text-sm font-black text-ink">{service.ownerName}</p>
                  <p className="text-xs font-bold text-ink/50">Responsável pelo anúncio</p>
                </div>
              </div>
              <ButtonLink
                href={`/usuarios/${service.ownerId}`}
                variant="secondary"
                size="sm"
              >
                Ver perfil
              </ButtonLink>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm font-bold text-ink/58">
              <span className="inline-flex items-center gap-2">
                <MapPin size={17} aria-hidden="true" />
                {service.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Star size={17} className="fill-gold text-gold" aria-hidden="true" />
                {ratingLabel}
              </span>
              <span className="inline-flex items-center gap-1">
                <Heart size={17} className="text-rose" aria-hidden="true" />
                {service.likeCount.toLocaleString("pt-BR")} curtidas
              </span>
            </div>

            <p className="mt-6 text-lg leading-8 text-ink/68">{service.description}</p>

            <div className="mt-6 grid gap-3 rounded-xl bg-cloud p-4">
              <p className="text-sm font-black uppercase text-ink/50">
                Valor ou orçamento
              </p>
              <p className="text-3xl font-black text-ink">{service.priceLabel}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-paper px-3 py-1 text-sm font-bold text-ink/65"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6">
              <RatingForm
                serviceId={service.id}
                initialRating={service.rating}
                initialCount={service.ratingCount}
              />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
              <WhatsAppContactButton serviceId={service.id} />
              <div className="grid gap-3">
                <LikeButton serviceId={service.id} initialCount={service.likeCount} />
                <ButtonLink href="/servicos" variant="secondary" size="lg">
                  Voltar ao marketplace
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
