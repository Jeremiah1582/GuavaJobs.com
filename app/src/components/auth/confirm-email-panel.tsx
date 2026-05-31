"use client"

import { useActionState } from "react"
import { AlertCircle, Mail } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  resendConfirmationAction,
  type AuthActionState,
} from "@/lib/auth/actions"

type ConfirmEmailPanelProps = {
  email: string
  next: string
}

export function ConfirmEmailPanel({ email, next }: ConfirmEmailPanelProps) {
  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(
    resendConfirmationAction,
    null,
  )

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent/10">
          <Mail className="size-6 text-accent" aria-hidden="true" />
        </div>
        <CardTitle className="font-serif text-2xl">Check your inbox</CardTitle>
        <CardDescription>
          We sent a confirmation link
          {email ? (
            <>
              {" "}
              to <span className="font-medium text-foreground">{email}</span>
            </>
          ) : (
            " to your email"
          )}
          . Click the link to activate your account, then sign in.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {state?.error ? (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        ) : null}
        {state?.success ? (
          <Alert>
            <AlertDescription>{state.success}</AlertDescription>
          </Alert>
        ) : null}

        {email ? (
          <form action={formAction} className="space-y-3">
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="next" value={next} />
            <Button
              type="submit"
              variant="outline"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Sending…" : "Resend confirmation email"}
            </Button>
          </form>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Use the link in your email. If you did not receive it, try signing
            up again.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
