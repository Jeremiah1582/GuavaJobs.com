import { Suspense } from "react"
import { AlertTriangle, Search } from "lucide-react"
import { redirect } from "next/navigation"
import { jobsService, JobsServiceError, type JobListing } from "@guavajobs/core"

import { AdzunaAttribution } from "@/components/jobs/adzuna-attribution"
import { JobsBoard } from "@/components/jobs/jobs-board"
import { JobsSearchSection } from "@/components/jobs/jobs-search-section"
import { EmptyState } from "@/components/empty-state"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { getJobCoverLetterContext } from "@/lib/applications/cover-letter-context"
import { trackJobById } from "@/lib/applications/track-job"
import { trackedApplicationPath } from "@/lib/applications/tracked-path"
import { getSession } from "@/lib/auth/get-session"
import { getGeoLocation } from "@/lib/geo/server"
import {
  parseJobsSearchParams,
  toSearchParamRecord,
  type ParsedJobsSearchParams,
} from "@/lib/jobs/search-params"

type JobsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function buildDefaultBanner(search: ParsedJobsSearchParams): string | null {
  if (!search.isDefaultSearch) return null
  if (search.where) {
    return `Showing junior tech roles near ${search.where}. Refine your search above.`
  }
  return "Showing junior tech roles popular for career changers. Refine your search above."
}

async function JobsResults({ search }: { search: ParsedJobsSearchParams }) {
  const session = await getSession()

  try {
    const result = await jobsService.search({
      q: search.effectiveQ,
      where: search.where,
      country: search.country,
      page: search.page,
      resultsPerPage: 20,
      distanceKm: search.distanceKm,
      maxDaysOld: search.maxDaysOld,
      sortBy: search.sortBy ?? (search.maxDaysOld ? "date" : undefined),
    })

    if (result.jobs.length === 0) {
      return (
        <EmptyState
          icon={Search}
          title="No jobs found"
          description="Try different keywords, widen the distance, or switch between UK and Germany markets."
        />
      )
    }

    const detailJobId = search.job ?? result.jobs[0]?.id ?? null
    let selectedJob: JobListing | null = null
    let coverLetterContext = null
    if (detailJobId) {
      const fromList = result.jobs.find((j) => j.id === detailJobId) ?? null
      try {
        selectedJob = (await jobsService.getById(detailJobId)) ?? fromList
      } catch {
        selectedJob = fromList
      }
      if (selectedJob) {
        coverLetterContext = await getJobCoverLetterContext(
          session?.id ?? null,
          selectedJob.id,
        )
      }
    }

    return (
      <div className="flex min-h-0 flex-1 flex-col">
      <JobsBoard
        jobs={result.jobs}
        totalCount={result.totalCount}
        page={result.page}
        resultsPerPage={result.resultsPerPage}
        search={{ ...search, job: selectedJob?.id ?? search.job }}
        selectedJob={selectedJob}
        coverLetterContext={coverLetterContext}
        session={session}
        defaultSearchBanner={buildDefaultBanner(search)}
      />
      </div>
    )
  } catch (err) {
    const message =
      err instanceof JobsServiceError
        ? err.message
        : "We could not load jobs right now. Please try again shortly."

    return (
      <EmptyState
        icon={AlertTriangle}
        title="Job board unavailable"
        description={message}
        action={{ label: "Try again", href: "/jobs" }}
      />
    )
  }
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const raw = await searchParams
  const geo = await getGeoLocation()

  const track =
    typeof raw.track === "string"
      ? raw.track
      : Array.isArray(raw.track)
        ? raw.track[0]
        : undefined

  const searchKeys = Object.keys(raw).filter((k) => k !== "track")
  if (
    searchKeys.length === 0 &&
    geo?.city &&
    track !== "1"
  ) {
    const qs = new URLSearchParams({
      where: geo.city,
      country: geo.market,
    })
    redirect(`/jobs?${qs.toString()}`)
  }

  const search = parseJobsSearchParams(raw, geo)
  const session = await getSession()

  if (track === "1" && search.job && session) {
    const application = await trackJobById(search.job)
    redirect(trackedApplicationPath(application.id))
  }

  const suspenseKey = JSON.stringify(toSearchParamRecord(search))

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-6rem)] max-w-7xl flex-col px-4 py-6 md:px-6">
      <PageHeader
        title="Job board"
        description="Browse junior tech roles in the UK and Germany. No account required to search."
      />

      <JobsSearchSection search={search} />

      <div className="mt-6 flex min-h-0 flex-1 flex-col overflow-hidden">
        <Suspense
          key={suspenseKey}
          fallback={
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          }
        >
          <JobsResults search={search} />
        </Suspense>
      </div>

      <div className="mt-8 shrink-0 border-t border-border pt-6">
        <AdzunaAttribution />
      </div>
    </div>
  )
}
