"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { JobSearchBarForm } from "@shared/components/job-search-bar";
import {
  buildJobsSearchUrl,
  type JobCountry,
  type JobSortBy,
} from "@shared/jobs/search-url";

export type JobSearchBarProps = {
  defaultQ?: string;
  defaultWhere?: string;
  defaultCountry?: JobCountry;
  submitLabel?: string;
  /** Omit outer card chrome when nested inside `JobSearchToolbar`. */
  embedded?: boolean;
  className?: string;
  /** From profile quiz (`roleType`) — powers “Use my preferences”. */
  preferenceQ?: string;
};

function preservedFilters(searchParams: URLSearchParams) {
  const distanceKm = searchParams.get("distanceKm");
  const maxDaysOld = searchParams.get("maxDaysOld");
  const sortByRaw = searchParams.get("sortBy");

  return {
    distanceKm: distanceKm ? Number(distanceKm) : undefined,
    maxDaysOld: maxDaysOld ? Number(maxDaysOld) : undefined,
    sortBy:
      sortByRaw === "date" || sortByRaw === "relevance"
        ? (sortByRaw as JobSortBy)
        : undefined,
  };
}

export function JobSearchBar({
  defaultQ = "",
  defaultWhere = "",
  defaultCountry = "gb",
  submitLabel = "Find jobs",
  embedded = false,
  className = "",
  preferenceQ,
}: JobSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(defaultQ);
  const [where, setWhere] = useState(defaultWhere);
  const [country, setCountry] = useState<JobCountry>(defaultCountry);

  useEffect(() => {
    setQ(defaultQ);
  }, [defaultQ]);

  useEffect(() => {
    setWhere(defaultWhere);
  }, [defaultWhere]);

  useEffect(() => {
    setCountry(defaultCountry);
  }, [defaultCountry]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const keywords = q.trim();
    const location = where.trim();
    const market = country;

    const href = buildJobsSearchUrl("/jobs", {
      q: keywords || undefined,
      where: location || undefined,
      country: market,
      ...preservedFilters(searchParams),
    });

    startTransition(() => {
      router.push(href);
    });
  }

  const showPreferences =
    Boolean(preferenceQ?.trim()) && preferenceQ!.trim() !== q.trim();

  return (
    <div className="min-w-0 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
          Keywords &amp; location
        </p>
        {preferenceQ?.trim() ? (
          <button
            type="button"
            disabled={!showPreferences || pending}
            onClick={() => setQ(preferenceQ!.trim())}
            className="text-[11px] font-medium leading-none text-guava-pink hover:underline disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
          >
            Use my preferences
          </button>
        ) : null}
      </div>
      <JobSearchBarForm
        idPrefix="job-search"
        q={q}
        onQChange={setQ}
        where={where}
        onWhereChange={setWhere}
        country={country}
        onCountryChange={setCountry}
        submitLabel={submitLabel}
        pending={pending}
        embedded={embedded}
        className={className}
        onSubmit={onSubmit}
      />
    </div>
  );
}
