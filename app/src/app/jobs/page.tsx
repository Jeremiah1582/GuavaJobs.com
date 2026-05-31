import { Suspense } from "react"
import { AlertTriangle, Search } from "lucide-react"
import { jobsService, JobsServiceError } from "@guavajobs/core"

import { AdzunaAttribution } from "@/components/jobs/adzuna-attribution"
import { JobCard } from "@/components/jobs/job-card"
import { JobSearchForm } from "@/components/jobs/job-search-form"
import { JobsPagination } from "@/components/jobs/jobs-pagination"
import { EmptyState } from "@/components/empty-state"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"

type JobsPageProps = {
  searchParams: Promise<{
    q?: string
    where?: string
    country?: string
    page?: string
  }>
}

function SearchFormFallback() {
  return <Skeleton className="h-36 w-full rounded-xl" />
}

async function JobsResults({
  q,
  where,
  country,
  page,
}: {
  q?: string
  where?: string
  country?: string
  page?: string
}) {
  const resolvedCountry = country === "de" ? "de" : "gb"
  const resolvedPage = page ? Number(page) : 1

  try {
    const result = await jobsService.search({
      q,
      where,
      country: resolvedCountry,
      page: Number.isFinite(resolvedPage) ? resolvedPage : 1,
      resultsPerPage: 20,
    })

    if (result.jobs.length === 0) {
      return (
        <EmptyState
          icon={Search}
          title="No jobs found"
          description="Try different keywords, another city, or switch between UK and Germany markets."
        />
      )
    }

    return (
      <div className="space-y-6">
        <ul className="space-y-4">
          {result.jobs.map((job) => (
            <li key={job.id}>
              <JobCard job={job} />
            </li>
          ))}
        </ul>
        <JobsPagination
          page={result.page}
          totalCount={result.totalCount}
          resultsPerPage={result.resultsPerPage}
          searchParams={{ q, where, country: resolvedCountry }}
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
  const params = await searchParams
  const q = params.q?.trim()
  const where = params.where?.trim()
  const country = params.country === "de" ? "de" : "gb"
  const page = params.page

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <PageHeader
        title="Job board"
        description="Browse tech roles in the UK and Germany. No account required to search."
      />

      <Suspense fallback={<SearchFormFallback />}>
        <JobSearchForm defaultQ={q} defaultWhere={where} defaultCountry={country} />
      </Suspense>

      <div className="mt-10">
        <Suspense
          key={`${q ?? ""}-${where ?? ""}-${country}-${page ?? "1"}`}
          fallback={
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          }
        >
          <JobsResults q={q} where={where} country={country} page={page} />
        </Suspense>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <AdzunaAttribution />
      </div>
    </div>
  )
}
