import { Bell, CheckCircle2 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { listNotifications } from "@/lib/marketplace-db";

export default async function NotificationsPage() {
  const session = await auth();
  const notifications = session ? await listNotifications(session.user.id) : [];

  return (
    <>
      <SiteHeader />
      <main className="bg-cloud py-12">
        <section className="container-page">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-sky">Notificações</p>
              <h1 className="mt-2 text-5xl font-black text-ink">
                Interesses, contatos e avisos.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-ink/62">
                Veja quando alguém curtir, tentar contato ou interagir com seus
                anúncios.
              </p>
            </div>
            {!session ? (
              <ButtonLink href="/login" variant="secondary">
                Entrar para ver avisos
              </ButtonLink>
            ) : null}
          </div>

          <div className="mt-8 grid gap-4">
            {!session ? (
              <article className="rounded-xl border border-ink/10 bg-white p-6 premium-shadow">
                <h2 className="text-2xl font-black text-ink">
                  Entre para ver seus avisos
                </h2>
                <p className="mt-3 text-base leading-7 text-ink/62">
                  Seus avisos são privados e aparecem quando alguém interage
                  com seus anúncios.
                </p>
              </article>
            ) : notifications.length === 0 ? (
              <article className="rounded-xl border border-ink/10 bg-white p-6 premium-shadow">
                <h2 className="text-2xl font-black text-ink">
                  Nenhum aviso por enquanto
                </h2>
                <p className="mt-3 text-base leading-7 text-ink/62">
                  Quando alguém curtir, tentar contato ou responder a um anúncio,
                  o aviso aparece aqui.
                </p>
              </article>
            ) : (
              notifications.map((notification) => (
              <article
                key={notification.id}
                className="flex gap-4 rounded-xl border border-ink/10 bg-white p-5 premium-shadow"
              >
                <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-mint text-ink">
                  {notification.unread ? (
                    <Bell size={20} aria-hidden="true" />
                  ) : (
                    <CheckCircle2 size={20} aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-black text-ink">
                      {notification.title}
                    </h2>
                    <span className="text-sm font-bold text-ink/48">
                      {notification.createdAt}
                    </span>
                  </div>
                  <p className="mt-2 text-base leading-7 text-ink/62">
                    {notification.description}
                  </p>
                </div>
              </article>
              ))
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
