"use client";

import { ArrowRight, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/http";
import { categories, ServiceMode } from "@/lib/marketplace-data";

export function ServiceForm({ initialMode = "request" }: { initialMode?: ServiceMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<ServiceMode>(initialMode);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    formData.set("mode", mode);

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        body: formData
      });
      const data = await readJsonResponse<{ message?: string }>(response);

      if (!response.ok) {
        throw new Error(data.message ?? "Não foi possível publicar.");
      }

      router.push("/servicos");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível publicar.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className="grid gap-5 rounded-xl border border-ink/10 bg-white p-5 premium-shadow"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className={`focus-ring rounded-lg border px-4 py-4 text-left font-black ${
            mode === "request" ? "border-sky bg-mint" : "border-ink/12 bg-cloud"
          }`}
          onClick={() => setMode("request")}
        >
          Criar pedido
        </button>
        <button
          type="button"
          className={`focus-ring rounded-lg border px-4 py-4 text-left font-black ${
            mode === "offer" ? "border-sky bg-mint" : "border-ink/12 bg-cloud"
          }`}
          onClick={() => setMode("offer")}
        >
          Anunciar oferta
        </button>
      </div>

      <div className="rounded-xl bg-paper p-4">
        <p className="text-sm font-black uppercase text-ink/48">
          Publicação com privacidade
        </p>
        <p className="mt-2 text-sm leading-6 text-ink/62">
          Escolha a categoria certa, informe valores e evite dados pessoais no
          texto público.
        </p>
      </div>

      <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="title">
        Título
        <input
          id="title"
          name="title"
          className="focus-ring h-12 rounded-lg border border-ink/12 bg-cloud px-4"
          placeholder="Ex: Catálogo digital com atendimento privado"
          required
          minLength={6}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="category">
          Categoria
          <select
            id="category"
            name="category"
            className="focus-ring h-12 rounded-lg border border-ink/12 bg-cloud px-4"
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="location">
          Local
          <input
            id="location"
            name="location"
            className="focus-ring h-12 rounded-lg border border-ink/12 bg-cloud px-4"
            placeholder="Cidade ou remoto"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="priceLabel">
          Preço
          <input
            id="priceLabel"
            name="priceLabel"
            className="focus-ring h-12 rounded-lg border border-ink/12 bg-cloud px-4"
            placeholder="A combinar"
            required
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="whatsapp">
        WhatsApp com DDD
        <input
          id="whatsapp"
          name="whatsapp"
          className="focus-ring h-12 rounded-lg border border-ink/12 bg-cloud px-4"
          placeholder="(42) 99999-9999"
          inputMode="tel"
          required
          minLength={10}
        />
        <span className="text-xs font-semibold text-ink/48">
          Não precisa informar o código do país.
        </span>
      </label>

      <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="description">
        Detalhes do serviço
        <textarea
          id="description"
          name="description"
          className="focus-ring min-h-36 resize-y rounded-lg border border-ink/12 bg-cloud p-4"
          placeholder="Explique o que oferece, valores, regras, privacidade, prazo e como prefere ser chamado."
          required
          minLength={20}
        />
      </label>

      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-ink/18 bg-cloud p-4 text-sm font-bold text-ink/70">
        <Upload size={18} aria-hidden="true" />
        Inserir foto do serviço
        <input type="file" name="photos" className="sr-only" accept="image/*" />
      </label>

      <Button
        type="submit"
        size="lg"
        icon={<ArrowRight size={18} aria-hidden="true" />}
        disabled={isLoading}
      >
        {isLoading ? "Publicando" : "Publicar serviço"}
      </Button>
      <p className="min-h-6 text-sm font-semibold text-coral" role="status">
        {message}
      </p>
    </form>
  );
}
