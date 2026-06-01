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

export function formatPostedDate(iso?: string): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "Posted today";
  if (diffDays === 1) return "Posted yesterday";
  if (diffDays < 7) return `Posted ${diffDays} days ago`;
  return `Posted ${date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
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
