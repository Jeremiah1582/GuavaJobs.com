import type { ReactNode } from "react"

import { getSession } from "@/lib/auth/get-session"

import { AppHeaderNav } from "./app-header-nav"
import { AppSidebar } from "./app-sidebar"

type AppShellProps = {
  children: ReactNode
}

export async function AppShell({ children }: AppShellProps) {
  const session = await getSession()
  const signedIn = Boolean(session)

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
      {signedIn ? <AppSidebar /> : null}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AppHeaderNav signedIn={signedIn} />
        <div
          id="app-main-scroll"
          className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
        >
          <main className="min-h-0 flex-1 pt-24 md:pt-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
