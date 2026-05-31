"use server"

import {
  profileService,
  profileUpdateSchema,
  usersService,
} from "@guavajobs/core"
import { revalidatePath } from "next/cache"

import { getSession } from "@/lib/auth/get-session"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env"

export type ProfileActionState = {
  error?: string
  success?: boolean
} | null

const CV_BUCKET = "cv-uploads"

export async function updateProfileAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  await usersService.ensureUser(session)

  try {
    const summaryRaw = formData.get("summary")
    const experienceRaw = formData.get("experienceJson")
    const educationRaw = formData.get("educationJson")
    const quizRaw = formData.get("quizJson")
    const skillsRaw = formData.get("skills")

    const input: Record<string, unknown> = {}

    if (summaryRaw !== null) {
      input.summary =
        String(summaryRaw).trim() === "" ? null : String(summaryRaw)
    }

    if (typeof experienceRaw === "string" && experienceRaw.length > 0) {
      input.experienceJson = JSON.parse(experienceRaw)
    }

    if (typeof educationRaw === "string" && educationRaw.length > 0) {
      input.educationJson = JSON.parse(educationRaw)
    }

    if (typeof quizRaw === "string" && quizRaw.length > 0) {
      input.quizJson = JSON.parse(quizRaw)
    }

    if (typeof skillsRaw === "string") {
      const skills = skillsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      input.skills = skills
    }

    const parsed = profileUpdateSchema.parse(input)
    await profileService.update(session.id, parsed)
    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save profile"
    return { error: message }
  }
}

export async function uploadCvAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  if (!isSupabaseBrowserConfigured()) {
    return { error: "Storage is not configured." }
  }

  const file = formData.get("cvFile")
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." }
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "File must be 5 MB or smaller." }
  }

  const allowed = [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]
  if (file.type && !allowed.includes(file.type)) {
    return { error: "Upload PDF, Word, or plain text files only." }
  }

  try {
    const supabase = await createServerSupabaseClient()
    const ext = file.name.split(".").pop() ?? "bin"
    const path = `${session.id}/${Date.now()}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())
    const { error: uploadError } = await supabase.storage
      .from(CV_BUCKET)
      .upload(path, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      })

    if (uploadError) {
      return {
        error:
          uploadError.message.includes("Bucket not found")
            ? "CV storage bucket is not set up in Supabase (cv-uploads)."
            : uploadError.message,
      }
    }

    await usersService.ensureUser(session)
    await profileService.update(session.id, { cvFileUrl: path })
    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload CV"
    return { error: message }
  }
}
