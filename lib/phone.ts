export function normalizeBrazilianWhatsApp(input: string) {
  const digits = input.replace(/\D/g, "");
  const withCountryCode =
    digits.startsWith("55") && digits.length === 13
      ? digits
      : digits.length === 11
        ? `55${digits}`
        : "";

  if (/^55[1-9][1-9]9\d{8}$/.test(withCountryCode)) {
    return withCountryCode;
  }

  return null;
}

export function toWhatsAppDialNumber(input: string) {
  return normalizeBrazilianWhatsApp(input);
}
