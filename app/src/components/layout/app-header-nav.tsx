"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowUpRight, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { landingUrl } from "@/lib/env"
import { signOutAction } from "@/lib/auth/actions"

const guestNavItems = [
  { name: "Jobs", href: "/jobs" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Profile", href: "/profile" },
]

const signedInNavItems = [
  { name: "Jobs", href: "/jobs" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Add application", href: "/applications/new" },
  { name: "Profile", href: "/profile" },
  { name: "Settings", href: "/settings" },
]

type AppHeaderNavProps = {
  signedIn: boolean
}

export function AppHeaderNav({ signedIn }: AppHeaderNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navItems = signedIn ? signedInNavItems : guestNavItems

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-700">
      <div
        className={`mx-auto max-w-7xl transition-all duration-700 ease-out ${
          scrolled
            ? "mx-4 mt-4 rounded-lg bg-background/95 px-6 py-2 shadow-lg backdrop-blur-md"
            : "mx-4 bg-background/90 px-6 py-4 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`font-bold text-foreground transition-all duration-700 ${scrolled ? "text-xl" : "text-2xl"}`}
          >
            <span className="text-guava-green">Guava</span>
            <span className="text-guava-pink">jobs</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/70 transition-colors duration-300 hover:text-accent"
              >
                {item.name}
              </Link>
            ))}
            <a
              href={landingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground/70 transition-colors duration-300 hover:text-accent"
            >
              Guavajobs.com
            </a>
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            {signedIn ? (
              <form action={signOutAction}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  Sign out
                </Button>
              </form>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-foreground/70 transition-colors duration-300 hover:text-accent"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 rounded-full bg-guava-pink-gradient px-5 py-2.5 text-sm font-medium text-accent-foreground transition-all duration-300 hover:opacity-90"
                >
                  Sign up
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {mobileOpen ? (
          <nav className="animate-in fade-in slide-in-from-top-4 pb-6 pt-4 duration-500 md:hidden">
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block text-sm font-medium text-foreground/70 transition-colors hover:text-accent"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={landingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-medium text-foreground/70"
                >
                  Guavajobs.com
                </a>
              </li>
              {signedIn ? (
                <li>
                  <form action={signOutAction}>
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="w-fit"
                    >
                      Sign out
                    </Button>
                  </form>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      href="/sign-in"
                      className="block text-sm font-medium text-foreground/70"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sign-up"
                      className="inline-flex w-fit items-center gap-2 rounded-full bg-guava-pink-gradient px-5 py-2.5 text-sm font-medium text-accent-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign up
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  )
}
