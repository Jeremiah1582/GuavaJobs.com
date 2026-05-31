import { createBrowserClient } from "@supabase/ssr"

import { requireSupabaseBrowserConfig } from "@/lib/supabase/env"

/** Browser Supabase client — use only from Client Components. */
export function createBrowserSupabaseClient() {
  const { url, key } = requireSupabaseBrowserConfig()
  return createBrowserClient(url, key)
}
