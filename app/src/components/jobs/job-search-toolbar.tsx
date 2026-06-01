"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

import { JobSearchBar } from "@/components/jobs/job-search-bar"
import {
  DISTANCE_MILES_OPTIONS,
  MAX_DAYS_OPTIONS,
  SORT_OPTIONS,
} from "@shared/jobs/search-url"

import type { ParsedJobsSearchParams } from "@/lib/jobs/search-params"

type JobSearchToolbarProps = {
  defaults: ParsedJobsSearchParams
  /** Profile quiz `roleType` for “Use my preferences”. */
  preferenceQ?: string
}

const FILTER_SELECT_CLASS =
  "block h-9 w-full min-w-0 truncate rounded-lg border border-input/80 bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guava-pink/40 disabled:opacity-60 sm:h-10 sm:rounded-xl sm:px-3 sm:text-sm"

const FILTER_FIELD_CLASS = "min-w-0 shrink flex-1 basis-0"

export function JobSearchToolbar({ defaults, preferenceQ }: JobSearchToolbarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  function applyFilters(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("page")
    params.delete("job")
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    startTransition(() => {
      router.push(`/jobs?${params.toString()}`)
    })
  }

  return (
    <div className="space-y-2">
      <JobSearchBar
        defaultQ={defaults.q ?? ""}
        defaultWhere={defaults.where ?? ""}
        defaultCountry={defaults.country}
        preferenceQ={preferenceQ}
      />

      <div className="flex min-w-0 flex-nowrap items-stretch gap-1.5 rounded-xl border border-border/80 bg-card/95 p-2 shadow-search-float backdrop-blur-sm sm:gap-2 sm:rounded-2xl sm:p-2.5">
        <div className={`${FILTER_FIELD_CLASS} min-w-[5.5rem]`}>
          <label htmlFor="filter-distance" className="sr-only">
            Distance
          </label>
          <select
            id="filter-distance"
            disabled={pending}
            aria-label="Distance"
            className={FILTER_SELECT_CLASS}
            value={defaults.distanceKm ?? ""}
            onChange={(e) => {
              const v = e.target.value
              applyFilters({ distanceKm: v || undefined })
            }}
          >
            {DISTANCE_MILES_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value ?? ""}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={`${FILTER_FIELD_CLASS} min-w-[5.5rem]`}>
          <label htmlFor="filter-date" className="sr-only">
            Date posted
          </label>
          <select
            id="filter-date"
            disabled={pending}
            aria-label="Date posted"
            className={FILTER_SELECT_CLASS}
            value={defaults.maxDaysOld ?? ""}
            onChange={(e) => {
              const v = e.target.value
              applyFilters({ maxDaysOld: v || undefined })
            }}
          >
            {MAX_DAYS_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value ?? ""}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={`${FILTER_FIELD_CLASS} min-w-[4.5rem] max-w-[9rem] sm:max-w-[11rem]`}>
          <label htmlFor="filter-sort" className="sr-only">
            Sort by
          </label>
          <select
            id="filter-sort"
            disabled={pending}
            aria-label="Sort by"
            className={FILTER_SELECT_CLASS}
            value={defaults.sortBy ?? "date"}
            onChange={(e) => {
              applyFilters({ sortBy: e.target.value || undefined })
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
