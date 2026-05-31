import { Suspense } from "react"

import { SignInForm } from "@/components/auth/sign-in-form"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Sign in",
}

function SignInFormFallback() {
  return <Skeleton className="mx-auto h-96 max-w-md rounded-xl" />
}

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-4 py-12 md:px-6">
      <div className="w-full">
        <Suspense fallback={<SignInFormFallback />}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  )
}
