import { ApplicationsServiceError, JobsServiceError } from "@guavajobs/core"

import { jsonError } from "./response"

export function handleServiceError(err: unknown): Response | null {
  if (err instanceof JobsServiceError) {
    return jsonError(err.code, err.message, err.status)
  }
  if (err instanceof ApplicationsServiceError) {
    return jsonError(err.code, err.message, err.status)
  }
  return null
}
