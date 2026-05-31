import {
  API_ERROR_STATUS,
  type ApiErrorCode,
  toErrorResponse,
  toSuccessResponse,
} from "@guavajobs/core"

export function jsonSuccess<T>(data: T, status = 200) {
  return Response.json(toSuccessResponse(data), { status })
}

export function jsonError(
  code: ApiErrorCode | string,
  message: string,
  status?: number,
  details?: unknown,
) {
  const resolvedStatus =
    status ??
    (typeof code === "string" && code in API_ERROR_STATUS
      ? API_ERROR_STATUS[code as ApiErrorCode]
      : 500)
  return Response.json(toErrorResponse(code, message, details), {
    status: resolvedStatus,
  })
}
