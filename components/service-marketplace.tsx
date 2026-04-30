"use client";

import {
  ArrowUpDown,
  BadgeCheck,
  BriefcaseBusiness,
  Handshake,
  MapPin,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { useMemo, useState } from "react";
import { ServiceRail } from "@/components/service-rail";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { MarketplaceService, categories } from "@/lib/marketplace-data";
import { cn } from "@/lib/utils";
import type { ServiceMode } from "@prisma/client";

const filters: Array<{ label: string; value: "all" | ServiceMode }> = [
  { label: "Todos", value: "all" },
  { label: "Pedidos", value: "REQUEST" },
  { label: "Ofertas", value: "OFFER" }
];

type SortOption = "recent" | "price-asc" | "price-desc";

export function ServiceMarketplace({
  services,
  initialCategory = "all",
  initialQuery = "",
  initialMode = "all"
}: {
  services: MarketplaceService[];
  initialCategory?: string;
  initialQuery?: string;
  initialMode?: "all" | ServiceMode;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<"all" | ServiceMode>(initialMode);
  const [category, setCategory] = useState(initialCategory);
  const [locationQuery, setLocationQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedLocation = locationQuery.trim().toLowerCase();

    const result = services.filter((service) => {
      const matchesMode = mode === "all" || service.mode === mode;
      const matchesCategory = category === "all" || service.category === category;
      const matchesLocation =
        !normalizedLocation || service.location.toLowerCase().includes(normalizedLocation);
      const matchesVerified = !verifiedOnly || service.verified;
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

      return (
        matchesMode &&
        matchesCategory &&
        matchesLocation &&
        matchesVerified &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.priceLabel.localeCompare(b.priceLabel, "pt-BR", { numeric: true });
        case "price-desc":
          return b.priceLabel.localeCompare(a.priceLabel, "pt-BR", { numeric: true });
        case "recent":
        default:
          return 0;
      }
    });
  }, [category, locationQuery, mode, query, services, sortBy, verifiedOnly]);

  const requests = filteredServices.filter((service) => service.mode === "REQUEST");
  const offers = filteredServices.filter((service) => service.mode === "OFFER");
  const activeFilterCount =
    (category !== "all" ? 1 : 0) +
    (locationQuery.trim() ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (sortBy !== "recent" ? 1 : 0);

  return (
    <>
      <div className="glass-panel rounded-xl p-5 md:p-7">
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
          <label className="focus-within:outline-sky flex min-h-12 items-center gap-3 rounded-lg border border-ink/12 bg-cloud px-4 text-sm font-bold text-ink/52 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2">
            <Search size={18} aria-hidden="true" />
            <input
              className="w-full bg-transparent text-base text-ink outline-none placeholder:text-ink/42"
              placeholder="Buscar serviço, cidade ou categoria"
              aria-label="Buscar serviços"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
            />
          </label>
          <button
            type="button"
            className={cn(
              "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-black transition",
              filtersOpen
                ? "state-active"
                : "border-ink/12 bg-cloud text-ink hover:border-sky/35 hover:bg-panel hover:text-white"
            )}
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <SlidersHorizontal size={17} aria-hidden="true" />
            Filtros
            {activeFilterCount > 0 ? (
              <span className="grid size-5 place-items-center rounded-full bg-panel text-[11px] text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-cloud p-1 text-sm font-black text-ink/62">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={cn(
                  "focus-ring rounded-md px-3 py-2 text-center",
                  mode === filter.value ? "state-active" : "hover:bg-panel hover:text-white"
                )}
                onClick={() => setMode(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        {filtersOpen ? (
          <div className="motion-rise mt-4 rounded-xl border border-ink/10 bg-cloud/80 p-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategory("all")}
                className={cn(
                  "focus-ring rounded-full px-3 py-1.5 text-xs font-black transition",
                  category === "all"
                    ? "state-active"
                    : "border border-ink/10 bg-cloud text-ink/62 hover:bg-panel hover:text-white"
                )}
              >
                Todas
              </button>
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(category === item ? "all" : item)}
                  className={cn(
                    "focus-ring rounded-full px-3 py-1.5 text-xs font-black transition",
                    category === item
                      ? "state-active"
                      : "border border-ink/10 bg-cloud text-ink/62 hover:bg-panel hover:text-white"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="flex min-h-10 items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm font-bold text-ink/62">
                <MapPin size={14} aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Cidade"
                  className="w-28 bg-transparent text-sm font-bold text-ink outline-none placeholder:text-ink/42"
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.currentTarget.value)}
                />
              </label>
              <button
                type="button"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={cn(
                  "focus-ring inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-black transition",
                  verifiedOnly
                    ? "state-active"
                    : "border-ink/10 bg-cloud text-ink/62 hover:bg-panel hover:text-white"
                )}
              >
                <BadgeCheck size={14} aria-hidden="true" />
                Verificados
              </button>
              <label className="flex min-h-10 items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm font-bold text-ink/62">
                <ArrowUpDown size={14} aria-hidden="true" />
                <select
                  className="bg-transparent text-xs font-black text-ink outline-none"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.currentTarget.value as SortOption)}
                >
                  <option value="recent">Mais recentes</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                </select>
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                setCategory("all");
                setLocationQuery("");
                setVerifiedOnly(false);
                setSortBy("recent");
              }}
              className="focus-ring mt-4 rounded-lg px-3 py-2 text-xs font-black text-ink/58 hover:bg-white"
            >
              Limpar filtros
            </button>
          </div>
        ) : null}
      </div>

      <div className="stagger-list mt-8 grid gap-3 md:grid-cols-3">
        <p className="surface-panel spatial-card flex min-h-20 items-center gap-3 rounded-xl p-4 text-sm font-black">
          <Handshake size={22} aria-hidden="true" />
          {requests.length} pedidos de quem quer contratar.
        </p>
        <p className="glass-panel spatial-card flex min-h-20 items-center gap-3 rounded-xl p-4 text-sm font-black text-ink/68">
          <BriefcaseBusiness size={22} className="text-white" aria-hidden="true" />
          {offers.length} profissionais e serviços anunciados.
        </p>
        <p className="glass-panel spatial-card flex min-h-20 items-center gap-3 rounded-xl p-4 text-sm font-black text-ink/68">
          <WhatsAppIcon className="size-6" />
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
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setMode("all");
              setCategory("all");
              setLocationQuery("");
              setVerifiedOnly(false);
              setSortBy("recent");
            }}
            className="focus-ring mt-4 rounded-lg bg-cloud px-4 py-2 text-sm font-black text-ink hover:bg-white"
          >
            Limpar filtros
          </button>
        </div>
      ) : null}
    </>
  );
}

