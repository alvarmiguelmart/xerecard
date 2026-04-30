import { mkdir, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

const uploadRoot = path.join(process.cwd(), "public", "uploads");
const storageBucket = "xerecard-uploads";

const allowedImageTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif"
} as const;

function hasImageSignature(buffer: Buffer, type: keyof typeof allowedImageTypes) {
  switch (type) {
    case "image/jpeg":
      return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case "image/png":
      return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case "image/webp":
      return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
    case "image/gif":
      return buffer.subarray(0, 6).toString("ascii") === "GIF87a" || buffer.subarray(0, 6).toString("ascii") === "GIF89a";
    case "image/avif":
      return buffer.subarray(4, 8).toString("ascii") === "ftyp" && buffer.subarray(8, 16).toString("ascii").includes("avif");
    default:
      return false;
  }
}

function getStorageConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    return null;
  }

  return {
    key,
    url: url.replace(/\/$/, "")
  };
}

async function ensureStorageBucket(url: string, key: string) {
  const response = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: storageBucket,
      name: storageBucket,
      public: true,
      file_size_limit: 4 * 1024 * 1024,
      allowed_mime_types: Object.keys(allowedImageTypes)
    })
  });

  if (response.ok || response.status === 409 || response.status === 400) {
    return;
  }

  throw new Error("Não conseguimos preparar o envio da imagem.");
}

export async function saveUpload(file: File, folder: "profiles" | "services") {
  const fileType = file.type as keyof typeof allowedImageTypes;
  const extension = allowedImageTypes[fileType];

  if (!extension) {
    throw new Error("Envie uma imagem JPG, PNG, WebP, GIF ou AVIF.");
  }

  if (file.size > 4 * 1024 * 1024) {
    throw new Error("A imagem deve ter no máximo 4MB.");
  }

  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const storageConfig = getStorageConfig();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (!hasImageSignature(buffer, fileType)) {
    throw new Error("O arquivo enviado não parece ser uma imagem válida.");
  }

  if (storageConfig) {
    const objectPath = `${folder}/${fileName}`;

    await ensureStorageBucket(storageConfig.url, storageConfig.key);

    const response = await fetch(
      `${storageConfig.url}/storage/v1/object/${storageBucket}/${objectPath}`,
      {
        method: "POST",
        headers: {
          apikey: storageConfig.key,
          Authorization: `Bearer ${storageConfig.key}`,
          "Content-Type": file.type,
          "x-upsert": "false"
        },
        body: buffer
      }
    );

    if (!response.ok) {
      throw new Error("Não conseguimos salvar a imagem.");
    }

    return `${storageConfig.url}/storage/v1/object/public/${storageBucket}/${objectPath}`;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Configure Supabase Storage para salvar imagens em produção.");
  }

  const directory = path.join(uploadRoot, folder);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, fileName), buffer);

  return `/uploads/${folder}/${fileName}`;
}

function getSupabaseObjectPath(fileUrl: string, storageUrl: string) {
  const publicPrefix = `${storageUrl}/storage/v1/object/public/${storageBucket}/`;

  if (!fileUrl.startsWith(publicPrefix)) {
    return null;
  }

  return fileUrl.slice(publicPrefix.length);
}

function getLocalUploadPath(fileUrl: string) {
  if (!fileUrl.startsWith("/uploads/")) {
    return null;
  }

  return path.join(uploadRoot, fileUrl.replace(/^\/uploads\//, ""));
}

export async function deleteUpload(fileUrl?: string | null) {
  if (!fileUrl) {
    return;
  }

  const storageConfig = getStorageConfig();

  if (storageConfig) {
    const objectPath = getSupabaseObjectPath(fileUrl, storageConfig.url);

    if (!objectPath) {
      return;
    }

    await fetch(`${storageConfig.url}/storage/v1/object/${storageBucket}/${objectPath}`, {
      method: "DELETE",
      headers: {
        apikey: storageConfig.key,
        Authorization: `Bearer ${storageConfig.key}`
      }
    });
    return;
  }

  const localPath = getLocalUploadPath(fileUrl);

  if (!localPath) {
    return;
  }

  await unlink(localPath).catch(() => undefined);
}
