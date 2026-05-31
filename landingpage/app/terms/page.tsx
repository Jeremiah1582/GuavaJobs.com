import Link from "next/link"

import Footer from "@/components/footer"
import Header from "@/components/header"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <article className="mx-auto max-w-3xl px-6 py-32">
        <h1 className="font-serif text-4xl text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground text-sm mt-2">Last updated: May 2026</p>
        <p className="text-muted-foreground leading-relaxed mt-6">
          By using Guavajobs you agree to these terms. This placeholder will be expanded with full legal
          review before launch.
        </p>
        <h2 className="font-serif text-2xl text-foreground mt-8">Service</h2>
        <p className="text-muted-foreground leading-relaxed">
          Guavajobs provides a job application tracker, job board, and AI-assisted cover letter tools. AI
          output is a draft only—you are responsible for reviewing accuracy before submitting applications.
        </p>
        <h2 className="font-serif text-2xl text-foreground mt-8">Accounts</h2>
        <p className="text-muted-foreground leading-relaxed">
          You must provide accurate information. We may suspend accounts that abuse the service or API.
        </p>
        <p className="mt-12">
          <Link href="/" className="text-accent hover:underline">
            ← Back to home
          </Link>
        </p>
      </article>
      <Footer />
    </main>
  )
}
