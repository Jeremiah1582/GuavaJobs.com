"use client"

import { Building2, MapPin } from "lucide-react"
import type { JobListing } from "@guavajobs/core"

import { Badge } from "@/components/ui/badge"
import { formatPostedDate, formatSalary } from "@/lib/jobs/format"
import { cn } from "@/lib/utils"

type JobCardProps = {
  job: JobListing
  isSelected?: boolean
  onSelect?: (jobId: string) => void
}

export function JobCard({ job, isSelected = false, onSelect }: JobCardProps) {
  const salary = formatSalary(job.salary)
  const posted = formatPostedDate(job.createdAt)
  const excerpt = job.description
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120)

  return (
    <article
      role="button"
      tabIndex={0}
      aria-current={isSelected ? "true" : undefined}
      onClick={() => onSelect?.(job.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect?.(job.id)
        }
      }}
      className={cn(
        "cursor-pointer rounded-xl border bg-card p-4 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected
          ? "border-guava-pink ring-1 ring-guava-pink/30 bg-guava-pink-light/30"
          : "border-border hover:border-guava-green/40",
      )}
    >
      <p className="text-xs text-muted-foreground">{job.company}</p>
      <h2 className="mt-1 font-semibold text-foreground">{job.title}</h2>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-1">{job.location}</span>
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {salary ? (
          <Badge variant="accent" className="max-w-full truncate">
            {salary}
          </Badge>
        ) : null}
        {posted ? (
          <Badge variant="outline">{posted}</Badge>
        ) : null}
      </div>
      {excerpt && !isSelected ? (
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{excerpt}…</p>
      ) : null}
      <span className="sr-only">
        <Building2 aria-hidden />
        {job.company}
      </span>
    </article>
  )
}
