"use client"

import { useEffect, useState } from "react"
import { FileText, Sparkles, User } from "lucide-react"

type MergePhase = "inputs" | "merging" | "generating" | "complete"

type CoverLetterMergeAnimationProps = {
  active: boolean
  className?: string
}

export function CoverLetterMergeAnimation({
  active,
  className = "",
}: CoverLetterMergeAnimationProps) {
  const [phase, setPhase] = useState<MergePhase>("inputs")

  useEffect(() => {
    if (!active) {
      setPhase("inputs")
      return
    }

    setPhase("inputs")
    const t1 = window.setTimeout(() => setPhase("merging"), 1200)
    const t2 = window.setTimeout(() => setPhase("generating"), 2400)
    const t3 = window.setTimeout(() => setPhase("complete"), 4800)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [active])

  if (!active) return null

  const showLetter = phase === "generating" || phase === "complete"

  return (
    <div
      className={`relative mx-auto w-full max-w-lg min-h-[280px] rounded-xl border border-border bg-muted/30 p-6 ${className}`}
      aria-live="polite"
      aria-busy={phase !== "complete"}
    >
      <h3 className="text-center text-sm font-semibold text-foreground">
        Creating your cover letter
      </h3>
      <p className="mt-1 text-center text-xs text-muted-foreground">
        Merging job description with your profile
      </p>

      <div className="relative mt-8 min-h-[200px]">
        <div
          className={`absolute left-0 top-0 w-[42%] transition-all duration-700 ease-out ${
            phase === "inputs"
              ? "translate-y-0 opacity-100"
              : phase === "merging"
                ? "translate-x-[55%] scale-90 opacity-100"
                : "scale-75 opacity-0"
          }`}
        >
          <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="size-4 text-accent" aria-hidden />
              <span className="text-xs font-medium">Job description</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-muted" />
              <div className="h-2 w-4/5 rounded-full bg-muted" />
              <div className="h-2 w-3/5 rounded-full bg-muted/80" />
            </div>
          </div>
        </div>

        <div
          className={`absolute right-0 top-0 w-[42%] transition-all duration-700 ease-out delay-150 ${
            phase === "inputs"
              ? "translate-y-0 opacity-100"
              : phase === "merging"
                ? "-translate-x-[55%] scale-90 opacity-100"
                : "scale-75 opacity-0"
          }`}
        >
          <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <User className="size-4 text-guava-green" aria-hidden />
              <span className="text-xs font-medium">Your profile</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-3/4 rounded-full bg-muted" />
              <div className="h-2 w-full rounded-full bg-muted" />
              <div className="h-2 w-2/3 rounded-full bg-muted/80" />
            </div>
          </div>
        </div>

        <div
          className={`absolute left-1/2 top-6 -translate-x-1/2 transition-all duration-500 ${
            phase === "merging" || phase === "generating"
              ? "scale-100 opacity-100"
              : "scale-50 opacity-0"
          }`}
        >
          <div
            className={`flex size-12 items-center justify-center rounded-full bg-guava-pink-light ${
              phase === "generating" ? "animate-pulse" : ""
            }`}
          >
            <Sparkles className="size-6 text-accent" aria-hidden />
          </div>
        </div>

        <div
          className={`absolute left-1/2 top-[88px] w-[88%] -translate-x-1/2 transition-all duration-700 ${
            showLetter ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="relative overflow-hidden rounded-xl border border-accent/30 bg-card p-4 shadow-md">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="size-4 text-accent" aria-hidden />
              <span className="text-xs font-semibold">Cover letter</span>
            </div>
            <div className="space-y-2">
              {[100, 92, 88, 70].map((width, i) => (
                <div
                  key={width}
                  className={`h-2 rounded-full bg-foreground/10 transition-all duration-500 ${
                    phase === "complete" ? "opacity-100" : "w-0 opacity-30"
                  }`}
                  style={{
                    width: phase === "complete" ? `${width}%` : undefined,
                    transitionDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
            {phase === "generating" ? (
              <div className="animate-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
            ) : null}
          </div>
          {phase === "complete" ? (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Grounded in your profile — no invented facts
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {phase === "inputs" && "Reading job requirements and your experience…"}
        {phase === "merging" && "Matching your background to the role…"}
        {phase === "generating" && "Writing your personalised letter…"}
        {phase === "complete" && "Almost done…"}
      </p>
    </div>
  )
}
