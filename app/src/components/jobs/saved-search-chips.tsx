"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { BookmarkPlus, X } from "lucide-react"
import type { SavedJobSearchDto } from "@guavajobs/core"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  deleteSavedSearchAction,
  saveJobSearchAction,
} from "@/lib/applications/actions"
import { buildJobsSearchUrl } from "@shared/jobs/search-url"
import type { ParsedJobsSearchParams } from "@/lib/jobs/search-params"
import { toast } from "sonner"

const RECENT_KEY = "gj_recent_searches"
const MAX_RECENT = 5

type RecentSearch = {
  label: string
  q?: string
  where?: string
  country?: "gb" | "de"
  distanceKm?: number
  maxDaysOld?: number
  sortBy?: "date" | "relevance"
}

type SavedSearchChipsProps = {
  savedSearches: SavedJobSearchDto[]
  isSignedIn: boolean
  currentSearch: ParsedJobsSearchParams
}

function buildLabel(search: ParsedJobsSearchParams): string {
  const parts: string[] = []
  if (search.q) parts.push(search.q)
  if (search.where) parts.push(search.where)
  if (parts.length > 0) return parts.join(" · ")
  return search.where ? `Jobs near ${search.where}` : "Junior jobs nearby"
}

function toRecent(search: ParsedJobsSearchParams): RecentSearch {
  return {
    label: buildLabel(search),
    q: search.q,
    where: search.where,
    country: search.country,
    distanceKm: search.distanceKm,
    maxDaysOld: search.maxDaysOld,
    sortBy: search.sortBy,
  }
}

function persistRecent(entry: RecentSearch) {
  try {
    const raw = sessionStorage.getItem(RECENT_KEY)
    const list: RecentSearch[] = raw ? JSON.parse(raw) : []
    const key = JSON.stringify(entry)
    const filtered = list.filter((item) => JSON.stringify(item) !== key)
    const next = [entry, ...filtered].slice(0, MAX_RECENT)
    sessionStorage.setItem(RECENT_KEY, JSON.stringify(next))
    return next
  } catch {
    return [entry]
  }
}

function loadRecent(): RecentSearch[] {
  try {
    const raw = sessionStorage.getItem(RECENT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function SavedSearchChips({
  savedSearches,
  isSignedIn,
  currentSearch,
}: SavedSearchChipsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [recent, setRecent] = useState<RecentSearch[]>([])

  useEffect(() => {
    if (!isSignedIn) {
      setRecent(loadRecent())
    }
  }, [isSignedIn])

  const applySearch = useCallback(
    (params: {
      q?: string
      where?: string
      country?: "gb" | "de"
      distanceKm?: number
      maxDaysOld?: number
      sortBy?: "date" | "relevance"
    }) => {
      const href = buildJobsSearchUrl("/jobs", params)
      startTransition(() => {
        router.push(href)
      })
    },
    [router],
  )

  function onSaveCurrent() {
    const label = buildLabel(currentSearch)
    if (!isSignedIn) {
      const next = persistRecent(toRecent(currentSearch))
      setRecent(next)
      toast.success("Search saved for this session")
      return
    }

    startTransition(async () => {
      try {
        await saveJobSearchAction({
          label,
          q: currentSearch.q,
          where: currentSearch.where,
          country: currentSearch.country,
          distanceKm: currentSearch.distanceKm,
          maxDaysOld: currentSearch.maxDaysOld,
          sortBy: currentSearch.sortBy,
        })
        toast.success("Search saved")
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not save search")
      }
    })
  }

  function onDeleteSaved(id: string) {
    startTransition(async () => {
      try {
        await deleteSavedSearchAction(id)
        toast.success("Saved search removed")
        router.refresh()
      } catch {
        toast.error("Could not remove search")
      }
    })
  }

  const chips = isSignedIn
    ? savedSearches.map((s) => ({
        id: s.id,
        label: s.label,
        params: {
          q: s.q ?? undefined,
          where: s.where ?? undefined,
          country: (s.country === "de" ? "de" : "gb") as "gb" | "de",
          distanceKm: s.distanceKm ?? undefined,
          maxDaysOld: s.maxDaysOld ?? undefined,
          sortBy: (s.sortBy as "date" | "relevance" | null) ?? undefined,
        },
        deletable: true,
      }))
    : recent.map((s, i) => ({
        id: `recent-${i}`,
        label: s.label,
        params: s,
        deletable: false,
      }))

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={onSaveCurrent}
          className="shrink-0"
        >
          <BookmarkPlus className="size-4" aria-hidden />
          Save this search
        </Button>
        {!isSignedIn ? (
          <span className="text-xs text-muted-foreground">
            Sign in to save searches across devices
          </span>
        ) : null}
      </div>

      {chips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Badge
              key={chip.id}
              variant="outline"
              className="cursor-pointer gap-1 py-1.5 pl-2.5 pr-1 hover:bg-secondary"
            >
              <button
                type="button"
                className="text-left text-xs font-medium"
                onClick={() => applySearch(chip.params)}
              >
                {chip.label}
              </button>
              {chip.deletable && isSignedIn ? (
                <button
                  type="button"
                  className="rounded-full p-0.5 hover:bg-muted"
                  aria-label={`Remove ${chip.label}`}
                  onClick={() => onDeleteSaved(chip.id)}
                >
                  <X className="size-3" />
                </button>
              ) : null}
            </Badge>
          ))}
        </div>
      ) : null}

      {/* Record current search in recent when params change (guest) */}
      {!isSignedIn && searchParams.toString() ? (
        <RecordRecent search={currentSearch} />
      ) : null}
    </div>
  )
}

function RecordRecent({ search }: { search: ParsedJobsSearchParams }) {
  useEffect(() => {
    if (search.q || search.where) {
      persistRecent(toRecent(search))
    }
  }, [search])
  return null
}
