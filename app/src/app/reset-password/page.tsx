import { redirect } from "next/navigation"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { getSession } from "@/lib/auth/get-session"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Reset password",
}

export default async function ResetPasswordPage() {
  const session = await getSession()
  if (!session) {
    redirect("/sign-in?next=/reset-password")
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-4 py-12 md:px-6">
      <div className="w-full">
        <ResetPasswordForm />
      </div>
    </div>
  )
}
