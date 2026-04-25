import { ServiceForm } from "@/components/service-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { ServiceMode } from "@/lib/marketplace-data";

type NewServicePageProps = {
  searchParams?: Promise<{
    tipo?: string;
  }>;
};

export default async function NewServicePage({ searchParams }: NewServicePageProps) {
  const session = await auth();
  const params = await searchParams;
  const initialMode: ServiceMode = params?.tipo === "oferecendo" ? "offer" : "request";

  return (
    <>
      <SiteHeader />
      <main className="bg-cloud py-12">
        <section className="container-page grid gap-8 lg:grid-cols-[0.75fr_1fr]">
          <div>
            <p className="text-sm font-black uppercase text-sky">Publicação</p>
            <h1 className="mt-2 text-5xl font-black leading-tight text-ink">
              Cadastre um serviço com contato por WhatsApp.
            </h1>
            <p className="mt-4 text-base leading-7 text-ink/62">
              O anúncio entra no marketplace. Para abrir contatos de outros
              serviços, o usuário precisa ativar uma assinatura.
            </p>
          </div>

          {session ? (
            <ServiceForm initialMode={initialMode} />
          ) : (
            <div className="rounded-xl border border-ink/10 bg-white p-6 premium-shadow">
              <h2 className="text-2xl font-black text-ink">Entre para publicar</h2>
              <p className="mt-3 text-base leading-7 text-ink/62">
                O cadastro de serviços fica disponível depois do login.
              </p>
              <div className="mt-6 flex gap-3">
                <ButtonLink href="/login" variant="secondary">
                  Entrar
                </ButtonLink>
                <ButtonLink href="/cadastrar">Criar conta</ButtonLink>
              </div>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
