import { BadgeCheck, Heart, MapPin, MessageCircle, Star } from "lucide-react";
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
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-white transition hover:-translate-y-1 hover:border-sky/35 hover:shadow-[0_20px_52px_rgba(7,16,20,0.12)]">
      <Link
        href={`/servicos/${service.id}`}
        className="focus-ring relative block aspect-[4/3] bg-cloud"
        aria-label={`Abrir anúncio ${service.title}`}
      >
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-black uppercase text-ink shadow-sm backdrop-blur">
          {service.mode === "REQUEST" ? "Pedido" : "Oferta"}
        </span>
        {service.verified ? (
          <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-mint text-sky shadow-sm">
            <BadgeCheck size={18} aria-hidden="true" />
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
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
            <p className="text-xs font-bold text-ink/48">{service.category}</p>
          </div>
        </Link>

        <div>
          <div className="flex items-center gap-2 text-sm font-black text-ink/58">
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

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink/10 pt-4">
          <div>
            <p className="text-sm font-black text-ink">{service.priceLabel}</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-bold text-ink/56">
              <Star size={14} className="fill-gold text-gold" aria-hidden="true" />
              {ratingLabel}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs font-bold text-ink/56">
              <Heart size={14} className="text-rose" aria-hidden="true" />
              {service.likeCount.toLocaleString("pt-BR")} curtidas
            </p>
          </div>
          <ButtonLink
            href={`/servicos/${service.id}`}
            size="sm"
            variant="dark"
            icon={<MessageCircle size={15} aria-hidden="true" />}
          >
            Ver detalhes
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
