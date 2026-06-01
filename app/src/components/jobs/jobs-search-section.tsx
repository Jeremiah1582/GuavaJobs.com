import { Suspense } from "react"
import { profileService, savedJobSearchesService } from "@guavajobs/core"

import { JobSearchToolbar } from "@/components/jobs/job-search-toolbar"
import { SavedSearchChips } from "@/components/jobs/saved-search-chips"
import { getSession } from "@/lib/auth/get-session"
import type { ParsedJobsSearchParams } from "@/lib/jobs/search-params"
import { quizRoleTypeForSearch } from "@shared/jobs/search-url"

type JobsSearchSectionProps = {
  search: ParsedJobsSearchParams
}

export async function JobsSearchSection({ search }: JobsSearchSectionProps) {
  const session = await getSession()
  const savedSearches = session
    ? await savedJobSearchesService.listByUser(session.id)
    : []

  let preferenceQ: string | undefined
  if (session) {
    const profile = await profileService.getByUserId(session.id)
    if (profile) {
      preferenceQ = quizRoleTypeForSearch(profile.quizJson)
    }
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      <JobSearchToolbar defaults={search} preferenceQ={preferenceQ} />
      <Suspense fallback={null}>
        <SavedSearchChips
          savedSearches={savedSearches}
          isSignedIn={Boolean(session)}
          currentSearch={search}
        />
      </Suspense>
    </div>
  )
}
