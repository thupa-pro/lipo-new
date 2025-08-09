import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModernFooter } from "@/components/modern-footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { 
  CheckCircle, 
  DollarSign, 
  Users, 
  Percent, 
  TrendingUp, 
  ArrowRight, 
  Crown, 
  Zap, 
  Shield, 
  Star, 
  Sparkles, 
  Globe, 
  MessageCircle, 
  Award,
  Phone,
  Clock,
  Target,
  BarChart3,
  Headphones
} from "lucide-react";

// Static generation configuration  
export const revalidate = false; // Static generation

// Enhanced metadata for SEO
export const metadata = {
  title: "Pricing Plans | Loconomy - Transparent & Fair Pricing for Local Services",
  description: "Choose the perfect plan for your needs. Free for customers, competitive rates for providers. No hidden fees, transparent pricing with powerful features included.",
  keywords: ["pricing", "plans", "local services pricing", "provider fees", "customer plans", "transparent pricing"],
  openGraph: {
    title: "Pricing Plans | Loconomy - Transparent & Fair",
    description: "Choose the perfect plan for your needs. Free for customers, competitive rates for providers.",
    url: "https://loconomy.com/pricing",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://loconomy.com/pricing",
  },
};

const customerPricing = [
  {
    title: "Essential",
    description: "Perfect for occasional service needs",
    price: "Free",
    period: "forever",
    features: [
      "Unlimited service browsing",
      "Direct provider messaging", 
      "Secure payment processing",
      "Basic customer support",
      "Service history tracking",
    ],
    action: { label: "Get Started Free", href: "/auth/signup" },
    gradient: "from-gray-500 to-gray-600",
    popular: false,
    neumorphic: true
  },
  {
    title: "Premium",
    description: "Enhanced features for regular users",
    price: "$9.99",
    period: "per month",
    features: [
      "Priority customer support",
      "Advanced search filters",
      "Service scheduling assistant",
      "Exclusive provider access",
      "Detailed service analytics",
      "Multiple saved addresses",
    ],
    action: { label: "Start Free Trial", href: "/auth/signup?plan=premium" },
    gradient: "from-purple-500 to-pink-500",
    popular: true,
    neumorphic: true
  },
  {
    title: "Business",
    description: "For businesses with multiple locations",
    price: "$49.99",
    period: "per month",
    features: [
      "Multi-location management",
      "Team account access",
      "Bulk service booking",
      "Priority provider matching",
      "Custom invoicing",
      "Dedicated account manager",
    ],
    action: { label: "Contact Sales", href: "/contact" },
    gradient: "from-cyan-500 to-blue-500",
    popular: false,
    neumorphic: true
  }
];

const providerPricing = [
  {
    title: "Starter",
    description: "Great for new service providers",
    price: "5%",
    period: "commission per booking",
    features: [
      "Basic profile listing",
      "Customer messaging",
      "Payment processing",
      "Mobile app access",
      "Basic analytics",
    ],
    action: { label: "Join as Provider", href: "/become-provider" },
    gradient: "from-green-500 to-emerald-500",
    popular: false,
    neumorphic: true
  },
  {
    title: "Professional",
    description: "Advanced tools for growing businesses", 
    price: "3%",
    period: "commission per booking",
    features: [
      "Enhanced profile features",
      "Priority search placement",
      "Advanced scheduling tools",
      "Customer insights",
      "Marketing automation",
      "24/7 provider support",
    ],
    action: { label: "Upgrade to Pro", href: "/become-provider?plan=pro" },
    gradient: "from-purple-500 to-violet-500",
    popular: true,
    neumorphic: true
  },
  {
    title: "Enterprise",
    description: "Full-service solution for large operations",
    price: "Custom",
    period: "tailored pricing",
    features: [
      "White-label solutions",
      "API access",
      "Custom integrations",
      "Dedicated support team",
      "Advanced reporting",
      "Multi-brand management",
    ],
    action: { label: "Contact Sales", href: "/contact" },
    gradient: "from-orange-500 to-red-500",
    popular: false,
    neumorphic: true
  }
];

const features = [
  {
    title: "AI-Powered Matching",
    description: "Our advanced algorithms ensure perfect provider-customer matches",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Secure Payments",
    description: "Bank-level security with instant, secure payment processing",
    icon: Shield,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock customer and provider support",
    icon: Headphones,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Real-time Analytics",
    description: "Comprehensive insights and performance tracking",
    icon: BarChart3,
    gradient: "from-orange-500 to-yellow-500"
  }
];

const faqs = [
  {
    question: "How does the commission structure work?",
    answer: "Providers pay a small commission only when they complete a successful booking. There are no upfront costs or monthly fees for our basic plan."
  },
  {
    question: "Can I change my plan anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences."
  },
  {
    question: "Is there a setup fee?",
    answer: "No setup fees for any of our plans. We believe in transparent pricing with no hidden costs."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our encrypted payment system."
  }
];

// Structured data for pricing
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Loconomy Pricing Plans",
  "description": "Transparent pricing for local services platform",
  "provider": {
    "@type": "Organization",
    "name": "Loconomy"
  },
  "offers": customerPricing.map(plan => ({
    "@type": "Offer",
    "name": plan.title,
    "description": plan.description,
    "price": plan.price === "Free" ? "0" : plan.price.replace("$", ""),
    "priceCurrency": "USD"
  }))
};

export default function PricingPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold gradient-text">Loconomy</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/about" className="text-sm font-medium hover:text-primary">About</Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary">Contact</Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="btn-glow">Get Started</Button>
              </Link>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section with Advanced Glassmorphism */}
          <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-purple-950/20 dark:via-background dark:to-cyan-950/20 relative overflow-hidden">
            {/* Floating elements */}
            <div className="absolute inset-0">
              <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
              <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="container relative z-10">
              <div className="text-center max-w-4xl mx-auto">
                <ScrollReveal>
                  <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Transparent Pricing
                  </Badge>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                    Simple, Fair Pricing for Everyone
                  </h1>
                </ScrollReveal>

                <ScrollReveal delay={400}>
                  <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                    No hidden fees, no surprises. Choose the plan that fits your needs perfectly, 
                    whether you're finding services or providing them.
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={600}>
                  <div className="flex justify-center gap-4">
                    <Badge variant="outline" className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      No Setup Fees
                    </Badge>
                    <Badge variant="outline" className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
                      <Crown className="w-4 h-4 mr-2 text-purple-500" />
                      Cancel Anytime
                    </Badge>
                    <Badge variant="outline" className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
                      <Shield className="w-4 h-4 mr-2 text-blue-500" />
                      30-Day Guarantee
                    </Badge>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* Customer Pricing Section */}
          <section className="py-24">
            <div className="container">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">For Customers</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Find and book trusted local service providers with ease
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {customerPricing.map((plan, index) => (
                  <ScrollReveal key={plan.title} delay={index * 200}>
                    <Card className={`relative ${plan.popular ? 'border-purple-500 shadow-2xl scale-105' : ''} ${plan.neumorphic ? 'neumorphic-card' : 'card-glow'} hover:-translate-y-2 transition-all duration-500 group`}>
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                            <Crown className="w-4 h-4 mr-1" />
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      
                      <CardHeader className="text-center pb-4">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl">{plan.title}</CardTitle>
                        <CardDescription className="text-base">{plan.description}</CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="text-center mb-8">
                          <div className="text-4xl font-bold mb-2">
                            {plan.price}
                          </div>
                          <div className="text-muted-foreground">{plan.period}</div>
                        </div>

                        <ul className="space-y-3 mb-8">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Link href={plan.action.href}>
                          <Button 
                            className={`w-full ${plan.popular ? 'btn-elite' : ''} group-hover:scale-105 transition-transform duration-300`}
                            variant={plan.popular ? "default" : "outline"}
                          >
                            {plan.action.label}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Provider Pricing Section */}
          <section className="py-24 bg-gradient-to-br from-purple-50/50 via-white to-cyan-50/50 dark:from-purple-950/10 dark:via-background dark:to-cyan-950/10">
            <div className="container">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">For Service Providers</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Grow your business and reach more customers
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {providerPricing.map((plan, index) => (
                  <ScrollReveal key={plan.title} delay={index * 200}>
                    <Card className={`relative ${plan.popular ? 'border-purple-500 shadow-2xl scale-105' : ''} ${plan.neumorphic ? 'neumorphic-card' : 'card-glow'} hover:-translate-y-2 transition-all duration-500 group`}>
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-4 py-1">
                            <Star className="w-4 h-4 mr-1" />
                            Recommended
                          </Badge>
                        </div>
                      )}
                      
                      <CardHeader className="text-center pb-4">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl">{plan.title}</CardTitle>
                        <CardDescription className="text-base">{plan.description}</CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="text-center mb-8">
                          <div className="text-4xl font-bold mb-2">
                            {plan.price}
                          </div>
                          <div className="text-muted-foreground">{plan.period}</div>
                        </div>

                        <ul className="space-y-3 mb-8">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Link href={plan.action.href}>
                          <Button 
                            className={`w-full ${plan.popular ? 'btn-elite' : ''} group-hover:scale-105 transition-transform duration-300`}
                            variant={plan.popular ? "default" : "outline"}
                          >
                            {plan.action.label}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-24">
            <div className="container">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">What You Get</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Powerful features included in every plan
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <ScrollReveal key={feature.title} delay={index * 150}>
                    <div className="text-center group">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-24 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Everything you need to know about our pricing
                  </p>
                </div>
              </ScrollReveal>

              <div className="max-w-3xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                  <ScrollReveal key={faq.question} delay={index * 100}>
                    <Card className="neumorphic-card p-6 hover:shadow-lg transition-all duration-300">
                      <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="container relative z-10">
              <ScrollReveal>
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Ready to Get Started?
                  </h2>
                  <p className="text-xl mb-8 opacity-90">
                    Join thousands of satisfied customers and providers on Loconomy today. 
                    Start with our free plan and upgrade as you grow.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/auth/signup">
                      <Button size="lg" variant="outline" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg border-white">
                        <Users className="w-5 h-5 mr-2" />
                        Sign Up Free
                      </Button>
                    </Link>
                    <Link href="/become-provider">
                      <Button size="lg" className="bg-white/20 hover:bg-white/30 border-white/20 px-8 py-4 text-lg backdrop-blur-md">
                        <Award className="w-5 h-5 mr-2" />
                        Become a Provider
                      </Button>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </main>

        <ModernFooter />
      </div>

      <style jsx global>{`
        .neumorphic-card {
          background: #ffffff;
          box-shadow: 
            20px 20px 60px #d1d1d1,
            -20px -20px 60px #ffffff;
          border: none;
        }
        .dark .neumorphic-card {
          background: #1a1a1a;
          box-shadow: 
            20px 20px 60px #151515,
            -20px -20px 60px #1f1f1f;
        }
        .neumorphic-card:hover {
          box-shadow: 
            25px 25px 75px #d1d1d1,
            -25px -25px 75px #ffffff;
        }
        .dark .neumorphic-card:hover {
          box-shadow: 
            25px 25px 75px #151515,
            -25px -25px 75px #1f1f1f;
        }
      `}</style>
    </>
  );
}
