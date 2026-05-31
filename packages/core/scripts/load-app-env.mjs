import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const coreRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const appEnvPath = resolve(coreRoot, "../../app/.env.local");

export function loadAppEnv() {
  if (!existsSync(appEnvPath)) {
    throw new Error(
      `Missing ${appEnvPath}. Copy app/.env.example to app/.env.local.`,
    );
  }
  const content = readFileSync(appEnvPath, "utf8");
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

export function deriveSupabaseUrl() {
  if (process.env.SUPABASE_URL) return process.env.SUPABASE_URL;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL;
  }
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const match = databaseUrl.match(/postgres\.([a-z0-9]+)/i);
  if (match) return `https://${match[1]}.supabase.co`;
  return null;
}
