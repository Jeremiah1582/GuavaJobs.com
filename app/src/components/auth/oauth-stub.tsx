"use client"

import { Chrome } from "lucide-react"

import { Button } from "@/components/ui/button"

export function OAuthStub() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled
      aria-disabled="true"
    >
      <Chrome className="size-4" aria-hidden="true" />
      Continue with Google — coming soon
    </Button>
  )
}
