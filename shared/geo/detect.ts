import type { GeoLocation, GeoMarket } from "./types";

const DACH_COUNTRY_CODES = new Set(["DE", "AT", "CH"]);

export const GEO_COOKIE_NAME = "gj_geo";
export const GEO_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const DEFAULT_GB: GeoLocation = {
  city: "London",
  countryCode: "GB",
  market: "gb",
};

const DEFAULT_DE: GeoLocation = {
  city: "Berlin",
  countryCode: "DE",
  market: "de",
};

export function marketFromCountryCode(countryCode: string | null | undefined): GeoMarket {
  if (!countryCode) return "gb";
  const upper = countryCode.toUpperCase();
  return DACH_COUNTRY_CODES.has(upper) ? "de" : "gb";
}

export function detectGeoFromHeaders(headers: Headers): GeoLocation {
  const city =
    headers.get("x-vercel-ip-city")?.trim() ||
    headers.get("cf-ipcity")?.trim() ||
    null;
  const countryCode =
    headers.get("x-vercel-ip-country")?.trim() ||
    headers.get("x-vercel-ip-country-code")?.trim() ||
    headers.get("cf-ipcountry")?.trim() ||
    null;

  const market = marketFromCountryCode(countryCode);
  const fallback = market === "de" ? DEFAULT_DE : DEFAULT_GB;

  return {
    city: city || fallback.city,
    countryCode: countryCode?.toUpperCase() || fallback.countryCode,
    market,
  };
}

export function parseGeoCookie(value: string | undefined): GeoLocation | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<GeoLocation>;
    if (!parsed.city || !parsed.market) return null;
    if (parsed.market !== "gb" && parsed.market !== "de") return null;
    return {
      city: String(parsed.city),
      countryCode: String(parsed.countryCode ?? (parsed.market === "de" ? "DE" : "GB")),
      market: parsed.market,
    };
  } catch {
    return null;
  }
}

export function serializeGeoCookie(geo: GeoLocation): string {
  return JSON.stringify(geo);
}
