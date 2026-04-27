import { NotificationsList } from "@/components/notifications-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { listNotifications } from "@/lib/marketplace-db";

export default async function NotificationsPage() {
  const session = await auth();
  const notificationPage = session
    ? await listNotifications({ userId: session.user.id })
    : { notifications: [], nextCursor: null };

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
            ) : (
              <NotificationsList
                initialNotifications={notificationPage.notifications}
                initialNextCursor={notificationPage.nextCursor}
              />
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
