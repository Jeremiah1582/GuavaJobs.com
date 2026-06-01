"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowUpRight, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { landingUrl } from "@/lib/env"
import { signOutAction } from "@/lib/auth/actions"

const guestNavItems = [
  { name: "Jobs", href: "/jobs" },
  { name: "Sign in", href: "/sign-in" },
  { name: "Sign up", href: "/sign-up" },
]

type AppHeaderNavProps = {
  signedIn: boolean
}

export function AppHeaderNav({ signedIn }: AppHeaderNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const scrollRoot =
      document.getElementById("app-main-scroll") ?? document.documentElement
    const handleScroll = () => setScrolled(scrollRoot.scrollTop > 50)
    handleScroll()
    scrollRoot.addEventListener("scroll", handleScroll, { passive: true })
    return () => scrollRoot.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 right-0 left-0 z-50 transition-all duration-700 md:static md:z-auto md:border-b md:border-border md:bg-card">
      <div
        className={`mx-auto max-w-7xl transition-all duration-700 ease-out md:max-w-none md:rounded-none md:shadow-none ${
          scrolled
            ? "mx-4 mt-4 rounded-lg bg-background/95 px-6 py-2 shadow-lg backdrop-blur-md md:mx-0 md:mt-0 md:bg-card md:px-4 md:py-2"
            : "mx-4 bg-background/90 px-6 py-4 backdrop-blur-md md:mx-0 md:bg-card md:px-4 md:py-3"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/jobs"
            className={`font-bold text-foreground transition-all duration-700 ${scrolled ? "text-xl" : "text-2xl"}`}
          >
            <span className="text-guava-green">Guava</span>
            <span className="text-guava-pink">jobs</span>
          </Link>

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
                {guestNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      item.href === "/sign-up"
                        ? "inline-flex items-center gap-2 rounded-full bg-guava-pink-gradient px-5 py-2.5 text-sm font-medium text-accent-foreground transition-all duration-300 hover:opacity-90"
                        : "text-sm font-medium text-foreground/70 transition-colors duration-300 hover:text-accent"
                    }
                  >
                    {item.name}
                    {item.href === "/sign-up" ? (
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    ) : null}
                  </Link>
                ))}
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
              {signedIn ? (
                <>
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
                </>
              ) : (
                <>
                  {guestNavItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={
                          item.href === "/sign-up"
                            ? "inline-flex w-fit items-center gap-2 rounded-full bg-guava-pink-gradient px-5 py-2.5 text-sm font-medium text-accent-foreground"
                            : "block text-sm font-medium text-foreground/70 transition-colors hover:text-accent"
                        }
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.name}
                        {item.href === "/sign-up" ? (
                          <ArrowUpRight className="size-4" />
                        ) : null}
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
                </>
              )}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  )
}
