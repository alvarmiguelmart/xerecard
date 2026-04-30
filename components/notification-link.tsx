"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readJsonResponse } from "@/lib/http";

export function NotificationLink({ initialUnreadCount }: { initialUnreadCount: number }) {
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  useEffect(() => {
    let active = true;

    async function refreshUnreadCount() {
      try {
        const response = await fetch("/api/notifications/unread-count", {
          cache: "no-store"
        });
        const data = await readJsonResponse<{ unreadCount?: number }>(response);

        if (active && response.ok) {
          setUnreadCount(data.unreadCount ?? 0);
        }
      } catch {
        // Header badge is non-critical.
      }
    }

    const interval = window.setInterval(refreshUnreadCount, 30_000);
    window.addEventListener("focus", refreshUnreadCount);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshUnreadCount);
    };
  }, []);

  return (
    <Link
      href="/notificacoes"
      className="focus-ring action-primary relative hidden size-11 place-items-center rounded-lg transition duration-200 hover:-translate-y-0.5 sm:grid"
      aria-label={unreadCount > 0 ? `${unreadCount} notificações novas` : "Notificações"}
    >
      <Bell size={18} aria-hidden="true" />
      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full border border-paper bg-coral px-1 text-[0.65rem] font-black leading-5 text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      ) : null}
    </Link>
  );
}

