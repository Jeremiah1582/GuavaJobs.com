import { ApiErrorCode } from "@guavajobs/core"

import { jsonError } from "./response"

type RouteHandler = (
  request: Request,
  context: { params: Promise<Record<string, string>> },
) => Promise<Response> | Response

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      return await handler(request, context)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred"
      console.error("[api]", message, err)
      return jsonError(
        ApiErrorCode.INTERNAL_ERROR,
        "Internal server error",
        500,
      )
    }
  }
}
