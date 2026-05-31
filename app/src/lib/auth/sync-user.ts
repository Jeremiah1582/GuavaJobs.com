"use server"

import { usersService } from "@guavajobs/core"

export async function syncUserAction(input: { id: string; email: string }) {
  await usersService.ensureUser(input)
}
