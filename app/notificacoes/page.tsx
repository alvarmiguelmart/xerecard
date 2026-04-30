import { Bell } from "lucide-react";
import { NotificationsList } from "@/components/notifications-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { DatabaseError, listNotifications } from "@/lib/marketplace-db";
import type { AppNotification } from "@/lib/marketplace-data";

export default async function NotificationsPage() {
  const session = await auth();
  let notificationsUnavailable = false;
  let notificationPage: {
    notifications: AppNotification[];
    nextCursor: string | null;
  } = { notifications: [], nextCursor: null };

  if (session) {
    try {
      notificationPage = await listNotifications({ userId: session.user.id });
    } catch (error) {
      if (!(error instanceof DatabaseError)) {
        throw error;
      }

      notificationsUnavailable = true;
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="page-depth py-12 md:py-16">
        <section className="container-page">
          <div className="motion-rise flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="page-kicker">
                <Bell size={14} aria-hidden="true" />
                Notificações
              </p>
              <h1 className="mt-2 text-5xl font-black text-ink">
                Interesses, contatos e avisos.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-ink/62">
                Veja quando alguém tentar contato ou interagir com seus anúncios.
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
              <article className="glass-panel-strong motion-rise rounded-xl p-6">
                <h2 className="text-2xl font-black text-ink">
                  Entre para ver seus avisos
                </h2>
                <p className="mt-3 text-base leading-7 text-ink/62">
                  Seus avisos são privados e aparecem quando alguém interage
                  com seus anúncios.
                </p>
              </article>
            ) : notificationsUnavailable ? (
              <article className="glass-panel-strong motion-rise rounded-xl p-6">
                <h2 className="text-2xl font-black text-ink">
                  Notificações temporariamente indisponíveis
                </h2>
                <p className="mt-3 text-base leading-7 text-ink/62">
                  Não conseguimos carregar seus avisos agora. Tente novamente em instantes.
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

