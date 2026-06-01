import type { ReactNode } from "react"

import { getSession } from "@/lib/auth/get-session"

import { AppFooter } from "./app-footer"
import { AppHeaderNav } from "./app-header-nav"
import { AppSidebar } from "./app-sidebar"

type AppShellProps = {
  children: ReactNode
}

export async function AppShell({ children }: AppShellProps) {
  const session = await getSession()
  const signedIn = Boolean(session)

  return (
    <div className="flex min-h-screen flex-1 flex-col md:flex-row">
      {signedIn ? <AppSidebar /> : null}
      <div className="flex min-h-0 flex-1 flex-col">
        <AppHeaderNav signedIn={signedIn} />
        <main className="min-h-0 flex-1 pt-24 md:pt-0">{children}</main>
        <AppFooter />
      </div>
    </div>
  )
}
