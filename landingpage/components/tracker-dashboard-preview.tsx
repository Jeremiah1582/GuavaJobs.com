"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Briefcase, FileText, Search } from "lucide-react"
import { formatApplicationStatusLabel, getApplicationRowClass } from "@guavajobs/core"

import { appDashboardUrl, appUrl } from "@/lib/env"

type MockRow = {
  title: string
  company: string
  status:
    | "DRAFT"
    | "APPLIED"
    | "WAITING"
    | "INTERVIEW"
    | "OFFER"
    | "ACCEPTED"
  rejectionPhase?: "PRE_INTERVIEW" | "POST_INTERVIEW" | null
  icon: typeof Briefcase
}

const MOCK_ROWS: MockRow[] = [
  {
    title: "Frontend Developer",
    company: "TechCorp Ltd",
    status: "INTERVIEW",
    icon: Briefcase,
  },
  {
    title: "Solutions Engineer",
    company: "SaaS Co",
    status: "WAITING",
    rejectionPhase: "POST_INTERVIEW",
    icon: FileText,
  },
  {
    title: "Junior React Developer",
    company: "StartupXYZ",
    status: "APPLIED",
    icon: FileText,
  },
  {
    title: "AI Engineer",
    company: "Innovation Co",
    status: "WAITING",
    rejectionPhase: "PRE_INTERVIEW",
    icon: Search,
  },
  {
    title: "Graduate Developer",
    company: "Agency Ltd",
    status: "DRAFT",
    icon: Search,
  },
]

export function TrackerDashboardPreview() {
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const start = viewportHeight * 0.85
      const end = viewportHeight * 0.25
      const progress = Math.min(
        Math.max((start - rect.top) / (start - end), 0),
        1,
      )
      setScrollProgress(progress)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scale = 0.9 + scrollProgress * 0.1
  const borderRadius = (1 - scrollProgress) * 28

  return (
    <section
      ref={sectionRef}
      id="product-preview"
      className="px-6 py-16 md:py-24"
      aria-label="Application tracker preview"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center md:mb-12">
          <p className="text-sm font-medium text-guava-pink">Your career command centre</p>
          <h2 className="mt-2 font-serif text-3xl text-foreground text-balance md:text-4xl">
            Track every application with ease
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Track stages, add notes, and stay organised — the same dashboard you get when you
            sign up free.
          </p>
        </div>

        <div
          className="relative mx-auto max-w-4xl transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{
            transform: `scale(${scale})`,
            borderRadius: `${borderRadius}px`,
          }}
        >
          <div className="animate-float-gentle-slow rounded-3xl bg-guava-pink bg-guava-pink-gradient p-6 shadow-xl md:p-10 lg:p-12">
            <div className="overflow-hidden rounded-2xl border border-border/50 bg-background/90 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-guava-pink/60" />
                  <div className="h-3 w-3 rounded-full bg-guava-green/60" />
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {new URL(appUrl).host}
                </span>
              </div>

              <div className="p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">My Applications</h3>
                  <span className="rounded-full border border-guava-pink/20 bg-guava-pink/10 px-3 py-1 text-xs font-medium text-guava-pink">
                    {MOCK_ROWS.length} Active
                  </span>
                </div>

                <div className="space-y-3">
                  {MOCK_ROWS.map((row) => {
                    const Icon = row.icon
                    const rowClass = getApplicationRowClass(
                      row.status,
                      row.rejectionPhase,
                    )
                    const label = row.rejectionPhase
                      ? "Rejected"
                      : formatApplicationStatusLabel(row.status)

                    return (
                      <div
                        key={`${row.title}-${row.company}`}
                        className={`flex items-center justify-between rounded-xl border border-border/50 p-4 transition-transform duration-500 hover:scale-[1.01] ${rowClass}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/60">
                            <Icon className="h-5 w-5 text-guava-pink" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{row.title}</p>
                            <p className="text-xs opacity-80">{row.company}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-background/50 px-2.5 py-1 text-xs font-medium">
                          {label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href={appDashboardUrl}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-guava-pink-gradient px-8 py-3 text-sm font-medium text-white shadow-md transition-opacity hover:opacity-90"
            >
              Open your dashboard
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
