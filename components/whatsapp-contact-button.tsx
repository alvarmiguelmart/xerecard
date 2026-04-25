"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
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
        throw new Error(data.message ?? "Entre para continuar.");
      }

      if (response.status === 402) {
        setNeedsSubscription(true);
        throw new Error(data.message ?? "Assine para abrir o WhatsApp.");
      }

      if (!response.ok || !data.url) {
        throw new Error(data.message ?? "Não foi possível abrir o contato.");
      }

      window.location.href = data.url;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível abrir o contato.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <Button
        type="button"
        variant="whatsapp"
        size="lg"
        icon={<MessageCircle size={19} aria-hidden="true" />}
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? "Verificando assinatura" : "Chamar no WhatsApp"}
      </Button>
      {needsSubscription ? (
        <ButtonLink href="/minha-conta#assinatura" variant="secondary">
          Assinar por R$ 6,99
        </ButtonLink>
      ) : null}
      {needsLogin ? (
        <ButtonLink href="/login" variant="secondary">
          Entrar ou criar conta
        </ButtonLink>
      ) : null}
      <p className="min-h-6 text-sm font-semibold text-coral" role="status">
        {message}
      </p>
    </div>
  );
}
