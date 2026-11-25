import { GeistPixelSquare } from "geist/font/pixel"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "ApiMint: turn your API into an MCP server",
  description:
    "Import an OpenAPI specification, choose your tools and get a hosted MCP server that AI agents can use.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      // The theme class is set before React loads.
      suppressHydrationWarning
      // Lets Next.js jump instantly between routes despite CSS smooth scroll.
      data-scroll-behavior="smooth"
      className={cn(
        "font-sans antialiased",
        sans.variable,
        mono.variable,
        GeistPixelSquare.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
