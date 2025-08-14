import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModernFooter } from "@/components/modern-footer";
import { ArrowLeft, FileText, Calendar, Scale } from "lucide-react";

// Static generation configuration
export const revalidate = false; // Static generation

// Enhanced metadata for SEO
export const metadata = {
  title: "Terms of Service | Loconomy - Platform Terms & Conditions",
  description: "Read Loconomy's terms of service and understand your rights and responsibilities when using our local services platform.",
  keywords: ["terms of service", "terms and conditions", "user agreement", "platform rules"],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://loconomy.com/terms",
  },
};

const lastUpdated = "December 15, 2024";

export default function TermsPage() {
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
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground mb-4">
            These terms govern your use of Loconomy's platform and services.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardContent className="p-8 prose prose-gray dark:prose-invert max-w-none">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing or using Loconomy's services, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations.
            </p>

            <h2>Description of Service</h2>
            <p>
              Loconomy is a platform that connects customers with local service providers. We facilitate 
              connections but are not directly involved in the provision of services.
            </p>

            <h2>User Accounts</h2>
            <h3>Registration</h3>
            <ul>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>One person may not maintain multiple accounts</li>
              <li>You must be at least 18 years old to use our services</li>
            </ul>

            <h3>Account Responsibilities</h3>
            <ul>
              <li>Keep your login credentials secure</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>You are liable for all activities under your account</li>
            </ul>

            <h2>User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any illegal purposes</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Upload malicious code or content</li>
              <li>Attempt to circumvent security measures</li>
              <li>Scrape or harvest user data</li>
            </ul>

            <h2>Service Provider Terms</h2>
            <h3>Provider Obligations</h3>
            <ul>
              <li>Provide accurate service descriptions and pricing</li>
              <li>Maintain appropriate licenses and insurance</li>
              <li>Deliver services as promised</li>
              <li>Communicate professionally with customers</li>
            </ul>

            <h3>Payment Terms</h3>
            <ul>
              <li>Commission fees are deducted from completed bookings</li>
              <li>Payments are processed within 2-3 business days</li>
              <li>Refunds follow our refund policy</li>
            </ul>

            <h2>Customer Terms</h2>
            <h3>Booking and Payment</h3>
            <ul>
              <li>Payments are processed securely through our platform</li>
              <li>You authorize charges for booked services</li>
              <li>Cancellation policies vary by provider</li>
            </ul>

            <h3>Service Quality</h3>
            <ul>
              <li>We screen providers but don't guarantee service quality</li>
              <li>Disputes should first be resolved with the provider</li>
              <li>We provide mediation support when needed</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              Loconomy and its content are protected by copyright, trademark, and other intellectual 
              property laws. You may not use our intellectual property without permission.
            </p>

            <h2>Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand 
              how we collect and use your information.
            </p>

            <h2>Disclaimers</h2>
            <p>
              Our services are provided "as is" without warranties of any kind. We disclaim all 
              warranties, express or implied, including warranties of merchantability and fitness 
              for a particular purpose.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              Loconomy's liability is limited to the maximum extent permitted by law. We are not 
              liable for indirect, incidental, or consequential damages.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account at any time for violation of these terms. 
              You may also delete your account at any time.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of our services after 
              changes constitutes acceptance of the new terms.
            </p>

            <h2>Contact Information</h2>
            <p>
              For questions about these Terms of Service, contact us at:
            </p>
            <ul>
              <li>Email: legal@loconomy.com</li>
              <li>Address: 123 Legal Street, San Francisco, CA 94105</li>
            </ul>
          </CardContent>
        </Card>

        {/* Related Links */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/privacy">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Privacy Policy
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
