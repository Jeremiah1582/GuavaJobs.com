import Link from "next/link"
import { Briefcase } from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"

export default function JobNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <EmptyState
        icon={Briefcase}
        title="Job not found"
        description="This listing may have expired or the link is incorrect."
        action={{ label: "Browse jobs", href: "/jobs" }}
      />
      <div className="mt-6 text-center">
        <Button asChild variant="outline">
          <Link href="/jobs">Back to job board</Link>
        </Button>
      </div>
    </div>
  )
}
