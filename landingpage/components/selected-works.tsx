"use client"

import { ArrowUpRight, Layers } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Briefcase, FileText, Search, User } from "lucide-react"

import { appDashboardUrl } from "@/lib/env"

const features = [
  {
    title: "Unlimited Application Tracker",
    description:
      "Track every job application in one place. Add notes, set hiring stages, and never lose track of where you applied. Always free, no limits.",
    icon: Briefcase,
    highlight: "Free forever",
  },
  {
    title: "AI Cover Letters",
    description:
      "Let AI draft cover letters using your profile and the job description. It only uses facts you provide, so every letter is grounded in your real experience.",
    icon: FileText,
    highlight: "5 free per month",
  },
  {
    title: "Public Job Board",
    description:
      "Search and filter tech roles across the UK and Germany. Browse without an account and sign up when you want to track a listing.",
    icon: Search,
    highlight: "No sign-up needed",
  },
  {
    title: "Profile & CV Upload",
    description:
      "Build your profile with your experience, skills, and education. Upload your CV or paste your LinkedIn summary. The AI uses this to personalise your letters.",
    icon: User,
    highlight: "Your data, your control",
  },
]

export default function SelectedWorks() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => [...new Set([...prev, index])])
            }
          })
        },
        { threshold: 0.2, rootMargin: "0px 0px -100px 0px" },
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  return (
    <section id="features" className="py-20 px-6 bg-section-pink">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-accent" strokeWidth={2} />
          <span className="text-sm font-medium text-muted-foreground">Core Features</span>
        </div>

        <h2 className="font-serif text-foreground mb-4 text-4xl md:text-5xl">Everything You Need</h2>
        <p className="text-muted-foreground max-w-2xl mb-12">
          A complete toolkit to manage your job search. Track applications, write cover letters, and find opportunities, all in one place.
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              className={`group p-8 rounded-2xl border border-border bg-background transition-all duration-1000 ease-out ${
                visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-guava-green/10 text-guava-green border border-guava-green/20">
                  {feature.highlight}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors duration-500">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href={appDashboardUrl}
            className="inline-flex items-center gap-2 rounded-full bg-guava-pink bg-guava-pink-gradient px-8 py-4 text-sm font-medium text-white hover:opacity-90 transition-all duration-700"
          >
            Try It Free
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
