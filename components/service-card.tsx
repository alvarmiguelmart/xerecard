import { BadgeCheck, Heart, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { MarketplaceService } from "@/lib/marketplace-data";

export function ServiceCard({ service }: { service: MarketplaceService }) {
  const ratingLabel =
    service.ratingCount > 0
      ? `${service.rating.toFixed(1)} · ${service.ratingCount.toLocaleString("pt-BR")}`
      : "Sem notas";

  return (
    <article className="overflow-hidden rounded-xl border border-ink/10 bg-white premium-shadow">
      <Link
        href={`/servicos/${service.id}`}
        className="focus-ring relative block aspect-[4/3] bg-cloud"
        aria-label={`Abrir publicação ${service.title}`}
      >
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-black uppercase text-ink shadow-sm">
          {service.mode === "request" ? "Precisa" : "Oferece"}
        </span>
      </Link>

      <div className="grid gap-4 p-5">
        <Link
          href={`/usuarios/${service.ownerId}`}
          className="focus-ring flex items-center gap-3 rounded-lg text-left hover:bg-cloud"
        >
          <UserAvatar
            name={service.ownerName}
            image={service.ownerImage}
            size="sm"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-ink">{service.ownerName}</p>
            <p className="text-xs font-bold text-ink/48">Ver perfil</p>
          </div>
        </Link>

        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-ink/58">
            <MapPin size={16} aria-hidden="true" />
            {service.location}
          </div>
          <Link
            href={`/servicos/${service.id}`}
            className="focus-ring mt-2 block min-h-14 rounded-md text-xl font-black leading-tight text-ink hover:text-sky"
          >
            {service.title}
          </Link>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-ink/62">
          {service.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {service.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-cloud px-3 py-1 text-xs font-bold text-ink/66"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-ink/10 pt-4">
          <div>
            <p className="text-sm font-black text-ink">{service.priceLabel}</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-bold text-ink/56">
              <Star size={14} className="fill-gold text-gold" aria-hidden="true" />
              {ratingLabel}
              {service.verified ? (
                <BadgeCheck size={14} className="text-sky" aria-hidden="true" />
              ) : null}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs font-bold text-ink/56">
              <Heart size={14} className="text-rose" aria-hidden="true" />
              {service.likeCount.toLocaleString("pt-BR")} curtidas
            </p>
          </div>
          <ButtonLink href={`/servicos/${service.id}`} size="sm" variant="dark">
            Ver detalhes
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
