import { type NextRequest } from "next/server"

import { ensureGeoCookie } from "@/lib/geo/middleware"
import { warnIfSupabaseEnvMissing } from "@/lib/supabase/env"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  warnIfSupabaseEnvMissing()
  const response = await updateSession(request)
  return ensureGeoCookie(request, response)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
