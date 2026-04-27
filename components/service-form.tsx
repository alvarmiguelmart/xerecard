"use client";

import { ArrowRight, BriefcaseBusiness, Handshake, Upload } from "lucide-react";
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
        throw new Error(data.message ?? "Não conseguimos publicar seu anúncio.");
      }

      router.push("/servicos");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não conseguimos publicar seu anúncio.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="grid gap-5 rounded-xl border border-ink/10 bg-white p-5 premium-shadow md:p-6" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className={`focus-ring flex items-center gap-3 rounded-lg border px-4 py-4 text-left font-black transition ${
            mode === "request" ? "border-sky bg-mint" : "border-ink/12 bg-cloud"
          }`}
          onClick={() => setMode("request")}
        >
          <Handshake size={20} aria-hidden="true" />
          Quero contratar
        </button>
        <button
          type="button"
          className={`focus-ring flex items-center gap-3 rounded-lg border px-4 py-4 text-left font-black transition ${
            mode === "offer" ? "border-sky bg-mint" : "border-ink/12 bg-cloud"
          }`}
          onClick={() => setMode("offer")}
        >
          <BriefcaseBusiness size={20} aria-hidden="true" />
          Quero oferecer
        </button>
      </div>

      <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="title">
        Título do anúncio
        <input
          id="title"
          name="title"
          className="field-control"
          placeholder="Ex: Preciso de ajuda para um evento"
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
            className="field-control"
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
          Local de atendimento
          <input
            id="location"
            name="location"
            className="field-control"
            placeholder="Cidade ou remoto"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="priceLabel">
          Orçamento ou preço
          <input
            id="priceLabel"
            name="priceLabel"
            className="field-control"
            placeholder="Ex: A combinar ou R$ 150"
            required
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="whatsapp">
        WhatsApp para contato
        <input
          id="whatsapp"
          name="whatsapp"
          className="field-control"
          placeholder="(42) 99999-9999"
          inputMode="tel"
          required
          minLength={10}
        />
        <span className="text-xs font-semibold text-ink/48">
          Informe com DDD. O número só aparece para assinantes.
        </span>
      </label>

      <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="description">
        Descrição
        <textarea
          id="description"
          name="description"
          className="field-control min-h-36 resize-y py-3"
          placeholder="Explique o que precisa, prazo, disponibilidade, local e qualquer condição importante."
          required
          minLength={20}
        />
      </label>

      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-ink/18 bg-cloud p-4 text-sm font-bold text-ink/70 transition hover:border-sky/45 hover:bg-white">
        <span className="flex items-center gap-3">
          <Upload size={18} aria-hidden="true" />
          Adicionar foto ao anúncio
        </span>
        <span className="text-xs font-black uppercase text-ink/42">Opcional</span>
        <input type="file" name="photos" className="sr-only" accept="image/*" />
      </label>

      <Button
        type="submit"
        size="lg"
        icon={<ArrowRight size={18} aria-hidden="true" />}
        disabled={isLoading}
      >
        {isLoading ? "Publicando" : "Publicar anúncio"}
      </Button>
      <p className="min-h-6 text-sm font-semibold text-coral" role="status">
        {message}
      </p>
    </form>
  );
}
