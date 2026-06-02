import { z } from "zod";

export const jobCountrySchema = z.enum(["gb", "de"]);

export const jobSortSchema = z.enum(["relevance", "date"]);

export const jobSearchSchema = z.object({
  q: z.string().trim().max(200).optional(),
  where: z.string().trim().max(200).optional(),
  country: jobCountrySchema.default("gb"),
  page: z.coerce.number().int().min(1).max(50).default(1),
  resultsPerPage: z.coerce.number().int().min(1).max(50).default(20),
  distanceKm: z.coerce.number().int().min(1).max(200).optional(),
  maxDaysOld: z.coerce.number().int().min(1).max(90).optional(),
  sortBy: jobSortSchema.optional(),
});

export const jobIdParamSchema = z
  .string()
  .regex(/^[a-z]{2}-\d+$/i, "Invalid job id (expected e.g. gb-1234567890)");

export const jobSalarySchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  currency: z.string().optional(),
  isPredicted: z.boolean().optional(),
});

/** Listing payload from search results — used when Adzuna detail API returns 404. */
export const jobListingSchema = z.object({
  id: jobIdParamSchema,
  country: jobCountrySchema,
  adzunaId: z.string().min(1),
  title: z.string().min(1).max(500),
  company: z.string().max(300),
  location: z.string().max(500),
  description: z.string().max(100_000),
  createdAt: z.string().max(50).optional(),
  redirectUrl: z.string().max(4000),
  category: z.string().max(200).optional(),
  contractType: z.string().max(100).optional(),
  salary: jobSalarySchema.optional(),
});
