import { ServiceRail } from "@/components/service-rail";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { listServices } from "@/lib/marketplace-db";

export default async function ServicesPage() {
  const services = await listServices();
  const requests = services.filter((service) => service.mode === "request");
  const offers = services.filter((service) => service.mode === "offer");

  return (
    <>
      <SiteHeader />
      <main className="bg-paper py-10">
        <section className="container-page">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-sky">Marketplace</p>
              <h1 className="mt-2 text-5xl font-black text-ink">
                Serviços disponíveis.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-ink/62">
                Navegue pelos pedidos e ofertas. O contato via WhatsApp é
                liberado para usuários com assinatura ativa.
              </p>
            </div>
            <ButtonLink href="/servicos/novo">Cadastrar serviço</ButtonLink>
          </div>

          <ServiceRail title="Precisando de serviços" services={requests} />
          <ServiceRail title="Oferecendo serviços" services={offers} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
