import { Suspense } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LayoutDashboard, Plus } from "lucide-react"
import { applicationsService, usersService } from "@guavajobs/core"

import { TrackedToast } from "@/components/dashboard/tracked-toast"
import { EmptyState } from "@/components/empty-state"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth/get-session"

export const dynamic = "force-dynamic"

function formatStatus(status: string): string {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

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
        description="Your saved job applications. Full pipeline tools ship in F7."
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
        <ul className="divide-y divide-border rounded-lg border border-border">
          {applications.map((application) => (
            <li
              key={application.id}
              className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">{application.title}</p>
                <p className="text-sm text-muted-foreground">{application.company}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{formatStatus(application.status)}</span>
                <time dateTime={application.updatedAt.toISOString()}>
                  {application.updatedAt.toLocaleDateString("en-GB")}
                </time>
              </div>
            </li>
          ))}
        </ul>
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
