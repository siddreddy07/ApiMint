import { ClosingCta } from "@/components/home/closing-cta"
import { Hero } from "@/components/home/hero"
import { HowItWorks } from "@/components/home/how-it-works"
import { Navbar } from "@/components/home/navbar"

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <HowItWorks />
      </main>
      <ClosingCta />
    </>
  )
}
