/**
 * Loads app/.env.local then runs Prisma CLI from packages/core.
 * Usage: node scripts/prisma-with-app-env.mjs <prisma-args...>
 * Example: node scripts/prisma-with-app-env.mjs db push
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const coreRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(coreRoot, "../../app/.env.local");

function loadEnvFile(path) {
  if (!existsSync(path)) {
    console.error(
      `Missing ${path}. Copy app/.env.example to app/.env.local and set DATABASE_URL / DIRECT_URL.`,
    );
    process.exit(1);
  }
  const content = readFileSync(path, "utf8");
  for (const line of content.split(/\r?\n/)) {
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
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(envPath);

const prismaArgs = process.argv.slice(2);
if (prismaArgs.length === 0) {
  console.error("Usage: node scripts/prisma-with-app-env.mjs <prisma-command> [args...]");
  process.exit(1);
}

const prismaBin = join(
  coreRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "prisma.cmd" : "prisma",
);

const result = spawnSync(prismaBin, prismaArgs, {
  cwd: coreRoot,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
