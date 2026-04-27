"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/http";

export function ProfilePhotoForm({
  name,
  image
}: {
  name: string;
  image?: string | null;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState(image ?? "");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        body: new FormData(event.currentTarget)
      });
      const data = await readJsonResponse<{ message?: string; image?: string }>(response);

      if (!response.ok) {
        throw new Error(data.message ?? "Não conseguimos atualizar seu perfil.");
      }

      if (data.image) {
        setPreview(data.image);
      }

      setMessage("Perfil salvo.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Não conseguimos atualizar seu perfil."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <div>
        <p className="text-sm font-black uppercase text-ink/48">Editar perfil</p>
        <p className="mt-1 text-sm font-semibold leading-6 text-ink/58">
          Atualize como seu nome e foto aparecem nos anúncios.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative size-20 overflow-hidden rounded-2xl bg-cloud">
          {preview ? (
            <Image src={preview} alt="" fill className="object-cover" sizes="80px" />
          ) : (
            <span className="grid size-full place-items-center text-2xl font-black text-ink">
              {name.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <label className="focus-within:ring-acid block cursor-pointer rounded-lg border border-ink/12 bg-white px-4 py-3 text-sm font-black text-ink hover:bg-cloud focus-within:ring-2">
            Alterar foto
            <input
              type="file"
              name="image"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          </label>
          <p className="mt-2 text-xs font-semibold text-ink/50">
            Use PNG ou JPG até 4MB.
          </p>
        </div>
      </div>

      <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="profile-name">
        Nome
        <input
          id="profile-name"
          name="name"
          defaultValue={name}
          className="field-control"
          minLength={2}
        />
      </label>

      <Button type="submit" variant="secondary" disabled={isLoading}>
        {isLoading ? "Salvando" : "Salvar perfil"}
      </Button>
      <p className="min-h-5 text-sm font-semibold text-sky" role="status">
        {message}
      </p>
    </form>
  );
}
