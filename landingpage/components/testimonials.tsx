import Image from "next/image"
import { Quote, Sparkles } from "lucide-react"

const testimonials = [
  {
    title: "Finally, One Place for Everything",
    quote:
      "I used to have a messy spreadsheet and forgot half my applications. Now I track every role, add notes after interviews, and actually feel in control of my job search.",
    author: "Bootcamp Graduate",
    location: "Berlin, Germany",
    image: "/images/imgi_108_user88.webp",
  },
  {
    title: "AI Letters That Sound Like Me",
    quote:
      "The AI cover letter feature is brilliant. It only uses what I put in my profile, so every letter feels authentic. I just tweak a few sentences and I&apos;m done.",
    author: "Career Changer",
    location: "London, UK",
    image: "/images/imgi_113_user93.webp",
  },
  {
    title: "No Pressure to Pay",
    quote:
      "I was skeptical because most tools push you to upgrade immediately. Guavajobs lets me track unlimited applications for free. The free AI letters each month are a bonus.",
    author: "Junior Developer",
    location: "Manchester, UK",
    image: "/images/imgi_109_user89.webp",
  },
  {
    title: "Perfect for My Bootcamp Cohort",
    quote:
      "We all started using it after graduation. Being able to see my application stages at a glance and write quick cover letters has made the job hunt so much less stressful.",
    author: "Full Stack Graduate",
    location: "Munich, Germany",
    image: "/images/imgi_107_user87.webp",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 px-6 bg-section-green">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-accent" strokeWidth={2} />
          <span className="text-sm font-medium text-muted-foreground">What job seekers say</span>
        </div>

        <h2 className="text-3xl font-serif text-foreground mb-12 md:text-5xl">Built for Real Job Searches</h2>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background rounded-3xl p-8 border border-border">
              <Quote className="h-8 w-8 text-accent/30 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-4">{testimonial.title}</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.author}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
