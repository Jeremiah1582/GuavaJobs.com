import { JUNIOR_DEFAULT_WHAT, type JobCountry, type JobSortBy } from "@guavajobs/core";

import type { GeoLocation } from "@/lib/geo/server";

export type ParsedJobsSearchParams = {
  q?: string;
  where?: string;
  country: JobCountry;
  page: number;
  job?: string;
  distanceKm?: number;
  maxDaysOld?: number;
  sortBy?: JobSortBy;
  /** Effective query sent to Adzuna (includes junior default). */
  effectiveQ?: string;
  isDefaultSearch: boolean;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseOptionalInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function parseJobsSearchParams(
  raw: RawSearchParams,
  geo?: GeoLocation,
): ParsedJobsSearchParams {
  const q = first(raw.q)?.trim() || undefined;
  const where = first(raw.where)?.trim() || geo?.city || undefined;
  const country = first(raw.country) === "de" ? "de" : geo?.market ?? "gb";
  const page = parseOptionalInt(first(raw.page)) ?? 1;
  const job = first(raw.job)?.trim() || undefined;
  const distanceKm = parseOptionalInt(first(raw.distanceKm));
  const maxDaysOld = parseOptionalInt(first(raw.maxDaysOld));
  const sortByRaw = first(raw.sortBy);
  const sortBy: JobSortBy | undefined =
    sortByRaw === "date" || sortByRaw === "relevance" ? sortByRaw : undefined;

  const hasUserQuery = Boolean(q || first(raw.where)?.trim());
  const isDefaultSearch = !hasUserQuery;
  const effectiveQ = q || (isDefaultSearch ? JUNIOR_DEFAULT_WHAT : undefined);

  return {
    q,
    where,
    country,
    page,
    job,
    distanceKm,
    maxDaysOld,
    sortBy,
    effectiveQ,
    isDefaultSearch,
  };
}

export function toSearchParamRecord(
  params: ParsedJobsSearchParams,
): Record<string, string | undefined> {
  return {
    q: params.q,
    where: params.where,
    country: params.country,
    page: params.page > 1 ? String(params.page) : undefined,
    job: params.job,
    distanceKm: params.distanceKm != null ? String(params.distanceKm) : undefined,
    maxDaysOld: params.maxDaysOld != null ? String(params.maxDaysOld) : undefined,
    sortBy: params.sortBy,
  };
}
