import { ServiceRail } from "@/components/service-rail";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { listServices } from "@/lib/marketplace-db";
import { categories } from "@/lib/marketplace-data";

type ServicesPageProps = {
  searchParams?: Promise<{
    q?: string;
    categoria?: string;
    tipo?: string;
    publico?: string;
  }>;
};

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR");
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const services = await listServices();
  const query = normalize(params?.q ?? "");
  const selectedCategory = params?.categoria ?? "";
  const selectedType = params?.tipo ?? "";
  const selectedAudience = params?.publico ?? "";

  const filteredServices = services.filter((service) => {
    const matchesQuery =
      query.length === 0 ||
      normalize(
        `${service.title} ${service.description} ${service.category} ${service.location} ${service.tags.join(" ")}`
      ).includes(query);
    const matchesCategory =
      selectedCategory.length === 0 || service.category === selectedCategory;
    const matchesType =
      selectedType.length === 0 ||
      (selectedType === "pedidos" && service.mode === "request") ||
      (selectedType === "ofertas" && service.mode === "offer");
    const matchesAudience =
      selectedAudience.length === 0 ||
      (selectedAudience === "adulto" && service.isAdult) ||
      (selectedAudience === "geral" && !service.isAdult);

    return matchesQuery && matchesCategory && matchesType && matchesAudience;
  });

  const requests = filteredServices.filter((service) => service.mode === "request");
  const offers = filteredServices.filter((service) => service.mode === "offer");
  const categoryCounts = categories
    .map((category) => ({
      category,
      count: services.filter((service) => service.category === category).length
    }))
    .filter((item) => item.count > 0);

  return (
    <>
      <SiteHeader />
      <main className="bg-paper py-10">
        <section className="container-page">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-sky">Marketplace</p>
              <h1 className="mt-2 text-5xl font-black text-ink">
                Explorar Xerecard.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-ink/62">
                Serviços, conteúdos digitais, comunidades e contato privado.
              </p>
            </div>
            <ButtonLink href="/servicos/novo">Cadastrar serviço</ButtonLink>
          </div>

          <form className="mt-8 grid gap-3 rounded-xl border border-ink/10 bg-white p-4 lg:grid-cols-[1fr_14rem_11rem_11rem_auto]">
            <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="q">
              Buscar
              <input
                id="q"
                name="q"
                defaultValue={params?.q ?? ""}
                className="focus-ring h-12 rounded-lg border border-ink/12 bg-cloud px-4"
                placeholder="Buscar packs, serviços, lives..."
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="categoria">
              Categoria
              <select
                id="categoria"
                name="categoria"
                defaultValue={selectedCategory}
                className="focus-ring h-12 rounded-lg border border-ink/12 bg-cloud px-4"
              >
                <option value="">Todas</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="tipo">
              Tipo
              <select
                id="tipo"
                name="tipo"
                defaultValue={selectedType}
                className="focus-ring h-12 rounded-lg border border-ink/12 bg-cloud px-4"
              >
                <option value="">Todos</option>
                <option value="pedidos">Pedidos</option>
                <option value="ofertas">Ofertas</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="publico">
              Público
              <select
                id="publico"
                name="publico"
                defaultValue={selectedAudience}
                className="focus-ring h-12 rounded-lg border border-ink/12 bg-cloud px-4"
              >
                <option value="">Todos</option>
                <option value="adulto">Restrito</option>
                <option value="geral">Geral</option>
              </select>
            </label>
            <div className="flex items-end gap-2">
              <button className="focus-ring h-12 rounded-lg bg-acid px-5 text-sm font-black text-ink hover:bg-mint">
                Filtrar
              </button>
              <ButtonLink href="/servicos" variant="secondary" className="h-12">
                Limpar
              </ButtonLink>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap gap-2">
            {categoryCounts.map((item) => (
              <ButtonLink
                key={item.category}
                href={`/servicos?categoria=${encodeURIComponent(item.category)}`}
                variant={selectedCategory === item.category ? "dark" : "secondary"}
                size="sm"
              >
                {item.category} ({item.count})
              </ButtonLink>
            ))}
          </div>

          {filteredServices.length > 0 ? (
            <>
              <ServiceRail title="Pedidos" services={requests} />
              <ServiceRail title="Ofertas" services={offers} />
            </>
          ) : (
            <div className="mt-10 rounded-xl border border-ink/10 bg-white p-8 text-center">
              <h2 className="text-3xl font-black text-ink">Nenhum serviço encontrado</h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-ink/62">
                Publique uma demanda ou limpe os filtros para voltar à vitrine.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href="/servicos/escolher">Publicar pedido</ButtonLink>
                <ButtonLink href="/servicos" variant="secondary">
                  Ver tudo
                </ButtonLink>
              </div>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
