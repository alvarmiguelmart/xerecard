"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ServiceRail } from "@/components/service-rail";
import { ButtonLink } from "@/components/ui/button";
import { MarketplaceService, ServiceMode } from "@/lib/marketplace-data";
import { cn } from "@/lib/utils";

const filters: Array<{ label: string; value: "all" | ServiceMode }> = [
  { label: "Todos", value: "all" },
  { label: "Pedidos", value: "request" },
  { label: "Ofertas", value: "offer" }
];

export function ServiceMarketplace({
  services
}: {
  services: MarketplaceService[];
}) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"all" | ServiceMode>("all");

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return services.filter((service) => {
      const matchesMode = mode === "all" || service.mode === mode;
      const searchable = [
        service.title,
        service.description,
        service.category,
        service.location,
        service.ownerName,
        ...service.tags
      ]
        .join(" ")
        .toLowerCase();

      return matchesMode && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [mode, query, services]);

  const requests = filteredServices.filter((service) => service.mode === "request");
  const offers = filteredServices.filter((service) => service.mode === "offer");

  return (
    <>
      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-label">Marketplace</p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-ink md:text-5xl">
              Encontre quem precisa ou quem resolve.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-ink/62">
              Busque por categoria, cidade ou palavra-chave. Quando fizer sentido,
              desbloqueie o WhatsApp e continue a conversa direto com a pessoa.
            </p>
          </div>
          <ButtonLink href="/servicos/novo">Criar anúncio</ButtonLink>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <label className="focus-within:outline-acid flex min-h-12 items-center gap-3 rounded-lg border border-ink/12 bg-cloud px-4 text-sm font-bold text-ink/52 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2">
            <Search size={18} aria-hidden="true" />
            <input
              className="w-full bg-transparent text-base text-ink outline-none placeholder:text-ink/42"
              placeholder="Buscar serviço, cidade ou categoria"
              aria-label="Buscar serviços"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-ink/12 bg-white px-4 text-sm font-black text-ink">
            <SlidersHorizontal size={17} aria-hidden="true" />
            Tipo de anúncio
          </div>
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-cloud p-1 text-sm font-black text-ink/62">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={cn(
                  "focus-ring rounded-md px-3 py-2 text-center",
                  mode === filter.value ? "bg-white text-ink shadow-sm" : "hover:bg-white/60"
                )}
                onClick={() => setMode(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <p className="rounded-xl border border-ink/10 bg-mint p-4 text-sm font-black text-ink">
          {requests.length} pedidos de quem quer contratar.
        </p>
        <p className="rounded-xl border border-ink/10 bg-white p-4 text-sm font-black text-ink/68">
          {offers.length} profissionais e serviços anunciados.
        </p>
        <p className="rounded-xl border border-ink/10 bg-white p-4 text-sm font-black text-ink/68">
          Assinantes conversam direto pelo WhatsApp.
        </p>
      </div>

      {requests.length > 0 ? (
        <ServiceRail title="Quem está procurando" services={requests} />
      ) : null}
      {offers.length > 0 ? (
        <ServiceRail title="Quem está oferecendo" services={offers} />
      ) : null}
      {filteredServices.length === 0 ? (
        <div className="mt-10 rounded-xl border border-ink/10 bg-white p-8 text-center">
          <h2 className="text-2xl font-black text-ink">Nada encontrado por aqui</h2>
          <p className="mt-2 text-sm font-semibold text-ink/58">
            Tente outra cidade, categoria ou palavra-chave.
          </p>
        </div>
      ) : null}
    </>
  );
}
