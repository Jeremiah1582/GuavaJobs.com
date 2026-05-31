import Link from "next/link"

import { ConfirmEmailPanel } from "@/components/auth/confirm-email-panel"
import { Button } from "@/components/ui/button"
import { resolveNextParam } from "@/lib/auth/routes"

export const metadata = {
  title: "Confirm your email",
}

type PageProps = {
  searchParams: Promise<{ email?: string; next?: string }>
}

export default async function ConfirmEmailPage({ searchParams }: PageProps) {
  const params = await searchParams
  const email = params.email?.trim() ?? ""
  const next = resolveNextParam(params.next)

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12 md:px-6">
      <ConfirmEmailPanel email={email} next={next} />
      <div className="mt-6 text-center">
        <Button asChild variant="outline" size="sm">
          <Link
            href={`/sign-in${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}
          >
            Back to sign in
          </Link>
        </Button>
      </div>
    </div>
  )
}
