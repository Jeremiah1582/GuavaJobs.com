import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ExternalLink } from "lucide-react"
import { jobsService, JobsServiceError } from "@guavajobs/core"

import { AdzunaAttribution } from "@/components/jobs/adzuna-attribution"
import { JobDetailContent } from "@/components/jobs/job-detail-content"
import { EmptyState } from "@/components/empty-state"
import { getJobCoverLetterContextAction } from "@/lib/applications/generate-cover-letter"
import { trackJobById } from "@/lib/applications/track-job"
import { trackedApplicationPath } from "@/lib/applications/tracked-path"
import { getSession } from "@/lib/auth/get-session"
import { appUrl } from "@/lib/env"

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
  const session = await getSession()

  if (track === "1" && session) {
    const application = await trackJobById(id)
    redirect(trackedApplicationPath(application.id))
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

  const coverLetterContext = session
    ? await getJobCoverLetterContextAction(job.id)
    : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/jobs" className="hover:text-accent">
          Job board
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{job.title}</span>
      </nav>

      <JobDetailContent
        job={job}
        session={session}
        coverLetterContext={coverLetterContext}
      />

      <footer className="mt-12 space-y-4 border-t border-border pt-8">
        <AdzunaAttribution />
      </footer>
    </div>
  )
}
