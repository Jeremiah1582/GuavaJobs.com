import type { CoverLetter, CoverLetterSource, Prisma } from "../generated/prisma";
import { ApiErrorCode } from "../api/errors";
import { getDb } from "../db";
import {
  coverLetterContentSchema,
  coverLetterUpdateSchema,
  type CoverLetterContentInput,
} from "../validators/cover-letters";
import { CoverLettersServiceError } from "./cover-letters/errors";

export type CoverLetterCitation = {
  field: string;
  excerpt: string;
};

export type CoverLetterDto = {
  id: string;
  applicationId: string;
  content: string;
  source: CoverLetterSource;
  citations: CoverLetterCitation[];
  createdAt: Date;
  updatedAt: Date;
};

export type GenerateCoverLetterResult = {
  applicationId: string;
  letter: CoverLetterDto;
  citations: CoverLetterCitation[];
};

export type GenerateCoverLetterOptions = {
  adaptExisting?: boolean;
  fresh?: boolean;
};

function parseCitations(value: unknown): CoverLetterCitation[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const field = typeof row.field === "string" ? row.field.trim() : "";
      const excerpt = typeof row.excerpt === "string" ? row.excerpt.trim() : "";
      if (!field || !excerpt) return null;
      return { field, excerpt };
    })
    .filter((item): item is CoverLetterCitation => item !== null);
}

function mapLetter(letter: CoverLetter): CoverLetterDto {
  return {
    id: letter.id,
    applicationId: letter.applicationId,
    content: letter.content,
    source: letter.source,
    citations: parseCitations(letter.citationsJson),
    createdAt: letter.createdAt,
    updatedAt: letter.updatedAt,
  };
}

export function coverLetterPreviewText(content: string): string {
  const flat = content.replace(/\s+/g, " ").trim();
  if (!flat) return "";
  return flat.length > 120 ? `${flat.slice(0, 120)}…` : flat;
}

/** @deprecated alias — prefer `coverLetterPreviewText` */
export const previewCoverLetterContent = coverLetterPreviewText;

export type LetterPayload = {
  letter: CoverLetterDto | null;
};

/** @deprecated F8 shape — `manual` mirrors `letter` */
export type ManualCoverLetterPayload = {
  manual: CoverLetterDto | null;
};

export async function getLetterPayload(
  userId: string,
  applicationId: string,
): Promise<LetterPayload> {
  const letter = await getLetterForApplication(userId, applicationId);
  return { letter };
}

export async function getManualPayload(
  userId: string,
  applicationId: string,
): Promise<ManualCoverLetterPayload> {
  const letter = await getLetterForApplication(userId, applicationId);
  return { manual: letter };
}

async function assertApplicationOwned(
  userId: string,
  applicationId: string,
): Promise<void> {
  const db = getDb();
  const application = await db.application.findFirst({
    where: { id: applicationId, userId },
    select: { id: true },
  });
  if (!application) {
    throw new CoverLettersServiceError(
      ApiErrorCode.NOT_FOUND,
      "Application not found",
      404,
    );
  }
}

export async function listForApplication(
  userId: string,
  applicationId: string,
): Promise<CoverLetterDto[]> {
  await assertApplicationOwned(userId, applicationId);
  const db = getDb();
  const letter = await db.coverLetter.findUnique({
    where: { applicationId },
  });
  return letter ? [mapLetter(letter)] : [];
}

export async function getLetterForApplication(
  userId: string,
  applicationId: string,
): Promise<CoverLetterDto | null> {
  await assertApplicationOwned(userId, applicationId);
  const db = getDb();
  const letter = await db.coverLetter.findUnique({
    where: { applicationId },
  });
  return letter ? mapLetter(letter) : null;
}

/** @deprecated use `getLetterForApplication` */
export const getManualForApplication = getLetterForApplication;

export async function upsertLetter(
  userId: string,
  applicationId: string,
  input: CoverLetterContentInput,
  options?: { source?: CoverLetterSource; citations?: CoverLetterCitation[] },
): Promise<CoverLetterDto> {
  const parsed = coverLetterContentSchema.parse(input);
  await assertApplicationOwned(userId, applicationId);

  const db = getDb();
  const existing = await db.coverLetter.findUnique({
    where: { applicationId },
  });

  const citationsJson =
    options?.citations !== undefined
      ? (options.citations as Prisma.InputJsonValue)
      : undefined;

  if (existing) {
    const updated = await db.coverLetter.update({
      where: { id: existing.id },
      data: {
        content: parsed.content,
        ...(options?.source ? { source: options.source } : {}),
        ...(citationsJson !== undefined ? { citationsJson } : {}),
      },
    });
    return mapLetter(updated);
  }

  const created = await db.coverLetter.create({
    data: {
      applicationId,
      content: parsed.content,
      source: options?.source ?? "MANUAL",
      citationsJson: citationsJson ?? undefined,
    },
  });
  return mapLetter(created);
}

/** @deprecated use `upsertLetter` */
export const upsertManual = upsertLetter;

export async function updateLetter(
  userId: string,
  applicationId: string,
  letterId: string,
  input: CoverLetterContentInput,
): Promise<CoverLetterDto> {
  const parsed = coverLetterUpdateSchema.parse(input);
  await assertApplicationOwned(userId, applicationId);

  const db = getDb();
  const letter = await db.coverLetter.findFirst({
    where: { id: letterId, applicationId },
  });

  if (!letter) {
    throw new CoverLettersServiceError(
      ApiErrorCode.NOT_FOUND,
      "Cover letter not found",
      404,
    );
  }

  const updated = await db.coverLetter.update({
    where: { id: letterId },
    data: { content: parsed.content },
  });
  return mapLetter(updated);
}

/** @deprecated use `updateLetter` */
export const updateManual = updateLetter;

export {
  generateForApplication,
} from "./cover-letters/generate";
export {
  generateCoverLetterForBody,
  resolveApplicationIdForGenerate,
} from "./cover-letters/generate-route";

export { CoverLettersServiceError } from "./cover-letters/errors";

export const coverLettersService = {
  listForApplication,
  getLetterForApplication,
  getLetterPayload,
  getManualForApplication,
  getManualPayload,
  upsertLetter,
  upsertManual,
  updateLetter,
  updateManual,
  generateForApplication: async (
    ...args: Parameters<typeof import("./cover-letters/generate").generateForApplication>
  ) => {
    const { generateForApplication } = await import("./cover-letters/generate");
    return generateForApplication(...args);
  },
  generateCoverLetterForBody: async (
    ...args: Parameters<typeof import("./cover-letters/generate-route").generateCoverLetterForBody>
  ) => {
    const { generateCoverLetterForBody } = await import("./cover-letters/generate-route");
    return generateCoverLetterForBody(...args);
  },
  generate: async (
    ...args: Parameters<typeof import("./cover-letters/generate").generateForApplication>
  ) => {
    const { generateForApplication } = await import("./cover-letters/generate");
    return generateForApplication(...args);
  },
};
