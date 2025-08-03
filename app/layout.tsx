import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { CommandPaletteProvider } from "@/components/providers/command-palette-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loconomy - Elite Local Services Platform",
  description: "Connect with trusted local service professionals. From home repairs to personal training - find verified providers in your area with AI-powered matching.",
  keywords: ["local services", "service providers", "home repair", "professional services", "marketplace"],
  authors: [{ name: "Loconomy" }],
  creator: "Loconomy",
  publisher: "Loconomy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://loconomy.com",
    title: "Loconomy - Elite Local Services Platform",
    description: "Connect with trusted local service professionals",
    siteName: "Loconomy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loconomy - Elite Local Services Platform",
    description: "Connect with trusted local service professionals",
    creator: "@loconomy",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
