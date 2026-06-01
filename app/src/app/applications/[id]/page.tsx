import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"
import { ExternalLink } from "lucide-react"
import {
  applicationsService,
  ApplicationsServiceError,
  profileService,
  usersService,
} from "@guavajobs/core"

import { ApplicationCvSection } from "@/components/applications/application-cv-section"
import { ApplicationGeneratedToast } from "@/components/applications/application-generated-toast"
import { ApplicationLetterEditor } from "@/components/applications/application-letter-editor"
import { LetterGroundingPanel } from "@/components/applications/letter-grounding-panel"
import { ApplicationStatusForm } from "@/components/dashboard/application-status-form"
import { ApplicationNotesPanel } from "@/components/dashboard/application-notes-panel"
import { PageHeader } from "@/components/page-header"
import { getSession } from "@/lib/auth/get-session"

type ApplicationDetailPageProps = {
  params: Promise<{ id: string }>
}

function formatStatus(status: string, rejectionPhase?: string | null): string {
  if (rejectionPhase === "PRE_INTERVIEW") return "Rejected (pre-interview)"
  if (rejectionPhase === "POST_INTERVIEW") return "Rejected (post-interview)"
  return status.charAt(0) + status.slice(1).toLowerCase()
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const session = await getSession()
  if (!session) {
    redirect("/sign-in?next=/dashboard")
  }

  const { id } = await params
  await usersService.ensureUser(session)

  let bundle
  try {
    bundle = await applicationsService.getBundleForUser(session.id, id)
  } catch (err) {
    if (err instanceof ApplicationsServiceError && err.status === 404) {
      notFound()
    }
    throw err
  }

  const { application, jobDescriptionText, jobListingSnapshot, letter } = bundle
  const profile = await profileService.getByUserId(session.id)
  const externalLink = application.jobUrl
  const jobDescription =
    jobDescriptionText ?? application.jobDescriptionSnapshot ?? null

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <Suspense fallback={null}>
        <ApplicationGeneratedToast />
      </Suspense>
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-accent">
          Application tracker
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{application.title}</span>
      </nav>

      <PageHeader
        title={application.title}
        description={[application.company, application.location].filter(Boolean).join(" · ")}
      />

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        {application.source ? (
          <div>
            <dt className="text-muted-foreground">Source</dt>
            <dd>{application.source}</dd>
          </div>
        ) : null}
        {application.appliedAt ? (
          <div>
            <dt className="text-muted-foreground">Applied</dt>
            <dd>{application.appliedAt.toLocaleDateString("en-GB")}</dd>
          </div>
        ) : null}
        {application.salaryText ? (
          <div>
            <dt className="text-muted-foreground">Salary</dt>
            <dd>{application.salaryText}</dd>
          </div>
        ) : null}
        {application.nextStep ? (
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Next step</dt>
            <dd>{application.nextStep}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ApplicationStatusForm
          applicationId={application.id}
          currentStatus={application.status}
        />
        {externalLink ? (
          <a
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Job posting
            <ExternalLink className="size-3.5" />
          </a>
        ) : null}
        {application.jobExternalId ? (
          <Link
            href={`/jobs?job=${encodeURIComponent(application.jobExternalId)}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            View board listing
            <ExternalLink className="size-3.5" />
          </Link>
        ) : null}
      </div>

      {application.interviewRound ? (
        <section className="mt-8 rounded-lg border border-sky-200 bg-sky-50/50 p-4 dark:border-sky-900 dark:bg-sky-950/20">
          <h2 className="text-sm font-semibold text-foreground">Interview</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Round {application.interviewRound}
            {application.interviewScheduledAt
              ? ` · ${application.interviewScheduledAt.toLocaleString("en-GB")}`
              : ""}
          </p>
          {application.interviewLocation ? (
            <p className="text-sm">{application.interviewLocation}</p>
          ) : null}
          {application.interviewUrl ? (
            <a
              href={application.interviewUrl}
              className="text-sm text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join link
            </a>
          ) : null}
        </section>
      ) : null}

      {jobListingSnapshot ? (
        <section className="mt-10">
          <h2 className="text-sm font-semibold text-foreground">Job snapshot</h2>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {jobListingSnapshot.salaryText ? (
              <div>
                <dt className="text-muted-foreground">Salary</dt>
                <dd>{jobListingSnapshot.salaryText}</dd>
              </div>
            ) : null}
            {jobListingSnapshot.category ? (
              <div>
                <dt className="text-muted-foreground">Category</dt>
                <dd>{jobListingSnapshot.category}</dd>
              </div>
            ) : null}
            {jobListingSnapshot.contractType ? (
              <div>
                <dt className="text-muted-foreground">Contract</dt>
                <dd>{jobListingSnapshot.contractType}</dd>
              </div>
            ) : null}
          </dl>
          {jobDescription ? (
            <div className="mt-3 max-h-80 overflow-y-auto rounded-lg border border-border bg-muted/30 p-4 text-sm whitespace-pre-wrap text-muted-foreground">
              {jobDescription}
            </div>
          ) : null}
        </section>
      ) : jobDescription ? (
        <section className="mt-10">
          <h2 className="text-sm font-semibold text-foreground">Job snapshot</h2>
          <div className="mt-3 max-h-80 overflow-y-auto rounded-lg border border-border bg-muted/30 p-4 text-sm whitespace-pre-wrap text-muted-foreground">
            {jobDescription}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <ApplicationNotesPanel
          applicationId={application.id}
          initialNotes={application.notes}
        />
      </section>

      <ApplicationLetterEditor
        applicationId={application.id}
        company={application.company}
        initialLetter={letter}
        isAiAssisted={bundle.flags.isAiAssisted}
      />

      <LetterGroundingPanel citations={letter?.citations ?? []} />

      <ApplicationCvSection cvFileUrl={profile?.cvFileUrl ?? null} />

      <p className="mt-8 text-xs text-muted-foreground">
        Status: {formatStatus(application.status, application.rejectionPhase)} · Updated{" "}
        {application.updatedAt.toLocaleDateString("en-GB")}
      </p>
    </div>
  )
}
