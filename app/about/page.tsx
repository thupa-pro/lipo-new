import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModernFooter } from "@/components/modern-footer";

import {
  MapPin,
  Users,
  Lightbulb,
  Handshake,
  ArrowRight,
  Sparkles,
  Award,
  Target,
  Globe,
  Heart,
  Zap,
  Shield,
  TrendingUp,
  Star,
  Crown,
  Brain,
  Rocket,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  Search
} from "lucide-react";

// Static generation configuration
export const revalidate = false; // Static generation

// Enhanced metadata for SEO
export const metadata = {
  title: "About Loconomy - AI-Powered Local Services Platform | Our Story & Mission",
  description: "Learn about Loconomy's mission to connect communities with trusted local service professionals through AI-powered matching. Discover our story, values, and commitment to excellence.",
  keywords: ["about loconomy", "local services platform", "AI matching", "company mission", "trusted professionals"],
  openGraph: {
    title: "About Loconomy - Our Story & Mission",
    description: "Learn about Loconomy's mission to connect communities with trusted local service professionals",
    url: "https://loconomy.com/about",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://loconomy.com/about",
  },
};

// Company stats (static data for about page)
const companyStats = [
  { label: "Active Users", value: "2.4M+", icon: Users, color: "text-purple-500" },
  { label: "Service Providers", value: "45K+", icon: Handshake, color: "text-cyan-500" },
  { label: "Services Completed", value: "1.2M+", icon: CheckCircle, color: "text-green-500" },
  { label: "Cities Served", value: "500+", icon: MapPin, color: "text-orange-500" },
];

const teamMembers = [
  {
    name: "Alex Rodriguez",
    role: "CEO & Co-Founder",
    bio: "Former tech executive with 15+ years in marketplace platforms",
    avatar: "AR",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    name: "Sarah Chen",
    role: "CTO & Co-Founder", 
    bio: "AI/ML expert, previously at Google and OpenAI",
    avatar: "SC",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    name: "Marcus Johnson",
    role: "Head of Operations",
    bio: "Operations specialist focused on provider success",
    avatar: "MJ",
    gradient: "from-green-500 to-teal-500"
  },
  {
    name: "Elena Vasquez",
    role: "Head of Design",
    bio: "UX designer passionate about human-centered experiences",
    avatar: "EV",
    gradient: "from-orange-500 to-red-500"
  }
];

const coreValues = [
  {
    title: "Trust & Safety",
    description: "Every provider is thoroughly vetted, verified, and insured for your peace of mind.",
    icon: Shield,
    gradient: "from-green-400 to-emerald-600"
  },
  {
    title: "Innovation",
    description: "We leverage cutting-edge AI to create the most intelligent matching platform.",
    icon: Brain,
    gradient: "from-purple-400 to-violet-600"
  },
  {
    title: "Community",
    description: "Building stronger local communities by connecting neighbors with trusted professionals.",
    icon: Heart,
    gradient: "from-pink-400 to-rose-600"
  },
  {
    title: "Excellence",
    description: "We're committed to delivering exceptional experiences for both customers and providers.",
    icon: Award,
    gradient: "from-yellow-400 to-orange-600"
  }
];

const milestones = [
  {
    year: "2019",
    title: "Company Founded",
    description: "Started with a vision to revolutionize local services",
    icon: Rocket
  },
  {
    year: "2020", 
    title: "AI Platform Launch",
    description: "Introduced our proprietary AI matching algorithm",
    icon: Brain
  },
  {
    year: "2021",
    title: "1M Users Milestone",
    description: "Reached our first million registered users",
    icon: Users
  },
  {
    year: "2022",
    title: "National Expansion",
    description: "Expanded to 500+ cities across the country",
    icon: Globe
  },
  {
    year: "2023",
    title: "Provider Excellence",
    description: "Launched comprehensive provider certification program",
    icon: Award
  },
  {
    year: "2024",
    title: "AI Revolution",
    description: "Advanced AI features for personalized service recommendations",
    icon: Sparkles
  }
];

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Loconomy",
  "description": "AI-Powered Local Services Platform connecting customers with trusted professionals",
  "url": "https://loconomy.com",
  "logo": "https://loconomy.com/logo.png",
  "foundingDate": "2019",
  "numberOfEmployees": "150+",
  "founder": [
    {
      "@type": "Person",
      "name": "Alex Rodriguez"
    },
    {
      "@type": "Person", 
      "name": "Sarah Chen"
    }
  ],
  "sameAs": [
    "https://twitter.com/loconomy",
    "https://linkedin.com/company/loconomy",
    "https://facebook.com/loconomy"
  ]
};

export default function AboutPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-stratosphere via-cirrus to-white dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
        {/* Neural Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, hsl(var(--neural-500)) 2px, transparent 0),
                             radial-gradient(circle at 75px 75px, hsl(var(--quantum-500)) 1px, transparent 0)`,
            backgroundSize: '100px 100px'
          }} />
        </div>

        <main className="relative z-10">
          {/* Hero Section with Modern Glassmorphism */}
          <section className="py-24 relative overflow-hidden">
            {/* Enhanced animated background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-neural/20 rounded-full blur-3xl animate-float"></div>
              <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-quantum/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-plasma/10 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="container relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                  <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium glass">
                    <Sparkles className="w-4 h-4 mr-2" />
                    About Our Mission
                  </Badge>

                  <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient-ai leading-tight">
                    Connecting Communities Through Trust & Innovation
                  </h1>

                  <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                    We're building the future of local services by combining cutting-edge AI technology 
                    with human-centered design to create meaningful connections between communities and 
                    trusted professionals.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/browse">
                      <EnhancedButton size="lg" variant="premium" className="px-8 py-4 text-lg hover:shadow-glow-neural">
                        <Search className="w-5 h-5 mr-2" />
                        Explore Platform
                      </EnhancedButton>
                    </Link>
                    <Link href="/become-provider">
                      <EnhancedButton variant="glass" size="lg" className="px-8 py-4 text-lg border-white/20">
                        <Users className="w-5 h-5 mr-2" />
                        Join as Provider
                      </EnhancedButton>
                    </Link>
                  </div>
              </div>
            </div>
          </section>

          {/* Company Stats with Enhanced Glassmorphism */}
          <section className="py-16">
            <div className="container">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {companyStats.map((stat, index) => {
                    const gradients = ['gradient-neural', 'gradient-quantum', 'gradient-trust', 'gradient-plasma'];
                    const gradientClass = gradients[index % gradients.length];

                    return (
                      <EnhancedCard key={stat.label} variant="glass" className="text-center hover:scale-105 transition-all duration-500 group">
                        <EnhancedCardContent className="pt-6">
                          <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl bg-${gradientClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <p className={`text-3xl font-bold mb-2 text-${gradientClass}`}>{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </EnhancedCardContent>
                      </EnhancedCard>
                    );
                  })}
                </div>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="py-24">
            <div className="container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="text-4xl font-bold mb-6">Our Story</h2>
                    <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                      <p>
                        Loconomy was born from a simple frustration: finding reliable local service providers 
                        shouldn't be a gamble. Our founders, having experienced the pain of unreliable contractors 
                        and service providers, envisioned a platform that would eliminate uncertainty through 
                        technology and trust.
                      </p>
                      <p>
                        What started as a weekend project in 2019 has evolved into a comprehensive platform 
                        serving millions of users. We've built sophisticated AI algorithms that don't just 
                        match you with any provider, but with the right provider for your specific needs, 
                        location, and preferences.
                      </p>
                      <p>
                        Today, we're proud to be the bridge that connects communities, helping local businesses 
                        thrive while ensuring customers receive exceptional service every time.
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <EnhancedCard variant="premium" className="aspect-square p-1 bg-gradient-ai">
                      <div className="w-full h-full rounded-3xl bg-background p-8 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-neural flex items-center justify-center">
                            <Rocket className="w-12 h-12 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2 text-gradient-neural">2019 - Present</h3>
                          <p className="text-muted-foreground">Building the future of local services</p>
                        </div>
                      </div>
                    </EnhancedCard>
                  </div>
              </div>
            </div>
          </section>

          {/* Core Values with Advanced Cards */}
          <section className="py-24">
            <div className="container">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4 text-gradient-quantum">Our Core Values</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    The principles that guide everything we do and drive our mission forward.
                  </p>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {coreValues.map((value, index) => {
                  const gradients = ['gradient-trust', 'gradient-neural', 'gradient-plasma', 'gradient-quantum'];
                  const gradientClass = gradients[index % gradients.length];

                  return (
                    <EnhancedCard key={value.title} variant="glass" className="p-8 group hover:scale-105 transition-all duration-500">
                      <div className="flex items-start gap-6">
                        <div className={`w-16 h-16 rounded-2xl bg-${gradientClass} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <value.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className={`text-2xl font-bold mb-4 text-${gradientClass} transition-colors`}>
                            {value.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </EnhancedCard>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Team Section with Modern Cards */}
          <section className="py-24">
            <div className="container">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4 text-gradient-trust">Meet Our Team</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    The passionate individuals building the future of local services.
                  </p>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => {
                  const gradients = ['gradient-neural', 'gradient-quantum', 'gradient-trust', 'gradient-plasma'];
                  const gradientClass = gradients[index % gradients.length];

                  return (
                    <EnhancedCard key={member.name} variant="glass" className="text-center group hover:scale-105 transition-all duration-500">
                      <EnhancedCardContent className="pt-8">
                        <Avatar className="w-24 h-24 mx-auto mb-4">
                          <AvatarImage src={`/team/${member.name.toLowerCase().replace(' ', '-')}.jpg`} />
                          <AvatarFallback className={`bg-${gradientClass} text-white text-xl font-bold`}>
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className={`text-xl font-bold mb-2 text-${gradientClass} transition-colors`}>
                          {member.name}
                        </h3>
                        <p className={`text-${gradientClass} font-medium mb-3 opacity-80`}>
                          {member.role}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {member.bio}
                        </p>
                      </EnhancedCardContent>
                    </EnhancedCard>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="py-24">
            <div className="container">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4 text-gradient-plasma">Our Journey</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Key milestones in our mission to revolutionize local services.
                  </p>
                </div>

              <div className="max-w-4xl mx-auto">
                {milestones.map((milestone, index) => {
                  const gradients = ['gradient-neural', 'gradient-quantum', 'gradient-trust', 'gradient-plasma', 'gradient-ai', 'gradient-glow'];
                  const gradientClass = gradients[index % gradients.length];

                  return (
                    <div key={milestone.year} className="flex items-center gap-8 mb-12 group">
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 rounded-2xl bg-${gradientClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <milestone.icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <EnhancedCard variant="glass" className="p-6 group-hover:scale-105 transition-all duration-500">
                          <div className="flex items-center gap-4 mb-3">
                            <Badge variant="secondary" className={`bg-${gradientClass}/20 text-${gradientClass} border-${gradientClass}/30`}>
                              {milestone.year}
                            </Badge>
                            <h3 className={`text-xl font-bold text-${gradientClass}`}>{milestone.title}</h3>
                          </div>
                          <p className="text-muted-foreground">{milestone.description}</p>
                        </EnhancedCard>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 bg-gradient-ai text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="container relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Ready to Experience the Future of Local Services?
                  </h2>
                  <p className="text-xl mb-8 opacity-90">
                    Join millions of satisfied customers and thousands of trusted professionals
                    on Loconomy today.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/browse">
                      <EnhancedButton size="lg" className="bg-white text-purple-600 hover:bg-gray-100 hover:shadow-glow-neural px-8 py-4 text-lg">
                        <Search className="w-5 h-5 mr-2" />
                        Find Services
                      </EnhancedButton>
                    </Link>
                    <Link href="/become-provider">
                      <EnhancedButton variant="glass" size="lg" className="border-white/20 hover:bg-white/10 px-8 py-4 text-lg">
                        <Users className="w-5 h-5 mr-2" />
                        Become a Provider
                      </EnhancedButton>
                    </Link>
                  </div>
                </div>
            </div>
          </section>
        </main>

        <ModernFooter />
      </div>
    </>
  );
}
