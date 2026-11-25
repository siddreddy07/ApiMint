"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

import { ENDPOINTS, METHOD_COLORS, SERVER_URL } from "@/lib/home-data"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const BOX = "rounded-lg border bg-card px-3 py-2"

// The URL sits on its own line so it fits a narrow column.
const CONFIG = `{
 "mcpServers": {
  "bookings": {
   "url":
    "${SERVER_URL}"
  }
 }
}`

const STEPS = [
  {
    title: "Import your spec",
    text: "Upload an OpenAPI 3.0 or 3.1 file, or paste its URL.",
    visual: (
      <>
        <p className={cn(BOX, "break-all")}>
          https://api.example.com/openapi.json
        </p>
        <ul className={cn(BOX, "divide-y py-0")}>
          {ENDPOINTS.map(({ method, path, tool }) => (
            <li key={tool} className="flex py-2.5">
              <span className={cn("w-16", METHOD_COLORS[method])}>
                {method}
              </span>
              {path}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    title: "Choose your tools",
    text: "Pick endpoints, edit names and descriptions, add an API key or Bearer token.",
    visual: [
      ["Tool name", "list_bookings"],
      ["Description", "Returns bookings, filtered by date."],
      ["Bearer token", "••••••••••••••••"],
    ].map(([label, value]) => (
      <div key={label} className={BOX}>
        <p className="font-sans text-xs text-muted-foreground">{label}</p>
        <p className="mt-1">{value}</p>
      </div>
    )),
  },
  {
    title: "Connect your agent",
    text: "Copy the server URL into your MCP client, then test calls and read the logs.",
    visual: (
      <>
        <pre className={cn(BOX, "break-all whitespace-pre-wrap")}>{CONFIG}</pre>
        <p className={cn(BOX, "flex justify-between gap-3")}>
          list_bookings <span className="text-leaf">200 OK</span>
        </p>
        <p className={cn(BOX, "flex justify-between gap-3")}>
          create_booking <span className="text-destructive">422 Error</span>
        </p>
      </>
    ),
  },
]

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null)

  // The line linking the steps draws itself once.
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-rail]", {
          scaleX: 0,
          duration: 0.5,
          stagger: 0.35,
          ease: "power2.inOut",
          scrollTrigger: { trigger: "ol", start: "top 75%", once: true },
        })
      })
    },
    { scope: ref }
  )

  return (
    <section
      ref={ref}
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="flex min-h-[calc(100svh-var(--nav-height))] scroll-mt-(--nav-height) items-center border-y bg-secondary py-16 dark:bg-background"
    >
      <div className="wrap">
        <h2 id="how-it-works-title" className="text-h2">
          From spec to server in three steps
        </h2>

        <ol className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-3 lg:gap-6">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary font-pixel text-xl text-primary-foreground">
                  {index + 1}
                </span>
                <span
                  data-rail
                  aria-hidden="true"
                  className="h-0.5 flex-1 origin-left bg-primary/30"
                />
              </div>
              <h3 className="mt-5 font-pixel text-xl font-medium">
                {step.title}
              </h3>
              <p className="mt-2 text-muted-foreground lg:min-h-18">
                {step.text}
              </p>
              <div className="mt-5 flex flex-1 items-center rounded-[20px] border border-transparent bg-stage grain p-3 sm:p-4 dark:border-border">
                <div className="w-full space-y-3 font-mono text-xs leading-5">
                  {step.visual}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
