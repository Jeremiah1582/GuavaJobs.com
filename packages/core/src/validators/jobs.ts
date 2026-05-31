import { z } from "zod";

export const jobCountrySchema = z.enum(["gb", "de"]);

export const jobSearchSchema = z.object({
  q: z.string().trim().max(200).optional(),
  where: z.string().trim().max(200).optional(),
  country: jobCountrySchema.default("gb"),
  page: z.coerce.number().int().min(1).max(50).default(1),
  resultsPerPage: z.coerce.number().int().min(1).max(50).default(20),
});

export const jobIdParamSchema = z
  .string()
  .regex(/^[a-z]{2}-\d+$/i, "Invalid job id (expected e.g. gb-1234567890)");
