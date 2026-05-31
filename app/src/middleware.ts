import { type NextRequest } from "next/server"

import { warnIfSupabaseEnvMissing } from "@/lib/supabase/env"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  warnIfSupabaseEnvMissing()
  return updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
