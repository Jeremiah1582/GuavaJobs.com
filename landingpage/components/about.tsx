import { ArrowUpRight, Target, Info } from "lucide-react"
import Link from "next/link"
import { appDashboardUrl } from "@/lib/env"

import PhoneAnimation from "./phone-animation"

export default function About() {
  return (
    <section id="about" className="py-20 px-6 bg-section-green">
      <div className="mx-auto max-w-7xl">
        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Phone Animation */}
          <div className="order-2 lg:order-1">
            <PhoneAnimation />
          </div>

          {/* Right Content - Text */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-2 mb-8">
              <Info className="w-5 h-5 text-guava-green" strokeWidth={2} />
              <span className="text-sm font-medium text-muted-foreground">About Guavajobs</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground leading-tight text-balance">
              One place for every job you pursue, every stage, every note.
            </h2>

            <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
              Job searching is fragmented across tabs, spreadsheets, and scattered notes. Guavajobs brings it all together in one dedicated hub where you can track applications, manage hiring stages, and draft cover letters that reflect your real experience.
            </p>

            <Link
              href={appDashboardUrl}
              className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors duration-700 group"
            >
              Start Tracking Today
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-700" />
            </Link>
          </div>
        </div>

        {/* Bottom card */}
        <div className="mt-20">
          <div className="rounded-3xl p-10 lg:p-12 border border-guava-green/20 bg-card">
            <div className="max-w-3xl">
              <div className="w-14 h-14 rounded-2xl bg-guava-green-gradient flex items-center justify-center mb-8">
                <Target className="h-7 w-7 text-white" />
              </div>

              <h3 className="text-2xl lg:text-3xl font-semibold text-foreground mb-6 text-balance">
                Built for Career Changers
              </h3>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you&apos;re a bootcamp graduate stepping into tech or pivoting careers, Guavajobs is designed for your journey. No payment details to sign up. The tracker is always free. AI cover letters use only facts from your profile, so you stay authentic and grounded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
