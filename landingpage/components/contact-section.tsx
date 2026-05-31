"use client"

import { ArrowUpRight, Rocket } from "lucide-react"
import Link from "next/link"

import { appDashboardUrl, appJobsUrl } from "@/lib/env"

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 px-6 bg-section-green">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="w-5 h-5 text-guava-green" strokeWidth={2} />
          <span className="text-sm font-medium text-muted-foreground">Get started</span>
        </div>

        {/* CTA Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - CTA Text */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-6 leading-tight">
              Ready to Take Control of Your Job Search?
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-lg mb-8">
              Join job seekers across the UK and Germany who track their applications, write better cover letters, and land interviews faster. No credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={appDashboardUrl}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-guava-pink bg-guava-pink-gradient px-8 py-4 text-sm font-medium text-white hover:opacity-90 transition-all duration-700"
              >
                Start Tracking Free
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href={appJobsUrl}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-guava-green/30 px-8 py-4 text-sm font-medium text-foreground hover:border-guava-green hover:text-guava-green transition-all duration-700"
              >
                Browse Jobs First
              </Link>
            </div>
          </div>

          {/* Right - Feature highlights */}
          <div className="bg-card rounded-3xl p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-6">What&apos;s included free:</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-guava-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-guava-green" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Unlimited Application Tracking</p>
                  <p className="text-sm text-muted-foreground">Track every job, add notes, set stages. No limits.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-guava-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-guava-green" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Unlimited Manual Cover Letters</p>
                  <p className="text-sm text-muted-foreground">Write and edit as many as you need. Always free.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-guava-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-guava-green" />
                </div>
                <div>
                  <p className="font-medium text-foreground">5 AI Cover Letters per Month</p>
                  <p className="text-sm text-muted-foreground">AI-drafted letters grounded in your real experience.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-guava-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-guava-green" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Public Job Board Access</p>
                  <p className="text-sm text-muted-foreground">Browse jobs without an account. Sign up to track.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
