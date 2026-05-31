import { ArrowUpRight, Zap, UserPlus, Search, FileText, CheckCircle } from "lucide-react"
import Link from "next/link"

import { appDashboardUrl } from "@/lib/env"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Free Account",
    description:
      "Sign up in seconds. No credit card, no payment details. Just your email and you&apos;re in.",
  },
  {
    icon: Search,
    step: "02",
    title: "Browse Jobs & Track Applications",
    description: "Search the job board or add any role you&apos;ve applied to. Track every stage from draft to offer.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Write or Generate Cover Letters",
    description: "Write manually (always free) or let AI draft one using your profile and the job description.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Stay Organised & Land Interviews",
    description: "Add notes, track progress, and keep your job search focused. Never miss a follow-up.",
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 px-6 bg-section-pink">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Content */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-guava-pink" strokeWidth={2} />
              <span className="text-sm font-medium text-muted-foreground">How it works</span>
            </div>

            <h2 className="text-3xl font-serif text-foreground mb-6 md:text-5xl">Simple to Start</h2>

            <p className="text-muted-foreground max-w-lg leading-relaxed">
              Get up and running in minutes. No complicated setup, no learning curve. Just sign up and start tracking your applications.
            </p>

            <Link
              href={appDashboardUrl}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-guava-green/30 px-6 py-3 text-sm font-medium text-foreground hover:border-guava-green hover:text-guava-green transition-all duration-700"
            >
              Get Started Free
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right Content - Steps */}
          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group p-6 border-b border-border hover:border-accent/30 transition-colors duration-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-guava-green">{step.step}</span>
                  <step.icon className="h-6 w-6 text-foreground/60" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-500">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
