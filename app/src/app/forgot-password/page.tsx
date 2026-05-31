import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata = {
  title: "Forgot password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-4 py-12 md:px-6">
      <div className="w-full">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
