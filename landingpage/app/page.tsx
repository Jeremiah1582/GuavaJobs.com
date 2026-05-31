import Header from "@/components/header"
import Hero from "@/components/hero"
import About from "@/components/about"
import LogoCloud from "@/components/logo-cloud"
import SelectedWorks from "@/components/selected-works"
import Services from "@/components/services"
import Testimonials from "@/components/testimonials"
import ContactSection from "@/components/contact-section"
import Stats from "@/components/stats"
import LatestArticles from "@/components/latest-articles"
import Footer from "@/components/footer"
import FloatingGuavas from "@/components/floating-guavas"

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative">
      <FloatingGuavas />
      <div className="relative z-10">
        <Header />
        <Hero />
        <LogoCloud />
        <About />
        <SelectedWorks />
        <Services />
        <Testimonials />
        <Stats />
        <LatestArticles />
        <ContactSection />
        <Footer />
      </div>
    </main>
  )
}
