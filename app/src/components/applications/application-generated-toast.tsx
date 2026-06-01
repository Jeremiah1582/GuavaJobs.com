"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export function ApplicationGeneratedToast() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get("generated") !== "1") return

    toast.success("Cover letter ready — review and edit below.")

    const params = new URLSearchParams(searchParams.toString())
    params.delete("generated")
    const query = params.toString()
    router.replace(query ? `?${query}` : "", { scroll: false })
  }, [router, searchParams])

  return null
}
