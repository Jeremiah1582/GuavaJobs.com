import { ArrowUpRight, Briefcase, FileText } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

import { HeroJobsSection } from "@/components/hero-jobs-section"
import { HeroSearchBar } from "@/components/hero-search-bar"
import { getLandingGeo } from "@/lib/geo"
import { appSignUpUrl } from "@/lib/env"

function HeroJobsFallback() {
  return (
    <div className="mx-auto mt-12 w-[90%] max-w-6xl border-t border-border/60 pt-8">
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 min-w-[260px] shrink-0 animate-pulse rounded-xl bg-muted/60"
          />
        ))}
      </div>
    </div>
  )
}

export default async function Hero() {
  const geo = await getLandingGeo()

  return (
    <section
      id="home"
      className="flex min-h-[min(100vh,920px)] flex-col pt-28 pb-12 md:pb-16"
    >
      <div className="mx-auto flex w-full flex-1 flex-col items-center px-4 sm:px-6">
        <div className="w-[90%] max-w-6xl text-center">
          <h1 className="text-balance font-sans text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Your Career Hub for{" "}
            <span className="text-guava-pink">Job Applications</span>{" "}
            & AI Cover Letters
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Built for UK and Germany bootcamp graduates and tech career changers.
            Search junior roles near you, track every application, and draft cover
            letters from your profile only. Free to use, no credit card required.
          </p>

          <div className="mx-auto mt-10 w-full animate-float-gentle motion-reduce:animate-none">
            <HeroSearchBar defaultWhere={geo.city} defaultCountry={geo.market} />
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <Link
              href={appSignUpUrl}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-guava-green/30 px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-guava-green hover:text-guava-green"
            >
              Sign up free
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-guava-pink" />
                Unlimited application tracking
              </span>
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4 text-guava-green" />
                5 free AI cover letters/month
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto w-full pt-12">
          <div className="mx-auto w-[90%] max-w-6xl">
            <Suspense fallback={<HeroJobsFallback />}>
              <HeroJobsSection />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
