export type JobCountry = "gb" | "de";
export type JobSortBy = "relevance" | "date";

export type JobsSearchParams = {
  q?: string;
  where?: string;
  country?: JobCountry;
  page?: number;
  job?: string;
  distanceKm?: number;
  maxDaysOld?: number;
  sortBy?: JobSortBy;
};

export function buildJobsSearchUrl(
  basePath: string,
  params: JobsSearchParams,
): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.where) search.set("where", params.where);
  if (params.country && params.country !== "gb") search.set("country", params.country);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  if (params.job) search.set("job", params.job);
  if (params.distanceKm != null) search.set("distanceKm", String(params.distanceKm));
  if (params.maxDaysOld != null) search.set("maxDaysOld", String(params.maxDaysOld));
  if (params.sortBy) search.set("sortBy", params.sortBy);
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Miles shown in UI → Adzuna distance in km. */
export const DISTANCE_MILES_OPTIONS = [
  { label: "Exact area", value: undefined as number | undefined },
  { label: "Within 10 miles", value: 16 },
  { label: "Within 20 miles", value: 32 },
  { label: "Within 40 miles", value: 64 },
  { label: "Within 60 miles", value: 97 },
] as const;

export const MAX_DAYS_OPTIONS = [
  { label: "Any time", value: undefined as number | undefined },
  { label: "Last 24 hours", value: 1 },
  { label: "Last 3 days", value: 3 },
  { label: "Last 7 days", value: 7 },
  { label: "Last 14 days", value: 14 },
  { label: "Last 30 days", value: 30 },
] as const;

export const SORT_OPTIONS = [
  { label: "Date posted", value: "date" as const },
  { label: "Relevance", value: "relevance" as const },
] as const;

/** Query keys used by job search forms (app + landing). */
export const JOB_SEARCH_QUERY_KEYS = ["q", "where", "country"] as const;

/** Prefill job search from profile quiz `roleType` when the user has not entered a query. */
export function quizRoleTypeForSearch(quizJson: unknown): string | undefined {
  if (!quizJson || typeof quizJson !== "object") return undefined;
  const roleType = (quizJson as { roleType?: unknown }).roleType;
  if (typeof roleType !== "string") return undefined;
  const trimmed = roleType.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
