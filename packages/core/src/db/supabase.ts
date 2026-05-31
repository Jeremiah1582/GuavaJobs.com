import { createClient, type SupabaseClient } from "@supabase/supabase-js"

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
}

/** Server-side Supabase admin client (service role). Do not use in browser. */
export function createSupabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      "@guavajobs/core: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.",
    )
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
