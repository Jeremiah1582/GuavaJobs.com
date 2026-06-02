"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"

import { CoverLetterMergeAnimation } from "@/components/cover-letters/cover-letter-merge-animation"
import { Button } from "@/components/ui/button"
import type { JobListing } from "@guavajobs/core"

import type { JobCoverLetterContext } from "@/lib/applications/cover-letter-context"
import {
  generateCoverLetterFromJobAction,
  getJobCoverLetterContextAction,
} from "@/lib/applications/generate-cover-letter"

type JobCoverLetterGenerateProps = {
  jobId: string
  /** Full listing from search — used when Adzuna detail API has no record. */
  jobListing?: JobListing
  signInNext: string
  session: { id: string } | null
  initialContext?: JobCoverLetterContext | null
}

type GenerateOverlayPhase = "idle" | "generating" | "complete"

export function JobCoverLetterGenerate({
  jobId,
  jobListing,
  signInNext,
  session,
  initialContext = null,
}: JobCoverLetterGenerateProps) {
  const [overlayPhase, setOverlayPhase] = useState<GenerateOverlayPhase>("idle")
  const [completedApplicationId, setCompletedApplicationId] = useState<string | null>(
    null,
  )
  const [context, setContext] = useState<JobCoverLetterContext | null>(initialContext)
  const [pending, startTransition] = useTransition()

  const showOverlay = overlayPhase === "generating" || overlayPhase === "complete"

  useEffect(() => {
    if (!session) {
      setContext(null)
      return
    }
    if (initialContext) {
      setContext(initialContext)
      return
    }
    let cancelled = false
    void getJobCoverLetterContextAction(jobId).then((data) => {
      if (!cancelled) setContext(data)
    })
    return () => {
      cancelled = true
    }
  }, [jobId, session, initialContext])

  function dismissOverlay() {
    setOverlayPhase("idle")
    setCompletedApplicationId(null)
  }

  function onGenerate() {
    if (!session || showOverlay || pending) return
    setOverlayPhase("generating")
    setCompletedApplicationId(null)

    startTransition(async () => {
      const result = await generateCoverLetterFromJobAction(jobId, {
        jobSnapshot: jobListing?.id === jobId ? jobListing : undefined,
      })
      if (!result.ok) {
        setOverlayPhase("idle")
        toast.error(result.message)
        return
      }

      setCompletedApplicationId(result.applicationId)
      setContext((prev) =>
        prev
          ? {
              ...prev,
              hasLetter: true,
              applicationId: result.applicationId,
            }
          : prev,
      )
      setOverlayPhase("complete")
      toast.success("Cover letter ready")
    })
  }

  if (!session) {
    return (
      <section className="rounded-lg border border-dashed border-border bg-muted/20 p-4">
        <p className="text-sm text-muted-foreground">
          Sign in to generate a grounded cover letter from this listing.
        </p>
        <Button asChild size="sm" className="mt-3">
          <Link href={`/sign-in?next=${encodeURIComponent(signInNext)}`}>
            Sign in to generate
          </Link>
        </Button>
      </section>
    )
  }

  const profileReady = context?.profileReady ?? false
  const applicationId = completedApplicationId ?? context?.applicationId
  const hasLetter = context?.hasLetter ?? false

  return (
    <>
      {showOverlay ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal
          aria-busy={overlayPhase === "generating"}
          aria-label={
            overlayPhase === "complete"
              ? "Cover letter generation complete"
              : "Generating cover letter"
          }
        >
          <div className="w-full max-w-md space-y-4">
            <CoverLetterMergeAnimation
              active
              complete={overlayPhase === "complete"}
              className="w-full"
            />
            {overlayPhase === "complete" && applicationId ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  className="bg-guava-pink-gradient text-accent-foreground hover:opacity-90"
                >
                  <Link href={`/applications/${applicationId}?generated=1`}>
                    Review cover letter
                  </Link>
                </Button>
                <Button type="button" variant="outline" onClick={dismissOverlay}>
                  Continue on job board
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <section className="rounded-lg border border-guava-pink/25 bg-guava-pink-light/30 p-4">
        <p className="text-sm font-semibold text-foreground">AI cover letter</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {profileReady
            ? "Generate a professional letter using only facts from your profile and this job description."
            : `Complete your profile (${context?.completeness.percent ?? 0}% done) before generating.`}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {!profileReady ? (
            <Button asChild variant="outline" size="sm" disabled={pending}>
              <Link href="/profile">Complete your profile</Link>
            </Button>
          ) : hasLetter && applicationId ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={`/applications/${applicationId}`}>View application</Link>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={pending || showOverlay}
                onClick={onGenerate}
              >
                <Sparkles className="size-4" aria-hidden />
                Regenerate letter
              </Button>
            </>
          ) : (
            <Button
              type="button"
              size="sm"
              className="bg-guava-pink-gradient text-accent-foreground hover:opacity-90"
              disabled={pending || showOverlay}
              onClick={onGenerate}
            >
              <Sparkles className="size-4" aria-hidden />
              Generate cover letter with AI
            </Button>
          )}
        </div>
      </section>
    </>
  )
}
