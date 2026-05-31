import { ApiErrorCode } from "../../api/errors";
import { JobsServiceError } from "./errors";
import type { JobCountry, JobListing, JobSalary } from "./types";

const ADZUNA_BASE = "https://api.adzuna.com/v1/api";

type AdzunaCompany = { display_name?: string };
type AdzunaLocation = { display_name?: string; area?: string[] };
type AdzunaCategory = { label?: string };
type AdzunaResult = {
  id?: string | number;
  title?: string;
  company?: AdzunaCompany;
  location?: AdzunaLocation;
  description?: string;
  created?: string;
  redirect_url?: string;
  category?: AdzunaCategory;
  contract_type?: string;
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: string | boolean;
};

type AdzunaSearchResponse = {
  count?: number;
  results?: AdzunaResult[];
  exception?: string;
  display?: string;
};

function getCredentials() {
  const appId = process.env.ADZUNA_APP_ID?.trim();
  const appKey = process.env.ADZUNA_API_KEY?.trim();
  if (!appId || !appKey) {
    throw new JobsServiceError(
      ApiErrorCode.SERVICE_UNAVAILABLE,
      "Job search is not configured",
      503,
    );
  }
  return { appId, appKey };
}

function currencyForCountry(country: JobCountry): string {
  return country === "de" ? "EUR" : "GBP";
}

function mapSalary(result: AdzunaResult, country: JobCountry): JobSalary | undefined {
  if (result.salary_min == null && result.salary_max == null) return undefined;
  return {
    min: result.salary_min,
    max: result.salary_max,
    currency: currencyForCountry(country),
    isPredicted:
      result.salary_is_predicted === true ||
      result.salary_is_predicted === "1" ||
      result.salary_is_predicted === "true",
  };
}

export function encodeJobId(country: JobCountry, adzunaId: string): string {
  return `${country}-${adzunaId}`;
}

export function parseJobId(id: string): { country: JobCountry; adzunaId: string } | null {
  const match = /^([a-z]{2})-(\d+)$/i.exec(id.trim());
  if (!match) return null;
  const country = match[1].toLowerCase();
  if (country !== "gb" && country !== "de") return null;
  return { country, adzunaId: match[2] };
}

export function mapAdzunaResult(result: AdzunaResult, country: JobCountry): JobListing | null {
  if (result.id == null || !result.title) return null;
  const adzunaId = String(result.id);
  const location =
    result.location?.display_name ??
    (Array.isArray(result.location?.area) ? result.location.area.join(", ") : "") ??
    "Location not specified";

  return {
    id: encodeJobId(country, adzunaId),
    country,
    adzunaId,
    title: result.title,
    company: result.company?.display_name ?? "Company not listed",
    location,
    description: result.description ?? "",
    createdAt: result.created,
    redirectUrl: result.redirect_url ?? "",
    category: result.category?.label,
    contractType: result.contract_type,
    salary: mapSalary(result, country),
  };
}

async function adzunaFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  let body: AdzunaSearchResponse & T;
  try {
    body = (await response.json()) as AdzunaSearchResponse & T;
  } catch {
    throw new JobsServiceError(
      ApiErrorCode.SERVICE_UNAVAILABLE,
      "Job search provider returned an invalid response",
      503,
    );
  }

  if (body.exception === "AUTH_FAIL") {
    throw new JobsServiceError(
      ApiErrorCode.SERVICE_UNAVAILABLE,
      "Job search provider authentication failed. Check ADZUNA_APP_ID and ADZUNA_API_KEY.",
      503,
    );
  }

  if (!response.ok) {
    const message =
      typeof body.display === "string"
        ? body.display
        : "Job search provider is temporarily unavailable";
    throw new JobsServiceError(ApiErrorCode.SERVICE_UNAVAILABLE, message, 503);
  }

  return body as T;
}

export async function fetchAdzunaSearch(params: {
  country: JobCountry;
  page: number;
  resultsPerPage: number;
  what?: string;
  where?: string;
}): Promise<{ count: number; results: JobListing[] }> {
  const { appId, appKey } = getCredentials();
  const search = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: String(params.resultsPerPage),
  });
  if (params.what) search.set("what", params.what);
  if (params.where) search.set("where", params.where);

  const url = `${ADZUNA_BASE}/jobs/${params.country}/search/${params.page}?${search}`;
  const data = await adzunaFetch<AdzunaSearchResponse>(url);

  const results = (data.results ?? [])
    .map((row) => mapAdzunaResult(row, params.country))
    .filter((job): job is JobListing => job !== null);

  return {
    count: data.count ?? results.length,
    results,
  };
}

export async function fetchAdzunaJob(
  country: JobCountry,
  adzunaId: string,
): Promise<JobListing | null> {
  const { appId, appKey } = getCredentials();
  const search = new URLSearchParams({ app_id: appId, app_key: appKey });
  const url = `${ADZUNA_BASE}/jobs/${country}/${adzunaId}?${search}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (response.status === 404) return null;

  let body: AdzunaSearchResponse & AdzunaResult;
  try {
    body = (await response.json()) as AdzunaSearchResponse & AdzunaResult;
  } catch {
    throw new JobsServiceError(
      ApiErrorCode.SERVICE_UNAVAILABLE,
      "Job search provider returned an invalid response",
      503,
    );
  }

  if (body.exception === "AUTH_FAIL") {
    throw new JobsServiceError(
      ApiErrorCode.SERVICE_UNAVAILABLE,
      "Job search provider authentication failed. Check ADZUNA_APP_ID and ADZUNA_API_KEY.",
      503,
    );
  }

  if (!response.ok) {
    const message =
      typeof body.display === "string"
        ? body.display
        : "Job search provider is temporarily unavailable";
    throw new JobsServiceError(ApiErrorCode.SERVICE_UNAVAILABLE, message, 503);
  }

  return mapAdzunaResult(body, country);
}
