import { ArrowUpRight, Check, CreditCard } from "lucide-react"
import Link from "next/link"

import { appDashboardUrl, appPricingUrl } from "@/lib/env"

const tiers = [
  {
    name: "Free",
    price: "€0",
    period: "forever",
    description: "Everything you need to track your job search.",
    features: [
      "Unlimited application tracking",
      "Unlimited manual cover letters",
      "5 AI cover letters per month",
      "Full job board access",
      "Profile & CV upload",
      "Notes on every application",
    ],
    cta: "Get Started Free",
    hrefKey: "dashboard" as const,
    highlighted: false,
  },
  {
    name: "Starter",
    price: "€9.99",
    period: "per month",
    description: "More AI power for active job seekers.",
    features: [
      "Everything in Free",
      "30 AI cover letters per month",
      "30 AI CV generations (coming soon)",
      "Priority support",
    ],
    cta: "Upgrade to Starter",
    hrefKey: "pricing" as const,
    highlighted: true,
  },
  {
    name: "Pro",
    price: "€29.99",
    period: "per month",
    description: "For serious job seekers and career changers.",
    features: [
      "Everything in Starter",
      "100 AI cover letters per month",
      "100 AI CV generations (coming soon)",
      "AI career coaching (coming soon)",
    ],
    cta: "Upgrade to Pro",
    hrefKey: "pricing" as const,
    highlighted: false,
  },
]

function tierHref(key: "dashboard" | "pricing") {
  return key === "dashboard" ? appDashboardUrl : appPricingUrl
}

export default function Stats() {
  return (
    <section id="pricing" className="py-20 px-6 bg-section-pink">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-accent" strokeWidth={2} />
            <span className="text-sm font-medium text-muted-foreground">Simple pricing</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-4">
            Free to Start, Upgrade When Ready
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The tracker is always free. No credit card required to sign up. Only pay when you need more AI power.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-8 border transition-all duration-700 ${
                tier.highlighted
                  ? "bg-guava-pink bg-guava-pink-gradient text-white border-guava-pink scale-105 shadow-xl"
                  : "bg-card border-border"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-2 ${tier.highlighted ? "text-white" : "text-foreground"}`}
              >
                {tier.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className={`text-4xl font-bold ${tier.highlighted ? "text-white" : "text-foreground"}`}
                >
                  {tier.price}
                </span>
                <span
                  className={`text-sm ${tier.highlighted ? "text-white/70" : "text-muted-foreground"}`}
                >
                  /{tier.period}
                </span>
              </div>
              <p
                className={`text-sm mb-6 ${tier.highlighted ? "text-white/80" : "text-muted-foreground"}`}
              >
                {tier.description}
              </p>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`h-5 w-5 flex-shrink-0 ${tier.highlighted ? "text-white" : "text-accent"}`}
                    />
                    <span
                      className={`text-sm ${tier.highlighted ? "text-white/90" : "text-muted-foreground"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={tierHref(tier.hrefKey)}
                className={`w-full flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-700 ${
                  tier.highlighted
                    ? "bg-white text-guava-pink hover:opacity-90"
                    : "bg-guava-pink bg-guava-pink-gradient text-white hover:opacity-90"
                }`}
              >
                {tier.cta}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Are you a bootcamp or training provider?{" "}
            <Link href="mailto:partners@guavajobs.com" className="text-accent hover:underline">
              Contact us for partnership deals
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
