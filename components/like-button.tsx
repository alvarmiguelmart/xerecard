"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/http";

export function LikeButton({
  serviceId,
  initialCount = 0
}: {
  serviceId: string;
  initialCount?: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [message, setMessage] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function like() {
    setIsLoading(true);
    setMessage("");
    setNeedsLogin(false);

    try {
      const response = await fetch(`/api/services/${serviceId}/like`, {
        method: "POST"
      });
      const data = await readJsonResponse<{ message?: string; likeCount?: number }>(response);

      if (response.status === 401) {
        setNeedsLogin(true);
        throw new Error(data.message ?? "Entre para salvar essa curtida.");
      }

      if (!response.ok) {
        throw new Error(data.message ?? "Não conseguimos registrar sua curtida.");
      }

      if (typeof data.likeCount === "number") {
        setCount(data.likeCount);
      }

      setMessage("Curtida registrada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não conseguimos registrar sua curtida.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid h-full content-start gap-3">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="min-h-14 w-full"
        icon={<Heart size={18} className="icon-like" aria-hidden="true" />}
        onClick={like}
        disabled={isLoading}
      >
        {isLoading ? "Enviando" : `Curtir anúncio (${count.toLocaleString("pt-BR")})`}
      </Button>
      {needsLogin ? (
        <ButtonLink href="/login" variant="secondary">
          Entrar para curtir
        </ButtonLink>
      ) : null}
      <p className="min-h-5 text-sm font-semibold text-ink" role="status">
        {message}
      </p>
    </div>
  );
}

