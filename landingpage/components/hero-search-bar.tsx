import { Briefcase, MapPin, Search } from "lucide-react";

import { appJobsUrl } from "@/lib/env";

type HeroSearchBarProps = {
  defaultWhere?: string;
  defaultCountry?: "gb" | "de";
};

export function HeroSearchBar({
  defaultWhere = "",
  defaultCountry = "gb",
}: HeroSearchBarProps) {
  const cityPlaceholder =
    defaultCountry === "de" ? "City, e.g. Berlin" : "City, e.g. London";

  return (
    <form
      method="get"
      action={appJobsUrl}
      className="flex w-full flex-col gap-3 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-search-float backdrop-blur-sm sm:flex-row sm:flex-wrap sm:items-end xl:flex-nowrap xl:gap-3"
    >
      <div className="relative min-w-0 w-full sm:flex-[1_1_12rem] xl:flex-[1.3]">
        <Briefcase
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-guava-pink/70"
          aria-hidden
        />
        <input
          id="hero-search-q"
          name="q"
          type="search"
          placeholder="Junior AI engineer, React developer, solutions engineer…"
          className="flex h-12 w-full min-w-0 rounded-xl border border-input/80 bg-background py-2 pl-11 pr-3 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guava-pink/40"
        />
      </div>
      <div className="relative min-w-0 w-full sm:flex-[1_1_12rem] xl:flex-1">
        <MapPin
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-guava-green/80"
          aria-hidden
        />
        <input
          id="hero-search-where"
          name="where"
          type="search"
          placeholder={cityPlaceholder}
          defaultValue={defaultWhere}
          className="flex h-12 w-full min-w-0 rounded-xl border border-input/80 bg-background py-2 pl-11 pr-3 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guava-pink/40"
        />
      </div>
      <div className="relative w-full sm:flex-[1_1_11rem] sm:min-w-[11rem] sm:max-w-[14rem] xl:w-[12.5rem] xl:flex-none">
        <label htmlFor="hero-search-country" className="sr-only">
          Market
        </label>
        <select
          id="hero-search-country"
          name="country"
          defaultValue={defaultCountry}
          className="flex h-12 w-full min-w-0 rounded-xl border border-input/80 bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guava-pink/40"
        >
          <option value="gb">United Kingdom</option>
          <option value="de">Germany</option>
        </select>
      </div>
      <button
        type="submit"
        className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-guava-pink-gradient px-6 text-sm font-medium text-white shadow-md transition-opacity hover:opacity-90 sm:w-auto sm:min-w-[9.5rem] xl:flex-none"
      >
        <Search className="size-4 shrink-0" aria-hidden />
        <span className="whitespace-nowrap">Find jobs</span>
      </button>
    </form>
  );
}
