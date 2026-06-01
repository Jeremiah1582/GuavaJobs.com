"use client"

import { useCallback } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import type { JobListing } from "@guavajobs/core"

import { JobCard } from "@/components/jobs/job-card"
import { JobDetailContent } from "@/components/jobs/job-detail-content"
import { JobsPagination } from "@/components/jobs/jobs-pagination"
import type { ParsedJobsSearchParams } from "@/lib/jobs/search-params"
import { toSearchParamRecord } from "@/lib/jobs/search-params"

type JobsBoardProps = {
  jobs: JobListing[]
  totalCount: number
  page: number
  resultsPerPage: number
  search: ParsedJobsSearchParams
  selectedJob: JobListing | null
  session: { id: string } | null
  defaultSearchBanner?: string | null
}

function DetailPanel({
  job,
  session,
  onBack,
  showBack,
}: {
  job: JobListing
  session: { id: string } | null
  onBack?: () => void
  showBack?: boolean
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {showBack && onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground lg:hidden"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to list
        </button>
      ) : null}
      <div className="min-h-0 flex-1">
        <JobDetailContent job={job} session={session} compact showFooterMeta={false} />
      </div>
      <p className="mt-4 shrink-0 text-sm">
        <Link
          href={`/jobs/${job.id}`}
          className="font-medium text-accent hover:underline"
        >
          Open full page view
        </Link>
      </p>
    </div>
  )
}

export function JobsBoard({
  jobs,
  totalCount,
  page,
  resultsPerPage,
  search,
  selectedJob,
  session,
  defaultSearchBanner,
}: JobsBoardProps) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()

  const paramRecord = toSearchParamRecord(search)

  const selectJob = useCallback(
    (jobId: string) => {
      const params = new URLSearchParams(urlSearchParams.toString())
      params.set("job", jobId)
      router.replace(`/jobs?${params.toString()}`, { scroll: false })
    },
    [router, urlSearchParams],
  )

  const clearSelection = useCallback(() => {
    const params = new URLSearchParams(urlSearchParams.toString())
    params.delete("job")
    router.replace(`/jobs?${params.toString()}`, { scroll: false })
  }, [router, urlSearchParams])

  const jobFromUrl = urlSearchParams.get("job")
  const activeJob = selectedJob
  const showDesktopDetail = Boolean(activeJob)
  const showMobileDetail = Boolean(activeJob && jobFromUrl)

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {defaultSearchBanner ? (
        <p className="shrink-0 rounded-lg border border-guava-pink/20 bg-guava-pink-light/40 px-4 py-3 text-sm text-muted-foreground">
          {defaultSearchBanner}
        </p>
      ) : null}

      <p className="shrink-0 text-sm font-medium text-guava-green">
        {totalCount.toLocaleString()} job{totalCount === 1 ? "" : "s"} found
      </p>

      <div className="flex min-h-0 max-h-[calc(100dvh-13rem)] flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-6 lg:grid lg:h-full lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-6">
          <ul className="scrollbar-hide min-h-0 space-y-3 overflow-y-auto overscroll-contain lg:max-h-full lg:pr-1">
            {jobs.map((job) => (
              <li key={job.id}>
                <JobCard
                  job={job}
                  isSelected={activeJob?.id === job.id}
                  onSelect={selectJob}
                />
              </li>
            ))}
          </ul>

          {showDesktopDetail && activeJob ? (
            <div className="scrollbar-hide hidden min-h-0 overflow-y-auto overscroll-contain rounded-xl border border-border bg-card p-6 lg:block lg:max-h-full">
              <DetailPanel job={activeJob} session={session} />
            </div>
          ) : null}

          {showMobileDetail && activeJob ? (
            <div className="scrollbar-hide min-h-0 overflow-y-auto overscroll-contain rounded-xl border border-border bg-card p-4 lg:hidden">
              <DetailPanel
                job={activeJob}
                session={session}
                showBack
                onBack={clearSelection}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="shrink-0">
        <JobsPagination
          page={page}
          totalCount={totalCount}
          resultsPerPage={resultsPerPage}
          searchParams={paramRecord}
        />
      </div>
    </div>
  )
}
