import { jobsService } from "@guavajobs/core"

import { handleServiceError } from "@/lib/api/handle-service-error"
import { jsonSuccess } from "@/lib/api/response"
import { withErrorHandler } from "@/lib/api/with-error-handler"

export const GET = withErrorHandler(async (request) => {
  const { searchParams } = new URL(request.url)

  try {
    const data = await jobsService.search({
      q: searchParams.get("q") ?? undefined,
      where: searchParams.get("where") ?? undefined,
      country: (searchParams.get("country") as "gb" | "de" | null) ?? undefined,
      page: searchParams.get("page") ?? undefined,
      resultsPerPage: searchParams.get("resultsPerPage") ?? undefined,
      distanceKm: searchParams.get("distanceKm") ?? undefined,
      maxDaysOld: searchParams.get("maxDaysOld") ?? undefined,
      sortBy: (searchParams.get("sortBy") as "relevance" | "date" | null) ?? undefined,
    })
    return jsonSuccess(data)
  } catch (err) {
    const handled = handleServiceError(err)
    if (handled) return handled
    throw err
  }
})
