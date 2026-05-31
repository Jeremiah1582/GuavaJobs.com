import Link from "next/link"
import { ArrowUpRight, Mail } from "lucide-react"

import { appDashboardUrl, appJobsUrl, appUrl } from "@/lib/env"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-foreground">
              <span className="text-guava-green">Guava</span>
              <span className="text-guava-pink">jobs</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground mb-6">
              Your career hub for job applications and AI cover letters. Track every application, write better letters, land more interviews.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email for updates"
                className="flex-1 px-4 py-2.5 rounded-l-full border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-r-full bg-guava-pink bg-guava-pink-gradient text-white hover:opacity-90 transition-all duration-500"
                aria-label="Subscribe to newsletter"
              >
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">PRODUCT</h4>
            <nav className="flex flex-col gap-3">
              <Link
                href={appUrl}
                className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                Open App
              </Link>
              <Link
                href={appJobsUrl}
                className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                Job Board
              </Link>
              <Link
                href={appDashboardUrl}
                className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                Application Tracker
              </Link>
              <Link
                href="#pricing"
                className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">COMPANY</h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="#about"
                className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                About
              </Link>
              <Link
                href="mailto:partners@guavajobs.com"
                className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                Partnerships
              </Link>
              <Link
                href="mailto:hello@guavajobs.com"
                className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">GET IN TOUCH</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href="mailto:hello@guavajobs.com"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
                >
                  hello@guavajobs.com
                </a>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-foreground mb-3">Markets</h4>
              <p className="text-sm text-muted-foreground">United Kingdom & Germany</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">2025 Guavajobs. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
