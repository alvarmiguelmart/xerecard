import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

const uploadRoot = path.join(process.cwd(), "public", "uploads");

export async function saveUpload(file: File, folder: "profiles" | "services") {
  if (!file.type.startsWith("image/")) {
    throw new Error("Envie uma imagem válida.");
  }

  if (file.size > 4 * 1024 * 1024) {
    throw new Error("A imagem deve ter no máximo 4MB.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const safeExtension = extension.replace(/[^a-z0-9]/g, "") || "png";
  const fileName = `${Date.now()}-${randomUUID()}.${safeExtension}`;
  const directory = path.join(uploadRoot, folder);

  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, fileName), Buffer.from(await file.arrayBuffer()));

  return `/uploads/${folder}/${fileName}`;
}
