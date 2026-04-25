export function normalizeBrazilianWhatsApp(input: string) {
  const digits = input.replace(/\D/g, "");

  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) {
    return digits.slice(2);
  }

  return digits;
}

export function toWhatsAppDialNumber(input: string) {
  const digits = normalizeBrazilianWhatsApp(input);

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits;
}
