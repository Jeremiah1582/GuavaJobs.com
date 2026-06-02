"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { JobSearchToolbar } from "@/components/jobs/job-search-toolbar"
import type { ParsedJobsSearchParams } from "@/lib/jobs/search-params"

type PreferenceQContextValue = {
  setPreferenceQ: (value: string | undefined) => void
}

const PreferenceQContext = createContext<PreferenceQContextValue | null>(null)

export function PreferenceQLoader({ preferenceQ }: { preferenceQ?: string }) {
  const ctx = useContext(PreferenceQContext)
  useEffect(() => {
    ctx?.setPreferenceQ(preferenceQ)
  }, [ctx, preferenceQ])
  return null
}

type JobsSearchSectionShellProps = {
  search: ParsedJobsSearchParams
  children?: ReactNode
}

/** Keeps the search toolbar mounted during navigations (no Suspense unmount). */
export function JobsSearchSectionShell({
  search,
  children,
}: JobsSearchSectionShellProps) {
  const [preferenceQ, setPreferenceQState] = useState<string | undefined>()
  const setPreferenceQ = useCallback((value: string | undefined) => {
    setPreferenceQState(value)
  }, [])
  const preferenceContext = useMemo(
    () => ({ setPreferenceQ }),
    [setPreferenceQ],
  )

  return (
    <PreferenceQContext.Provider value={preferenceContext}>
      <div className="space-y-2 sm:space-y-3">
        <JobSearchToolbar
          defaults={search}
          preferenceQ={preferenceQ}
        />
        {children}
      </div>
    </PreferenceQContext.Provider>
  )
}
