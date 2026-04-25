import { mkdir, writeFile } from "node:fs/promises";
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

  throw new Error("Não foi possível preparar o armazenamento da imagem.");
}

export async function saveUpload(file: File, folder: "profiles" | "services") {
  const extension = allowedImageTypes[file.type as keyof typeof allowedImageTypes];

  if (!extension) {
    throw new Error("Envie uma imagem JPG, PNG, WebP, GIF ou AVIF.");
  }

  if (file.size > 4 * 1024 * 1024) {
    throw new Error("A imagem deve ter no máximo 4MB.");
  }

  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const storageConfig = getStorageConfig();
  const buffer = Buffer.from(await file.arrayBuffer());

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
      throw new Error("Não foi possível salvar a imagem.");
    }

    return `${storageConfig.url}/storage/v1/object/public/${storageBucket}/${objectPath}`;
  }

  const directory = path.join(uploadRoot, folder);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, fileName), buffer);

  return `/uploads/${folder}/${fileName}`;
}
