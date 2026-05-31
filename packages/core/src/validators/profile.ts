import { z } from "zod";

export const experienceEntrySchema = z.object({
  role: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  startDate: z.string().min(1).max(50),
  endDate: z.string().max(50).optional(),
  bullets: z.array(z.string().max(2000)).max(30).default([]),
});

export const educationEntrySchema = z.object({
  institution: z.string().min(1).max(200),
  degree: z.string().max(200).optional(),
  startDate: z.string().max(50).optional(),
  endDate: z.string().max(50).optional(),
});

export const profileQuizSchema = z.object({
  roleType: z.string().max(100).optional(),
  workMode: z.enum(["remote", "hybrid", "onsite", "flexible"]).optional(),
  priorities: z.array(z.string().max(100)).max(10).optional(),
});

export const profileUpdateSchema = z
  .object({
    summary: z.string().max(5000).nullable().optional(),
    experienceJson: z.array(experienceEntrySchema).max(30).optional(),
    skills: z.array(z.string().min(1).max(100)).max(100).optional(),
    educationJson: z.array(educationEntrySchema).max(20).optional(),
    quizJson: profileQuizSchema.optional(),
    cvFileUrl: z.string().max(2000).nullable().optional(),
  })
  .strict();

export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type ProfileQuiz = z.infer<typeof profileQuizSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
