/** Adzuna-supported markets for V1. */
export type JobCountry = "gb" | "de";

export type JobSalary = {
  min?: number;
  max?: number;
  currency?: string;
  isPredicted?: boolean;
};

/** Normalised listing returned by jobsService (search + detail). */
export type JobListing = {
  id: string;
  country: JobCountry;
  adzunaId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  createdAt?: string;
  redirectUrl: string;
  category?: string;
  contractType?: string;
  salary?: JobSalary;
};

/** Raw search params (coerced by jobSearchSchema in jobsService.search). */
export type JobSearchInput = {
  q?: string;
  where?: string;
  country?: JobCountry;
  page?: number | string;
  resultsPerPage?: number | string;
};

export type JobSearchResult = {
  jobs: JobListing[];
  totalCount: number;
  page: number;
  resultsPerPage: number;
  country: JobCountry;
};
