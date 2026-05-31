import Link from "next/link"

import { Button } from "@/components/ui/button"

type JobsPaginationProps = {
  page: number
  totalCount: number
  resultsPerPage: number
  searchParams: Record<string, string | undefined>
}

function buildHref(
  page: number,
  searchParams: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (value) params.set(key, value)
  }
  if (page > 1) params.set("page", String(page))
  else params.delete("page")
  const qs = params.toString()
  return qs ? `/jobs?${qs}` : "/jobs"
}

export function JobsPagination({
  page,
  totalCount,
  resultsPerPage,
  searchParams,
}: JobsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / resultsPerPage))
  if (totalPages <= 1) return null

  const from = (page - 1) * resultsPerPage + 1
  const to = Math.min(page * resultsPerPage, totalCount)

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Showing {from}–{to} of {totalCount.toLocaleString()} roles
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Button asChild variant="outline" size="sm">
            <Link href={buildHref(page - 1, searchParams)}>Previous</Link>
          </Button>
        ) : null}
        {page < totalPages ? (
          <Button asChild variant="outline" size="sm">
            <Link href={buildHref(page + 1, searchParams)}>Next</Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
