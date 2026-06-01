import { NextResponse, type NextRequest } from "next/server";

import {
  detectGeoFromHeaders,
  GEO_COOKIE_MAX_AGE,
  GEO_COOKIE_NAME,
  parseGeoCookie,
  serializeGeoCookie,
} from "@shared/geo/detect";

export function ensureGeoCookie(
  request: NextRequest,
  response: NextResponse,
): NextResponse {
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
