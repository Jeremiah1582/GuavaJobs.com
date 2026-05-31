import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import {
  ArrowUpRight,
  Building2,
  ExternalLink,
  MapPin,
} from "lucide-react"
import { jobsService, JobsServiceError } from "@guavajobs/core"

import { AdzunaAttribution } from "@/components/jobs/adzuna-attribution"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { trackJobAction, trackJobById } from "@/lib/applications/track-job"
import { getSession } from "@/lib/auth/get-session"
import { appUrl } from "@/lib/env"
import { formatSalary, stripHtml } from "@/lib/jobs/format"

type JobDetailPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ track?: string }>
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const job = await jobsService.getById(id)
    if (!job) {
      return { title: "Job not found" }
    }
    const canonical = `${appUrl}/jobs/${job.id}`
    return {
      title: `${job.title} at ${job.company}`,
      description: `View ${job.title} at ${job.company} in ${job.location}. Track this role with Guavajobs.`,
      alternates: { canonical },
      openGraph: {
        title: `${job.title} at ${job.company}`,
        description: job.location,
        url: canonical,
        type: "website",
      },
    }
  } catch {
    return { title: "Job details" }
  }
}

export default async function JobDetailPage({
  params,
  searchParams,
}: JobDetailPageProps) {
  const { id } = await params
  const { track } = await searchParams
  const trackNext = encodeURIComponent(`/jobs/${id}?track=1`)
  const session = await getSession()

  if (track === "1" && session) {
    await trackJobById(id)
    redirect("/dashboard?tracked=1")
  }

  let job
  try {
    job = await jobsService.getById(id)
  } catch (err) {
    if (err instanceof JobsServiceError && err.status === 503) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
          <EmptyState
            icon={ExternalLink}
            title="Job board unavailable"
            description={err.message}
            action={{ label: "Back to jobs", href: "/jobs" }}
          />
        </div>
      )
    }
    throw err
  }

  if (!job) notFound()

  const salary = formatSalary(job.salary)
  const description = stripHtml(job.description)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/jobs" className="hover:text-accent">
          Job board
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{job.title}</span>
      </nav>

      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="font-serif text-3xl text-foreground md:text-4xl">{job.title}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Building2 className="size-4 shrink-0" aria-hidden />
            {job.company}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {job.location}
          </span>
        </div>
        {salary ? <p className="text-lg font-medium text-foreground">{salary}</p> : null}
        {(job.contractType || job.category) && (
          <p className="text-sm text-muted-foreground">
            {[job.contractType, job.category].filter(Boolean).join(" · ")}
          </p>
        )}
      </header>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {session ? (
          <form action={trackJobAction}>
            <input type="hidden" name="jobId" value={job.id} />
            <Button
              type="submit"
              className="bg-guava-pink-gradient text-accent-foreground hover:opacity-90"
            >
              Track with GuavaJobs
              <ArrowUpRight className="size-4" aria-hidden />
            </Button>
          </form>
        ) : (
          <Button asChild className="bg-guava-pink-gradient text-accent-foreground hover:opacity-90">
            <Link href={`/sign-up?next=${trackNext}`}>
              Track with GuavaJobs
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Button>
        )}
        {job.redirectUrl ? (
          <Button asChild variant="outline">
            <a href={job.redirectUrl} target="_blank" rel="noopener noreferrer">
              Apply on employer site
              <ExternalLink className="size-4" aria-hidden />
            </a>
          </Button>
        ) : null}
        {!session ? (
          <Button asChild variant="ghost" className="text-muted-foreground">
            <Link href={`/sign-in?next=${trackNext}`}>Already have an account?</Link>
          </Button>
        ) : null}
      </div>

      {description ? (
        <section className="mt-10">
          <h2 className="mb-4 font-semibold text-foreground">Job description</h2>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-muted-foreground">
            {description}
          </div>
        </section>
      ) : null}

      <footer className="mt-12 space-y-4 border-t border-border pt-8">
        <AdzunaAttribution />
        <p className="text-xs text-muted-foreground">
          Listing ID: {job.id}
          {job.createdAt ? ` · Posted ${new Date(job.createdAt).toLocaleDateString("en-GB")}` : null}
        </p>
      </footer>
    </div>
  )
}
