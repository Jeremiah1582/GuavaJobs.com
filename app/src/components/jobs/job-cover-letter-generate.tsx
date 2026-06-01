"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"

import { CoverLetterMergeAnimation } from "@/components/cover-letters/cover-letter-merge-animation"
import { Button } from "@/components/ui/button"
import type { JobCoverLetterContext } from "@/lib/applications/cover-letter-context"
import {
  generateCoverLetterFromJobAction,
  getJobCoverLetterContextAction,
} from "@/lib/applications/generate-cover-letter"

type JobCoverLetterGenerateProps = {
  jobId: string
  signInNext: string
  session: { id: string } | null
  initialContext?: JobCoverLetterContext | null
}

export function JobCoverLetterGenerate({
  jobId,
  signInNext,
  session,
  initialContext = null,
}: JobCoverLetterGenerateProps) {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [context, setContext] = useState<JobCoverLetterContext | null>(initialContext)
  const [pending, startTransition] = useTransition()

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

  function onGenerate() {
    if (!session || generating || pending) return
    setGenerating(true)
    startTransition(async () => {
      const result = await generateCoverLetterFromJobAction(jobId)
      if (!result.ok) {
        setGenerating(false)
        toast.error(result.message)
        return
      }
      router.push(`/applications/${result.applicationId}?generated=1`)
      router.refresh()
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

  if (generating) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal
        aria-busy
        aria-label="Generating cover letter"
      >
        <CoverLetterMergeAnimation active className="w-full max-w-md" />
      </div>
    )
  }

  const profileReady = context?.profileReady ?? false
  const hasLetter = context?.hasLetter ?? false
  const applicationId = context?.applicationId

  return (
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
              disabled={pending}
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
            disabled={pending}
            onClick={onGenerate}
          >
            <Sparkles className="size-4" aria-hidden />
            Generate cover letter with AI
          </Button>
        )}
      </div>
    </section>
  )
}
