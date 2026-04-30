import { BadgeCheck, Heart, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { MarketplaceService } from "@/lib/marketplace-data";

export function ServiceCard({ service }: { service: MarketplaceService }) {
  return (
    <article className="card-surface spatial-card group flex h-full w-full flex-col overflow-hidden rounded-xl transition hover:border-sky/35">
      <Link
        href={`/servicos/${service.id}`}
        className="focus-ring relative block aspect-[4/3] bg-cloud sm:aspect-square"
        aria-label={`Abrir anúncio ${service.title}`}
      >
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        <span className="absolute left-3 top-3 rounded-full border border-sky/35 bg-panel/92 px-3 py-1 text-xs font-black uppercase text-white backdrop-blur">
          {service.mode === "REQUEST" ? "Pedido" : "Oferta"}
        </span>
        {service.verified ? (
          <span className="badge-success absolute right-3 top-3 grid size-9 place-items-center rounded-full">
            <BadgeCheck size={18} aria-hidden="true" />
          </span>
        ) : null}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full border border-white/12 bg-panel/80 px-3 py-1 text-xs font-black text-white/75 backdrop-blur">
          <WhatsAppIcon className="size-3.5" />
          WhatsApp
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link
          href={`/usuarios/${service.ownerId}`}
          className="focus-ring flex items-center gap-3 text-left"
        >
          <UserAvatar
            name={service.ownerName}
            image={service.ownerImage}
            size="sm"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-ink">{service.ownerName}</p>
            <p className="text-xs font-bold text-ink/48">{service.category}</p>
          </div>
        </Link>

        <div className="grid gap-2">
          <div className="flex min-h-5 items-center gap-2 text-sm font-black text-ink/58">
            <MapPin size={16} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{service.location}</span>
          </div>
          <Link
            href={`/servicos/${service.id}`}
            className="focus-ring line-clamp-2 min-h-14 rounded-md text-xl font-black leading-tight text-ink transition hover:text-sky"
          >
            {service.title}
          </Link>
        </div>

        <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-ink/62">
          {service.description}
        </p>

        <div className="flex min-h-[4.25rem] flex-wrap content-start gap-2">
          {service.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="metric-chip max-w-full truncate rounded-full px-3 py-1 text-xs font-bold"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-black text-ink/58">
          <p className="metric-chip flex min-h-10 items-center gap-1.5 rounded-lg px-3 py-2">
            <Heart size={14} className="icon-like shrink-0" aria-hidden="true" />
            <span className="truncate">
              {(service.likeCount ?? 0).toLocaleString("pt-BR")} curtidas
            </span>
          </p>
          <p className="metric-chip flex min-h-10 items-center gap-1.5 rounded-lg px-3 py-2">
            <Star size={14} className="icon-star shrink-0" aria-hidden="true" />
            <span className="truncate">
              {(service.rating ?? 0).toFixed(1)}
              {service.ratingCount ? ` (${service.ratingCount})` : ""}
            </span>
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink/10 pt-4">
          <div>
            <p className="price-display whitespace-nowrap text-sm font-black text-ink">
              {service.priceLabel}
            </p>
            <p className="mt-1 text-xs font-bold text-ink/56">
              Contato direto pelo WhatsApp
            </p>
          </div>
          <ButtonLink
            href={`/servicos/${service.id}`}
            size="sm"
            variant="secondary"
            icon={<WhatsAppIcon className="size-4" />}
          >
            Ver detalhes
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

