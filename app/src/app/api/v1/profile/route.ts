import { ApiErrorCode, profileService, usersService } from "@guavajobs/core"

import { getSession } from "@/lib/auth/get-session"
import { jsonError, jsonSuccess } from "@/lib/api/response"
import { withErrorHandler } from "@/lib/api/with-error-handler"

export const GET = withErrorHandler(async () => {
  const session = await getSession()
  if (!session) {
    return jsonError(ApiErrorCode.UNAUTHORIZED, "Authentication required", 401)
  }

  await usersService.ensureUser(session)
  let profile = await profileService.getByUserId(session.id)
  if (!profile) {
    await profileService.getOrCreateForUser(session.id)
    profile = await profileService.getByUserId(session.id)
  }

  return jsonSuccess(profile)
})

export const PATCH = withErrorHandler(async (request: Request) => {
  const session = await getSession()
  if (!session) {
    return jsonError(ApiErrorCode.UNAUTHORIZED, "Authentication required", 401)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError(
      ApiErrorCode.VALIDATION_ERROR,
      "Invalid JSON body",
      400,
    )
  }

  try {
    await usersService.ensureUser(session)
    const profile = await profileService.update(session.id, body as never)
    return jsonSuccess(profile)
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "issues" in error &&
      Array.isArray((error as { issues: unknown[] }).issues)
    ) {
      const issues = (error as { issues: { message: string }[] }).issues
      return jsonError(
        ApiErrorCode.VALIDATION_ERROR,
        issues.map((e) => e.message).join("; "),
        400,
      )
    }
    throw error
  }
})
