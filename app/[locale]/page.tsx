import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Brain,
  Shield,
  Zap,
  Users,
  Globe,
  Award,
  ArrowRight,
  ChevronRight,
  Network,
  Atom,
  Bot,
  Radar,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stratosphere dark:bg-eclipse text-eclipse dark:text-stratosphere overflow-hidden relative">
      {/* Advanced Neural Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neural-50/80 via-quantum-50/60 to-trust-50/80 dark:from-neural-950/60 dark:via-quantum-950/40 dark:to-trust-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(79,124,255,0.15),transparent_60%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(79,124,255,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,212,255,0.12),transparent_60%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(0,212,255,0.15),transparent_60%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* AI Status Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-strong border border-neural-200/50 dark:border-neural-700/50 mb-12">
            <div className="w-3 h-3 bg-trust-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-neural-700 dark:text-neural-300">
              Neural Networks Active: 2.1M+ Global Users
            </span>
            <Bot className="w-5 h-5 text-neural-500 dark:text-neural-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-display-xl font-black mb-8 leading-none">
            <span className="text-gradient-neural">
              Local Services
            </span>
            <br />
            <span className="text-gradient-quantum">
              Redefined by AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-body-l text-nimbus dark:text-cirrus mb-16 max-w-5xl mx-auto leading-relaxed">
            Experience the future of local services with our 
            <span className="text-gradient-plasma font-semibold">
              {" "}quantum-enhanced AI platform{" "}
            </span>
            that connects you with verified professionals.
          </p>

          {/* Search Interface */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-neural rounded-4xl blur-xl opacity-30 dark:opacity-40 transition duration-1000" />
              <div className="relative glass-strong rounded-4xl p-3 border border-neural-200/30 dark:border-neural-700/30 shadow-glass-lg">
                <div className="flex items-center gap-6 px-8 py-6">
                  <div className="w-8 h-8 rounded-full bg-gradient-neural flex items-center justify-center shadow-glow-neural">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <input
                    type="text"
                    placeholder="Describe your perfect service match..."
                    className="flex-1 bg-transparent border-none outline-none text-eclipse dark:text-stratosphere placeholder-nimbus dark:placeholder-cirrus text-lg font-medium"
                  />
                  <Button className="bg-gradient-neural text-white rounded-3xl px-10 py-4 font-bold text-lg transition-all duration-500">
                    Neural Search
                    <Radar className="w-5 h-5 ml-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
            <Button
              size="lg"
              className="relative bg-gradient-neural text-white rounded-3xl px-16 py-6 font-bold text-xl shadow-glass transition-all duration-500"
              asChild
            >
              <Link href="/browse">
                <Brain className="w-6 h-6 mr-4" />
                Activate Neural Search
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-3xl px-16 py-6 font-bold text-xl border-2 border-neural-300 dark:border-neural-600 text-neural-700 dark:text-neural-300 transition-all duration-500"
              asChild
            >
              <Link href="/become-provider">
                Join Neural Network
                <Network className="w-6 h-6 ml-4" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-80">
            {[
              { icon: Shield, text: "Quantum Verified", color: "text-trust-500" },
              { icon: Award, text: "Neural Rated", color: "text-neural-500" },
              { icon: Zap, text: "Instant Matching", color: "text-quantum-500" },
              { icon: Users, text: "AI Community", color: "text-plasma-500" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-base text-nimbus dark:text-cirrus transition-all duration-300"
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Metrics Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-display-l font-bold mb-8">
              <span className="text-gradient-quantum">Neural Analytics</span>
            </h2>
            <p className="text-body-l text-nimbus dark:text-cirrus max-w-4xl mx-auto">
              Real-time metrics from our quantum-enhanced AI platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                label: "Neural Networks",
                value: "2.1M+",
                icon: Brain,
                description: "Active AI Models",
                gradient: "from-neural-500 to-quantum-500",
              },
              {
                label: "Quantum Processing",
                value: "50M+",
                icon: Atom,
                description: "Operations per Second",
                gradient: "from-quantum-500 to-trust-500",
              },
              {
                label: "Trust Score",
                value: "99.7%",
                icon: Shield,
                description: "Security Rating",
                gradient: "from-trust-500 to-plasma-500",
              },
              {
                label: "Global Reach",
                value: "180",
                icon: Globe,
                description: "Countries Connected",
                gradient: "from-plasma-500 to-neural-500",
              },
            ].map((metric, index) => (
              <Card
                key={index}
                className="relative glass-strong border-0 rounded-3xl p-8 group transition-all duration-700 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-3xl`} />
                
                <CardContent className="p-0 relative z-10">
                  <div
                    className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${metric.gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500`}
                  >
                    <metric.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="text-5xl font-black mb-3 text-eclipse dark:text-stratosphere">
                    {metric.value}
                  </div>
                  
                  <div className="text-heading-m font-semibold text-storm dark:text-cirrus mb-2">
                    {metric.label}
                  </div>
                  
                  <div className="text-sm text-nimbus dark:text-cirrus">
                    {metric.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-neural rounded-4xl blur-3xl opacity-20 dark:opacity-30" />
            <div className="relative glass-strong rounded-4xl p-16 border border-neural-200/30 dark:border-neural-700/30 shadow-glass-xl">
              <h2 className="text-display-l font-bold mb-8">
                <span className="text-gradient-neural">Ready to Enter</span>
                <br />
                <span className="text-gradient-quantum">the Neural Future?</span>
              </h2>
              
              <p className="text-body-l text-nimbus dark:text-cirrus mb-16 max-w-3xl mx-auto">
                Join over 2 million users who trust our quantum-enhanced AI platform
                to connect them with verified local professionals
              </p>

              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Button
                  size="lg"
                  className="relative bg-gradient-neural text-white rounded-3xl px-16 py-6 font-bold text-xl transition-all duration-500"
                  asChild
                >
                  <Link href="/auth/signup">
                    <Radar className="w-6 h-6 mr-4" />
                    Activate Neural Search
                  </Link>
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-3xl px-16 py-6 font-bold text-xl border-2 border-neural-300 dark:border-neural-600 text-neural-700 dark:text-neural-300 transition-all duration-500"
                  asChild
                >
                  <Link href="/become-provider">
                    <Network className="w-6 h-6 mr-4" />
                    Join Neural Network
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
