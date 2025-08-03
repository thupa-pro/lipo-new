"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wand2,
  Sparkles,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Star,
  Brain,
  Target,
  Zap
} from "lucide-react";
import { AIJobPostingWizard } from "@/components/wizards/ai-job-posting-wizard";
import { useToast } from "@/hooks/use-toast";

interface JobPostData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  location: {
    address: string;
    coordinates?: [number, number];
    type: 'onsite' | 'remote' | 'hybrid';
  };
  scheduling: {
    type: 'asap' | 'scheduled' | 'flexible';
    dates: Date[];
    timeSlots: string[];
    duration: number;
    recurring: boolean;
    recurringPattern?: string;
  };
  budget: {
    type: 'fixed' | 'hourly' | 'negotiable';
    min?: number;
    max?: number;
    currency: string;
  };
  requirements: string[];
  benefits: string[];
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  photos: File[];
  tags: string[];
}

export default function PostJobPage() {
  const [showWizard, setShowWizard] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleJobComplete = async (jobData: JobPostData) => {
    try {
      // Simulate API call to create job posting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Job Posted Successfully!",
        description: `"${jobData.title}" has been published and is now visible to providers.`,
      });

      // Redirect to job management or browse page
      router.push('/my-jobs');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Descriptions",
      description: "Get professionally written job descriptions that attract top providers",
      color: "from-purple-500 to-blue-600"
    },
    {
      icon: Target,
      title: "Smart Pricing Suggestions",
      description: "AI analyzes market data to suggest optimal pricing for your job",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Zap,
      title: "Instant Matching",
      description: "Get matched with qualified providers in minutes, not days",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Star,
      title: "Quality Guarantee",
      description: "All providers are background-checked and customer-rated",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const stats = [
    { label: "Average Response Time", value: "< 2 hours", icon: Clock },
    { label: "Provider Satisfaction", value: "98%", icon: Star },
    { label: "Jobs Completed", value: "10,000+", icon: CheckCircle },
    { label: "Active Providers", value: "5,000+", icon: Users },
  ];

  if (showWizard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4">
          <AIJobPostingWizard
            onComplete={handleJobComplete}
            onCancel={() => setShowWizard(false)}
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
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
            <Wand2 className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Post Your Job with 
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {" "}AI Magic
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Our AI-powered wizard creates professional job postings in minutes, 
            matches you with the perfect providers, and gets your job done faster than ever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowWizard(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start AI Wizard
            </Button>
            <Button size="lg" variant="outline">
              See Example Posts
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
                  <Icon className="w-8 h-8 mx-auto text-blue-600 mb-2" />
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

        {/* How It Works */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Describe Your Job</h3>
                <p className="text-sm text-muted-foreground">
                  Tell our AI what you need done. It will help you create a detailed, professional job posting.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Get Matched</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI instantly matches you with qualified, rated providers in your area.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Get It Done</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your provider, schedule the work, and enjoy professional service delivery.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Job Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Popular Job Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'House Cleaning',
                'Handyman Services',
                'Pet Care',
                'Tutoring',
                'Car Wash',
                'Lawn Care',
                'Moving Help',
                'Personal Training'
              ].map((jobType, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => setShowWizard(true)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {jobType}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of satisfied customers who get their jobs done faster with our AI platform.
          </p>
          <Button 
            size="lg" 
            onClick={() => setShowWizard(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8"
          >
            <Wand2 className="w-5 h-5 mr-2" />
            Create Your First Job Post
          </Button>
        </div>
      </div>
    </div>
  );
}
