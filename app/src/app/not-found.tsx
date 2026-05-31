import Link from "next/link"
import { SearchX } from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <EmptyState
        icon={SearchX}
        title="Page not found"
        description="This page does not exist or may have moved."
        action={{ label: "Browse jobs", href: "/jobs" }}
      />
      <div className="mt-6 text-center">
        <Button asChild variant="ghost">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  )
}
