import type { User } from "../generated/prisma"
import { validateSessionUser, type SessionUser } from "../auth/session"
import { getDb } from "../db"

export async function ensureUser(input: SessionUser): Promise<User> {
  const user = validateSessionUser(input)
  const db = getDb()

  return db.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email,
    },
    update: {
      email: user.email,
    },
  })
}

export async function deleteUser(id: string): Promise<void> {
  const db = getDb()
  await db.user.delete({ where: { id } })
}

export const usersService = {
  ensureUser,
  deleteUser,
}
