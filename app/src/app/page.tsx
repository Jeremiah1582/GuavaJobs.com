import Link from "next/link"
import { Briefcase, Sparkles } from "lucide-react"

import { HomeDemoToast } from "@/components/home-demo"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20 bg-section-pink rounded-2xl">
      <PageHeader
        title="Your career hub"
        description="Track applications, browse jobs, and draft cover letters — all in one place. Auth and full features ship in upcoming phases."
      />

      <div className="flex flex-wrap gap-4">
        <Button asChild className="bg-guava-pink-gradient text-accent-foreground hover:opacity-90">
          <Link href="/jobs">
            <Briefcase className="size-4" />
            Browse jobs
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/sign-up">
            <Sparkles className="size-4" />
            Get started free
          </Link>
        </Button>
        <HomeDemoToast />
      </div>
    </div>
  )
}
