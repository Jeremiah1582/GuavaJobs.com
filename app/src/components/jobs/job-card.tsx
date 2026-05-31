import Link from "next/link"
import { ArrowUpRight, Building2, MapPin } from "lucide-react"
import type { JobListing } from "@guavajobs/core"

import { formatSalary } from "@/lib/jobs/format"

type JobCardProps = {
  job: JobListing
}

export function JobCard({ job }: JobCardProps) {
  const salary = formatSalary(job.salary)
  const excerpt = job.description
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160)

  return (
    <article className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-guava-green/40">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-foreground">
            <Link href={`/jobs/${job.id}`} className="hover:text-accent">
              {job.title}
            </Link>
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Building2 className="size-3.5 shrink-0" aria-hidden />
              {job.company}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              {job.location}
            </span>
          </div>
          {salary ? (
            <p className="mt-2 text-sm font-medium text-foreground">{salary}</p>
          ) : null}
          {excerpt ? (
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{excerpt}…</p>
          ) : null}
        </div>
        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          View role
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  )
}
