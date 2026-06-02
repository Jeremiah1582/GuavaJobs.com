/**
 * Smoke test for profile URL import normalization + optional live import.
 * Usage:
 *   node scripts/test-profile-url-import.mjs
 *   node scripts/test-profile-url-import.mjs --live https://jeremiahpbrown.dev
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const coreRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(coreRoot, "../../app/.env.local");

function loadEnvFile(path) {
  if (!existsSync(path)) {
    console.error(`Missing ${path}`);
    process.exit(1);
  }
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(envPath);

const normalizeUrl = pathToFileURL(
  join(coreRoot, "src/services/profile-url-import/normalize.ts"),
).href;

const { normalizeAiProfile } = await import(normalizeUrl);

const nullQuizPayload = {
  name: "Jeremiah Brown",
  summary: "Software engineer portfolio.",
  skills: ["TypeScript", "React"],
  experience: [],
  education: [],
  quiz: { roleType: null, workMode: null, priorities: null },
  confidence: "medium",
};

try {
  const result = normalizeAiProfile(nullQuizPayload, [
    { url: "https://jeremiahpbrown.dev/", path: "/", ok: true },
  ]);
  console.log("✓ normalizeAiProfile accepts null quiz fields");
  console.log("  quiz:", result.quiz === undefined ? "(omitted)" : result.quiz);
} catch (error) {
  console.error("✗ normalizeAiProfile failed:", error);
  process.exit(1);
}

const liveUrl = process.argv.find((a) => a.startsWith("http"));
if (liveUrl) {
  const importUrl = pathToFileURL(
    join(coreRoot, "src/services/profile-url-import/extract.ts"),
  ).href;
  const { importProfileFromUrl } = await import(importUrl);
  console.log(`\nLive import: ${liveUrl} …`);
  try {
    const data = await importProfileFromUrl(liveUrl);
    console.log("✓ Live import OK");
    console.log(
      `  confidence=${data.confidence} skills=${data.skills.length} exp=${data.experience.length}`,
    );
  } catch (error) {
    console.error("✗ Live import failed:", error);
    process.exit(1);
  }
} else {
  console.log("\nPass --live <url> to run a full fetch + AI import (uses OPENAI_API_KEY).");
}
