const defaultAuthRedirect = "/servicos";

export function getSafeAuthRedirect(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return defaultAuthRedirect;
  }

  return value;
}
