"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Rocket,
  TrendingUp,
  Target,
  Zap,
  DollarSign,
  Brain,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { TipBoostingEngine } from "@/components/optimization/tip-boosting-engine";
import { useToast } from "@/hooks/use-toast";

export default function OptimizeServicePage() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showEngine, setShowEngine] = useState(false);
  const { toast } = useToast();

  const services = [
    {
      id: 1,
      title: "House Cleaning Service",
      category: "home-services",
      amount: 125,
      urgency: "medium" as const,
      description: "3-bedroom apartment deep cleaning"
    },
    {
      id: 2,
      title: "Math Tutoring Session",
      category: "education",
      amount: 65,
      urgency: "low" as const,
      description: "High school calculus tutoring"
    },
    {
      id: 3,
      title: "Emergency Plumbing Repair",
      category: "home-services",
      amount: 200,
      urgency: "urgent" as const,
      description: "Urgent pipe leak repair"
    }
  ];

  const handleBoostApplied = (boost: any, tip: number) => {
    toast({
      title: "Optimization Applied!",
      description: `${boost.name} activated with $${tip} tip. Your service visibility has been enhanced.`,
    });
    
    // Simulate redirect to service tracking
    setTimeout(() => {
      setShowEngine(false);
    }, 2000);
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Optimization",
      description: "Machine learning algorithms analyze market data to suggest optimal tips and boosts",
      color: "from-purple-500 to-blue-600"
    },
    {
      icon: Target,
      title: "Dynamic Pricing Intelligence",
      description: "Real-time market analysis provides competitive pricing insights and recommendations",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Rocket,
      title: "Instant Visibility Boost",
      description: "Get featured placement and priority matching to connect with providers faster",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: TrendingUp,
      title: "ROI Optimization",
      description: "Predictive analytics ensure maximum return on your tip and boost investments",
      color: "from-blue-500 to-cyan-600"
    }
  ];

  const stats = [
    { label: "Avg. Response Improvement", value: "73%", icon: Zap },
    { label: "Customer Satisfaction", value: "4.8/5", icon: Star },
    { label: "Successful Matches", value: "94%", icon: CheckCircle },
    { label: "Time Saved", value: "2.5hrs", icon: Target },
  ];

  if (showEngine && selectedService) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowEngine(false)}
              className="mb-4"
            >
              ← Back to Services
            </Button>
          </div>
          
          <TipBoostingEngine
            providerId="provider_123"
            serviceAmount={selectedService.amount}
            serviceCategory={selectedService.category}
            urgency={selectedService.urgency}
            onBoostApplied={handleBoostApplied}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-6">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Optimize Your Service with 
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {" "}AI Intelligence
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Use our advanced tip boosting engine to maximize your service visibility, 
            get faster responses, and ensure the best possible experience with AI-optimized recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-lg px-8"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Optimization
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Icon className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Service Selection */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Choose a Service to Optimize</CardTitle>
            <p className="text-center text-muted-foreground">
              Select one of your services to see AI optimization recommendations
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card 
                  key={service.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-orange-200"
                  onClick={() => {
                    setSelectedService(service);
                    setShowEngine(true);
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold mb-1">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      <Badge 
                        className={
                          service.urgency === 'urgent' ? 'bg-red-100 text-red-800' :
                          service.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                          service.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }
                      >
                        {service.urgency}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-orange-600">
                        ${service.amount}
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">How AI Optimization Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-orange-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Analyze Your Service</h3>
                <p className="text-sm text-muted-foreground">
                  AI examines your service details, pricing, urgency, and market conditions.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Generate Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Machine learning suggests optimal tips and visibility boosts for maximum impact.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Apply Optimizations</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from AI suggestions or customize your optimization strategy.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-600">4</span>
                </div>
                <h3 className="font-semibold mb-2">Track Results</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor improved response rates, faster matching, and better outcomes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Services?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who get better results with AI-powered optimization.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-lg px-8"
          >
            <Rocket className="w-5 h-5 mr-2" />
            Start Optimizing Now
          </Button>
        </div>
      </div>
    </div>
  );
}
