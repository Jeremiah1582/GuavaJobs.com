import type { PrismaClient } from "../generated/prisma"

import { getPrismaClient } from "./client"

export { getPrismaClient } from "./client"
export { createSupabaseAdmin, isSupabaseConfigured } from "./supabase"

let _client: PrismaClient | null = null

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

/** Returns singleton Prisma client. Requires DATABASE_URL and `prisma generate`. */
export function getDb(): PrismaClient {
  if (!_client) {
    if (!isDatabaseConfigured()) {
      throw new Error(
        "@guavajobs/core: DATABASE_URL is not set. See packages/core README.",
      )
    }
    _client = getPrismaClient()
  }
  return _client
}

/** For tests or explicit bootstrap only. */
export function setDb(client: PrismaClient | null): void {
  _client = client
}
