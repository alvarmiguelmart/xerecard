import { ServiceMarketplace } from "@/components/service-marketplace";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listServices } from "@/lib/marketplace-db";

export default async function ServicesPage() {
  const services = await listServices();

  return (
    <>
      <SiteHeader />
      <main className="bg-paper py-10">
        <section className="container-page">
          <ServiceMarketplace services={services} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
