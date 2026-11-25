"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { CheckIcon, CopyIcon } from "lucide-react"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import Link from "next/link"
import { useRef, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  ENDPOINTS,
  IMPORT_HREF,
  METHOD_COLORS,
  SERVER_URL,
} from "@/lib/home-data"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP)

const BOOKINGS = [
  { time: "09:30", title: "Consultation", status: "Confirmed" },
  { time: "13:00", title: "Follow-up", status: "Confirmed" },
  { time: "16:15", title: "Site visit", status: "Pending" },
]

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out", duration: 0.6 } })
          .set("[data-enter='title']", { visibility: "visible" })
          .fromTo(
            "[data-line]",
            { yPercent: 110 },
            { yPercent: 0, stagger: 0.08 }
          )
          .fromTo(
            "[data-enter='body']",
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, stagger: 0.1 },
            "-=0.4"
          )
      })
    },
    { scope: ref }
  )

  return (
    <section
      ref={ref}
      className="wrap py-8 lg:flex lg:min-h-[calc(100svh-var(--nav-height))] lg:flex-col lg:justify-center"
    >
      <div className="grid items-end gap-6 lg:grid-cols-12">
        <h1 data-enter="title" className="text-h1 lg:col-span-7">
          {["Turn your API into", "an MCP server"].map((line) => (
            // The padding keeps descenders inside the mask.
            <span
              key={line}
              className="-mb-[0.12em] block overflow-hidden pb-[0.12em]"
            >
              <span data-line className="block">
                {line}{" "}
              </span>
            </span>
          ))}
        </h1>

        <div data-enter="body" className="lg:col-span-5 lg:pb-1 lg:pl-6">
          <p className="max-w-[46ch] text-lg leading-[1.55] text-muted-foreground">
            Bring your API. Choose your tools. Get a hosted MCP server that
            Claude, Cursor and other MCP clients can connect to.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={IMPORT_HREF}
              className={buttonVariants({ size: "pill" })}
            >
              Import your spec
            </Link>
            <a
              href="#how-it-works"
              className={buttonVariants({ variant: "secondary", size: "pill" })}
            >
              See how it works
            </a>
          </div>
        </div>
      </div>

      <div data-enter="body" className="mt-8">
        <Demo />
      </div>
    </section>
  )
}

/** A miniature of the product: switch endpoints on to add tools. */
function Demo() {
  const [enabled, setEnabled] = useState<string[]>([
    "list_bookings",
    "list_customers",
    "create_booking",
  ])
  const [copied, setCopied] = useState(false)
  const tools = ENDPOINTS.filter((e) => enabled.includes(e.tool))

  async function copy() {
    try {
      await navigator.clipboard.writeText(SERVER_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access was refused. The URL stays selectable.
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        id="example"
        className="grid scroll-mt-[calc(var(--nav-height)+16px)] grid-cols-[minmax(0,1fr)] rounded-[20px] border border-transparent bg-stage grain p-3 sm:p-6 lg:grid-cols-[minmax(0,5fr)_64px_minmax(0,7fr)] lg:items-center dark:border-border"
      >
        <div className="rounded-xl border bg-card p-4 sm:p-5">
          <h2 className="truncate font-mono text-sm font-medium">
            bookings.openapi.yaml
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Example spec. Switch on what an agent may use.
          </p>
          <ul className="mt-3 divide-y">
            {ENDPOINTS.map(({ method, path, tool }) => (
              <li key={tool}>
                <label className="flex min-h-13 cursor-pointer items-center gap-2 font-mono text-[0.8125rem]">
                  <span className={cn("w-14", METHOD_COLORS[method])}>
                    {method}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{path}</span>
                  <Switch
                    checked={enabled.includes(tool)}
                    onCheckedChange={(on) =>
                      setEnabled((list) =>
                        on ? [...list, tool] : list.filter((t) => t !== tool)
                      )
                    }
                    aria-label={`Expose ${method} ${path} as a tool`}
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div
          aria-hidden="true"
          className="mx-auto h-8 w-0.5 bg-foreground/60 lg:h-0.5 lg:w-full"
        />

        <div className="rounded-xl border bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-pixel text-base font-medium">
              Your MCP server
            </h2>
            <p
              className="text-sm text-muted-foreground tabular-nums"
              aria-live="polite"
            >
              {tools.length} {tools.length === 1 ? "tool" : "tools"}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg border py-1 pr-1 pl-3">
            <code className="min-w-0 flex-1 truncate font-mono text-[0.8125rem]">
              {SERVER_URL}
            </code>
            <Button variant="ghost" size="sm" className="h-9" onClick={copy}>
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <ul
              className="relative flex min-h-42 flex-col gap-2"
              aria-label="Tools"
            >
              <AnimatePresence initial={false} mode="popLayout">
                {tools.map(({ tool }) => (
                  <motion.li
                    key={tool}
                    layout
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    className="flex h-9 shrink-0 items-center rounded-lg bg-secondary px-3 font-mono text-[0.8125rem]"
                  >
                    {tool}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="flex min-h-42 flex-col gap-2 text-sm">
              <p className="self-end rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground">
                Show me all my bookings for tomorrow.
              </p>
              {enabled.includes("list_bookings") ? (
                <>
                  <p className="font-mono text-xs text-leaf">
                    Called list_bookings
                  </p>
                  <ul className="divide-y rounded-lg border px-3">
                    {BOOKINGS.map((booking) => (
                      <li key={booking.time} className="flex gap-3 py-1.5">
                        <span className="font-mono text-xs leading-5">
                          {booking.time}
                        </span>
                        <span className="flex-1">{booking.title}</span>
                        <span className="text-muted-foreground">
                          {booking.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="rounded-2xl rounded-bl-sm bg-secondary px-3 py-2">
                  I have no tool that lists bookings. Switch on GET /bookings.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  )
}
