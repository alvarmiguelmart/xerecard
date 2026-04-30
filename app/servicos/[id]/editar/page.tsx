import { ArrowRight, LockKeyhole, Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/service-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { findService } from "@/lib/marketplace-db";

type EditServicePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditServicePage({ params }: EditServicePageProps) {
  const session = await auth();
  const { id } = await params;
  const service = await findService(id);

  if (!service) {
    notFound();
  }

  const canEdit = session?.user.id === service.ownerId;

  return (
    <>
      <SiteHeader />
      <main className="page-depth py-12 md:py-16">
        <section className="container-page grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-start">
          <div className="motion-rise">
            <p className="page-kicker">
              <Pencil size={14} aria-hidden="true" />
              Editar anúncio
            </p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-ink md:text-5xl">
              Atualize o conteúdo e a imagem do anúncio.
            </h1>
            <p className="mt-4 text-base leading-7 text-ink/62">
              Ajuste título, preço, descrição, contato e troque a foto quando precisar
              deixar a publicação mais clara.
            </p>
            <div className="mt-6">
              <ButtonLink
                href={`/servicos/${service.id}`}
                variant="secondary"
                icon={<ArrowRight size={17} aria-hidden="true" />}
              >
                Voltar ao anúncio
              </ButtonLink>
            </div>
          </div>

          {canEdit ? (
            <ServiceForm initialService={service} />
          ) : (
            <div className="glass-panel-strong motion-rise rounded-xl p-6">
              <div className="surface-panel grid size-12 place-items-center rounded-xl">
                <LockKeyhole size={22} aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-2xl font-black text-ink">
                Você não pode editar este anúncio
              </h2>
              <p className="mt-3 text-base leading-7 text-ink/62">
                Entre com a conta que publicou este anúncio para alterar conteúdo e imagem.
              </p>
              <div className="mt-6 flex gap-3">
                <ButtonLink href="/login" variant="secondary">
                  Entrar
                </ButtonLink>
                <ButtonLink href="/servicos">Ver marketplace</ButtonLink>
              </div>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
