"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, useTransition } from "react"

import { JobSearchBar } from "@/components/jobs/job-search-bar"
import {
  DISTANCE_MILES_OPTIONS,
  MAX_DAYS_OPTIONS,
  SORT_OPTIONS,
} from "@shared/jobs/search-url"

import type { ParsedJobsSearchParams } from "@/lib/jobs/search-params"

type JobSearchToolbarProps = {
  defaults: ParsedJobsSearchParams
  /** Profile quiz `roleType` for "Use my preferences". */
  preferenceQ?: string
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SEARCH PARAM DETECTION
 * The toolbar auto-detects which filters to render based on available params
 * from the search engine configuration.
 * ───────────────────────────────────────────────────────────────────────────── */

type FilterParamConfig = {
  key: string
  label: string
  options: ReadonlyArray<{ label: string; value: string }>
}

/**
 * Detects available filter params from the job search engine configuration.
 * Returns array of filter configs that should be rendered in the toolbar.
 */
function useAvailableFilterParams(): FilterParamConfig[] {
  return useMemo(() => {
    const filters: FilterParamConfig[] = []

    // Distance filter (if distance options are defined)
    if (DISTANCE_MILES_OPTIONS.length > 0) {
      filters.push({
        key: "distanceKm",
        label: "Distance",
        options: DISTANCE_MILES_OPTIONS.map((opt) => ({
          label: opt.label,
          value: opt.value === undefined ? "" : String(opt.value),
        })),
      })
    }

    // Date posted filter (if date options are defined)
    if (MAX_DAYS_OPTIONS.length > 0) {
      filters.push({
        key: "maxDaysOld",
        label: "Posted",
        options: MAX_DAYS_OPTIONS.map((opt) => ({
          label: opt.label,
          value: opt.value === undefined ? "" : String(opt.value),
        })),
      })
    }

    // Sort filter (if sort options are defined)
    if (SORT_OPTIONS.length > 0) {
      filters.push({
        key: "sortBy",
        label: "Sort",
        options: SORT_OPTIONS.map((opt) => ({
          label: opt.label,
          value: opt.value,
        })),
      })
    }

    return filters
  }, [])
}

/* ─────────────────────────────────────────────────────────────────────────────
 * ICONS
 * ───────────────────────────────────────────────────────────────────────────── */

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function IconFilter({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
 * FILTER SELECT COMPONENT
 * ───────────────────────────────────────────────────────────────────────────── */

type FilterSelectProps = {
  id: string
  label: string
  disabled?: boolean
  value: string
  onChange: (value: string) => void
  options: ReadonlyArray<{ label: string; value: string }>
}

function FilterSelect({
  id,
  label,
  disabled,
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <div className="group relative flex w-full flex-col">
      <label
        htmlFor={id}
        className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80 transition-colors duration-300 group-focus-within:text-guava-pink sm:text-[11px]"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          disabled={disabled}
          className="
            block h-9 w-full min-w-0 cursor-pointer appearance-none truncate 
            rounded-lg border border-border/60 bg-background/80 
            px-3 pr-8 text-xs font-medium text-foreground
            shadow-sm backdrop-blur-sm
            transition-all duration-300 ease-out
            hover:border-guava-pink/40 hover:bg-background
            focus:border-guava-pink/60 focus:outline-none focus:ring-2 focus:ring-guava-pink/20
            disabled:cursor-not-allowed disabled:opacity-50
            sm:h-10 sm:rounded-xl sm:px-3.5 sm:text-sm
          "
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60 transition-colors duration-300 group-hover:text-guava-pink/70 sm:size-4" />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
 * MAIN TOOLBAR COMPONENT
 * ───────────────────────────────────────────────────────────────────────────── */

export function JobSearchToolbar({ defaults, preferenceQ }: JobSearchToolbarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const availableFilters = useAvailableFilterParams()

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

  function getFilterValue(key: string): string {
    switch (key) {
      case "distanceKm":
        return defaults.distanceKm === undefined ? "" : String(defaults.distanceKm)
      case "maxDaysOld":
        return defaults.maxDaysOld === undefined ? "" : String(defaults.maxDaysOld)
      case "sortBy":
        return defaults.sortBy ?? "date"
      default:
        return ""
    }
  }

  // Count active filters for visual feedback
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (defaults.distanceKm !== undefined) count++
    if (defaults.maxDaysOld !== undefined) count++
    if (defaults.sortBy && defaults.sortBy !== "date") count++
    return count
  }, [defaults.distanceKm, defaults.maxDaysOld, defaults.sortBy])

  return (
    <section
      className="
        overflow-hidden rounded-xl border border-border/50
        bg-gradient-to-b from-card/95 to-card/80
        shadow-search-float backdrop-blur-sm
        transition-all duration-700 ease-out
        sm:rounded-2xl
      "
      aria-label="Job search"
    >
      {/* Search Bar Section */}
      <div className="p-3 sm:p-4">
        <JobSearchBar
          embedded
          defaultQ={defaults.q ?? ""}
          defaultWhere={defaults.where ?? ""}
          defaultCountry={defaults.country}
          preferenceQ={preferenceQ}
        />
      </div>

      {/* Filter Section — renders dynamically based on available params */}
      {availableFilters.length > 0 && (
        <div
          className="
            border-t border-border/40
            bg-gradient-to-b from-muted/30 to-transparent
            px-3 pb-3 pt-2.5
            sm:px-4 sm:pb-4 sm:pt-3
          "
          role="group"
          aria-labelledby="job-search-refine-heading"
        >
          {/* Section Header */}
          <div className="mb-2.5 flex items-center gap-2 sm:mb-3">
            <div className="flex items-center gap-1.5">
              <IconFilter className="size-3 text-guava-pink/70 sm:size-3.5" />
              <h3
                id="job-search-refine-heading"
                className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs"
              >
                Refine
              </h3>
            </div>
            {activeFilterCount > 0 && (
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-guava-pink/15 px-1.5 text-[10px] font-semibold text-guava-pink transition-all duration-500">
                {activeFilterCount}
              </span>
            )}
          </div>

          {/* Filter Controls — full-width on mobile, side-by-side on desktop */}
          <div
            className="
              grid gap-2
              grid-cols-1
              sm:grid-cols-3
              sm:gap-3
            "
          >
            {availableFilters.map((filter) => (
              <FilterSelect
                key={filter.key}
                id={`filter-${filter.key}`}
                label={filter.label}
                disabled={pending}
                value={getFilterValue(filter.key)}
                options={filter.options}
                onChange={(v) =>
                  applyFilters({ [filter.key]: v || undefined })
                }
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
