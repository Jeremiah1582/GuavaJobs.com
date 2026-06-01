import type {
  Application,
  ApplicationNote,
  ApplicationRejectionPhase,
  ApplicationStatus as PrismaApplicationStatus,
} from "../generated/prisma";
import { nextPipelineStatus } from "../applications/constants";
import { ApiErrorCode } from "../api/errors";
import { getDb } from "../db";
import {
  applicationNoteSchema,
  applicationNoteUpdateSchema,
  applicationUpdateSchema,
  interviewUpdateSchema,
  manualApplicationCreateSchema,
  type ApplicationNoteInput,
  type ApplicationUpdateInput,
  type InterviewUpdateInput,
  type ManualApplicationCreateInput,
} from "../validators/applications";
import { ApplicationsServiceError } from "./applications/errors";
import type { JobListing } from "./jobs/types";

export type ApplicationListItem = {
  id: string;
  title: string;
  company: string;
  status: PrismaApplicationStatus;
  rejectionPhase: ApplicationRejectionPhase | null;
  location: string | null;
  source: string | null;
  jobUrl: string | null;
  appliedAt: Date | null;
  updatedAt: Date;
  jobExternalId: string | null;
  createdAt: Date;
  noteCount: number;
  interviewRound: number | null;
  viaRecruiter: boolean;
};

export type ApplicationNoteDto = {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ApplicationDetail = {
  id: string;
  title: string;
  company: string;
  status: PrismaApplicationStatus;
  rejectionPhase: ApplicationRejectionPhase | null;
  rejectedAt: Date | null;
  jobExternalId: string | null;
  jobUrl: string | null;
  source: string | null;
  location: string | null;
  salaryText: string | null;
  nextStep: string | null;
  contactName: string | null;
  viaRecruiter: boolean;
  fitScore: string | null;
  industry: string | null;
  requirementsNotes: string | null;
  aboutNotes: string | null;
  language: string | null;
  roleStartDate: Date | null;
  interviewRound: number | null;
  interviewScheduledAt: Date | null;
  interviewLocation: string | null;
  interviewUrl: string | null;
  jobDescriptionSnapshot: string | null;
  appliedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  notes: ApplicationNoteDto[];
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
  const description = input.description?.trim();
  return description || null;
}

function mapNote(note: ApplicationNote): ApplicationNoteDto {
  return {
    id: note.id,
    body: note.body,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}

function mapDetail(application: Application & { timelineNotes: ApplicationNote[] }): ApplicationDetail {
  return {
    id: application.id,
    title: application.title,
    company: application.company,
    status: application.status,
    rejectionPhase: application.rejectionPhase,
    rejectedAt: application.rejectedAt,
    jobExternalId: application.jobExternalId,
    jobUrl: application.jobUrl,
    source: application.source,
    location: application.location,
    salaryText: application.salaryText,
    nextStep: application.nextStep,
    contactName: application.contactName,
    viaRecruiter: application.viaRecruiter,
    fitScore: application.fitScore,
    industry: application.industry,
    requirementsNotes: application.requirementsNotes,
    aboutNotes: application.aboutNotes,
    language: application.language,
    roleStartDate: application.roleStartDate,
    interviewRound: application.interviewRound,
    interviewScheduledAt: application.interviewScheduledAt,
    interviewLocation: application.interviewLocation,
    interviewUrl: application.interviewUrl,
    jobDescriptionSnapshot: application.jobDescriptionSnapshot,
    appliedAt: application.appliedAt,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
    notes: application.timelineNotes.map(mapNote),
  };
}

async function assertOwned(
  userId: string,
  applicationId: string,
): Promise<Application> {
  const db = getDb();
  const application = await db.application.findFirst({
    where: { id: applicationId, userId },
  });
  if (!application) {
    throw new ApplicationsServiceError(
      ApiErrorCode.NOT_FOUND,
      "Application not found",
      404,
    );
  }
  return application;
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
        location: job.location || null,
        jobUrl: job.redirectUrl || null,
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
      jobUrl: parsed.jobUrl?.trim() || null,
      source: parsed.source?.trim() || null,
      location: parsed.location?.trim() || null,
      appliedAt: parsed.appliedAt ?? null,
      jobDescriptionSnapshot: buildManualSnapshot(parsed),
      status: parsed.appliedAt ? "APPLIED" : "DRAFT",
    },
  });
}

export async function listByUser(userId: string): Promise<ApplicationListItem[]> {
  const db = getDb();
  const rows = await db.application.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      company: true,
      status: true,
      rejectionPhase: true,
      location: true,
      source: true,
      jobUrl: true,
      appliedAt: true,
      interviewRound: true,
      viaRecruiter: true,
      updatedAt: true,
      jobExternalId: true,
      createdAt: true,
      _count: { select: { timelineNotes: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    company: row.company,
    status: row.status,
    rejectionPhase: row.rejectionPhase,
    location: row.location,
    source: row.source,
    jobUrl: row.jobUrl,
    appliedAt: row.appliedAt,
    interviewRound: row.interviewRound,
    viaRecruiter: row.viaRecruiter,
    updatedAt: row.updatedAt,
    jobExternalId: row.jobExternalId,
    createdAt: row.createdAt,
    noteCount: row._count.timelineNotes,
  }));
}

export async function getByIdForUser(
  userId: string,
  applicationId: string,
): Promise<ApplicationDetail> {
  const db = getDb();
  const application = await db.application.findFirst({
    where: { id: applicationId, userId },
    include: {
      timelineNotes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!application) {
    throw new ApplicationsServiceError(
      ApiErrorCode.NOT_FOUND,
      "Application not found",
      404,
    );
  }

  return mapDetail(application);
}

export async function update(
  userId: string,
  applicationId: string,
  input: ApplicationUpdateInput,
): Promise<ApplicationDetail> {
  const parsed = applicationUpdateSchema.parse(input);
  const existing = await assertOwned(userId, applicationId);

  const db = getDb();
  const data: Record<string, unknown> = {};

  if (parsed.clearRejection) {
    data.rejectionPhase = null;
    data.rejectedAt = null;
  }
  if (parsed.status) {
    data.status = parsed.status;
    if (parsed.status === "APPLIED" && !existing.appliedAt) {
      data.appliedAt = new Date();
    }
    if (parsed.status === "INTERVIEW" && !existing.interviewRound) {
      data.interviewRound = 1;
    }
    if (parsed.status !== "INTERVIEW") {
      // keep interview fields when moving away unless explicitly cleared
    }
  }
  if (parsed.title) data.title = parsed.title;
  if (parsed.company) data.company = parsed.company;
  if (parsed.jobUrl !== undefined) data.jobUrl = parsed.jobUrl?.trim() || null;
  if (parsed.source !== undefined) data.source = parsed.source?.trim() || null;
  if (parsed.location !== undefined) data.location = parsed.location?.trim() || null;
  if (parsed.salaryText !== undefined) data.salaryText = parsed.salaryText?.trim() || null;
  if (parsed.nextStep !== undefined) data.nextStep = parsed.nextStep?.trim() || null;
  if (parsed.contactName !== undefined) data.contactName = parsed.contactName?.trim() || null;
  if (parsed.viaRecruiter !== undefined) data.viaRecruiter = parsed.viaRecruiter;
  if (parsed.fitScore !== undefined) data.fitScore = parsed.fitScore?.trim() || null;
  if (parsed.industry !== undefined) data.industry = parsed.industry?.trim() || null;
  if (parsed.requirementsNotes !== undefined) {
    data.requirementsNotes = parsed.requirementsNotes?.trim() || null;
  }
  if (parsed.aboutNotes !== undefined) data.aboutNotes = parsed.aboutNotes?.trim() || null;
  if (parsed.language !== undefined) data.language = parsed.language?.trim() || null;
  if (parsed.roleStartDate !== undefined) data.roleStartDate = parsed.roleStartDate ?? null;
  if (parsed.appliedAt !== undefined) data.appliedAt = parsed.appliedAt ?? null;
  if (parsed.interviewRound !== undefined) data.interviewRound = parsed.interviewRound;
  if (parsed.interviewScheduledAt !== undefined) {
    data.interviewScheduledAt = parsed.interviewScheduledAt ?? null;
  }
  if (parsed.interviewLocation !== undefined) {
    data.interviewLocation = parsed.interviewLocation?.trim() || null;
  }
  if (parsed.interviewUrl !== undefined) data.interviewUrl = parsed.interviewUrl?.trim() || null;

  await db.application.update({
    where: { id: applicationId },
    data,
  });

  return getByIdForUser(userId, applicationId);
}

export async function advanceStage(
  userId: string,
  applicationId: string,
): Promise<ApplicationDetail> {
  const existing = await assertOwned(userId, applicationId);
  const db = getDb();

  if (existing.rejectionPhase) {
    throw new ApplicationsServiceError(
      ApiErrorCode.VALIDATION_ERROR,
      "Clear rejection before advancing",
      400,
    );
  }

  if (existing.status === "INTERVIEW") {
    await db.application.update({
      where: { id: applicationId },
      data: { interviewRound: (existing.interviewRound ?? 0) + 1 },
    });
    return getByIdForUser(userId, applicationId);
  }

  const next = nextPipelineStatus(existing.status);
  if (!next) {
    return getByIdForUser(userId, applicationId);
  }

  const data: Record<string, unknown> = {
    status: next,
    rejectionPhase: null,
    rejectedAt: null,
  };
  if (next === "APPLIED" && !existing.appliedAt) {
    data.appliedAt = new Date();
  }
  if (next === "INTERVIEW") {
    data.interviewRound = existing.interviewRound ?? 1;
  }

  await db.application.update({ where: { id: applicationId }, data });
  return getByIdForUser(userId, applicationId);
}

export async function markRejected(
  userId: string,
  applicationId: string,
  phase?: ApplicationRejectionPhase,
): Promise<ApplicationDetail> {
  const existing = await assertOwned(userId, applicationId);
  const db = getDb();

  const resolved: ApplicationRejectionPhase =
    phase ??
    (existing.status === "INTERVIEW" || (existing.interviewRound ?? 0) >= 1
      ? "POST_INTERVIEW"
      : "PRE_INTERVIEW");

  await db.application.update({
    where: { id: applicationId },
    data: {
      rejectionPhase: resolved,
      rejectedAt: new Date(),
    },
  });

  return getByIdForUser(userId, applicationId);
}

export async function clearRejection(
  userId: string,
  applicationId: string,
): Promise<ApplicationDetail> {
  await assertOwned(userId, applicationId);
  const db = getDb();
  await db.application.update({
    where: { id: applicationId },
    data: { rejectionPhase: null, rejectedAt: null },
  });
  return getByIdForUser(userId, applicationId);
}

/** @deprecated Use markRejected */
export const rejectApplication = markRejected;

export async function setInterviewDetails(
  userId: string,
  applicationId: string,
  input: InterviewUpdateInput,
): Promise<ApplicationDetail> {
  const parsed = interviewUpdateSchema.parse(input);
  await assertOwned(userId, applicationId);
  const db = getDb();

  await db.application.update({
    where: { id: applicationId },
    data: {
      status: "INTERVIEW",
      interviewRound: parsed.interviewRound,
      interviewScheduledAt: parsed.interviewScheduledAt ?? null,
      interviewLocation: parsed.interviewLocation?.trim() || null,
      interviewUrl: parsed.interviewUrl?.trim() || null,
      rejectionPhase: null,
      rejectedAt: null,
    },
  });

  return getByIdForUser(userId, applicationId);
}

export async function remove(userId: string, applicationId: string): Promise<void> {
  await assertOwned(userId, applicationId);
  const db = getDb();
  await db.application.delete({ where: { id: applicationId } });
}

export async function listNotes(
  userId: string,
  applicationId: string,
): Promise<ApplicationNoteDto[]> {
  await assertOwned(userId, applicationId);
  const db = getDb();
  const notes = await db.applicationNote.findMany({
    where: { applicationId },
    orderBy: { createdAt: "desc" },
  });
  return notes.map(mapNote);
}

export async function createNote(
  userId: string,
  applicationId: string,
  input: ApplicationNoteInput,
): Promise<ApplicationNoteDto> {
  const parsed = applicationNoteSchema.parse(input);
  await assertOwned(userId, applicationId);

  const db = getDb();
  const note = await db.applicationNote.create({
    data: {
      applicationId,
      body: parsed.body,
    },
  });
  return mapNote(note);
}

export async function updateNote(
  userId: string,
  applicationId: string,
  noteId: string,
  body: string,
): Promise<ApplicationNoteDto> {
  const parsed = applicationNoteUpdateSchema.parse({ body });
  await assertOwned(userId, applicationId);

  const db = getDb();
  const note = await db.applicationNote.findFirst({
    where: { id: noteId, applicationId },
  });
  if (!note) {
    throw new ApplicationsServiceError(
      ApiErrorCode.NOT_FOUND,
      "Note not found",
      404,
    );
  }

  const updated = await db.applicationNote.update({
    where: { id: noteId },
    data: { body: parsed.body },
  });
  return mapNote(updated);
}

export async function deleteNote(
  userId: string,
  applicationId: string,
  noteId: string,
): Promise<void> {
  await assertOwned(userId, applicationId);
  const db = getDb();
  const note = await db.applicationNote.findFirst({
    where: { id: noteId, applicationId },
  });
  if (!note) {
    throw new ApplicationsServiceError(
      ApiErrorCode.NOT_FOUND,
      "Note not found",
      404,
    );
  }
  await db.applicationNote.delete({ where: { id: noteId } });
}

export { ApplicationsServiceError } from "./applications/errors";

export const applicationsService = {
  findByUserAndExternalId,
  createFromJobListing,
  createManual,
  listByUser,
  getByIdForUser,
  update,
  advanceStage,
  markRejected,
  clearRejection,
  rejectApplication,
  setInterviewDetails,
  remove,
  listNotes,
  createNote,
  updateNote,
  deleteNote,
};
