"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { GlassmorphicContainer } from "@/components/admin/design-system/glassmorphic-container";
import { HolographicText } from "@/components/admin/design-system/holographic-text";
import {
  Briefcase,
  Users,
  Heart,
  Rocket,
  ArrowRight,
  MapPin,
  Clock,
  Building,
  Search,
  Filter,
  Star,
  Brain,
  Code,
  Palette,
  BarChart3,
  Shield,
  Globe,
  Zap,
  Award,
  Coffee,
  Monitor,
  Gamepad2,
  Lightbulb,
  TrendingUp,
  Target
} from "lucide-react";

const jobOpenings = [
  {
    id: 1,
    title: "Senior AI Engineer (Neural Networks)",
    location: "Remote / San Francisco, CA",
    department: "AI Research",
    type: "Full-time",
    level: "Senior",
    salary: "$180k - $250k",
    description: "Lead development of our quantum-enhanced neural matching algorithms that power intelligent service discovery.",
    requirements: ["PhD in CS/AI or equivalent", "5+ years ML/AI experience", "PyTorch/TensorFlow expertise", "Neural architecture experience"],
    benefits: ["Equity package", "Full health coverage", "Unlimited PTO", "Remote-first"],
    featured: true,
    urgent: false,
    icon: Brain,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    title: "Senior Frontend Engineer (React/Next.js)",
    location: "Remote / New York, NY",
    department: "Engineering",
    type: "Full-time", 
    level: "Senior",
    salary: "$150k - $200k",
    description: "Build beautiful, performant user interfaces for our AI-powered local services platform using cutting-edge technologies.",
    requirements: ["5+ years React experience", "Next.js expertise", "TypeScript mastery", "Design system experience"],
    benefits: ["Stock options", "Health + dental", "Learning budget", "Flexible hours"],
    featured: true,
    urgent: false,
    icon: Code,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "Product Manager (AI/UX)",
    location: "Remote / San Francisco, CA",
    department: "Product",
    type: "Full-time",
    level: "Mid-Senior",
    salary: "$140k - $180k", 
    description: "Drive product strategy for AI-powered features that create magical user experiences and increase platform engagement.",
    requirements: ["4+ years PM experience", "AI/ML product experience", "Data-driven mindset", "User research skills"],
    benefits: ["Equity participation", "Premium healthcare", "Quarterly offsites", "Product budget"],
    featured: false,
    urgent: true,
    icon: Target,
    gradient: "from-green-500 to-teal-500"
  },
  {
    id: 4,
    title: "Senior UX Designer (AI Interfaces)",
    location: "Remote / Los Angeles, CA",
    department: "Design",
    type: "Full-time",
    level: "Senior",
    salary: "$130k - $170k",
    description: "Design intuitive interfaces for complex AI systems, making artificial intelligence feel natural and magical for everyday users.",
    requirements: ["5+ years UX design", "AI/ML interface experience", "Figma mastery", "User research skills"],
    benefits: ["Design conference budget", "Top-tier equipment", "Flexible schedule", "Creative freedom"],
    featured: false,
    urgent: false,
    icon: Palette,
    gradient: "from-pink-500 to-orange-500"
  },
  {
    id: 5,
    title: "Data Scientist (Growth Analytics)",
    location: "Remote / Chicago, IL",
    department: "Analytics",
    type: "Full-time",
    level: "Mid-Senior",
    salary: "$120k - $160k",
    description: "Analyze user behavior patterns and optimize growth funnels using advanced statistical modeling and machine learning.",
    requirements: ["3+ years data science", "Python/R proficiency", "Statistics expertise", "Growth experience"],
    benefits: ["Learning stipend", "Conference travel", "Collaborative team", "Impact-driven work"],
    featured: false,
    urgent: false,
    icon: BarChart3,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: 6,
    title: "Security Engineer (AI Systems)",
    location: "Remote / Austin, TX", 
    department: "Security",
    type: "Full-time",
    level: "Senior",
    salary: "$160k - $210k",
    description: "Secure our AI infrastructure and protect user data with next-generation security protocols and quantum-resistant encryption.",
    requirements: ["5+ years security engineering", "AI/ML security experience", "Cloud security expertise", "Incident response skills"],
    benefits: ["Security conference budget", "Certification support", "On-call compensation", "Elite team culture"],
    featured: false,
    urgent: true,
    icon: Shield,
    gradient: "from-red-500 to-pink-500"
  }
];

const companyValues = [
  {
    title: "AI-First Innovation",
    description: "We leverage cutting-edge AI to solve real-world problems and create magical user experiences.",
    icon: Brain,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Remote-First Culture",
    description: "Work from anywhere with a team that values flexibility, trust, and work-life balance.",
    icon: Globe,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Impact-Driven Mission",
    description: "Every line of code and design decision directly improves lives and strengthens communities.",
    icon: Heart,
    gradient: "from-green-500 to-teal-500"
  },
  {
    title: "Continuous Learning",
    description: "Grow your skills with generous learning budgets, mentorship, and challenging projects.",
    icon: Lightbulb,
    gradient: "from-orange-500 to-red-500"
  }
];

const benefits = [
  { icon: Heart, title: "Health & Wellness", description: "Premium health, dental, vision + $2k wellness budget" },
  { icon: Rocket, title: "Equity & Growth", description: "Meaningful equity package with high growth potential" },
  { icon: Monitor, title: "Remote-First", description: "Work from anywhere + $3k home office setup budget" },
  { icon: Coffee, title: "Unlimited PTO", description: "Take time when you need it + quarterly company retreats" },
  { icon: Award, title: "Learning Budget", description: "$5k annual budget for courses, conferences, books" },
  { icon: Users, title: "Amazing Team", description: "Work with brilliant, passionate people who care deeply" }
];

const departments = ["All", "Engineering", "AI Research", "Product", "Design", "Analytics", "Security"];

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [filteredJobs, setFilteredJobs] = useState(jobOpenings);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterJobs(query, selectedDepartment);
  };

  const handleDepartmentFilter = (department: string) => {
    setSelectedDepartment(department);
    filterJobs(searchQuery, department);
  };

  const filterJobs = (query: string, department: string) => {
    let filtered = jobOpenings;
    
    if (department !== "All") {
      filtered = filtered.filter(job => job.department === department);
    }
    
    if (query) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase()) ||
        job.department.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredJobs(filtered);
  };

  const featuredJobs = filteredJobs.filter(job => job.featured);
  const regularJobs = filteredJobs.filter(job => !job.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      {/* Header spacing */}
      <div className="h-20 md:h-24"></div>

      {/* Hero Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              <Briefcase className="w-4 h-4 mr-2" />
              Join Our Mission
            </Badge>
            
            <HolographicText className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
              Build the Future of AI Services
            </HolographicText>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Join a team of brilliant minds creating AI-powered solutions that connect people with perfect local services. 
              Work on cutting-edge technology that impacts millions of lives worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EnhancedButton size="lg" className="px-8 py-4 text-lg">
                <Search className="w-5 h-5 mr-2" />
                View Open Positions
              </EnhancedButton>
              
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-4 text-lg border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Heart className="w-5 h-5 mr-2" />
                Our Culture
              </Button>
            </div>
          </div>

          {/* Company Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { label: "Team Members", value: "150+", icon: Users },
              { label: "Countries", value: "25+", icon: Globe },
              { label: "Funding Raised", value: "$50M", icon: TrendingUp },
              { label: "Customer Rating", value: "4.9/5", icon: Star }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4 bg-white/50 dark:bg-gray-800/20">
        <div className="max-w-4xl mx-auto">
          <GlassmorphicContainer variant="subtle">
            <div className="p-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search positions by title, skills, or department..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 text-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-white/40 focus:border-blue-400 focus:ring-blue-400/30 rounded-xl"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    size="sm"
                    variant={selectedDepartment === dept ? "default" : "outline"}
                    onClick={() => handleDepartmentFilter(dept)}
                    className={`text-xs ${
                      selectedDepartment === dept 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80'
                    }`}
                  >
                    {dept}
                  </Button>
                ))}
              </div>
            </div>
          </GlassmorphicContainer>
        </div>
      </section>

      {/* Featured Positions */}
      {featuredJobs.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                <Star className="w-4 h-4 mr-2" />
                Featured Positions
              </Badge>
              <HolographicText className="text-3xl md:text-4xl font-bold mb-4">
                High-Impact Roles
              </HolographicText>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                These positions have direct impact on our AI capabilities and user experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredJobs.map((job) => (
                <EnhancedCard key={job.id} variant="interactive" className="hover:scale-[1.02] transition-all duration-500 h-full">
                  <EnhancedCardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${job.gradient} flex items-center justify-center shadow-lg`}>
                        <job.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                          {job.urgent && (
                            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {job.department}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.type}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {job.description}
                    </p>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Requirements:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.slice(0, 3).map((req, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                          {job.requirements.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.requirements.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {job.salary}
                          </span>
                        </div>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {job.level}
                        </Badge>
                      </div>
                    </div>
                    
                    <EnhancedButton className="w-full">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </EnhancedButton>
                  </EnhancedCardContent>
                </EnhancedCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Positions */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <HolographicText className="text-3xl md:text-4xl font-bold mb-4">
              All Open Positions
            </HolographicText>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join our growing team and help shape the future of AI-powered services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularJobs.map((job) => (
              <EnhancedCard key={job.id} variant="glass" className="hover:scale-105 transition-all duration-500 h-full group">
                <EnhancedCardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${job.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <job.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          {job.department}
                        </Badge>
                        {job.urgent && (
                          <Badge className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {job.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {job.type} • {job.level}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {job.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {job.salary}
                    </span>
                  </div>
                  
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors"
                  >
                    <Link href={`/careers/${job.id}`}>
                      View Details
                      <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </EnhancedCardContent>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              <Heart className="w-4 h-4 mr-2" />
              Our Values
            </Badge>
            <HolographicText className="text-4xl md:text-5xl font-bold mb-6">
              What Drives Us
            </HolographicText>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our values guide everything we do, from the code we write to the products we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <EnhancedCard key={index} variant="glass" className="hover:scale-105 transition-all duration-500 text-center">
                <EnhancedCardContent className="p-8">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${value.gradient} flex items-center justify-center shadow-lg`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </EnhancedCardContent>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              <Star className="w-4 h-4 mr-2" />
              Benefits & Perks
            </Badge>
            <HolographicText className="text-4xl md:text-5xl font-bold mb-6">
              Why You'll Love Working Here
            </HolographicText>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We invest in our people with comprehensive benefits and a culture that puts your well-being first.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <EnhancedCard key={index} variant="glass" className="hover:scale-102 transition-all duration-500">
                <EnhancedCardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <div className="text-4xl mb-6">🚀</div>
          <HolographicText className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Shape the Future?
          </HolographicText>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Join us in building AI that makes a real difference in people's lives. Your next adventure starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnhancedButton 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-6 text-xl shadow-xl"
            >
              <Search className="w-6 h-6 mr-3" />
              Browse All Positions
            </EnhancedButton>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-white border-white/50 hover:border-white hover:bg-white/10 px-10 py-6 text-xl"
            >
              <Heart className="w-6 h-6 mr-3" />
              Learn Our Culture
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
