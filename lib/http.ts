export async function readJsonResponse<T extends Record<string, unknown>>(
  response: Response
): Promise<Partial<T>> {
  const text = await response.text();

  if (!text.trim()) {
    return {};
  }

  try {
    return JSON.parse(text) as Partial<T>;
  } catch {
    return {};
  }
}
