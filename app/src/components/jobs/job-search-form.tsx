"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type JobSearchFormProps = {
  defaultQ?: string
  defaultWhere?: string
  defaultCountry?: "gb" | "de"
}

export function JobSearchForm({
  defaultQ = "",
  defaultWhere = "",
  defaultCountry = "gb",
}: JobSearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const params = new URLSearchParams(searchParams.toString())
    params.delete("page")

    const q = String(form.get("q") ?? "").trim()
    const where = String(form.get("where") ?? "").trim()
    const country = String(form.get("country") ?? "gb")

    if (q) params.set("q", q)
    else params.delete("q")
    if (where) params.set("where", where)
    else params.delete("where")
    params.set("country", country)

    startTransition(() => {
      router.push(`/jobs?${params.toString()}`)
    })
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 rounded-xl border border-border bg-card p-4 md:grid-cols-[1fr_1fr_auto_auto] md:items-end md:p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="q">Keywords</Label>
        <Input
          id="q"
          name="q"
          placeholder="e.g. React developer"
          defaultValue={defaultQ}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="where">Location</Label>
        <Input
          id="where"
          name="where"
          placeholder={defaultCountry === "de" ? "e.g. Berlin" : "e.g. London"}
          defaultValue={defaultWhere}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Market</Label>
        <select
          id="country"
          name="country"
          defaultValue={defaultCountry}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="gb">United Kingdom</option>
          <option value="de">Germany</option>
        </select>
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="bg-guava-pink-gradient text-accent-foreground hover:opacity-90"
      >
        <Search className="mr-2 size-4" aria-hidden />
        {pending ? "Searching…" : "Search"}
      </Button>
    </form>
  )
}
