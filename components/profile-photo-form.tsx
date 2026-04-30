"use client";

import { ImagePlus, Scissors } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/http";

const maxImageSize = 4 * 1024 * 1024;

function formatFileSize(size: number) {
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}

export function ProfilePhotoForm({
  bannerImage,
  bio,
  name,
  image,
  role
}: {
  bannerImage?: string | null;
  bio?: string | null;
  name: string;
  image?: string | null;
  role: "CLIENT" | "PROFESSIONAL";
}) {
  const router = useRouter();
  const [bannerPreview, setBannerPreview] = useState(bannerImage ?? "");
  const [preview, setPreview] = useState(image ?? "");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profileX, setProfileX] = useState(50);
  const [profileY, setProfileY] = useState(50);
  const [profileZoom, setProfileZoom] = useState(1);
  const [bannerX, setBannerX] = useState(50);
  const [bannerY, setBannerY] = useState(50);
  const [bannerZoom, setBannerZoom] = useState(1);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isProfileGif = profileFile?.type === "image/gif";
  const isBannerGif = bannerFile?.type === "image/gif";
  const bannerStatus = bannerFile
    ? `${bannerFile.type.replace("image/", "").toUpperCase()} · ${formatFileSize(bannerFile.size)}`
    : "PNG, JPG, WebP, AVIF ou GIF animado · até 4MB";
  const profileStatus = profileFile
    ? `${profileFile.type.replace("image/", "").toUpperCase()} · ${formatFileSize(profileFile.size)}`
    : "PNG, JPG, WebP, AVIF ou GIF animado · até 4MB";

  async function buildCroppedImage(
    file: File,
    width: number,
    height: number,
    x: number,
    y: number,
    zoom: number
  ) {
    if (file.type === "image/gif") {
      return file;
    }

    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      return file;
    }

    const baseScale = Math.max(width / bitmap.width, height / bitmap.height);
    const scale = baseScale * zoom;
    const drawWidth = bitmap.width * scale;
    const drawHeight = bitmap.height * scale;

    context.drawImage(
      bitmap,
      -(drawWidth - width) * (x / 100),
      -(drawHeight - height) * (y / 100),
      drawWidth,
      drawHeight
    );

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

  function handleProfileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;
    if (file && file.size > maxImageSize) {
      event.currentTarget.value = "";
      setProfileFile(null);
      setPreview(image ?? "");
      setMessage("Foto muito grande. Use arquivo de até 4MB.");
      return;
    }

    setMessage("");
    setProfileFile(file);
    setProfileX(50);
    setProfileY(50);
    setProfileZoom(1);
    setPreview(file ? URL.createObjectURL(file) : (image ?? ""));
  }

  function handleBannerChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;
    if (file && file.size > maxImageSize) {
      event.currentTarget.value = "";
      setBannerFile(null);
      setBannerPreview(bannerImage ?? "");
      setMessage("Banner muito grande. Use arquivo de até 4MB.");
      return;
    }

    setMessage("");
    setBannerFile(file);
    setBannerX(50);
    setBannerY(50);
    setBannerZoom(1);
    setBannerPreview(file ? URL.createObjectURL(file) : (bannerImage ?? ""));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    const formData = new FormData(event.currentTarget);

    if (profileFile) {
      formData.set(
        "image",
        await buildCroppedImage(profileFile, 512, 512, profileX, profileY, profileZoom)
      );
    }

    if (bannerFile) {
      formData.set(
        "bannerImage",
        await buildCroppedImage(bannerFile, 1400, 420, bannerX, bannerY, bannerZoom)
      );
    }

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        body: formData
      });
      const data = await readJsonResponse<{
        bannerImage?: string;
        image?: string;
        message?: string;
      }>(response);

      if (!response.ok) {
        throw new Error(data.message ?? "Não conseguimos atualizar seu perfil.");
      }

      if (data.image) {
        setPreview(data.image);
      }

      if (data.bannerImage) {
        setBannerPreview(data.bannerImage);
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
          Atualize como seu nome, foto e banner aparecem no perfil.
        </p>
      </div>
      <div className="grid gap-2">
        <div className="relative min-h-28 overflow-hidden rounded-xl bg-panel">
          {bannerPreview ? (
            <Image
              src={bannerPreview}
              alt=""
              fill
              className="object-cover"
              sizes="420px"
              style={{
                objectPosition: `${bannerX}% ${bannerY}%`,
                transform: `scale(${bannerZoom})`
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.30),transparent_34%),linear-gradient(135deg,#050505_0%,#0a0a0a_58%,rgba(56,189,248,0.22)_160%)]" />
          )}
        </div>
        <label className="focus-within:ring-sky inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-ink/12 bg-white px-4 text-sm font-black text-ink transition hover:border-sky/60 hover:bg-cloud focus-within:ring-2">
          Alterar banner
          <ImagePlus size={17} aria-hidden="true" />
          <input
            type="file"
            name="bannerImage"
            accept="image/*"
            className="sr-only"
            onChange={handleBannerChange}
          />
        </label>
        <p className="text-xs font-semibold text-ink/50">
          {bannerStatus}. {isBannerGif ? "GIF mantém animação; corte fica desligado." : "Use o ajuste para escolher a parte visível."}
        </p>
      </div>
      {bannerFile ? (
        <div className="grid gap-3 rounded-lg border border-ink/10 bg-cloud p-3">
          <p className="flex items-center gap-2 text-xs font-black uppercase text-ink/58">
            <Scissors size={14} aria-hidden="true" />
            {isBannerGif ? "GIF animado" : "Ajustar banner"}
          </p>
          {isBannerGif ? (
            <p className="text-xs font-semibold text-ink/58">
              GIF animado fica sem recorte para manter a animação.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="grid gap-2 text-xs font-black uppercase text-ink/58">
                Horizontal
                <input type="range" min="0" max="100" value={bannerX} onChange={(event) => setBannerX(Number(event.currentTarget.value))} />
              </label>
              <label className="grid gap-2 text-xs font-black uppercase text-ink/58">
                Vertical
                <input type="range" min="0" max="100" value={bannerY} onChange={(event) => setBannerY(Number(event.currentTarget.value))} />
              </label>
              <label className="grid gap-2 text-xs font-black uppercase text-ink/58">
                Zoom
                <input type="range" min="1" max="1.8" step="0.05" value={bannerZoom} onChange={(event) => setBannerZoom(Number(event.currentTarget.value))} />
              </label>
            </div>
          )}
        </div>
      ) : null}

      <div className="flex items-center gap-4">
        <div className="relative size-20 overflow-hidden rounded-2xl bg-cloud">
          {preview ? (
            <Image
              src={preview}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
              style={{
                objectPosition: `${profileX}% ${profileY}%`,
                transform: `scale(${profileZoom})`
              }}
            />
          ) : (
            <span className="grid size-full place-items-center text-2xl font-black text-ink">
              {name.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <label className="focus-within:ring-sky block cursor-pointer rounded-lg border border-ink/12 bg-white px-4 py-3 text-sm font-black text-ink hover:bg-cloud focus-within:ring-2">
            Alterar foto
            <input
              type="file"
              name="image"
              accept="image/*"
              className="sr-only"
              onChange={handleProfileChange}
            />
          </label>
          <p className="mt-2 text-xs font-semibold text-ink/50">
            {profileStatus}. {isProfileGif ? "GIF mantém animação; corte fica desligado." : "Use o ajuste para enquadrar o rosto."}
          </p>
        </div>
      </div>
      {profileFile ? (
        <div className="grid gap-3 rounded-lg border border-ink/10 bg-cloud p-3">
          <p className="flex items-center gap-2 text-xs font-black uppercase text-ink/58">
            <Scissors size={14} aria-hidden="true" />
            {isProfileGif ? "GIF animado" : "Ajustar foto"}
          </p>
          {isProfileGif ? (
            <p className="text-xs font-semibold text-ink/58">
              GIF animado fica sem recorte para manter a animação.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="grid gap-2 text-xs font-black uppercase text-ink/58">
                Horizontal
                <input type="range" min="0" max="100" value={profileX} onChange={(event) => setProfileX(Number(event.currentTarget.value))} />
              </label>
              <label className="grid gap-2 text-xs font-black uppercase text-ink/58">
                Vertical
                <input type="range" min="0" max="100" value={profileY} onChange={(event) => setProfileY(Number(event.currentTarget.value))} />
              </label>
              <label className="grid gap-2 text-xs font-black uppercase text-ink/58">
                Zoom
                <input type="range" min="1" max="1.8" step="0.05" value={profileZoom} onChange={(event) => setProfileZoom(Number(event.currentTarget.value))} />
              </label>
            </div>
          )}
        </div>
      ) : null}

      <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="profile-bio">
        Minha bio
        <textarea
          id="profile-bio"
          name="bio"
          defaultValue={bio ?? ""}
          className="field-control min-h-28 resize-y py-3"
          maxLength={220}
          placeholder="Conte rapidamente quem você é, o que faz ou o que procura."
        />
        <span className="text-xs font-semibold text-ink/50">
          Até 220 caracteres. Aparece no seu perfil público.
        </span>
      </label>

      <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="profile-name">
        Nome
        <input
          id="profile-name"
          name="name"
          defaultValue={name}
          className="field-control"
          minLength={2}
          maxLength={80}
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-ink" htmlFor="profile-role">
        Tipo de perfil
        <select
          id="profile-role"
          name="role"
          defaultValue={role}
          className="field-control"
        >
          <option value="CLIENT">Cliente</option>
          <option value="PROFESSIONAL">Profissional</option>
        </select>
      </label>

      <Button type="submit" variant="secondary" disabled={isLoading}>
        {isLoading ? "Salvando" : "Salvar perfil"}
      </Button>
      <p className="min-h-5 text-sm font-semibold text-ink" role="status">
        {message}
      </p>
    </form>
  );
}

