"use client";

import { Crown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/http";
import type { Plan } from "@prisma/client";

export function SubscribeButton({
  plan = "ESSENTIAL",
  method
}: {
  plan?: Exclude<Plan, "FREE">;
  method: "card" | "pix";
}) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function activate() {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/subscription/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, method })
      });
      const data = await readJsonResponse<{ message?: string; url?: string }>(response);

      if (!response.ok) {
        throw new Error(data.message ?? "Não conseguimos iniciar sua assinatura.");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setMessage("Checkout aberto. Finalize para liberar contatos.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Não conseguimos iniciar sua assinatura."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        icon={<Crown size={18} aria-hidden="true" />}
        onClick={activate}
        disabled={isLoading}
      >
        {isLoading ? "Abrindo pagamento" : method === "pix" ? "Pagar com Pix" : "Pagar com cartão"}
      </Button>
      <p className="min-h-5 text-sm font-semibold text-sky" role="status">
        {message}
      </p>
    </div>
  );
}
