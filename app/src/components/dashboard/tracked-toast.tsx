"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

/**
 * Shows a success toast when `?tracked=1` is present after saving an application.
 * On the applications list, prompts the user to open a row; on a detail page,
 * prompts them to continue the draft (notes, status, cover letter).
 */
export function TrackedToast() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const hasShownToastRef = useRef(false)

  const tracked = searchParams.get("tracked")
  const queryString = searchParams.toString()

  useEffect(() => {
    hasShownToastRef.current = false
  }, [pathname])

  useEffect(() => {
    if (tracked !== "1") return

    if (!hasShownToastRef.current) {
      hasShownToastRef.current = true
      const isDetail =
        pathname.startsWith("/applications/") && pathname !== "/applications"

      toast.success("Application saved as draft", {
        description: isDetail
          ? "Continue below — add notes, update status, or generate a cover letter."
          : "Your tracked role is in the list. Open it to continue the application.",
      })
    }

    const params = new URLSearchParams(queryString)
    params.delete("tracked")
    const nextQuery = params.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    })
  }, [tracked, queryString, pathname, router])

  return null
}
