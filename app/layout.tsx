import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { CommandPaletteProvider } from "@/components/providers/command-palette-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { NetworkProvider } from "@/components/network/network-status";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loconomy - AI-Powered Local Services Platform",
  description: "Connect with trusted local service professionals through our intelligent platform. From home repairs to personal training - find verified providers with AI-powered matching, real-time chat, and smart recommendations.",
  keywords: ["local services", "AI marketplace", "service providers", "home repair", "professional services", "artificial intelligence", "smart matching"],
  authors: [{ name: "Loconomy" }],
  creator: "Loconomy",
  publisher: "Loconomy",
  applicationName: "Loconomy",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://loconomy.com",
    title: "Loconomy - AI-Powered Local Services Platform",
    description: "Connect with trusted local service professionals through our intelligent platform",
    siteName: "Loconomy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Loconomy - AI-Powered Local Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Loconomy - AI-Powered Local Services Platform",
    description: "Connect with trusted local service professionals through our intelligent platform",
    creator: "@loconomy",
    images: ["/twitter-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#8B5CF6" },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "technology",
  classification: "Business",
  other: {
    "msapplication-TileColor": "#8B5CF6",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7C3AED" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0B1E" },
  ],
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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />

        {/* PWA and App-like Meta Tags */}
        <meta name="theme-color" content="#7C3AED" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#7C3AED" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0A0B1E" />

        {/* iOS PWA Support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Loconomy" />

        {/* Android PWA Support */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Loconomy" />

        {/* Windows PWA Support */}
        <meta name="msapplication-TileColor" content="#7C3AED" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="msapplication-starturl" content="/" />

        {/* App-like Features */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="format-detection" content="address=no" />
        <meta name="format-detection" content="email=no" />

        {/* Performance and Optimization */}
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="HandheldFriendly" content="true" />

        {/* Icons and Manifest */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Fonts */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NetworkProvider>
            <AuthProvider>
              <CommandPaletteProvider>
                <main className="min-h-screen">{children}</main>
                <Toaster />
              </CommandPaletteProvider>
            </AuthProvider>
          </NetworkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
