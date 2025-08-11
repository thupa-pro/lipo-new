import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Loconomy Authentication",
    default: "Authentication | Loconomy"
  },
  description: "Secure access to your Loconomy account with AI-enhanced authentication and premium security features.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950">
      {children}
    </div>
  );
}
