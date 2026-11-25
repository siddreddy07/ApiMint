"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { AuthDialog } from "@/components/home/auth-dialog"
import { Logo } from "@/components/logo"
import { StaggeredMenu } from "@/components/StaggeredMenu"
import { Button, buttonVariants } from "@/components/ui/button"
import { IMPORT_HREF, NAV_LINKS } from "@/lib/home-data"
import { cn } from "@/lib/utils"

/** Scrolls to in-page sections without putting "#..." in the address bar. */
function useCleanHashLinks() {
  useEffect(() => {
    const scrollTo = (hash: string) => {
      const target = document.getElementById(hash.slice(1))
      target?.scrollIntoView()
      // Moves keyboard focus too, for the skip link.
      if (target?.hasAttribute("tabindex")) {
        target.focus({ preventScroll: true })
      }
    }

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest("a")
      const href = link?.getAttribute("href")
      const modified = event.ctrlKey || event.metaKey || event.shiftKey
      if (!href?.startsWith("#") || event.button !== 0 || modified) return
      event.preventDefault()
      // Waits a tick so the mobile menu can close first.
      setTimeout(() => scrollTo(href))
    }

    // A shared link may arrive with a hash: go there, then tidy the URL.
    if (window.location.hash) {
      scrollTo(window.location.hash)
      const { pathname, search } = window.location
      window.history.replaceState(null, "", pathname + search)
    }

    // Capture phase, so this runs before next/link handles the click.
    window.addEventListener("click", onClick, true)
    return () => window.removeEventListener("click", onClick, true)
  }, [])
}

export function Navbar() {
  useCleanHashLinks()
  const [scrolled, setScrolled] = useState(false)

  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-(--nav-height) border-b bg-background transition-colors",
        scrolled ? "border-border" : "border-transparent"
      )}
    >
      <nav aria-label="Main" className="wrap flex h-full items-center gap-10">
        <Link href="/" className="rounded-full py-2">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-block py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="pill" onClick={() => setAuthOpen(true)}>
            Sign in
          </Button>
          <Link href={IMPORT_HREF} className={buttonVariants({ size: "pill" })}>
            Import your spec
          </Link>
        </div>
      </nav>
      {/* Phones and tablets. */}
      <div className="lg:hidden">
        <StaggeredMenu
          items={NAV_LINKS.map(({ label, href }) => ({ label, link: href }))}
          footer={
            // Side by side, half the width each.
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="pill"
                className="px-2"
                onClick={() => setAuthOpen(true)}
              >
                Sign in
              </Button>
              <Link
                href={IMPORT_HREF}
                className={buttonVariants({ size: "pill", className: "px-2" })}
              >
                Import your spec
              </Link>
            </div>
          }
        />
      </div>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  )
}
