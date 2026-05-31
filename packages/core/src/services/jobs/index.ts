import { ApiErrorCode } from "../../api/errors";
import { jobSearchSchema } from "../../validators/jobs";
import {
  fetchAdzunaJob,
  fetchAdzunaSearch,
  parseJobId,
} from "./adzuna";
import { getCached, setCached, JOB_CACHE_TTL_MS } from "./cache";
import { JobsServiceError } from "./errors";
import type { JobListing, JobSearchInput, JobSearchResult } from "./types";

export type { JobCountry, JobListing, JobSalary, JobSearchInput, JobSearchResult } from "./types";
export { JobsServiceError } from "./errors";
export { encodeJobId, parseJobId } from "./adzuna";
export { JOB_CACHE_TTL_MS } from "./cache";

function cacheKey(prefix: string, payload: unknown): string {
  return `${prefix}:${JSON.stringify(payload)}`;
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

    const { q, where, country, page, resultsPerPage } = parsed.data;
    const key = cacheKey("search", { q, where, country, page, resultsPerPage });
    const cached = getCached<JobSearchResult>(key);
    if (cached) return cached;

    try {
      const { count, results } = await fetchAdzunaSearch({
        country,
        page,
        resultsPerPage,
        what: q,
        where,
      });

      const payload: JobSearchResult = {
        jobs: results,
        totalCount: count,
        page,
        resultsPerPage,
        country,
      };
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
};
