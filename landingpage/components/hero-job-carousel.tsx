"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import type { JobCountry, JobListing } from "@guavajobs/core";

import { appJobsUrl } from "@/lib/env";
import { buildJobsSearchUrl } from "@shared/jobs/search-url";

const PLACEHOLDER_JOBS = [
  { company: "Tech startup", title: "Junior React Developer", location: "Your city" },
  { company: "SaaS scale-up", title: "Junior Solutions Engineer", location: "Your city" },
  { company: "AI product team", title: "Junior AI Engineer", location: "Your city" },
  { company: "Digital agency", title: "Junior Full Stack Developer", location: "Your city" },
] as const;

type HeroJobCarouselProps = {
  jobs: JobListing[];
  geoCity: string;
  geoCountry?: JobCountry;
  searchFailed?: boolean;
};

function formatSalary(job: JobListing): string | null {
  const { salary } = job;
  if (!salary) return null;
  const symbol = salary.currency === "EUR" ? "€" : "£";
  if (salary.min != null && salary.max != null) {
    return `${symbol}${salary.min.toLocaleString()} – ${symbol}${salary.max.toLocaleString()}`;
  }
  if (salary.max != null) return `Up to ${symbol}${salary.max.toLocaleString()}`;
  if (salary.min != null) return `From ${symbol}${salary.min.toLocaleString()}`;
  return null;
}

export function HeroJobCarousel({
  jobs,
  geoCity,
  geoCountry = "gb",
  searchFailed = false,
}: HeroJobCarouselProps) {
  const displayJobs = jobs.length > 0 ? jobs : null;
  const slideCount = displayJobs?.length ?? PLACEHOLDER_JOBS.length;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: slideCount > 1,
    dragFree: true,
  });

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || slideCount <= 1) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = window.setInterval(scrollNext, 5000);
    return () => window.clearInterval(timer);
  }, [emblaApi, scrollNext, slideCount]);

  const boardUrl = buildJobsSearchUrl(appJobsUrl, {
    where: geoCity,
    country: geoCountry,
  });

  return (
    <div className="mt-10 border-t border-border/60 pt-8">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Popular near you</p>
          <p className="text-xs text-muted-foreground">
            Junior tech roles around {geoCity}
            {searchFailed ? " — live listings load on the job board" : ""}
          </p>
        </div>
        <Link
          href={boardUrl}
          className="inline-flex items-center gap-1 text-sm font-medium text-guava-pink hover:underline"
        >
          {displayJobs ? "Open full job board" : `Search junior roles near ${geoCity}`}
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {displayJobs
            ? displayJobs.map((job) => {
                const salary = formatSalary(job);
                const base = appJobsUrl.replace(/\/$/, "");
                const href = `${base}?job=${encodeURIComponent(job.id)}&where=${encodeURIComponent(geoCity)}&country=${geoCountry}`;
                return (
                  <Link
                    key={job.id}
                    href={href}
                    className="min-w-[260px] max-w-[280px] shrink-0 rounded-xl border border-border bg-card/90 p-4 shadow-sm transition-colors hover:border-guava-pink/40"
                  >
                    <p className="line-clamp-1 text-xs text-muted-foreground">{job.company}</p>
                    <p className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">
                      {job.title}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3 shrink-0" aria-hidden />
                      <span className="line-clamp-1">{job.location}</span>
                    </p>
                    {salary ? (
                      <p className="mt-2 text-xs font-medium text-guava-pink-dark">{salary}</p>
                    ) : null}
                  </Link>
                );
              })
            : PLACEHOLDER_JOBS.map((job) => (
                <Link
                  key={job.title}
                  href={boardUrl}
                  className="min-w-[260px] max-w-[280px] shrink-0 rounded-xl border border-dashed border-border bg-card/60 p-4 shadow-sm transition-colors hover:border-guava-pink/40"
                >
                  <p className="line-clamp-1 text-xs text-muted-foreground">{job.company}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">
                    {job.title}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3 shrink-0" aria-hidden />
                    <span className="line-clamp-1">{geoCity}</span>
                  </p>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
