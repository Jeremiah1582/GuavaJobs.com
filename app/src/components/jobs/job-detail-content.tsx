import Link from "next/link"
import {
  ArrowUpRight,
  Building2,
  ExternalLink,
  MapPin,
} from "lucide-react"
import type { JobListing } from "@guavajobs/core"

import { Button } from "@/components/ui/button"
import { JobCoverLetterGenerate } from "@/components/jobs/job-cover-letter-generate"
import { trackJobAction } from "@/lib/applications/track-job"
import type { JobCoverLetterContext } from "@/lib/applications/cover-letter-context"
import { formatPostedDate, formatSalary, stripHtml } from "@/lib/jobs/format"

type JobDetailContentProps = {
  job: JobListing
  session: { id: string } | null
  compact?: boolean
  showFooterMeta?: boolean
  coverLetterContext?: JobCoverLetterContext | null
}

export function JobDetailContent({
  job,
  session,
  compact = false,
  showFooterMeta = true,
  coverLetterContext = null,
}: JobDetailContentProps) {
  const salary = formatSalary(job.salary)
  const description = stripHtml(job.description)
  const posted = formatPostedDate(job.createdAt)
  // Raw path for auth forms — encode once at Link href construction.
  const trackNext = `/jobs?job=${encodeURIComponent(job.id)}&track=1`
  const trackAuthHref = (path: "/sign-up" | "/sign-in") =>
    `${path}?next=${encodeURIComponent(trackNext)}`

  return (
    <div className={compact ? "flex h-full min-h-0 flex-col" : "space-y-8"}>
      <header className="space-y-3 border-b border-border pb-6">
        <p className="text-sm text-muted-foreground">{job.company}</p>
        <h1
          className={
            compact
              ? "font-serif text-2xl text-foreground"
              : "font-serif text-3xl text-foreground md:text-4xl"
          }
        >
          {job.title}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="size-4 shrink-0" aria-hidden />
            {job.company}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {job.location}
          </span>
        </div>
        {salary ? <p className="text-base font-medium text-foreground">{salary}</p> : null}
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {posted ? (
            <span className={compact ? "font-medium text-foreground" : undefined}>
              {compact ? (
                <>
                  <span className="text-muted-foreground">Posted</span> {posted}
                </>
              ) : (
                posted
              )}
            </span>
          ) : null}
          {job.contractType ? <span>· {job.contractType}</span> : null}
          {job.category ? <span>· {job.category}</span> : null}
        </div>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {session ? (
          <form action={trackJobAction}>
            <input type="hidden" name="jobId" value={job.id} />
            <Button
              type="submit"
              className="w-full bg-guava-pink-gradient text-accent-foreground hover:opacity-90 sm:w-auto"
            >
              Track with GuavaJobs
              <ArrowUpRight className="size-4" aria-hidden />
            </Button>
          </form>
        ) : (
          <Button
            asChild
            className="w-full bg-guava-pink-gradient text-accent-foreground hover:opacity-90 sm:w-auto"
          >
            <Link href={trackAuthHref("/sign-up")}>
              Track with GuavaJobs
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Button>
        )}
        {job.redirectUrl ? (
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <a href={job.redirectUrl} target="_blank" rel="noopener noreferrer">
              Apply on employer site
              <ExternalLink className="size-4" aria-hidden />
            </a>
          </Button>
        ) : null}
        {!session ? (
          <Button asChild variant="ghost" className="text-muted-foreground">
            <Link href={trackAuthHref("/sign-in")}>Already have an account?</Link>
          </Button>
        ) : null}
      </div>

      <JobCoverLetterGenerate
        jobId={job.id}
        jobListing={job}
        session={session}
        initialContext={coverLetterContext}
        signInNext={trackNext}
      />

      {description ? (
        <section className={compact ? "min-h-0 flex-1 overflow-y-auto" : ""}>
          <h2 className="mb-3 font-semibold text-foreground">Job description</h2>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {description}
          </div>
        </section>
      ) : null}

      {showFooterMeta ? (
        <p className="text-xs text-muted-foreground">
          Listing ID: {job.id}
        </p>
      ) : null}
    </div>
  )
}
