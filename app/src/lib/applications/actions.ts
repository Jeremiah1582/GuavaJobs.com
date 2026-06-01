"use server"

import { revalidatePath } from "next/cache"
import {
  applicationsService,
  PIPELINE_STATUS_OPTIONS,
  savedJobSearchesService,
  usersService,
  type InterviewUpdateInput,
} from "@guavajobs/core"
import { getSession } from "@/lib/auth/get-session"

export type PipelineStatus = (typeof PIPELINE_STATUS_OPTIONS)[number]

async function requireUserId(): Promise<string> {
  const session = await getSession()
  if (!session) {
    throw new Error("Authentication required")
  }
  await usersService.ensureUser(session)
  return session.id
}

export async function getApplicationDetailAction(applicationId: string) {
  const userId = await requireUserId()
  return applicationsService.getByIdForUser(userId, applicationId)
}

export async function updateApplicationStatusAction(
  applicationId: string,
  status: (typeof PIPELINE_STATUS_OPTIONS)[number],
) {
  const userId = await requireUserId()
  await applicationsService.update(userId, applicationId, { status })
  revalidatePath("/dashboard")
  revalidatePath(`/applications/${applicationId}`)
}

export async function updateApplicationFieldsAction(
  applicationId: string,
  input: {
    status?: (typeof PIPELINE_STATUS_OPTIONS)[number]
    title?: string
    company?: string
    jobUrl?: string
    source?: string
    location?: string
    salaryText?: string
    nextStep?: string
    contactName?: string
    viaRecruiter?: boolean
    fitScore?: string
    industry?: string
    requirementsNotes?: string
    aboutNotes?: string
    language?: string
  },
) {
  const userId = await requireUserId()
  await applicationsService.update(userId, applicationId, input)
  revalidatePath("/dashboard")
  revalidatePath(`/applications/${applicationId}`)
}

export async function setInterviewDetailsAction(
  applicationId: string,
  input: InterviewUpdateInput,
) {
  const userId = await requireUserId()
  await applicationsService.setInterviewDetails(userId, applicationId, input)
  revalidatePath("/dashboard")
  revalidatePath(`/applications/${applicationId}`)
}

export async function advanceApplicationStageAction(applicationId: string) {
  const userId = await requireUserId()
  await applicationsService.advanceStage(userId, applicationId)
  revalidatePath("/dashboard")
  revalidatePath(`/applications/${applicationId}`)
}

export async function rejectApplicationAction(applicationId: string) {
  const userId = await requireUserId()
  await applicationsService.rejectApplication(userId, applicationId)
  revalidatePath("/dashboard")
  revalidatePath(`/applications/${applicationId}`)
}

export async function clearApplicationRejectionAction(applicationId: string) {
  const userId = await requireUserId()
  await applicationsService.clearRejection(userId, applicationId)
  revalidatePath("/dashboard")
  revalidatePath(`/applications/${applicationId}`)
}

export async function addApplicationNoteAction(applicationId: string, body: string) {
  const userId = await requireUserId()
  await applicationsService.createNote(userId, applicationId, { body })
  revalidatePath("/dashboard")
  revalidatePath(`/applications/${applicationId}`)
}

export async function updateApplicationNoteAction(
  applicationId: string,
  noteId: string,
  body: string,
) {
  const userId = await requireUserId()
  await applicationsService.updateNote(userId, applicationId, noteId, body)
  revalidatePath("/dashboard")
  revalidatePath(`/applications/${applicationId}`)
}

export async function deleteApplicationAction(applicationId: string) {
  const userId = await requireUserId()
  await applicationsService.remove(userId, applicationId)
  revalidatePath("/dashboard")
}

export async function saveJobSearchAction(input: {
  label: string
  q?: string
  where?: string
  country?: "gb" | "de"
  distanceKm?: number
  maxDaysOld?: number
  sortBy?: "date" | "relevance"
}) {
  const userId = await requireUserId()
  const saved = await savedJobSearchesService.create(userId, {
    ...input,
    country: input.country ?? "gb",
  })
  revalidatePath("/jobs")
  return saved
}

export async function deleteSavedSearchAction(id: string) {
  const userId = await requireUserId()
  await savedJobSearchesService.remove(userId, id)
  revalidatePath("/jobs")
}
