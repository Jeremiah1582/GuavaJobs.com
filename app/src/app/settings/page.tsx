import { redirect } from "next/navigation"

import { SettingsPanel } from "@/components/auth/settings-panel"
import { getSession } from "@/lib/auth/get-session"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Account settings",
}

export default async function SettingsPage() {
  const session = await getSession()
  if (!session) {
    redirect("/sign-in?next=/settings")
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 md:px-6">
      <header className="mb-8">
        <h1 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
          Settings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account, session, and data.
        </p>
      </header>
      <SettingsPanel email={session.email} />
    </div>
  )
}
