import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SmartRecommendations from "@/components/ai/smart-recommendations";
import {
  Star,
  MapPin,
  Zap,
  Shield,
  Users,
  Sparkles,
  Search,
  TrendingUp,
  Clock,
  Award,
  CheckCircle,
  ArrowRight,
  Brain,
  Heart,
  Home,
  Briefcase,
  Car,
  PiggyBank,
  Target,
  Smartphone,
  Play,
  ChevronRight,
  Globe,
  Layers,
  Database,
  Cpu,
  MessageCircle,
  Activity,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const stats = [
    {
      label: "Active Users",
      value: "2.1M",
      icon: Users,
      trend: "+847%",
      color: "from-violet-500 to-purple-600",
    },
    {
      label: "AI Matches",
      value: "50M+",
      icon: Brain,
      trend: "+312%",
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Trust Score",
      value: "99.7%",
      icon: Shield,
      trend: "Industry Leading",
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Global Reach",
      value: "180",
      icon: Globe,
      trend: "Countries",
      color: "from-blue-500 to-cyan-600",
    },
  ];

  const services = [
    {
      title: "Smart Matching",
      subtitle: "AI-Powered Service Discovery",
      description:
        "Our intelligent AI analyzes your needs, location, and preferences to connect you with the perfect local professionals instantly.",
      icon: Brain,
      gradient: "from-blue-600 via-purple-600 to-emerald-600",
      stats: { accuracy: "96.8%", matches: "2.1M+", satisfaction: "4.9★" },
    },
    {
      title: "Verified Professionals",
      subtitle: "Trusted & Background-Checked",
      description:
        "Every service provider undergoes thorough verification, background checks, and continuous quality monitoring.",
      icon: Shield,
      gradient: "from-emerald-600 via-green-600 to-cyan-600",
      stats: { verified: "100%", checks: "15+", quality: "A+" },
    },
    {
      title: "Fair Pricing",
      subtitle: "Transparent & Competitive",
      description:
        "Advanced algorithms ensure fair, competitive pricing while helping providers earn sustainable income.",
      icon: Target,
      gradient: "from-purple-600 via-pink-600 to-rose-600",
      stats: { savings: "25%", transparent: "100%", fair: "A+" },
    },
  ];

  const categories = [
    {
      name: "Home & Living",
      icon: Home,
      count: "12.4K",
      color: "from-blue-500 to-purple-600",
      popular: true,
    },
    {
      name: "Professional",
      icon: Briefcase,
      count: "8.7K",
      color: "from-purple-500 to-pink-600",
      popular: false,
    },
    {
      name: "Wellness",
      icon: Heart,
      count: "6.2K",
      color: "from-pink-500 to-rose-600",
      popular: true,
    },
    {
      name: "Technology",
      icon: Cpu,
      count: "4.8K",
      color: "from-green-500 to-emerald-600",
      popular: false,
    },
    {
      name: "Transportation",
      icon: Car,
      count: "3.1K",
      color: "from-blue-500 to-teal-600",
      popular: false,
    },
    {
      name: "Education",
      icon: Database,
      count: "9.3K",
      color: "from-cyan-500 to-blue-600",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(139,92,246,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_40%_60%,rgba(16,185,129,0.08),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 dark:bg-violet-400 rounded-full animate-pulse opacity-30 dark:opacity-40" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-emerald-400 dark:bg-blue-400 rounded-full animate-ping opacity-20 dark:opacity-30" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-400 dark:bg-emerald-400 rounded-full animate-bounce opacity-15 dark:opacity-20" />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-cyan-400 dark:bg-pink-400 rounded-full animate-pulse opacity-20 dark:opacity-30" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-indigo-400 dark:bg-cyan-400 rounded-full animate-ping opacity-15 dark:opacity-25" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-8 group hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Trusted by 2.1M+ Users Globally
            </span>
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none">
            <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
              Local Services
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Redefined
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Connect with AI-matched, verified local professionals who deliver
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
              {" "}
              exceptional quality service{" "}
            </span>
            right in your neighborhood.
          </p>

          {/* Search Interface */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-50 transition duration-1000" />
              <div className="relative bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-3xl p-2 border border-blue-200/50 dark:border-white/20 shadow-xl">
                <div className="flex items-center gap-4 px-6 py-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-violet-500 dark:to-purple-500 flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type="text"
                    placeholder="Find trusted local help near you..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 text-lg"
                  />
                  <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl px-8 py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25">
                    Find Services
                    <MapPin className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-2xl px-12 py-4 font-bold text-lg shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-violet-500/30 transition-all duration-500 group"
              asChild
            >
              <Link href="/browse">
                <Search className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Find Services Now
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl px-12 py-4 font-bold text-lg border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:border-blue-400 dark:hover:border-white/40 transition-all duration-500"
              asChild
            >
              <Link href="/become-provider">
                Become a Provider
                <ChevronRight className="w-5 h-5 ml-3" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70 dark:opacity-60">
            {[
              { icon: Shield, text: "Verified Professionals" },
              { icon: Award, text: "5-Star Quality" },
              { icon: Zap, text: "Instant Booking" },
              { icon: Users, text: "Trusted Community" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-300"
              >
                <item.icon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Redefining Excellence
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real-time metrics from our revolutionary platform that's changing
              how the world connects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="relative bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl p-8 group hover:bg-white/10 transition-all duration-500 hover:scale-105"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color.replace("from-", "").replace(" to-", ", ")})`,
                  }}
                />
                <CardContent className="p-0 relative z-10">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-black mb-2 text-white">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 mb-3 font-medium">
                    {stat.label}
                  </div>
                  <div className="text-sm text-emerald-400 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SmartRecommendations
            location="Global"
            context="elite-homepage"
            maxRecommendations={3}
            showAIInsights={true}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur-2xl opacity-10 dark:opacity-20" />
            <div className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-blue-200/50 dark:border-white/10 shadow-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
                  Ready to Find Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Perfect Match?
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
                Join over 2 million users who trust Loconomy to connect them
                with exceptional local professionals.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-2xl px-12 py-4 font-bold text-lg shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-violet-500/30 transition-all duration-500"
                  asChild
                >
                  <Link href="/auth/signup">
                    <Search className="w-5 h-5 mr-3" />
                    Find Services Now
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-12 py-4 font-bold text-lg border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:border-blue-400 dark:hover:border-white/40 transition-all duration-500"
                  asChild
                >
                  <Link href="/become-provider">
                    <Heart className="w-5 h-5 mr-3" />
                    Join as Provider
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
