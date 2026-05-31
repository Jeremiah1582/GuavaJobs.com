"use client"

import { ArrowUpRight, Briefcase, FileText, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { appJobsUrl, appSignUpUrl, appUrl } from "@/lib/env"

export default function Hero() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = 500
      const progress = Math.min(scrolled / maxScroll, 1)
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scale = 1 - scrollProgress * 0.15
  const borderRadius = scrollProgress * 24

  return (
    <section id="home" className="pt-28 pb-16">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left Content - Title and Button */}
          <div className="lg:max-w-3xl pt-0">
            <h1 className="text-balance text-left font-sans font-semibold tracking-tight text-foreground text-4xl md:text-5xl lg:text-6xl leading-tight">
              Your Career Hub for{" "}
              <span className="text-guava-pink">Job Applications</span>{" "}
              & AI Cover Letters
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Built for UK and Germany bootcamp graduates and tech career changers. Track every application in one place, write cover letters manually, or let grounded AI draft them from your profile only. Free to use, no credit card required.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href={appJobsUrl}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-guava-pink bg-guava-pink-gradient px-6 py-3.5 text-sm font-medium text-white hover:opacity-90 transition-all duration-700"
              >
                Browse Jobs
                <Search className="h-4 w-4" />
              </Link>
              <Link
                href={appSignUpUrl}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-guava-green/30 px-6 py-3.5 text-sm font-medium text-foreground hover:border-guava-green hover:text-guava-green transition-all duration-700"
              >
                Sign Up Free
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right side - Feature highlights */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 text-guava-pink" />
                <span>Unlimited application tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4 text-guava-green" />
                <span>5 free AI cover letters/month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero visual — single-hue pink gradient container */}
      <div className="mt-12 px-6">
        <div
          className="relative overflow-hidden transition-transform duration-700 ease-out"
          style={{
            transform: `scale(${scale})`,
            borderRadius: `${borderRadius}px`,
          }}
        >
          <div className="bg-guava-pink bg-guava-pink-gradient p-8 md:p-12 lg:p-16">
            <div className="max-w-4xl mx-auto">
              {/* Mock dashboard preview */}
              <div className="bg-background/90 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 overflow-hidden">
                {/* Header bar */}
                <div className="bg-card px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-guava-pink/60" />
                    <div className="w-3 h-3 rounded-full bg-guava-green/60" />
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {new URL(appUrl).host}
                  </span>
                </div>
                
                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">My Applications</h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-guava-pink/10 text-guava-pink font-medium border border-guava-pink/20">3 Active</span>
                  </div>
                  
                  {/* Application rows */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-guava-pink/10 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-guava-pink" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">Frontend Developer</p>
                          <p className="text-xs text-muted-foreground">TechCorp Ltd</p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-guava-pink/15 text-guava-pink font-medium">Interview</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-guava-green/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-guava-green" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">Full Stack Engineer</p>
                          <p className="text-xs text-muted-foreground">StartupXYZ</p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">Applied</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-guava-green/10 flex items-center justify-center">
                          <Search className="h-5 w-5 text-guava-green" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">React Developer</p>
                          <p className="text-xs text-muted-foreground">Innovation Co</p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">Draft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
