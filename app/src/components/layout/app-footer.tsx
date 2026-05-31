import Link from "next/link"

import { landingPrivacyUrl, landingTermsUrl, landingUrl } from "@/lib/env"

const productLinks = [
  { label: "Jobs", href: "/jobs" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Sign in", href: "/sign-in" },
  { label: "Sign up", href: "/sign-up" },
]

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <p className="text-lg font-bold">
            <span className="text-guava-green">Guava</span>
            <span className="text-guava-pink">jobs</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Your career hub for applications and AI cover letters.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Product
          </p>
          <ul className="mt-4 space-y-2">
            {productLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Legal
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <a
                href={landingPrivacyUrl}
                className="text-sm text-muted-foreground hover:text-accent"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href={landingTermsUrl}
                className="text-sm text-muted-foreground hover:text-accent"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href={landingUrl}
                className="text-sm text-muted-foreground hover:text-accent"
              >
                Marketing site
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground md:px-6">
        © {new Date().getFullYear()} Guavajobs. All rights reserved.
      </div>
    </footer>
  )
}
