import { type NextRequest, NextResponse } from "next/server";

import {
  detectGeoFromHeaders,
  GEO_COOKIE_MAX_AGE,
  GEO_COOKIE_NAME,
  parseGeoCookie,
  serializeGeoCookie,
} from "@shared/geo/detect";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const existing = parseGeoCookie(request.cookies.get(GEO_COOKIE_NAME)?.value);
  if (existing) return response;

  const geo = detectGeoFromHeaders(request.headers);
  response.cookies.set(GEO_COOKIE_NAME, serializeGeoCookie(geo), {
    path: "/",
    maxAge: GEO_COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
