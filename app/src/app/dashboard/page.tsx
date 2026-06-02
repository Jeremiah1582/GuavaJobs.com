import { redirect } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Briefcase,
  Calendar,
  ClipboardList,
  TrendingUp,
} from "lucide-react"
import { applicationsService, usersService } from "@guavajobs/core"

import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth/get-session"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Dashboard - Guavajobs",
  description: "View your job search analytics and insights.",
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) {
    redirect("/sign-in?next=/dashboard")
  }

  await usersService.ensureUser(session)
  const applications = await applicationsService.listByUser(session.id)

  // Calculate some basic stats
  const totalApplications = applications.length
  const activeApplications = applications.filter(
    (a) => !a.rejectionPhase && a.status !== "ACCEPTED"
  ).length
  const interviewCount = applications.filter(
    (a) => a.status === "INTERVIEW" && !a.rejectionPhase
  ).length
  const offerCount = applications.filter(
    (a) => (a.status === "OFFER" || a.status === "ACCEPTED") && !a.rejectionPhase
  ).length
  const rejectedCount = applications.filter((a) => a.rejectionPhase).length

  // Calculate response rate
  const appliedCount = applications.filter(
    (a) => a.status !== "DRAFT"
  ).length
  const responseCount = applications.filter(
    (a) => a.status !== "DRAFT" && a.status !== "APPLIED" && a.status !== "WAITING"
  ).length
  const responseRate = appliedCount > 0 ? Math.round((responseCount / appliedCount) * 100) : 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-foreground md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track your job search progress and insights.
        </p>
      </header>

      {/* Quick Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2.5 dark:bg-slate-900">
              <ClipboardList className="size-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">{totalApplications}</p>
              <p className="text-sm text-muted-foreground">Total Applications</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-sky-100 p-2.5 dark:bg-sky-950">
              <Calendar className="size-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">{interviewCount}</p>
              <p className="text-sm text-muted-foreground">Interviews Scheduled</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2.5 dark:bg-emerald-950">
              <Briefcase className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">{offerCount}</p>
              <p className="text-sm text-muted-foreground">Offers Received</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2.5 dark:bg-amber-950">
              <TrendingUp className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">{responseRate}%</p>
              <p className="text-sm text-muted-foreground">Response Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pipeline Overview */}
        <div className="rounded-xl border border-border bg-card lg:col-span-2">
          <div className="border-b border-border px-5 py-4">
            <h2 className="flex items-center gap-2 font-semibold">
              <BarChart3 className="size-4" />
              Pipeline Overview
            </h2>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {[
                { label: "Draft", count: applications.filter(a => a.status === "DRAFT" && !a.rejectionPhase).length, color: "bg-slate-400" },
                { label: "Applied", count: applications.filter(a => a.status === "APPLIED" && !a.rejectionPhase).length, color: "bg-yellow-500" },
                { label: "Waiting", count: applications.filter(a => a.status === "WAITING" && !a.rejectionPhase).length, color: "bg-amber-500" },
                { label: "Interview", count: applications.filter(a => a.status === "INTERVIEW" && !a.rejectionPhase).length, color: "bg-sky-500" },
                { label: "Offer", count: applications.filter(a => a.status === "OFFER" && !a.rejectionPhase).length, color: "bg-blue-500" },
                { label: "Accepted", count: applications.filter(a => a.status === "ACCEPTED" && !a.rejectionPhase).length, color: "bg-emerald-500" },
                { label: "Rejected", count: rejectedCount, color: "bg-red-500" },
              ].map((stage) => (
                <div key={stage.label} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-muted-foreground">{stage.label}</div>
                  <div className="flex-1">
                    <div className="h-6 overflow-hidden rounded-full bg-muted/50">
                      <div
                        className={`h-full ${stage.color} transition-all duration-700`}
                        style={{
                          width: totalApplications > 0
                            ? `${(stage.count / totalApplications) * 100}%`
                            : "0%",
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-8 text-right text-sm font-medium tabular-nums">
                    {stage.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold">Quick Actions</h2>
            </div>
            <div className="flex flex-col gap-2 p-4">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/applications">
                  <ClipboardList className="mr-2 size-4" />
                  View All Applications
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/jobs">
                  <Briefcase className="mr-2 size-4" />
                  Browse Jobs
                </Link>
              </Button>
              <Button asChild className="justify-start bg-guava-pink-gradient text-accent-foreground">
                <Link href="/applications/new">
                  Add New Application
                </Link>
              </Button>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-5 text-center">
            <BarChart3 className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              More Analytics Coming Soon
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Application trends, success rates, and personalized insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
