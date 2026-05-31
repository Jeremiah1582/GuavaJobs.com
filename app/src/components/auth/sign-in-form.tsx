"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { AlertCircle } from "lucide-react"

import { OAuthStub } from "@/components/auth/oauth-stub"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { signInAction, type AuthActionState } from "@/lib/auth/actions"

function callbackErrorMessage(error: string | null): string | null {
  if (!error) return null
  if (error === "expired_link") {
    return "This confirmation link has expired. Request a new one from sign up."
  }
  if (error === "auth_callback_error") {
    return "Sign-in failed. Please try again."
  }
  return "Sign-in failed. Please try again."
}

export function SignInForm() {
  const searchParams = useSearchParams()
  const next =
    searchParams.get("next") ?? searchParams.get("returnUrl") ?? "/dashboard"
  const callbackError = searchParams.get("error")

  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(
    signInAction,
    callbackError
      ? { error: callbackErrorMessage(callbackError) ?? undefined }
      : null,
  )

  const error = state?.error

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Sign in</CardTitle>
        <CardDescription>
          Welcome back. Free — no credit card required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />

          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href={`/forgot-password${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}
                className="text-sm text-muted-foreground hover:text-accent"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-guava-pink-gradient text-accent-foreground hover:opacity-90"
            disabled={isPending}
          >
            {isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <OAuthStub />
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        No account?{" "}
        <Link
          href={`/sign-up${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="ml-1 font-medium text-accent hover:underline"
        >
          Create one free
        </Link>
      </CardFooter>
    </Card>
  )
}
