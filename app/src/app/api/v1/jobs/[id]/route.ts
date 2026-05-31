import { ApiErrorCode, jobsService } from "@guavajobs/core"

import { handleServiceError } from "@/lib/api/handle-service-error"
import { jsonError, jsonSuccess } from "@/lib/api/response"
import { withErrorHandler } from "@/lib/api/with-error-handler"

export const GET = withErrorHandler(async (_request, context) => {
  const { id } = await context.params

  try {
    const job = await jobsService.getById(id)
    if (!job) {
      return jsonError(ApiErrorCode.NOT_FOUND, "Job not found", 404)
    }
    return jsonSuccess(job)
  } catch (err) {
    const handled = handleServiceError(err)
    if (handled) return handled
    throw err
  }
})
