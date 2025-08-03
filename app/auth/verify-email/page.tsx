"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { authService } from '@/lib/auth/auth-utils'
import { useToast } from '@/components/ui/use-toast'

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [resendError, setResendError] = useState('')
  const { toast } = useToast()

  const handleResendVerification = async () => {
    setIsResending(true)
    setResendMessage('')
    setResendError('')

    try {
      // Get current user
      const user = await authService.getCurrentUser()
      
      if (!user) {
        setResendError('No user session found. Please sign up again.')
        return
      }

      if (user.email_confirmed_at) {
        setResendMessage('Your email is already verified! You can now sign in.')
        return
      }

      // Resend verification email
      const { error } = await authService.resetPassword(user.email!)
      
      if (error) {
        setResendError(error.message)
        toast({
          title: 'Resend Failed',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        setResendMessage('Verification email resent! Please check your inbox.')
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your inbox for the verification link.',
          variant: 'default',
        })
      }
    } catch (error) {
      console.error('Resend verification error:', error)
      setResendError('Failed to resend verification email. Please try again.')
      toast({
        title: 'Resend Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                L
              </div>
              <span className="text-2xl font-bold">Loconomy</span>
            </div>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a verification link to your email address. Please click the link to activate your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {resendError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{resendError}</AlertDescription>
              </Alert>
            )}

            {resendMessage && (
              <Alert className="bg-green-50 border-green-200 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{resendMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">What's next?</h3>
                <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>1. Check your email inbox</li>
                  <li>2. Look for an email from Loconomy</li>
                  <li>3. Click the verification link</li>
                  <li>4. Sign in to your account</li>
                </ol>
              </div>

              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Resending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>

              <div className="text-center text-sm space-y-2">
                <p className="text-muted-foreground">
                  Didn't receive the email? Check your spam folder or resend it.
                </p>
                <div className="space-x-2">
                  <Link
                    href="/auth/signin"
                    className="text-primary hover:underline font-medium"
                  >
                    Back to Sign In
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link
                    href="/auth/signup"
                    className="text-primary hover:underline font-medium"
                  >
                    Try Different Email
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
