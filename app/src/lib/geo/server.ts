import { cookies, headers } from "next/headers";

import {
  detectGeoFromHeaders,
  GEO_COOKIE_MAX_AGE,
  GEO_COOKIE_NAME,
  parseGeoCookie,
  serializeGeoCookie,
} from "@shared/geo/detect";
import type { GeoLocation } from "@shared/geo/types";

export type { GeoLocation } from "@shared/geo/types";

export async function getGeoLocation(): Promise<GeoLocation> {
  const cookieStore = await cookies();
  const fromCookie = parseGeoCookie(cookieStore.get(GEO_COOKIE_NAME)?.value);
  if (fromCookie) return fromCookie;

  const headerList = await headers();
  return detectGeoFromHeaders(headerList);
}

export function geoCookieHeader(geo: GeoLocation): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${GEO_COOKIE_NAME}=${encodeURIComponent(serializeGeoCookie(geo))}; Path=/; Max-Age=${GEO_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}
