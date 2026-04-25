import { BadgeCheck, LockKeyhole, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MarketplaceService } from "@/lib/marketplace-data";

export function ServiceCard({ service }: { service: MarketplaceService }) {
  const ratingLabel =
    service.ratingCount > 0 ? service.rating.toFixed(1) : "Novo";

  return (
    <article className="overflow-hidden rounded-xl border border-ink/10 bg-white">
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
        <span className="absolute left-3 top-3 rounded-full bg-white/94 px-3 py-1 text-xs font-black uppercase text-ink">
          {service.isAdult ? "Restrito" : service.mode === "request" ? "Pedido" : "Oferta"}
        </span>
      </Link>

      <div className="grid gap-3 p-4">
        <div className="flex items-center justify-between gap-3 text-xs font-bold text-ink/52">
          <span>{service.category}</span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} aria-hidden="true" />
            {service.location}
          </span>
        </div>

        <Link
          href={`/servicos/${service.id}`}
          className="focus-ring line-clamp-2 min-h-14 rounded-md text-xl font-black leading-tight text-ink hover:text-sky"
        >
          {service.title}
        </Link>

        <div className="flex items-center justify-between gap-3 border-t border-ink/10 pt-3">
          <div>
            <p className="text-base font-black text-ink">{service.priceLabel}</p>
            <p className="mt-1 flex items-center gap-2 text-xs font-bold text-ink/52">
              <Star size={14} className="fill-gold text-gold" aria-hidden="true" />
              {ratingLabel}
              {service.verified ? (
                <BadgeCheck size={14} className="text-sky" aria-hidden="true" />
              ) : null}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-cloud px-3 py-1 text-xs font-black text-ink/64">
            <LockKeyhole size={13} aria-hidden="true" />
            privado
          </span>
        </div>
      </div>
    </article>
  );
}
