"use client";

import { Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/http";

export function ManageSubscriptionButton() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function openPortal() {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/subscription/portal", {
        method: "POST"
      });
      const data = await readJsonResponse<{ message?: string; url?: string }>(response);

      if (!response.ok || !data.url) {
        throw new Error(data.message ?? "Não conseguimos abrir o portal Stripe.");
      }

      window.location.href = data.url;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não conseguimos abrir o portal Stripe.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="secondary"
        icon={<Settings size={18} aria-hidden="true" />}
        onClick={openPortal}
        disabled={isLoading}
      >
        {isLoading ? "Abrindo portal" : "Gerenciar assinatura"}
      </Button>
      <p className="min-h-5 text-sm font-semibold text-ink" role="status">
        {message}
      </p>
    </div>
  );
}

