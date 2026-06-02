/**
 * When DEV_MODE is enabled, API routes may return extra error detail for debugging.
 * Set DEV_MODE=True in app/.env.local (server-only; not exposed to the client bundle).
 */
export function isDevMode(): boolean {
  const value = process.env.DEV_MODE?.trim().toLowerCase();
  return value === "true" || value === "1" || value === "yes";
}

export function devErrorDetails(error: unknown): Record<string, unknown> | undefined {
  if (!isDevMode()) return undefined;

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return { value: String(error) };
}
