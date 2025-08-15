"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/features/auth-provider'

export default function UnauthorizedPage() {
  const { user, userProfile } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl text-red-900 dark:text-red-100">Access Denied</CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              You don't have permission to access this page
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="font-medium text-red-900 dark:text-red-100 mb-2">Why am I seeing this?</h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                This page requires specific permissions that your current account doesn't have.
              </p>
              {userProfile && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  Current role: <span className="font-medium capitalize">{userProfile.role}</span>
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Need different permissions?{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
