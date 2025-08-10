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
      {/* Global auth styles and optimizations */}
      <style jsx global>{`
        .auth-layout {
          font-feature-settings: "rlig" 1, "calt" 1;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .auth-layout input {
          font-feature-settings: "tnum" 1;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .auth-layout * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      
      {children}
    </div>
  );
}
