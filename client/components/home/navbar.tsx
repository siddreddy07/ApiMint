"use client"

import { MenuIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { IMPORT_HREF, NAV_LINKS, SIGN_IN_HREF } from "@/lib/home-data"
import { cn } from "@/lib/utils"

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2 font-pixel text-2xl font-bold">
      {/* A struck coin: mint disc with a notched edge. */}
      <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
        <circle cx="12" cy="12" r="11" className="fill-mint" />
        <circle
          cx="12"
          cy="12"
          r="9.5"
          fill="none"
          strokeWidth="3"
          strokeDasharray="1.2 2.53"
          className="stroke-[#0b2a22]"
        />
        <circle cx="12" cy="12" r="4" className="fill-[#0b2a22]" />
      </svg>
      ApiMint
    </span>
  )
}

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

        <ul className="hidden items-center gap-7 md:flex">
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

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Link
            href={SIGN_IN_HREF}
            className={buttonVariants({ variant: "ghost", size: "pill" })}
          >
            Sign in
          </Link>
          <Link href={IMPORT_HREF} className={buttonVariants({ size: "pill" })}>
            Import your spec
          </Link>
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                className="ml-auto size-11 md:hidden"
              />
            }
          >
            <MenuIcon className="size-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="px-6 pt-16 pb-6">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            {NAV_LINKS.map((link) => (
              <SheetClose
                key={link.href}
                nativeButton={false}
                render={<a href={link.href} />}
                className="py-2 text-2xl font-semibold"
              >
                {link.label}
              </SheetClose>
            ))}
            <div className="mt-auto flex flex-col gap-2">
              <Link
                href={SIGN_IN_HREF}
                className={buttonVariants({ variant: "outline", size: "pill" })}
              >
                Sign in
              </Link>
              <Link
                href={IMPORT_HREF}
                className={buttonVariants({ size: "pill" })}
              >
                Import your spec
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
