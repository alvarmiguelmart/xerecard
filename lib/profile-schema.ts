import { prisma } from "@/lib/prisma";

let bioColumnReady: Promise<void> | null = null;

export function ensureProfileBioColumn() {
  bioColumnReady ??= prisma.$executeRawUnsafe(
    'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bio" TEXT'
  ).then(() => undefined);

  return bioColumnReady;
}
