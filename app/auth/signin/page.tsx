import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <SignIn 
        appearance={{
          variables: {
            colorPrimary: '#8B5CF6',
            colorBackground: 'white',
            colorText: '#1f2937',
          },
          elements: {
            formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
            card: 'shadow-2xl border-0',
            headerTitle: 'text-2xl font-bold text-gray-900',
            headerSubtitle: 'text-gray-600',
          }
        }}
        redirectUrl="/dashboard"
        signUpUrl="/auth/signup"
      />
    </div>
  )
}
