'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Brain,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Zap,
  Target,
  Users,
  MessageCircle,
  Calendar,
  ArrowRight,
  Sparkles,
  Shield,
  Award,
  ThumbsUp,
  Eye,
  Filter,
  Shuffle
} from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  service: string;
  rating: number;
  reviewCount: number;
  distance: string;
  responseTime: string;
  price: string;
  avatar: string;
  verified: boolean;
  matchScore: number;
  specialties: string[];
  availability: 'available' | 'busy' | 'offline';
  completedJobs: number;
}

export function SmartMatchPreview() {
  const [selectedService, setSelectedService] = useState('House Cleaning');
  const [isMatching, setIsMatching] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);

  const sampleProviders: Provider[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      service: 'House Cleaning',
      rating: 4.9,
      reviewCount: 247,
      distance: '0.8 mi',
      responseTime: '2 min',
      price: '$45/hr',
      avatar: '/api/placeholder/100/100',
      verified: true,
      matchScore: 98,
      specialties: ['Deep Cleaning', 'Eco-Friendly', 'Pet-Friendly'],
      availability: 'available',
      completedJobs: 312
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      service: 'House Cleaning',
      rating: 4.8,
      reviewCount: 189,
      distance: '1.2 mi',
      responseTime: '5 min',
      price: '$40/hr',
      avatar: '/api/placeholder/100/100',
      verified: true,
      matchScore: 95,
      specialties: ['Move-in/out', 'Office Cleaning'],
      availability: 'available',
      completedJobs: 278
    },
    {
      id: '3',
      name: 'Emma Thompson',
      service: 'House Cleaning',
      rating: 4.9,
      reviewCount: 156,
      distance: '2.1 mi',
      responseTime: '8 min',
      price: '$50/hr',
      avatar: '/api/placeholder/100/100',
      verified: true,
      matchScore: 92,
      specialties: ['Luxury Homes', 'Same-day Service'],
      availability: 'busy',
      completedJobs: 201
    }
  ];

  const services = [
    'House Cleaning',
    'Plumbing',
    'Math Tutoring',
    'Personal Training',
    'Dog Walking',
    'Lawn Care'
  ];

  // Simulate AI matching process
  useEffect(() => {
    setIsMatching(true);
    setProviders([]);
    
    const timeout = setTimeout(() => {
      const shuffled = [...sampleProviders]
        .sort(() => Math.random() - 0.5)
        .map(provider => ({
          ...provider,
          service: selectedService,
          matchScore: Math.floor(Math.random() * 20) + 80, // 80-100
          distance: `${(Math.random() * 3 + 0.5).toFixed(1)} mi`,
          responseTime: `${Math.floor(Math.random() * 10) + 1} min`
        }));
      
      setProviders(shuffled);
      setIsMatching(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [selectedService]);

  const getAvailabilityColor = (availability: Provider['availability']) => {
    switch (availability) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getAvailabilityText = (availability: Provider['availability']) => {
    switch (availability) {
      case 'available':
        return 'Available Now';
      case 'busy':
        return 'Busy';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <Badge className="mb-4 px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          <Brain className="w-4 h-4 mr-2" />
          AI Matching Demo
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          See How Our AI Finds Your Perfect Match
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Experience our intelligent matching algorithm in action. Select a service and watch as our AI instantly finds the best professionals for your needs.
        </p>
      </div>

      {/* Service Selector */}
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 self-center mr-4">
              Try searching for:
            </span>
            {services.map((service) => (
              <Button
                key={service}
                variant={selectedService === service ? "default" : "outline"}
                size="sm"
                className={`transition-all duration-300 ${
                  selectedService === service
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'hover:border-blue-300 dark:hover:border-blue-600'
                }`}
                onClick={() => setSelectedService(service)}
              >
                {service}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Matching Process */}
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200/50 dark:border-gray-700/50">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                AI Matching Results for "{selectedService}"
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Powered by advanced machine learning algorithms
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {isMatching ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-spin">
                  <div className="w-full h-full rounded-full border-4 border-transparent border-t-white"></div>
                </div>
                <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  AI is finding your perfect matches...
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Analyzing {Math.floor(Math.random() * 500 + 200)} professionals in your area
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {providers.map((provider, index) => (
                <div
                  key={provider.id}
                  className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-6">
                    {/* Match Score */}
                    <div className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-2">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-500">
                          <div 
                            className="w-full h-full rounded-full border-4 border-transparent"
                            style={{
                              background: `conic-gradient(from 0deg, #10b981 ${provider.matchScore * 3.6}deg, #e5e7eb ${provider.matchScore * 3.6}deg)`
                            }}
                          ></div>
                        </div>
                        <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {provider.matchScore}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                              match
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                        #{index + 1} Match
                      </Badge>
                    </div>

                    {/* Provider Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={provider.avatar} alt={provider.name} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                              {provider.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                {provider.name}
                              </h3>
                              {provider.verified && (
                                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-medium">{provider.rating}</span>
                                <span>({provider.reviewCount} reviews)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Award className="w-4 h-4" />
                                <span>{provider.completedJobs} jobs</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {provider.price}
                          </div>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getAvailabilityColor(provider.availability)}`}>
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            {getAvailabilityText(provider.availability)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{provider.distance} away</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>Responds in {provider.responseTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                          <Target className="w-4 h-4" />
                          <span>{provider.matchScore}% match</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <ThumbsUp className="w-4 h-4" />
                          <span>Top rated</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {provider.specialties.map((specialty, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Now
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Features Highlight */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">
              Why Our AI Matching is Revolutionary
            </h3>
            <p className="text-purple-100 text-lg">
              Our advanced machine learning algorithms consider hundreds of factors to find your perfect match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'Learning Algorithm',
                description: 'Gets smarter with every match, learning your preferences and improving recommendations'
              },
              {
                icon: Zap,
                title: 'Instant Results',
                description: 'Find qualified professionals in seconds, not hours. Real-time availability matching'
              },
              {
                icon: Target,
                title: '98% Success Rate',
                description: 'Our AI achieves 98% customer satisfaction by precisely matching needs with expertise'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-purple-100 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              Try Different Service
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
