/** Shape returned by app API routes on failure (optional dev fields). */
export type ApiErrorPayload = {
  error?: string;
  code?: string;
  details?: unknown;
  devMessage?: string;
};

export function apiErrorMessage(payload: ApiErrorPayload, fallback: string): string {
  const parts: string[] = [];
  const main =
    typeof payload.error === "string" && payload.error.trim()
      ? payload.error.trim()
      : fallback;
  parts.push(main);

  if (typeof payload.code === "string" && payload.code.trim()) {
    parts.push(`Code: ${payload.code.trim()}`);
  }

  if (typeof payload.devMessage === "string" && payload.devMessage.trim()) {
    parts.push(payload.devMessage.trim());
  }

  return parts.join("\n");
}

export function formatApiErrorDetails(details: unknown): string | null {
  if (details === undefined || details === null) return null;
  if (typeof details === "string") return details.trim() || null;
  try {
    return JSON.stringify(details, null, 2);
  } catch {
    return String(details);
  }
}
