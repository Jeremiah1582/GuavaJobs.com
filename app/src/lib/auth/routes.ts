/** Exact paths accessible without authentication. */
const PUBLIC_EXACT_PATHS = new Set([
  "/",
  "/jobs",
  "/sign-in",
  "/sign-up",
  "/sign-up/confirm-email",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/api/v1/health",
  "/api/v1/jobs",
])

/** Path prefixes accessible without authentication. */
const PUBLIC_PREFIX_PATHS = ["/jobs/", "/api/v1/jobs/"]

/** Exact paths that require authentication. */
const PROTECTED_EXACT_PATHS = new Set([
  "/dashboard",
  "/profile",
  "/settings",
])

const AUTH_PAGE_PATHS = new Set([
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
])

export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT_PATHS.has(pathname)) return true
  return PUBLIC_PREFIX_PATHS.some((prefix) => pathname.startsWith(prefix))
}

export function isProtectedPath(pathname: string): boolean {
  if (PROTECTED_EXACT_PATHS.has(pathname)) return true
  if (pathname === "/applications" || pathname.startsWith("/applications/")) {
    return true
  }
  return false
}

export function isAuthPage(pathname: string): boolean {
  return AUTH_PAGE_PATHS.has(pathname)
}

/** Relative path safe for post-auth redirects (no open redirects). */
export function isSafeNextPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//")
}

export function resolveNextParam(
  next: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (next && isSafeNextPath(next)) return next
  return fallback
}
