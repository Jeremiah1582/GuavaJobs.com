import { ApiErrorCode } from "../../api/errors";
import { jobSearchSchema } from "../../validators/jobs";
import {
  fetchAdzunaJob,
  fetchAdzunaSearch,
  parseJobId,
} from "./adzuna";
import { jobListingSchema } from "../../validators/jobs";
import { getCached, setCached, JOB_CACHE_TTL_MS } from "./cache";
import { JobsServiceError } from "./errors";
import type { JobListing, JobSearchInput, JobSearchResult } from "./types";

export type {
  JobCountry,
  JobListing,
  JobSalary,
  JobSearchInput,
  JobSearchResult,
  JobSortBy,
} from "./types";
export { JobsServiceError } from "./errors";
export { encodeJobId, parseJobId } from "./adzuna";
export { JOB_CACHE_TTL_MS } from "./cache";
export { JUNIOR_DEFAULT_WHAT } from "./constants";

function cacheKey(prefix: string, payload: unknown): string {
  return `${prefix}:${JSON.stringify(payload)}`;
}

function cacheJobListing(job: JobListing): void {
  const parsed = parseJobId(job.id);
  if (!parsed) return;
  setCached(cacheKey("job", parsed), job, JOB_CACHE_TTL_MS);
}

function cacheJobListings(jobs: JobListing[]): void {
  for (const job of jobs) {
    cacheJobListing(job);
  }
}

export const jobsService = {
  async search(raw: JobSearchInput): Promise<JobSearchResult> {
    const parsed = jobSearchSchema.safeParse(raw);
    if (!parsed.success) {
      throw new JobsServiceError(
        ApiErrorCode.VALIDATION_ERROR,
        parsed.error.errors[0]?.message ?? "Invalid search parameters",
        400,
      );
    }

    const { q, where, country, page, resultsPerPage, distanceKm, maxDaysOld, sortBy } =
      parsed.data;
    const key = cacheKey("search", {
      q,
      where,
      country,
      page,
      resultsPerPage,
      distanceKm,
      maxDaysOld,
      sortBy,
    });
    const cached = getCached<JobSearchResult>(key);
    if (cached) {
      cacheJobListings(cached.jobs);
      return cached;
    }

    try {
      const { count, results } = await fetchAdzunaSearch({
        country,
        page,
        resultsPerPage,
        what: q,
        where,
        distanceKm,
        maxDaysOld,
        sortBy,
      });

      const payload: JobSearchResult = {
        jobs: results,
        totalCount: count,
        page,
        resultsPerPage,
        country,
      };
      cacheJobListings(results);
      setCached(key, payload, JOB_CACHE_TTL_MS);
      return payload;
    } catch (err) {
      if (err instanceof JobsServiceError) throw err;
      throw new JobsServiceError(
        ApiErrorCode.SERVICE_UNAVAILABLE,
        "Unable to fetch job listings right now",
        503,
      );
    }
  },

  async getById(id: string): Promise<JobListing | null> {
    const parsed = parseJobId(id);
    if (!parsed) {
      throw new JobsServiceError(
        ApiErrorCode.VALIDATION_ERROR,
        "Invalid job id format (expected e.g. gb-1234567890)",
        400,
      );
    }

    const key = cacheKey("job", parsed);
    const cached = getCached<JobListing>(key);
    if (cached) return cached;

    try {
      const job = await fetchAdzunaJob(parsed.country, parsed.adzunaId);
      if (job) setCached(key, job, JOB_CACHE_TTL_MS);
      if (job) cacheJobListing(job);
      return job;
    } catch (err) {
      if (err instanceof JobsServiceError) throw err;
      throw new JobsServiceError(
        ApiErrorCode.SERVICE_UNAVAILABLE,
        "Unable to fetch this job right now",
        503,
      );
    }
  },

  /**
   * Resolve a listing for applications / cover letters.
   * Uses detail API, in-memory search cache, then an optional client snapshot.
   */
  async resolveListing(
    id: string,
    snapshot?: unknown,
  ): Promise<JobListing | null> {
    const fromApi = await this.getById(id);
    if (fromApi) return fromApi;

    if (snapshot !== undefined) {
      const parsed = jobListingSchema.safeParse(snapshot);
      if (parsed.success && parsed.data.id === id) {
        cacheJobListing(parsed.data);
        return parsed.data;
      }
    }

    return null;
  },
};
