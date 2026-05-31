import { z } from "zod";

export const manualApplicationCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  company: z.string().trim().min(1, "Company is required").max(200),
  description: z.string().trim().max(50_000).optional(),
  jobUrl: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .refine(
      (value) => !value || value === "" || z.string().url().safeParse(value).success,
      "Enter a valid job URL",
    ),
});

export type ManualApplicationCreateInput = z.infer<
  typeof manualApplicationCreateSchema
>;
