"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { JobSearchBarForm } from "@shared/components/job-search-bar";
import { buildJobsSearchUrl, type JobSortBy } from "@shared/jobs/search-url";

export type JobSearchBarProps = {
  defaultQ?: string;
  defaultWhere?: string;
  defaultCountry?: "gb" | "de";
  submitLabel?: string;
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
  className = "",
  preferenceQ,
}: JobSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(defaultQ);

  useEffect(() => {
    setQ(defaultQ);
  }, [defaultQ]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const keywords = String(form.get("q") ?? "").trim();
    const where = String(form.get("where") ?? "").trim();
    const country = (String(form.get("country") ?? "gb") === "de" ? "de" : "gb") as
      | "gb"
      | "de";

    const href = buildJobsSearchUrl("/jobs", {
      q: keywords || undefined,
      where: where || undefined,
      country,
      ...preservedFilters(searchParams),
    });

    startTransition(() => {
      router.push(href);
    });
  }

  const showPreferences =
    Boolean(preferenceQ?.trim()) && preferenceQ!.trim() !== q.trim();

  return (
    <>
      {preferenceQ?.trim() ? (
        <div className="mb-1 flex justify-end">
          <button
            type="button"
            disabled={!showPreferences || pending}
            onClick={() => setQ(preferenceQ!.trim())}
            className="text-[11px] font-medium leading-none text-guava-pink hover:underline disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
          >
            Use my preferences
          </button>
        </div>
      ) : null}
      <JobSearchBarForm
        key={`${defaultQ}|${defaultWhere}|${defaultCountry}`}
        idPrefix="job-search"
        defaultQ={defaultQ}
        defaultWhere={defaultWhere}
        defaultCountry={defaultCountry}
        q={q}
        onQChange={setQ}
        submitLabel={submitLabel}
        pending={pending}
        className={className}
        onSubmit={onSubmit}
      />
    </>
  );
}
