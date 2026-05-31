import type { Prisma, Profile } from "../generated/prisma";
import { getDb } from "../db";
import {
  profileUpdateSchema,
  type ProfileUpdateInput,
} from "../validators/profile";

export type ProfileCompleteness = {
  percent: number;
  missing: string[];
};

export type ProfileDto = {
  userId: string;
  summary: string | null;
  experienceJson: unknown;
  skills: string[];
  educationJson: unknown;
  cvFileUrl: string | null;
  quizJson: unknown;
  createdAt: string;
  updatedAt: string;
  completeness: ProfileCompleteness;
};

const COMPLETENESS_SECTIONS = [
  { key: "summary", label: "Professional summary" },
  { key: "experience", label: "Work experience" },
  { key: "skills", label: "Skills" },
  { key: "education", label: "Education" },
  { key: "quiz", label: "Job preferences" },
] as const;

function hasExperience(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

function hasEducation(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

function hasQuiz(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const quiz = value as Record<string, unknown>;
  return Boolean(quiz.roleType || quiz.workMode || (Array.isArray(quiz.priorities) && quiz.priorities.length > 0));
}

export function computeCompleteness(profile: Profile): ProfileCompleteness {
  const checks: Record<string, boolean> = {
    summary: Boolean(profile.summary?.trim()),
    experience: hasExperience(profile.experienceJson),
    skills: profile.skills.length > 0,
    education: hasEducation(profile.educationJson),
    quiz: hasQuiz(profile.quizJson),
  };

  const filled = COMPLETENESS_SECTIONS.filter((s) => checks[s.key]).length;
  const percent = Math.round((filled / COMPLETENESS_SECTIONS.length) * 100);
  const missing = COMPLETENESS_SECTIONS.filter((s) => !checks[s.key]).map(
    (s) => s.label,
  );

  return { percent, missing };
}

function toDto(profile: Profile): ProfileDto {
  return {
    userId: profile.userId,
    summary: profile.summary,
    experienceJson: profile.experienceJson ?? [],
    skills: profile.skills,
    educationJson: profile.educationJson ?? [],
    cvFileUrl: profile.cvFileUrl,
    quizJson: profile.quizJson ?? {},
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
    completeness: computeCompleteness(profile),
  };
}

export async function getOrCreateForUser(userId: string): Promise<Profile> {
  const db = getDb();
  return db.profile.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

export async function getByUserId(userId: string): Promise<ProfileDto | null> {
  const db = getDb();
  const profile = await db.profile.findUnique({ where: { userId } });
  if (!profile) return null;
  return toDto(profile);
}

export async function update(
  userId: string,
  input: ProfileUpdateInput,
): Promise<ProfileDto> {
  const parsed = profileUpdateSchema.parse(input);
  await getOrCreateForUser(userId);

  const data: Prisma.ProfileUpdateInput = {};

  if (parsed.summary !== undefined) {
    data.summary = parsed.summary;
  }
  if (parsed.experienceJson !== undefined) {
    data.experienceJson = parsed.experienceJson;
  }
  if (parsed.skills !== undefined) {
    data.skills = parsed.skills;
  }
  if (parsed.educationJson !== undefined) {
    data.educationJson = parsed.educationJson;
  }
  if (parsed.quizJson !== undefined) {
    data.quizJson = parsed.quizJson;
  }
  if (parsed.cvFileUrl !== undefined) {
    data.cvFileUrl = parsed.cvFileUrl;
  }

  const db = getDb();
  const profile = await db.profile.update({
    where: { userId },
    data,
  });

  return toDto(profile);
}

export const profileService = {
  getOrCreateForUser,
  getByUserId,
  update,
  computeCompleteness,
};
