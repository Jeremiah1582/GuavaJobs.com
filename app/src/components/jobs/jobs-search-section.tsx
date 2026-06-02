import { Suspense } from "react"
import { profileService, savedJobSearchesService } from "@guavajobs/core"

import {
  JobsSearchSectionShell,
  PreferenceQLoader,
} from "@/components/jobs/jobs-search-section-shell"
import { SavedSearchChips } from "@/components/jobs/saved-search-chips"
import { getSession } from "@/lib/auth/get-session"
import type { ParsedJobsSearchParams } from "@/lib/jobs/search-params"
import { quizRoleTypeForSearch } from "@shared/jobs/search-url"

type JobsSearchSectionProps = {
  search: ParsedJobsSearchParams
}

async function JobsSearchUserData({ search }: JobsSearchSectionProps) {
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
    <>
      <PreferenceQLoader preferenceQ={preferenceQ} />
      <SavedSearchChips
        savedSearches={savedSearches}
        isSignedIn={Boolean(session)}
        currentSearch={search}
      />
    </>
  )
}

export function JobsSearchSection({ search }: JobsSearchSectionProps) {
  return (
    <JobsSearchSectionShell search={search}>
      <Suspense fallback={null}>
        <JobsSearchUserData search={search} />
      </Suspense>
    </JobsSearchSectionShell>
  )
}
