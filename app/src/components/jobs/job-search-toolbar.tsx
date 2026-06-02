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

const TOOLBAR_SHELL_CLASS = [
  "overflow-hidden rounded-xl border border-border/80 bg-card/95 shadow-search-float backdrop-blur-sm",
  "sm:rounded-2xl",
].join(" ")

const FILTER_SELECT_CLASS = [
  "block h-9 w-full min-w-0 rounded-lg border border-input/80 bg-background px-2.5 text-xs shadow-sm",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guava-pink/40",
  "disabled:cursor-not-allowed disabled:opacity-60 sm:h-10 sm:rounded-xl sm:px-3 sm:text-sm",
].join(" ")

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
    <div className="flex min-w-0 flex-col gap-1">
      <label
        htmlFor={id}
        className="text-[11px] font-medium leading-none text-muted-foreground sm:text-xs"
      >
        {label}
      </label>
      <select
        id={id}
        disabled={disabled}
        className={FILTER_SELECT_CLASS}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

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

  const distanceOptions = DISTANCE_MILES_OPTIONS.map((opt) => ({
    label: opt.label,
    value: opt.value === undefined ? "" : String(opt.value),
  }))

  const dateOptions = MAX_DAYS_OPTIONS.map((opt) => ({
    label: opt.label,
    value: opt.value === undefined ? "" : String(opt.value),
  }))

  const sortOptions = SORT_OPTIONS.map((opt) => ({
    label: opt.label,
    value: opt.value,
  }))

  return (
    <section className={TOOLBAR_SHELL_CLASS} aria-label="Job search">
      <div className="space-y-3 p-2.5 sm:p-3">
        <JobSearchBar
          embedded
          defaultQ={defaults.q ?? ""}
          defaultWhere={defaults.where ?? ""}
          defaultCountry={defaults.country}
          preferenceQ={preferenceQ}
        />

        <div
          className="border-t border-border/60 pt-3"
          role="group"
          aria-labelledby="job-search-refine-heading"
        >
          <h3
            id="job-search-refine-heading"
            className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs"
          >
            Refine results
          </h3>
          <div className="grid grid-cols-1 gap-2 min-[28rem]:grid-cols-2 lg:grid-cols-3">
            <FilterSelect
              id="filter-distance"
              label="Distance"
              disabled={pending}
              value={
                defaults.distanceKm === undefined
                  ? ""
                  : String(defaults.distanceKm)
              }
              options={distanceOptions}
              onChange={(v) => applyFilters({ distanceKm: v || undefined })}
            />
            <FilterSelect
              id="filter-date"
              label="Date posted"
              disabled={pending}
              value={
                defaults.maxDaysOld === undefined ? "" : String(defaults.maxDaysOld)
              }
              options={dateOptions}
              onChange={(v) => applyFilters({ maxDaysOld: v || undefined })}
            />
            <FilterSelect
              id="filter-sort"
              label="Sort by"
              disabled={pending}
              value={defaults.sortBy ?? "date"}
              options={sortOptions}
              onChange={(v) => applyFilters({ sortBy: v || undefined })}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
