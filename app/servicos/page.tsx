import { ServiceMarketplace } from "@/components/service-marketplace";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DatabaseError, listServices } from "@/lib/marketplace-db";
import { categories } from "@/lib/marketplace-data";
import type { MarketplaceService } from "@/lib/marketplace-data";

type ServicesPageProps = {
  searchParams?: Promise<{
    busca?: string;
    categoria?: string;
  }>;
};

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const requestedCategory = params?.categoria;
  const initialQuery = params?.busca?.trim().slice(0, 120) ?? "";
  const initialCategory =
    requestedCategory && categories.includes(requestedCategory as (typeof categories)[number])
      ? requestedCategory
      : "all";
  let services: MarketplaceService[] = [];
  let servicesUnavailable = false;

  try {
    services = await listServices();
  } catch (error) {
    if (!(error instanceof DatabaseError)) {
      throw error;
    }

    servicesUnavailable = true;
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-paper py-10">
        <section className="container-page">
          {servicesUnavailable ? (
            <div className="rounded-xl border border-ink/10 bg-white p-8 premium-shadow">
              <h1 className="text-4xl font-black text-ink">
                Serviços temporariamente indisponíveis
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-ink/62">
                Não conseguimos carregar o marketplace agora. Tente novamente em instantes.
              </p>
            </div>
          ) : (
            <ServiceMarketplace
              services={services}
              initialCategory={initialCategory}
              initialQuery={initialQuery}
            />
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
