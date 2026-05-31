import { Suspense } from "react"

import { SignUpForm } from "@/components/auth/sign-up-form"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Create account",
}

function SignUpFormFallback() {
  return <Skeleton className="mx-auto h-[28rem] max-w-md rounded-xl" />
}

export default function SignUpPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-4 py-12 md:px-6">
      <div className="w-full">
        <Suspense fallback={<SignUpFormFallback />}>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  )
}
