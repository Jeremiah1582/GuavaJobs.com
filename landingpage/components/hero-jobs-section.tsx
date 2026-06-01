import { JUNIOR_DEFAULT_WHAT, jobsService } from "@guavajobs/core";

import { HeroJobCarousel } from "@/components/hero-job-carousel";
import { getLandingGeo } from "@/lib/geo";

export async function HeroJobsSection() {
  const geo = await getLandingGeo();

  let jobs: Awaited<ReturnType<typeof jobsService.search>>["jobs"] = [];
  let searchFailed = false;
  try {
    const result = await jobsService.search({
      q: JUNIOR_DEFAULT_WHAT,
      where: geo.city,
      country: geo.market,
      page: 1,
      resultsPerPage: 12,
      sortBy: "date",
      maxDaysOld: 14,
    });
    jobs = result.jobs;
  } catch {
    jobs = [];
    searchFailed = true;
  }

  return (
    <HeroJobCarousel
      jobs={jobs}
      geoCity={geo.city}
      geoCountry={geo.market}
      searchFailed={searchFailed}
    />
  );
}
