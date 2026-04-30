"use client";

import Image from "next/image";
import { ArrowRight, BriefcaseBusiness, Handshake, Lightbulb, Scissors, Sparkles, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/http";
import { categories } from "@/lib/marketplace-data";
import type { ServiceMode } from "@prisma/client";

type EditableService = {
  id: string;
  mode: ServiceMode;
  title: string;
  category: string;
  location: string;
  priceLabel: string;
  description: string;
  whatsapp: string;
  image: string;
};

const maxImageSize = 4 * 1024 * 1024;

export function ServiceForm({
  initialMode = "REQUEST",
  initialService
}: {
  initialMode?: ServiceMode;
  initialService?: EditableService;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<ServiceMode>(initialService?.mode ?? initialMode);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [photoName, setPhotoName] = useState(initialService?.image ? "Imagem atual" : "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(initialService?.image ?? "");
  const [cropX, setCropX] = useState(50);
  const [cropY, setCropY] = useState(50);
  const [cropZoom, setCropZoom] = useState(1);
  const isEditing = Boolean(initialService);
  const isGifUpload = photoFile?.type === "image/gif";

  async function buildCroppedImage(file: File) {
    if (file.type === "image/gif") {
      return file;
    }

    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = 1800;
    canvas.height = 1000;

    const context = canvas.getContext("2d");
    if (!context) {
      return file;
    }

    const baseScale = Math.max(canvas.width / bitmap.width, canvas.height / bitmap.height);
    const scale = baseScale * cropZoom;
    const drawWidth = bitmap.width * scale;
    const drawHeight = bitmap.height * scale;
    const offsetX = -(drawWidth - canvas.width) * (cropX / 100);
    const offsetY = -(drawHeight - canvas.height) * (cropY / 100);

    context.drawImage(bitmap, offsetX, offsetY, drawWidth, drawHeight);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, file.type === "image/png" ? "image/png" : "image/jpeg", 0.9);
    });

    bitmap.close();

    return blob
      ? new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
          type: blob.type,
          lastModified: Date.now()
        })
      : file;
  }

  function formatCellphone(value: string) {
    const digits = value.replace(/\D/g, "").replace(/^55/, "").slice(0, 11);
    const ddd = digits.slice(0, 2);
    const first = digits.slice(2, 7);
    const second = digits.slice(7, 11);

    if (digits.length <= 2) {
      return ddd ? `(${ddd}` : "";
    }

    if (digits.length <= 7) {
      return `(${ddd}) ${first}`;
    }

    return `(${ddd}) ${first}-${second}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    formData.set("mode", mode);

    if (photoFile) {
      formData.set("photos", await buildCroppedImage(photoFile));
    }

    try {
      const response = await fetch(
        isEditing && initialService ? `/api/services/${initialService.id}` : "/api/services",
        {
          method: isEditing ? "PATCH" : "POST",
          body: formData
        }
      );
      const data = await readJsonResponse<{ message?: string; service?: { id: string } }>(
        response
      );

      if (!response.ok) {
        throw new Error(
          data.message ??
            (isEditing ? "Não conseguimos salvar seu anúncio." : "Não conseguimos publicar seu anúncio.")
        );
      }

      router.push(isEditing && data.service?.id ? `/servicos/${data.service.id}` : "/servicos");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : isEditing
            ? "Não conseguimos salvar seu anúncio."
            : "Não conseguimos publicar seu anúncio."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;
    if (file && file.size > maxImageSize) {
      event.currentTarget.value = "";
      setPhotoFile(null);
      setPhotoName(initialService?.image ? "Imagem atual" : "");
      setPhotoPreview(initialService?.image ?? "");
      setMessage("Imagem muito grande. Use arquivo de até 4MB.");
      return;
    }

    setMessage("");
    setPhotoFile(file);
    setPhotoName(file?.name ?? (initialService?.image ? "Imagem atual" : ""));
    setCropX(50);
    setCropY(50);
    setCropZoom(1);
    setPhotoPreview(file ? URL.createObjectURL(file) : (initialService?.image ?? ""));
  }

  return (
    <form className="glass-panel motion-rise grid gap-5 rounded-xl p-5 md:p-6" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className={`focus-ring flex items-center gap-3 rounded-lg border px-4 py-4 text-left font-black transition ${
            mode === "REQUEST" ? "state-active" : "border-ink/12 bg-cloud"
          }`}
          onClick={() => setMode("REQUEST")}
        >
          <Handshake size={20} aria-hidden="true" />
          Quero contratar
        </button>
        <button
          type="button"
          className={`focus-ring flex items-center gap-3 rounded-lg border px-4 py-4 text-left font-black transition ${
            mode === "OFFER" ? "state-active" : "border-ink/12 bg-cloud"
          }`}
          onClick={() => setMode("OFFER")}
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
          defaultValue={initialService?.title}
          placeholder={
            mode === "REQUEST"
              ? "Ex: Preciso de editor de vídeos para Reels"
              : "Ex: Edição de vídeos curtos com entrega em 24h"
          }
          required
          minLength={6}
          maxLength={100}
        />
        <span className="text-xs font-semibold text-ink/48">
          {mode === "REQUEST"
            ? "Seja específico: diga o que precisa, prazo e local."
            : "Destaque o benefício: entrega, experiência ou diferencial."}
        </span>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="category">
          Categoria
          <select
            id="category"
            name="category"
            className="field-control"
            defaultValue={initialService?.category}
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <span className="text-xs font-semibold text-ink/48">
            Escolha a categoria que mais combina com o anúncio.
          </span>
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="priceLabel">
          Orçamento ou preço
          <input
            id="priceLabel"
            name="priceLabel"
            className="field-control"
            defaultValue={initialService?.priceLabel}
            placeholder="Ex: A combinar ou R$ 150"
            required
            maxLength={80}
          />
          <span className="text-xs font-semibold text-ink/48">
            Informe preço fixo, faixa ou a combinar.
          </span>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="location">
          Local de atendimento
          <input
            id="location"
            name="location"
            className="field-control"
            defaultValue={initialService?.location}
            placeholder="Cidade ou remoto"
            required
            maxLength={100}
          />
          <span className="text-xs font-semibold text-ink/48">
            Use cidade, região ou remoto.
          </span>
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="whatsapp">
          WhatsApp para contato
          <input
            id="whatsapp"
            name="whatsapp"
            className="field-control"
            defaultValue={initialService?.whatsapp ? formatCellphone(initialService.whatsapp) : ""}
            placeholder="(42) 99999-9999"
            inputMode="tel"
            pattern="\([1-9]{2}\) 9[0-9]{4}-[0-9]{4}"
            required
            minLength={15}
            maxLength={15}
            onChange={(event) => {
              event.currentTarget.value = formatCellphone(event.currentTarget.value);
            }}
          />
          <span className="text-xs font-semibold text-ink/48">
            Use celular com DDD no formato (42) 99999-9999. O número só aparece para assinantes.
          </span>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="description">
        Descrição
        <textarea
          id="description"
          name="description"
          className="field-control min-h-36 resize-y py-3"
          defaultValue={initialService?.description}
          placeholder={
            mode === "REQUEST"
              ? "Explique o que precisa, prazo, disponibilidade, local e qualquer condição importante."
              : "Descreva sua experiência, portfólio, como trabalha e por que contratar você."
          }
          required
          minLength={20}
          maxLength={500}
        />
        <span className="text-xs font-semibold text-ink/48">
          {mode === "REQUEST"
            ? "Quanto mais detalhes, melhor o orçamento que você vai receber."
            : "Mostre resultados anteriores, prazos e formas de pagamento aceitas."}
        </span>
      </label>

      <div className="rounded-lg border border-ink/10 bg-cloud p-4">
        <p className="flex items-center gap-2 text-sm font-black text-ink">
          <Lightbulb size={16} className="text-white" aria-hidden="true" />
          Dicas para anúncios que convertem
        </p>
        <ul className="mt-3 grid gap-2 text-xs font-semibold text-ink/62">
          {[
            "Use uma foto real do serviço ou resultado.",
            'Seja claro no preço: "a partir de R$ X" ou "faixa de R$ X a Y".',
            "Responda rápido para aumentar chance de fechar negócio."
          ].map((tip) => (
            <li key={tip} className="flex gap-2">
              <Sparkles size={14} className="mt-0.5 shrink-0 text-white" aria-hidden="true" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <label className="grid cursor-pointer gap-2 rounded-lg border border-dashed border-ink/18 bg-cloud p-4 text-sm font-bold text-ink/70 transition hover:border-sky/45 hover:bg-white">
        <span className="flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-3">
            <Upload size={18} className="shrink-0" aria-hidden="true" />
            <span className="truncate">
              {photoName || "Adicionar foto ao anúncio"}
            </span>
          </span>
          <span className="shrink-0 text-xs font-black uppercase text-ink/42">
            {isEditing ? "Trocar" : "Opcional"}
          </span>
        </span>
        <span className="text-xs font-semibold text-ink/48">
          PNG, JPG, WebP, AVIF ou GIF animado até 4MB. Ajuste o corte para escolher a parte visível.
        </span>
        <input type="file" name="photos" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
      </label>

      {photoPreview ? (
        <div className="grid gap-4 rounded-xl border border-ink/12 bg-cloud p-4">
          <div className="flex items-center gap-2 text-sm font-black text-ink">
            <Scissors size={17} aria-hidden="true" />
            {isGifUpload ? "GIF animado" : "Ajustar corte da imagem"}
          </div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-ink/10 bg-panel">
            <Image
              src={photoPreview}
              alt=""
              fill
              sizes="(min-width: 768px) 520px, 100vw"
              className="object-cover"
              style={{
                objectPosition: `${cropX}% ${cropY}%`,
                transform: `scale(${cropZoom})`
              }}
            />
          </div>
          {isGifUpload ? (
            <p className="text-xs font-semibold text-ink/58">
              GIF animado fica sem recorte para manter a animação.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              <label className="grid gap-2 text-xs font-black uppercase text-ink/58">
                Horizontal
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cropX}
                  onChange={(event) => setCropX(Number(event.currentTarget.value))}
                  disabled={!photoFile}
                />
              </label>
              <label className="grid gap-2 text-xs font-black uppercase text-ink/58">
                Vertical
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cropY}
                  onChange={(event) => setCropY(Number(event.currentTarget.value))}
                  disabled={!photoFile}
                />
              </label>
              <label className="grid gap-2 text-xs font-black uppercase text-ink/58">
                Zoom
                <input
                  type="range"
                  min="1"
                  max="1.8"
                  step="0.05"
                  value={cropZoom}
                  onChange={(event) => setCropZoom(Number(event.currentTarget.value))}
                  disabled={!photoFile}
                />
              </label>
            </div>
          )}
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        icon={<ArrowRight size={18} aria-hidden="true" />}
        disabled={isLoading}
      >
        {isLoading
          ? isEditing
            ? "Salvando"
            : "Publicando"
          : isEditing
            ? "Salvar anúncio"
            : "Publicar anúncio"}
      </Button>
      <p className="min-h-6 text-sm font-semibold text-coral" role="status">
        {message}
      </p>
    </form>
  );
}

