"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/http";

export function DeleteServiceButton({ serviceId }: { serviceId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function deleteService() {
    if (!window.confirm("Excluir este anúncio? Esta ação remove o anúncio do marketplace.")) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/services/${serviceId}`, { method: "DELETE" });
      const data = await readJsonResponse<{ message?: string }>(response);

      if (!response.ok) {
        throw new Error(data.message ?? "Não conseguimos excluir o anúncio.");
      }

      router.push("/servicos");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não conseguimos excluir o anúncio.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="min-h-14 w-full border-coral/40 text-coral hover:border-coral/80"
        icon={<Trash2 size={17} aria-hidden="true" />}
        onClick={deleteService}
        disabled={isLoading}
      >
        {isLoading ? "Excluindo" : "Excluir anúncio"}
      </Button>
      <p className="min-h-5 text-sm font-semibold text-coral" role="status">
        {message}
      </p>
    </div>
  );
}
