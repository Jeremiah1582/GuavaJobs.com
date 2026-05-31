"use server"

import { redirect } from "next/navigation"
import { applicationsService, usersService } from "@guavajobs/core"

import { getSession } from "@/lib/auth/get-session"

export async function createManualApplicationAction(
  formData: FormData,
): Promise<void> {
  const session = await getSession()
  if (!session) {
    redirect("/sign-in?next=/applications/new")
  }

  await usersService.ensureUser(session)

  await applicationsService.createManual(session.id, {
    title: String(formData.get("title") ?? ""),
    company: String(formData.get("company") ?? ""),
    description: String(formData.get("description") ?? "") || undefined,
    jobUrl: String(formData.get("jobUrl") ?? "") || undefined,
  })

  redirect("/dashboard?tracked=1")
}
