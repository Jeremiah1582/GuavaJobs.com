"use client"

import { HelpCircle, ChevronDown } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "Is Guavajobs really free to use?",
    answer:
      "Yes. The application tracker, manual cover letter writing, and job board are completely free with no limits. You get 5 AI cover letter generations per month on the free tier. No credit card required to sign up.",
  },
  {
    question: "How does the AI cover letter feature work?",
    answer:
      "The AI reads your profile (experience, skills, education) and the job description, then drafts a cover letter. It only uses facts you've provided, so every letter is grounded in your real experience. You can edit the result before using it.",
  },
  {
    question: "What makes AI letters 'grounded'?",
    answer:
      "We built it so the AI can only reference information from your profile. It won't invent employers, dates, or skills. This keeps your letters authentic and truthful.",
  },
  {
    question: "Can I use Guavajobs if I'm not in tech?",
    answer:
      "Absolutely. While we focus on bootcamp grads and career changers entering tech, the tracker and cover letter tools work for any industry or role.",
  },
  {
    question: "Where do the job listings come from?",
    answer:
      "Our job board is powered by Adzuna, a job search aggregator. We currently focus on UK and Germany listings. You can browse without an account and sign up when you want to track a role.",
  },
  {
    question: "Is my data safe?",
    answer:
      "We take privacy seriously. Your profile and application data are stored securely. We're GDPR-compliant, and you can export or delete your data at any time. We never sell your information.",
  },
]

export default function LatestArticles() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 px-6 bg-section-pink">
      <div className="mx-auto max-w-3xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-accent" strokeWidth={2} />
            <span className="text-sm font-medium text-muted-foreground">FAQ</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Common Questions</h2>
          <p className="text-muted-foreground">
            Everything you need to know about Guavajobs.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-2xl overflow-hidden transition-all duration-500"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary/50 transition-colors duration-300"
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-foreground pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-500 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-700 ease-out ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-6 text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
