"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/http";
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
      const data = await readJsonResponse<{
        message?: string;
        rating?: number;
        ratingCount?: number;
      }>(response);

      if (response.status === 401) {
        setNeedsLogin(true);
        throw new Error(data.message ?? "Entre para avaliar este anúncio.");
      }

      if (!response.ok) {
        throw new Error(data.message ?? "Não conseguimos enviar sua avaliação.");
      }

      setRating(typeof data.rating === "number" ? data.rating : rating);
      setCount(typeof data.ratingCount === "number" ? data.ratingCount : count);
      setMessage("Avaliação registrada.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Não conseguimos enviar sua avaliação."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid h-full content-start gap-3">
      <div className="flex min-h-14 items-center justify-between gap-3 rounded-lg border border-ink/12 bg-panel px-4">
        <p className="text-sm font-black text-ink">Avaliar anúncio</p>
        <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            className="focus-ring rounded-md p-0.5 disabled:opacity-50"
            aria-label={`Avaliar com ${score} estrela${score > 1 ? "s" : ""}`}
            onClick={() => submit(score)}
            disabled={isLoading}
          >
            <Star
              size={19}
              className={cn(
                "transition",
                "icon-star",
                score <= (selected || Math.round(rating)) ? "opacity-100" : "opacity-35"
              )}
              aria-hidden="true"
            />
          </button>
        ))}
        </div>
      </div>
      <p className="text-sm font-bold text-ink/60">
        {count > 0
          ? `${rating.toFixed(1)} de 5 em ${count.toLocaleString("pt-BR")} avaliações`
          : "Seja a primeira pessoa a avaliar este anúncio."}
      </p>
      {needsLogin ? (
        <ButtonLink href="/login" variant="secondary" size="sm" className="mt-3">
          Entrar e avaliar
        </ButtonLink>
      ) : null}
      <p className="mt-2 min-h-5 text-sm font-semibold text-ink" role="status">
        {message}
      </p>
    </div>
  );
}

