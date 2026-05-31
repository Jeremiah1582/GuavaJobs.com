"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

import {
  NavigationMenuSignInLink,
  NavigationMenuSignUpButton,
} from "@/components/ui/navigation-menu"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "HOME", href: "#home" },
    { name: "ABOUT", href: "#about" },
    { name: "FEATURES", href: "#features" },
    { name: "PRICING", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-700">
      <div
        className={`mx-auto max-w-7xl transition-all duration-700 ease-out ${
          scrolled
            ? "mt-4 mx-4 px-6 py-2 shadow-lg bg-background/95 backdrop-blur-md rounded-lg"
            : "px-6 py-4 bg-background/90 backdrop-blur-md mx-4"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`font-bold text-foreground transition-all duration-700 ${scrolled ? "text-xl" : "text-2xl"}`}
          >
            <span className="text-guava-green">Guava</span>
            <span className="text-guava-pink">jobs</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors duration-300 cursor-pointer"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Auth CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <NavigationMenuSignInLink className="cursor-pointer" />
            <NavigationMenuSignUpButton className="cursor-pointer duration-700" />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors duration-300 cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
              <NavigationMenuSignInLink className="cursor-pointer" />
              <NavigationMenuSignUpButton className="w-fit cursor-pointer" />
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
