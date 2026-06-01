"use server"

import { redirect } from "next/navigation"
import {
  applicationsService,
  CoverLettersServiceError,
  coverLettersService,
  jobsService,
  usersService,
} from "@guavajobs/core"

import { getSession } from "@/lib/auth/get-session"
import {
  getJobCoverLetterContext,
  type JobCoverLetterContext,
} from "@/lib/applications/cover-letter-context"

export type { JobCoverLetterContext } from "@/lib/applications/cover-letter-context"

export async function getJobCoverLetterContextAction(
  jobId: string,
): Promise<JobCoverLetterContext | null> {
  const session = await getSession()
  if (!session) return null
  await usersService.ensureUser(session)
  return getJobCoverLetterContext(session.id, jobId)
}

export type GenerateCoverLetterActionResult =
  | { ok: true; applicationId: string }
  | { ok: false; message: string }

export async function generateCoverLetterFromJobAction(
  jobId: string,
  options?: { adaptExisting?: boolean; fresh?: boolean },
): Promise<GenerateCoverLetterActionResult> {
  const session = await getSession()
  if (!session) {
    redirect(`/sign-in?next=${encodeURIComponent(`/jobs?job=${jobId}`)}`)
  }

  await usersService.ensureUser(session)

  const job = await jobsService.getById(jobId)
  if (!job) {
    return { ok: false, message: "Job not found" }
  }

  try {
    const application = await applicationsService.createFromJobListing(session.id, job)
    const result = await coverLettersService.generateForApplication(
      session.id,
      application.id,
      options,
    )
    return { ok: true, applicationId: result.applicationId }
  } catch (err) {
    if (err instanceof CoverLettersServiceError) {
      return { ok: false, message: err.userMessage ?? err.message }
    }
    throw err
  }
}

export async function regenerateCoverLetterAction(
  applicationId: string,
): Promise<GenerateCoverLetterActionResult> {
  const session = await getSession()
  if (!session) {
    redirect(`/sign-in?next=${encodeURIComponent(`/applications/${applicationId}`)}`)
  }

  await usersService.ensureUser(session)

  try {
    const result = await coverLettersService.generateForApplication(session.id, applicationId, {
      adaptExisting: true,
    })
    return { ok: true, applicationId: result.applicationId }
  } catch (err) {
    if (err instanceof CoverLettersServiceError) {
      return { ok: false, message: err.userMessage ?? err.message }
    }
    throw err
  }
}
