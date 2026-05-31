export default function LogoCloud() {
  return (
    <section className="py-12 px-6 bg-section-pink border-none">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-sm font-medium text-muted-foreground mb-6">
          Helping job seekers in the UK and Germany launch their tech careers
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <div className="font-medium text-lg text-foreground/80 hover:text-guava-pink transition-colors duration-500">
            Bootcamp Grads
          </div>
          <div className="font-medium text-lg text-foreground/80 hover:text-guava-pink transition-colors duration-500">
            Career Changers
          </div>
          <div className="font-medium text-lg text-foreground/80 hover:text-guava-green transition-colors duration-500">
            Tech Professionals
          </div>
          <div className="font-medium text-lg text-foreground/80 hover:text-guava-pink transition-colors duration-500">
            Recent Graduates
          </div>
        </div>
      </div>
    </section>
  )
}
