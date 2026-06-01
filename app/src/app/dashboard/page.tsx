import { Suspense } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LayoutDashboard, Plus } from "lucide-react"
import { applicationsService, usersService } from "@guavajobs/core"

import { ApplicationTracker } from "@/components/dashboard/application-tracker"
import { TrackedToast } from "@/components/dashboard/tracked-toast"
import { EmptyState } from "@/components/empty-state"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth/get-session"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) {
    redirect("/sign-in?next=/dashboard")
  }

  await usersService.ensureUser(session)
  const applications = await applicationsService.listByUser(session.id)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <Suspense fallback={null}>
        <TrackedToast />
      </Suspense>
      <PageHeader
        title="Application tracker"
        description="Track every role you pursue. Expand a row to update status, add notes, or open the full application page."
      />

      <div className="mb-8 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/jobs">Browse jobs</Link>
        </Button>
        <Button asChild className="bg-guava-pink-gradient text-accent-foreground hover:opacity-90">
          <Link href="/applications/new">
            <Plus className="size-4" aria-hidden />
            Add job manually
          </Link>
        </Button>
      </div>

      {applications.length > 0 ? (
        <ApplicationTracker applications={applications} />
      ) : (
        <EmptyState
          icon={LayoutDashboard}
          title="No applications yet"
          description="Track a job from the board or add one manually to start your pipeline."
          action={{ label: "Browse jobs", href: "/jobs" }}
        />
      )}
    </div>
  )
}
