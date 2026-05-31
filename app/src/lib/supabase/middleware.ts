import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import {
  isAuthPage,
  isProtectedPath,
  isSafeNextPath,
  resolveNextParam,
} from "@/lib/auth/routes"
import {
  getSupabaseProjectUrl,
  getSupabasePublishableKey,
} from "@/lib/supabase/env"

type CookieToSet = {
  name: string
  value: string
  options: CookieOptions
}

/** Copy refreshed Supabase session cookies onto redirect responses. */
export function copySupabaseCookies(
  from: NextResponse,
  to: NextResponse,
): NextResponse {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value, cookie)
  })
  return to
}

function redirectWithCookies(
  request: NextRequest,
  supabaseResponse: NextResponse,
  pathname: string,
  search = "",
): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = search
  return copySupabaseCookies(
    supabaseResponse,
    NextResponse.redirect(url),
  )
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const url = getSupabaseProjectUrl()
  const publishableKey = getSupabasePublishableKey()

  if (!url || !publishableKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if (user && isAuthPage(pathname)) {
    const nextParam =
      request.nextUrl.searchParams.get("next") ??
      request.nextUrl.searchParams.get("returnUrl")
    const destination = resolveNextParam(nextParam)
    const queryIndex = destination.indexOf("?")
    if (queryIndex >= 0) {
      return copySupabaseCookies(
        supabaseResponse,
        NextResponse.redirect(
          new URL(destination, request.nextUrl.origin),
        ),
      )
    }
    return redirectWithCookies(
      request,
      supabaseResponse,
      destination,
      "",
    )
  }

  if (!user && isProtectedPath(pathname)) {
    const next =
      pathname +
      (request.nextUrl.search.length > 0 ? request.nextUrl.search : "")
    const safeNext = isSafeNextPath(next) ? next : pathname
    const params = new URLSearchParams({ next: safeNext })
    return redirectWithCookies(
      request,
      supabaseResponse,
      "/sign-in",
      `?${params.toString()}`,
    )
  }

  return supabaseResponse
}
