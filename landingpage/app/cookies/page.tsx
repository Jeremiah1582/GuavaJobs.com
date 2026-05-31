import Link from "next/link"

import Footer from "@/components/footer"
import Header from "@/components/header"

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <article className="mx-auto max-w-3xl px-6 py-32">
        <h1 className="font-serif text-4xl text-foreground">Cookie Policy</h1>
        <p className="text-muted-foreground text-sm mt-2">Last updated: May 2026</p>
        <p className="text-muted-foreground leading-relaxed mt-6">
          We use essential cookies for authentication on the product app and optional analytics (e.g. Vercel
          Analytics) on the marketing site. A full cookie banner and preference centre will be added before
          launch if required.
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
