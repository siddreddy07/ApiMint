"use client"

import { motion, useInView, useReducedMotion } from "motion/react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { GrainPanel } from "@/components/grain-panel"
import { Logo } from "@/components/logo"
import { buttonVariants } from "@/components/ui/button"
import { IMPORT_HREF, NAV_LINKS } from "@/lib/home-data"

// With reduced motion, only the last name shows.
const CLIENTS = ["Claude Desktop", "Claude Code", "Cursor", "any MCP client"]

export function ClosingCta() {
  return (
    <div className="flex min-h-[calc(100svh-var(--nav-height))] flex-col">
      <section
        aria-labelledby="closing-title"
        className="wrap flex flex-1 py-8"
      >
        <GrainPanel className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
          <h2 id="closing-title" className="w-full text-closing">
            <span className="sr-only">
              Your API already works. Now use it from any MCP client.
            </span>
            <span aria-hidden="true">
              <span className="block">Your API already works.</span>
              <span className="block">Now use it from</span>
              <ClientName />
            </span>
          </h2>
          <Link
            href={IMPORT_HREF}
            className={buttonVariants({ size: "pill", className: "mt-8" })}
          >
            Import your spec
          </Link>
        </GrainPanel>
      </section>

      <footer className="wrap">
        <div className="flex flex-col gap-4 border-t py-6 sm:flex-row sm:items-center">
          <Logo />
          <ul className="flex gap-6 sm:ml-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-block py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground sm:ml-auto">
            © 2026 ApiMint
          </p>
        </div>
        {/* The wordmark, set large, closes the page. */}
        <p
          aria-hidden="true"
          className="pb-4 text-center font-pixel text-[min(20vw,17rem)] leading-[0.8] text-mint select-none dark:text-secondary"
        >
          ApiMint
        </p>
      </footer>
    </div>
  )
}

/** Loops through the client names while the line is on screen. */
function ClientName() {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { amount: 1 })
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!inView || reduced) return
    const timer = setTimeout(() => setIndex((index + 1) % CLIENTS.length), 1800)
    return () => clearTimeout(timer)
  }, [inView, reduced, index])

  return (
    <span ref={ref} className="block text-leaf">
      <motion.span
        key={index}
        className="inline-block"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: reduced ? 0 : 0.35 }}
      >
        {CLIENTS[reduced ? CLIENTS.length - 1 : index]}
      </motion.span>
    </span>
  )
}
