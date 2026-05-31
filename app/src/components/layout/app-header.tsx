import { getSession } from "@/lib/auth/get-session"

import { AppHeaderNav } from "./app-header-nav"

export async function AppHeader() {
  const session = await getSession()
  return <AppHeaderNav signedIn={!!session} />
}
