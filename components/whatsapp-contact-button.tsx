"use client";

import { CheckCircle2, TimerReset } from "lucide-react";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { readJsonResponse } from "@/lib/http";

export function WhatsAppContactButton({ serviceId }: { serviceId: string }) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [needsSubscription, setNeedsSubscription] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    setMessage("");
    setNeedsSubscription(false);
    setNeedsLogin(false);

    try {
      const response = await fetch(`/api/services/${serviceId}/whatsapp`, {
        method: "POST"
      });
      const data = await readJsonResponse<{ url?: string; message?: string }>(response);

      if (response.status === 401) {
        setNeedsLogin(true);
        throw new Error(data.message ?? "Entre para abrir o contato.");
      }

      if (response.status === 402) {
        setNeedsSubscription(true);
        throw new Error(data.message ?? "Ative um plano para abrir o WhatsApp.");
      }

      if (!response.ok || !data.url) {
        throw new Error(data.message ?? "Não conseguimos abrir esse contato agora.");
      }

      window.location.href = data.url;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não conseguimos abrir esse contato agora.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid h-full content-start gap-3">
      <Button
        type="button"
        variant="whatsapp"
        size="lg"
        className="min-h-14 w-full"
        icon={<WhatsAppIcon className="size-5" />}
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? "Verificando acesso" : "Abrir WhatsApp"}
      </Button>
      {needsSubscription ? (
        <div className="rounded-xl border border-sky/35 bg-panel p-4 text-white premium-shadow">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-black text-white">Plano Essencial</p>
            <span className="badge-success inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-black">
              <TimerReset size={12} aria-hidden="true" />
              1 mês grátis
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-white/62">
            {message || "Comece o teste grátis e abra conversas direto pelo WhatsApp."}
          </p>
          <p className="mt-3 flex gap-2 text-sm font-semibold text-white/72">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-white" aria-hidden="true" />
            Abra contatos dos anúncios quando precisar.
          </p>
          <ButtonLink href="/minha-conta?tab=assinatura" className="mt-4 w-full justify-center">
            Ativar plano Essencial
          </ButtonLink>
        </div>
      ) : null}
      {needsLogin ? (
        <ButtonLink href="/login" variant="secondary">
          Entrar ou criar conta
        </ButtonLink>
      ) : null}
      <p className="min-h-6 text-sm font-semibold text-coral" role="status">
        {needsSubscription ? "" : message}
      </p>
    </div>
  );
}

