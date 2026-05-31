import { parseSessionUser } from "@guavajobs/core"

import { isSupabaseBrowserConfigured } from "@/lib/supabase/env"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function getSession() {
  if (!isSupabaseBrowserConfigured()) {
    return null
  }

  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return null
  }

  return parseSessionUser({ id: user.id, email: user.email })
}

export async function requireSession() {
  const session = await getSession()
  if (!session) {
    throw new Error("Authentication required")
  }
  return session
}
