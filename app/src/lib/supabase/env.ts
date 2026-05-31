/**
 * Supabase project URL + publishable (browser) key from app/.env.local.
 * Supports the publishable key name or legacy anon key.
 */
export function getSupabaseProjectUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
}

export function getSupabasePublishableKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export function isSupabaseBrowserConfigured(): boolean {
  return Boolean(getSupabaseProjectUrl() && getSupabasePublishableKey())
}

let warnedMissingSupabaseEnv = false

/** Dev-only: warn once when Supabase env is missing (middleware skips auth). */
export function warnIfSupabaseEnvMissing(): void {
  if (process.env.NODE_ENV === "production") return
  if (isSupabaseBrowserConfigured() || warnedMissingSupabaseEnv) return
  warnedMissingSupabaseEnv = true
  console.warn(
    "[guavajobs] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are unset — auth middleware is disabled.",
  )
}

export function requireSupabaseBrowserConfig(): { url: string; key: string } {
  const url = getSupabaseProjectUrl()
  const key = getSupabasePublishableKey()

  if (!url || !key) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in app/.env.local (legacy NEXT_PUBLIC_SUPABASE_ANON_KEY also works).",
    )
  }

  return { url, key }
}
