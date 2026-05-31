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
import { signUpAction, type AuthActionState } from "@/lib/auth/actions"

export function SignUpForm() {
  const searchParams = useSearchParams()
  const next =
    searchParams.get("next") ?? searchParams.get("returnUrl") ?? "/dashboard"

  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(
    signUpAction,
    null,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Create account</CardTitle>
        <CardDescription>
          Free — no credit card required. Track applications and write cover
          letters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />

          {state?.error ? (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{state.error}</AlertDescription>
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-guava-pink-gradient text-accent-foreground hover:opacity-90"
            disabled={isPending}
          >
            {isPending ? "Creating account…" : "Create account"}
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
        Already have an account?{" "}
        <Link
          href={`/sign-in${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="ml-1 font-medium text-accent hover:underline"
        >
          Sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
