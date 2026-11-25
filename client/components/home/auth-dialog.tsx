"use client"

import { useState } from "react"

import { GrainPanel } from "@/components/grain-panel"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function AuthDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] gap-0 overflow-y-auto rounded-[20px] p-0 sm:max-w-sm lg:max-w-3xl lg:grid-cols-2">
        {/* Large screens only. */}
        <GrainPanel
          aria-hidden="true"
          className="hidden rounded-none border-0 lg:block"
        />
        <AuthForm />
      </DialogContent>
    </Dialog>
  )
}

function AuthForm() {
  const [signup, setSignup] = useState(false)
  const [sent, setSent] = useState(false)

  return (
    <div className="p-6 lg:flex lg:min-h-112 lg:flex-col lg:justify-center lg:px-8">
      <Logo />
      <DialogTitle className="mt-5 font-pixel text-2xl">
        {signup ? "Create your account" : "Welcome back"}
      </DialogTitle>

      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault()
          // TODO: call the auth API once the server has one.
          setSent(true)
        }}
      >
        {signup && (
          <Input
            name="name"
            aria-label="Name"
            placeholder="Name"
            autoComplete="name"
            required
            className="h-10"
          />
        )}
        <Input
          type="email"
          name="email"
          aria-label="Email"
          placeholder="Email"
          autoComplete="email"
          required
          className="h-10"
        />
        <Input
          type="password"
          name="password"
          aria-label="Password"
          placeholder={signup ? "Password (8+ characters)" : "Password"}
          autoComplete={signup ? "new-password" : "current-password"}
          minLength={signup ? 8 : undefined}
          required
          className="h-10"
        />
        <Button type="submit" size="pill" className="w-full">
          {signup ? "Create account" : "Log in"}
        </Button>
      </form>

      <p role="status" className="text-sm text-muted-foreground">
        {sent && (
          <span className="mt-3 block">
            Accounts aren&apos;t open yet, so nothing was sent or saved.
          </span>
        )}
      </p>

      <p className="mt-3 text-center text-sm text-muted-foreground">
        {signup ? "Have an account?" : "New here?"}{" "}
        <button
          type="button"
          className="cursor-pointer py-2 font-medium text-foreground underline underline-offset-4"
          onClick={() => {
            setSignup(!signup)
            setSent(false)
          }}
        >
          {signup ? "Log in" : "Sign up"}
        </button>
      </p>
    </div>
  )
}
