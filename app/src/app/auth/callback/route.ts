import { NextResponse } from "next/server"

import { usersService } from "@guavajobs/core"

import { isSafeNextPath, resolveNextParam } from "@/lib/auth/routes"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const nextParam = searchParams.get("next")
  const type = searchParams.get("type")

  if (!code) {
    return NextResponse.redirect(
      `${origin}/sign-in?error=auth_callback_error`,
    )
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const isExpired =
      error.message.toLowerCase().includes("expired") ||
      error.message.toLowerCase().includes("invalid") ||
      error.status === 400
    const errorCode = isExpired ? "expired_link" : "auth_callback_error"
    return NextResponse.redirect(`${origin}/sign-in?error=${errorCode}`)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user?.email) {
    try {
      await usersService.ensureUser({ id: user.id, email: user.email })
    } catch {
      // DB sync failure should not block auth — user can retry on next login.
    }
  }

  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/reset-password`)
  }

  const safeNext =
    nextParam && isSafeNextPath(nextParam)
      ? nextParam
      : resolveNextParam(null)
  return NextResponse.redirect(`${origin}${safeNext}`)
}
