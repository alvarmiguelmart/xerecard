import { BadgeCheck, Heart, MapPin, Pencil, Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DeleteServiceButton } from "@/components/delete-service-button";
import { LikeButton } from "@/components/like-button";
import { RatingForm } from "@/components/rating-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { WhatsAppContactButton } from "@/components/whatsapp-contact-button";
import { auth } from "@/lib/auth";
import { findService } from "@/lib/marketplace-db";

type ServiceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  const service = await findService(id);

  if (!service) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="page-depth py-8 md:py-12">
        <section className="container-page grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="card-surface relative h-[min(78svh,50rem)] min-h-[24rem] overflow-hidden rounded-xl p-2 md:min-h-[38rem] lg:sticky lg:top-24">
            <div className="relative h-full overflow-hidden rounded-lg bg-cloud">
              <Image
                src={service.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>

          <div className="glass-panel-strong motion-rise rounded-xl p-6 lg:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="surface-panel rounded-full px-3 py-1 text-xs font-black uppercase">
                {service.mode === "REQUEST" ? "Pedido de serviço" : "Oferta de serviço"}
              </span>
              {service.verified ? (
                <span className="badge-success inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black">
                  <BadgeCheck size={14} aria-hidden="true" />
                  Verificado
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 text-4xl font-black leading-tight text-ink">
              {service.title}
            </h1>

            <div className="surface-panel mt-5 flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between">
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

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-bold text-ink/58">
              <span className="data-chip">
                <MapPin size={17} aria-hidden="true" />
                {service.location}
              </span>
              <span className="data-chip">
                <Heart size={15} className="icon-like" aria-hidden="true" />
                {(service.likeCount ?? 0).toLocaleString("pt-BR")} curtidas
              </span>
              <span className="data-chip">
                <Star size={15} className="icon-star" aria-hidden="true" />
                {(service.rating ?? 0).toFixed(1)} avaliação
              </span>
            </div>

            <p className="mt-6 text-lg leading-8 text-ink/68">{service.description}</p>

            <div className="card-surface mt-6 grid gap-3 rounded-xl p-4">
              <p className="text-sm font-black uppercase text-ink/50">
                Valor ou orçamento
              </p>
              <p className="price-display text-3xl font-black text-ink">
                {service.priceLabel}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="metric-chip rounded-full px-3 py-1 text-sm font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <WhatsAppContactButton serviceId={service.id} />
              <div className="grid h-full content-start gap-3">
                <ButtonLink
                  href="/servicos"
                  variant="secondary"
                  size="lg"
                  className="min-h-14 w-full"
                >
                  Voltar ao marketplace
                </ButtonLink>
                <p className="text-sm font-semibold leading-6 text-ink/58">
                  Continue explorando pedidos e ofertas no marketplace.
                </p>
              </div>
              <LikeButton serviceId={service.id} initialCount={service.likeCount ?? 0} />
              <RatingForm
                serviceId={service.id}
                initialRating={service.rating ?? 0}
                initialCount={service.ratingCount ?? 0}
              />
              {session?.user.id === service.ownerId ? (
                <>
                  <ButtonLink
                    href={`/servicos/${service.id}/editar`}
                    variant="secondary"
                    size="lg"
                    className="min-h-14 w-full"
                    icon={<Pencil size={17} aria-hidden="true" />}
                  >
                    Editar anúncio
                  </ButtonLink>
                  <DeleteServiceButton serviceId={service.id} />
                </>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

