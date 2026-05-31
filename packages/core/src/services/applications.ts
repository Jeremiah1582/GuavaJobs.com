import type { Application, ApplicationStatus as PrismaApplicationStatus } from "../generated/prisma";
import { getDb } from "../db";
import {
  manualApplicationCreateSchema,
  type ManualApplicationCreateInput,
} from "../validators/applications";
import type { JobListing } from "./jobs/types";

export type ApplicationListItem = {
  id: string;
  title: string;
  company: string;
  status: PrismaApplicationStatus;
  updatedAt: Date;
};

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}

function buildManualSnapshot(input: ManualApplicationCreateInput): string | null {
  const parts: string[] = [];
  const jobUrl = input.jobUrl?.trim();
  const description = input.description?.trim();

  if (jobUrl) {
    parts.push(`Job URL: ${jobUrl}`);
  }
  if (description) {
    parts.push(description);
  }

  return parts.length > 0 ? parts.join("\n\n") : null;
}

export async function findByUserAndExternalId(
  userId: string,
  jobExternalId: string,
): Promise<Application | null> {
  const db = getDb();
  return db.application.findFirst({
    where: { userId, jobExternalId },
  });
}

export async function createFromJobListing(
  userId: string,
  job: JobListing,
): Promise<Application> {
  const existing = await findByUserAndExternalId(userId, job.id);
  if (existing) return existing;

  const db = getDb();
  const snapshot = job.description?.trim() || null;

  try {
    return await db.application.create({
      data: {
        userId,
        jobExternalId: job.id,
        title: job.title,
        company: job.company,
        jobDescriptionSnapshot: snapshot,
        status: "DRAFT",
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      const duplicate = await findByUserAndExternalId(userId, job.id);
      if (duplicate) return duplicate;
    }
    throw error;
  }
}

export async function createManual(
  userId: string,
  input: ManualApplicationCreateInput,
): Promise<Application> {
  const parsed = manualApplicationCreateSchema.parse(input);
  const db = getDb();

  return db.application.create({
    data: {
      userId,
      title: parsed.title,
      company: parsed.company,
      jobDescriptionSnapshot: buildManualSnapshot(parsed),
      status: "DRAFT",
    },
  });
}

export async function listByUser(userId: string): Promise<ApplicationListItem[]> {
  const db = getDb();
  return db.application.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      company: true,
      status: true,
      updatedAt: true,
    },
  });
}

export const applicationsService = {
  findByUserAndExternalId,
  createFromJobListing,
  createManual,
  listByUser,
};
