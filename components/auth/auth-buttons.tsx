'use client'

import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function AuthButtons() {
  const { isSignedIn, user } = useUser()

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-10 w-10"
            }
          }}
          afterSignOutUrl="/"
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <SignInButton mode="modal">
        <Button variant="ghost">Sign In</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button>Get Started</Button>
      </SignUpButton>
    </div>
  )
}

export function QuickAuthLinks() {
  return (
    <div className="flex items-center gap-4">
      <Link href="/auth/signin">
        <Button variant="outline" size="sm">Sign In</Button>
      </Link>
      <Link href="/auth/signup">
        <Button size="sm">Sign Up</Button>
      </Link>
    </div>
  )
}
