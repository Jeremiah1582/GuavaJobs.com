import Link from "next/link"

import Footer from "@/components/footer"
import Header from "@/components/header"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <article className="mx-auto max-w-3xl px-6 py-32 prose prose-neutral dark:prose-invert">
        <h1 className="font-serif text-4xl text-foreground">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">Last updated: May 2026</p>
        <p className="text-muted-foreground leading-relaxed">
          Guavajobs (&quot;we&quot;) operates guavajobs.com (marketing) and app.guavajobs.com (product). This
          placeholder will be replaced with a full GDPR-aligned policy before public launch.
        </p>
        <h2 className="font-serif text-2xl text-foreground mt-8">What we collect</h2>
        <p className="text-muted-foreground leading-relaxed">
          Account email, profile and job application data you provide, and usage related to AI cover letter
          generation. We use Supabase for auth and storage, Adzuna for job listings, and an AI provider for
          letter drafting.
        </p>
        <h2 className="font-serif text-2xl text-foreground mt-8">Your rights</h2>
        <p className="text-muted-foreground leading-relaxed">
          You may export or delete your data from the app settings. Contact{" "}
          <a href="mailto:hello@guavajobs.com" className="text-accent hover:underline">
            hello@guavajobs.com
          </a>{" "}
          for requests.
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
