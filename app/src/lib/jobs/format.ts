import type { JobSalary } from "@guavajobs/core"

export function formatSalary(salary?: JobSalary): string | null {
  if (!salary) return null
  const { min, max, currency } = salary
  const symbol = currency === "EUR" ? "€" : "£"

  if (min != null && max != null) {
    return `${symbol}${min.toLocaleString()} – ${symbol}${max.toLocaleString()}`
  }
  if (min != null) return `From ${symbol}${min.toLocaleString()}`
  if (max != null) return `Up to ${symbol}${max.toLocaleString()}`
  return null
}

export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}
