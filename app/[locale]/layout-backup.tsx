import type React from "react";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { IntlProvider } from "@/components/providers/intl-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { notFound } from "next/navigation";
import { locales } from "@/lib/i18n/config";

const inter = Inter({ subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1A2A44" },
  ],
};

export const metadata: Metadata = {
  title: "Loconomy - Elite Local Services Platform",
  description:
    "Connect with verified, elite local professionals for premium home and personal services. Enterprise-grade security, real-time tracking, and exceptional quality.",
  keywords:
    "elite local services, premium home services, verified professionals, enterprise security, real-time tracking",
  authors: [{ name: "Loconomy Elite Team" }],
  creator: "Loconomy",
  publisher: "Loconomy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://loconomy.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Loconomy - Elite Local Services Platform",
    description:
      "Connect with verified, elite local professionals for premium home and personal services.",
    url: "https://loconomy.vercel.app",
    siteName: "Loconomy",
    images: [
      {
        url: "https://loconomy.vercel.app/api/og",
        width: 1200,
        height: 630,
        alt: "Loconomy - Elite Local Services Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loconomy - Elite Local Services Platform",
    description:
      "Connect with verified, elite local professionals for premium home and personal services.",
    images: ["https://loconomy.vercel.app/api/og"],
    creator: "@loconomy",
  },
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
  verification: {
    google: "google-verification-code",
    yandex: "yandex-verification-code",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", sizes: "32x32", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon.svg", sizes: "180x180", type: "image/svg+xml" }],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.className} ${jakarta.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ErrorBoundary>
          <IntlProvider locale={locale}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="relative flex min-h-screen flex-col">
                <Navigation />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </ThemeProvider>
          </IntlProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
