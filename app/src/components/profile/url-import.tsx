"use client"

import { useState } from "react"
import { Globe, Loader2, Sparkles, X, CheckCircle2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { EducationEntry, ExperienceEntry } from "@guavajobs/core"

type ParsedProfileData = {
  name?: string | null
  summary?: string | null
  location?: string | null
  skills?: string[]
  experience?: ExperienceEntry[]
  education?: EducationEntry[]
}

type UrlImportProps = {
  onImport: (data: ParsedProfileData) => void
  className?: string
}

type ImportState = "idle" | "loading" | "success" | "error"

export function UrlImport({ onImport, className }: UrlImportProps) {
  const [url, setUrl] = useState("")
  const [state, setState] = useState<ImportState>("idle")
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      setError("Please enter a valid URL (e.g., https://yoursite.com)")
      return
    }

    setState("loading")
    setError(null)

    try {
      const response = await fetch("/api/profile/parse-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to parse profile")
      }

      setState("success")
      onImport(result.data)
      
      // Reset after success animation
      setTimeout(() => {
        setUrl("")
        setState("idle")
        setIsExpanded(false)
      }, 2000)
    } catch (err) {
      setState("error")
      setError(err instanceof Error ? err.message : "Failed to import profile")
    }
  }

  const handleCancel = () => {
    setUrl("")
    setState("idle")
    setError(null)
    setIsExpanded(false)
  }

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl border border-dashed border-muted-foreground/30 bg-gradient-to-br from-muted/30 to-muted/10 p-4 text-left transition-all duration-700 hover:border-accent/50 hover:from-guava-pink-light/30 hover:to-muted/10",
          className
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-guava-pink-gradient text-accent-foreground transition-transform duration-700 group-hover:scale-110">
          <Sparkles className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground">Import from your website</p>
          <p className="text-sm text-muted-foreground">
            Paste a link to your portfolio or profile and let AI fill in your details
          </p>
        </div>
        <Globe className="size-5 shrink-0 text-muted-foreground transition-colors duration-700 group-hover:text-accent" />
      </button>
    )
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-br from-guava-pink-light/40 to-muted/20 transition-all duration-700",
        className
      )}
    >
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-guava-pink-gradient text-accent-foreground">
              <Sparkles className="size-4" />
            </div>
            <span className="font-medium text-foreground">Import from URL</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="size-8"
            disabled={state === "loading"}
          >
            <X className="size-4" />
            <span className="sr-only">Cancel</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://yourportfolio.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (error) setError(null)
                  if (state === "error") setState("idle")
                }}
                className="pl-10"
                disabled={state === "loading" || state === "success"}
              />
            </div>
            <Button
              type="submit"
              disabled={state === "loading" || state === "success" || !url.trim()}
              className={cn(
                "min-w-[100px] transition-all duration-700",
                state === "success" && "bg-guava-green text-white"
              )}
            >
              {state === "loading" ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Reading...
                </>
              ) : state === "success" ? (
                <>
                  <CheckCircle2 className="mr-2 size-4" />
                  Done
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 size-4" />
                  Import
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {state === "loading" && (
            <p className="text-center text-sm text-muted-foreground animate-pulse">
              Analyzing your profile page with AI...
            </p>
          )}

          {state === "success" && (
            <p className="text-center text-sm text-guava-green">
              Profile data imported! Review the fields below.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
