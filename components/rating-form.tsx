"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RatingForm({
  serviceId,
  initialRating,
  initialCount
}: {
  serviceId: string;
  initialRating: number;
  initialCount: number;
}) {
  const [rating, setRating] = useState(initialRating);
  const [count, setCount] = useState(initialCount);
  const [selected, setSelected] = useState(0);
  const [message, setMessage] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function submit(score: number) {
    setSelected(score);
    setIsLoading(true);
    setNeedsLogin(false);
    setMessage("");

    try {
      const response = await fetch(`/api/services/${serviceId}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score })
      });
      const data = (await response.json()) as {
        message?: string;
        rating?: number;
        ratingCount?: number;
      };

      if (response.status === 401) {
        setNeedsLogin(true);
        throw new Error(data.message ?? "Entre para dar uma nota.");
      }

      if (!response.ok) {
        throw new Error(data.message ?? "Não foi possível enviar sua nota.");
      }

      setRating(typeof data.rating === "number" ? data.rating : rating);
      setCount(typeof data.ratingCount === "number" ? data.ratingCount : count);
      setMessage("Nota registrada.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Não foi possível enviar sua nota."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-cloud p-4">
      <p className="text-sm font-black uppercase text-ink/50">Avaliar serviço</p>
      <div className="mt-3 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            className="focus-ring rounded-md p-1 text-gold disabled:opacity-50"
            aria-label={`Dar nota ${score}`}
            onClick={() => submit(score)}
            disabled={isLoading}
          >
            <Star
              size={24}
              className={cn(
                "transition",
                score <= (selected || Math.round(rating))
                  ? "fill-gold text-gold"
                  : "text-ink/25"
              )}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm font-bold text-ink/60">
        {count > 0
          ? `${rating.toFixed(1)} de 5 em ${count.toLocaleString("pt-BR")} avaliações`
          : "Seja a primeira pessoa a avaliar."}
      </p>
      {needsLogin ? (
        <ButtonLink href="/login" variant="secondary" size="sm" className="mt-3">
          Entrar para avaliar
        </ButtonLink>
      ) : null}
      <p className="mt-2 min-h-5 text-sm font-semibold text-sky" role="status">
        {message}
      </p>
    </div>
  );
}
