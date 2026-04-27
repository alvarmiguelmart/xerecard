"use client";

import { Bell, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/http";
import type { AppNotification } from "@/lib/marketplace-data";

export function NotificationsList({
  initialNotifications,
  initialNextCursor
}: {
  initialNotifications: AppNotification[];
  initialNextCursor: string | null;
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function loadMore() {
    if (!nextCursor) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/notifications?cursor=${encodeURIComponent(nextCursor)}&take=20`
      );
      const data = await readJsonResponse<{
        notifications?: AppNotification[];
        nextCursor?: string | null;
        message?: string;
      }>(response);

      if (!response.ok) {
        throw new Error(data.message ?? "Não conseguimos carregar mais avisos.");
      }

      setNotifications((current) => [...current, ...(data.notifications ?? [])]);
      setNextCursor(data.nextCursor ?? null);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Não conseguimos carregar mais avisos."
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (notifications.length === 0) {
    return (
      <article className="rounded-xl border border-ink/10 bg-white p-6 premium-shadow">
        <h2 className="text-2xl font-black text-ink">Nenhum aviso por enquanto</h2>
        <p className="mt-3 text-base leading-7 text-ink/62">
          Quando alguém curtir, tentar contato ou responder a um anúncio, o aviso aparece aqui.
        </p>
      </article>
    );
  }

  return (
    <>
      {notifications.map((notification) => (
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
              <h2 className="text-xl font-black text-ink">{notification.title}</h2>
              <span className="text-sm font-bold text-ink/48">
                {notification.createdAt}
              </span>
            </div>
            <p className="mt-2 text-base leading-7 text-ink/62">
              {notification.description}
            </p>
          </div>
        </article>
      ))}

      {nextCursor ? (
        <div className="flex justify-center">
          <Button type="button" variant="secondary" onClick={loadMore} disabled={isLoading}>
            {isLoading ? "Carregando" : "Carregar mais"}
          </Button>
        </div>
      ) : null}
      <p className="min-h-5 text-center text-sm font-semibold text-coral" role="status">
        {message}
      </p>
    </>
  );
}
