/**
 * Verifies resolveListing uses search snapshot when detail API returns null.
 * Run: npx tsx scripts/test-resolve-job-listing.mjs
 */
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const coreRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const jobsIndex = pathToFileURL(join(coreRoot, "src/services/jobs/index.ts")).href;

const { jobsService } = await import(jobsIndex);

const snapshot = {
  id: "gb-999999999",
  country: "gb",
  adzunaId: "999999999",
  title: "Test Engineer",
  company: "Acme",
  location: "London",
  description: "A".repeat(100),
  redirectUrl: "https://example.com/job",
};

const originalGetById = jobsService.getById.bind(jobsService);
jobsService.getById = async () => null;

const resolved = await jobsService.resolveListing(snapshot.id, snapshot);
jobsService.getById = originalGetById;

if (!resolved || resolved.title !== snapshot.title) {
  console.error("✗ resolveListing did not return snapshot");
  process.exit(1);
}

const fromCache = await jobsService.getById(snapshot.id);
if (!fromCache) {
  console.error("✗ snapshot was not written to job cache");
  process.exit(1);
}

console.log("✓ resolveListing uses client snapshot and warms cache");
