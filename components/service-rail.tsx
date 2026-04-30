import { ArrowRight } from "lucide-react";
import { ServiceCard } from "@/components/service-card";
import { MarketplaceService } from "@/lib/marketplace-data";

export function ServiceRail({
  title,
  services
}: {
  title: string;
  services: MarketplaceService[];
}) {
  const titleId = `rail-${title.toLowerCase().replace(/\s+/g, "-")}`;

  if (services.length === 0) {
    return null;
  }

  return (
    <section className="mt-12" aria-labelledby={titleId}>
      <div className="flex items-center justify-between gap-4">
        <h2 id={titleId} className="text-3xl font-black text-ink">
          {title}
        </h2>
        <div className="hidden items-center gap-2 text-sm font-black text-ink/45 md:flex">
          deslize para ver mais
          <ArrowRight size={19} aria-hidden="true" />
        </div>
      </div>

      <div className="marketplace-scrollbar stagger-list mt-5 flex snap-x items-stretch gap-5 overflow-x-auto pb-5 pr-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex w-[min(86vw,22rem)] shrink-0 snap-start lg:w-[calc((100%_-_2.5rem)/3)]"
          >
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </section>
  );
}

