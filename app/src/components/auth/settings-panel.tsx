"use client"

import { useState, useTransition } from "react"
import { AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { deleteAccountAction, signOutAction } from "@/lib/auth/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

type SettingsPanelProps = {
  email: string
}

export function SettingsPanel({ email }: SettingsPanelProps) {
  const [confirmEmail, setConfirmEmail] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSigningOut, startSignOut] = useTransition()
  const [isDeleting, startDelete] = useTransition()

  function handleSignOut() {
    startSignOut(async () => {
      await signOutAction()
    })
  }

  function handleDelete() {
    setError(null)
    startDelete(async () => {
      const result = await deleteAccountAction(confirmEmail)
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Account</CardTitle>
          <CardDescription>Your sign-in email and session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-display">Email</Label>
            <Input
              id="email-display"
              type="email"
              value={email}
              readOnly
              disabled
              className="bg-muted/50"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing out…
              </>
            ) : (
              "Sign out"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Delete account</CardTitle>
          <CardDescription>
            Permanently remove your account, profile, and application data
            (GDPR). This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showDeleteConfirm ? (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete account
            </Button>
          ) : (
            <>
              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <p className="text-sm text-muted-foreground">
                Type <span className="font-medium text-foreground">{email}</span>{" "}
                to confirm deletion.
              </p>

              <div className="space-y-2">
                <Label htmlFor="confirm-email">Confirm email</Label>
                <Input
                  id="confirm-email"
                  type="email"
                  value={confirmEmail}
                  onChange={(event) => setConfirmEmail(event.target.value)}
                  disabled={isDeleting}
                  placeholder={email}
                />
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting || !confirmEmail.trim()}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    "Yes, delete my account"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setConfirmEmail("")
                    setError(null)
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
