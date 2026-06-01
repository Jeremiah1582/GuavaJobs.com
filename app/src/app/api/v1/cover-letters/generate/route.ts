import {
  ApiErrorCode,
  CoverLettersServiceError,
  generateCoverLetterForBody,
  usersService,
} from "@guavajobs/core"

import { getSession } from "@/lib/auth/get-session"
import { handleServiceError } from "@/lib/api/handle-service-error"
import { jsonError, jsonSuccess } from "@/lib/api/response"
import { withErrorHandler } from "@/lib/api/with-error-handler"

export const POST = withErrorHandler(async (request) => {
  const session = await getSession()
  if (!session) {
    return jsonError(ApiErrorCode.UNAUTHORIZED, "Authentication required", 401)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError(ApiErrorCode.VALIDATION_ERROR, "Invalid JSON body", 400)
  }

  await usersService.ensureUser(session)

  try {
    const data = await generateCoverLetterForBody(session.id, body)
    return jsonSuccess(data, 201)
  } catch (err) {
    if (err && typeof err === "object" && "issues" in err) {
      const issues = (err as { issues: { message: string }[] }).issues
      return jsonError(
        ApiErrorCode.VALIDATION_ERROR,
        issues.map((e) => e.message).join("; "),
        400,
      )
    }
    if (err instanceof CoverLettersServiceError) {
      const handled = handleServiceError(err)
      if (handled) return handled
    }
    const handled = handleServiceError(err)
    if (handled) return handled
    throw err
  }
})
