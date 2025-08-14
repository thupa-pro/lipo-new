import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModernFooter } from "@/components/layout/modern-footer";
import { ArrowLeft, Shield, FileText, Calendar } from "lucide-react";

// Static generation configuration
export const revalidate = false; // Static generation

// Enhanced metadata for SEO
export const metadata = {
  title: "Privacy Policy | Loconomy - Your Privacy Matters",
  description: "Learn how Loconomy protects your privacy and handles your personal information. Transparent privacy practices for our local services platform.",
  keywords: ["privacy policy", "data protection", "personal information", "privacy rights"],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://loconomy.com/privacy",
  },
};

const lastUpdated = "December 15, 2024";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold gradient-text">Loconomy</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardContent className="p-8 prose prose-gray dark:prose-invert max-w-none">
            <h2>Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support.
            </p>

            <h3>Personal Information</h3>
            <ul>
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Payment information</li>
              <li>Service preferences and history</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <ul>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage patterns and preferences</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and improve our services</li>
              <li>Process transactions and payments</li>
              <li>Communicate with you about our services</li>
              <li>Ensure safety and security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information in limited circumstances:
            </p>
            <ul>
              <li>With service providers who work on our behalf</li>
              <li>When required by law or legal process</li>
              <li>To protect safety and security</li>
              <li>In connection with business transfers</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Object to certain processing</li>
              <li>Data portability</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@loconomy.com</li>
              <li>Address: 123 Privacy Street, San Francisco, CA 94105</li>
            </ul>
          </CardContent>
        </Card>

        {/* Related Links */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/terms">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Terms of Service
            </Button>
          </Link>
          <Link href="/cookies">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Cookie Policy
            </Button>
          </Link>
          <Link href="/gdpr">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              GDPR Information
            </Button>
          </Link>
        </div>
      </main>

      <ModernFooter />
    </div>
  );
}
