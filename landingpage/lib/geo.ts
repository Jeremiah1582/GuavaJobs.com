import { cookies, headers } from "next/headers";

import {
  detectGeoFromHeaders,
  parseGeoCookie,
} from "@shared/geo/detect";
import type { GeoLocation } from "@shared/geo/types";

export async function getLandingGeo(): Promise<GeoLocation> {
  const cookieStore = await cookies();
  const fromCookie = parseGeoCookie(cookieStore.get("gj_geo")?.value);
  if (fromCookie) return fromCookie;
  const headerList = await headers();
  return detectGeoFromHeaders(headerList);
}
