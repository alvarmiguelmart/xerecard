function hasPlaceholderToken(value: string) {
  return /[[\]<>]/.test(value) || value.includes("PROJECT_REF") || value.includes("PASSWORD");
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "http://localhost:3000";
}

export function getMetadataBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "https://xerecard.vercel.app";
}

export function getDatabaseConfigIssue() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return "DATABASE_URL não configurado.";
  }

  if (hasPlaceholderToken(databaseUrl)) {
    return "DATABASE_URL ainda contém placeholders da documentação.";
  }

  try {
    new URL(databaseUrl);
    return null;
  } catch {
    return "DATABASE_URL inválido.";
  }
}
