"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AdvancedReviewSystem, 
  CommunityPlatform, 
  SocialProofWidgets, 
  EnhancedUserProfile 
} from '@/components/social';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Star, Award, Heart, MessageCircle, 
  TrendingUp, Shield, Globe, Crown 
} from 'lucide-react';

// Mock data for demonstrations
const mockReviews = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    userAvatar: '/placeholder.svg',
    rating: 5,
    title: 'Exceptional Service!',
    content: 'The quality of work exceeded my expectations. Fast delivery, great communication, and attention to detail. Will definitely hire again!',
    timestamp: new Date('2024-01-15'),
    likes: 24,
    dislikes: 0,
    replies: 3,
    verified: true,
    sentiment: 'positive' as const,
    aiInsights: {
      trustScore: 95,
      keyPoints: ['Quality work', 'Fast delivery', 'Great communication'],
      emotion: 'satisfied',
      authenticity: 0.94
    },
    categories: ['quality', 'communication', 'timeliness'],
    helpfulVotes: 18,
    reportedCount: 0,
    isEdited: false,
    serviceId: 'service1',
    providerId: 'provider1'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Michael Chen',
    userAvatar: '/placeholder.svg',
    rating: 4,
    title: 'Good Experience Overall',
    content: 'Professional approach and delivered on time. Minor revisions needed but overall satisfied with the outcome.',
    timestamp: new Date('2024-01-10'),
    likes: 12,
    dislikes: 1,
    replies: 2,
    verified: true,
    sentiment: 'positive' as const,
    aiInsights: {
      trustScore: 88,
      keyPoints: ['Professional', 'On time delivery', 'Minor revisions'],
      emotion: 'satisfied',
      authenticity: 0.91
    },
    categories: ['professionalism', 'timeliness'],
    helpfulVotes: 8,
    reportedCount: 0,
    isEdited: false,
    serviceId: 'service1',
    providerId: 'provider1'
  }
];

const mockSocialProof = {
  totalReviews: 1247,
  averageRating: 4.8,
  ratingDistribution: { 5: 856, 4: 312, 3: 67, 2: 9, 1: 3 },
  recentTrend: 'up' as const,
  trustScore: 94,
  verifiedReviews: 1156,
  responseRate: 98,
  responseTime: '< 2 hours'
};

const mockUserProfile = {
  id: 'user1',
  name: 'Alex Rivera',
  avatar: '/placeholder.svg',
  title: 'Senior Full-Stack Developer',
  location: 'San Francisco, CA',
  joinDate: new Date('2022-03-15'),
  reputation: 8540,
  level: 12,
  badges: [],
  stats: {
    completedJobs: 127,
    totalEarnings: 125000,
    rating: 4.9,
    reviewCount: 89,
    responseRate: 98,
    responseTime: '< 1 hour'
  },
  skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
  certifications: ['AWS Certified', 'React Expert'],
  socialLinks: {
    linkedin: 'https://linkedin.com/in/alexrivera',
    website: 'https://alexrivera.dev'
  },
  bio: 'Passionate full-stack developer with 8+ years of experience building scalable web applications.',
  isVerified: true,
  isOnline: true,
  lastSeen: new Date(),
  privacySettings: {
    showEarnings: true,
    showLocation: true,
    allowMessages: true
  }
};

const mockCommunityPosts = [
  {
    id: '1',
    authorId: 'user1',
    author: mockUserProfile,
    content: 'Just launched a new project using Next.js 14 and the new App Router. The developer experience is amazing! 🚀\n\nAnyone else experimenting with the latest features?',
    type: 'text' as const,
    timestamp: new Date('2024-01-15T10:30:00'),
    likes: 42,
    comments: 8,
    shares: 3,
    bookmarks: 12,
    tags: ['nextjs', 'webdev', 'react'],
    isPromoted: false,
    engagement: {
      views: 234,
      clickthrough: 18,
      saves: 12
    }
  }
];

const mockGroups = [
  {
    id: '1',
    name: 'React Developers',
    description: 'A community for React developers to share knowledge and best practices',
    avatar: '/placeholder.svg',
    memberCount: 15420,
    category: 'Technology',
    isPrivate: false,
    tags: ['react', 'javascript', 'frontend'],
    rules: ['Be respectful', 'No spam', 'Share knowledge'],
    moderators: ['mod1', 'mod2'],
    activity: 156,
    createdDate: new Date('2023-01-15')
  }
];

const mockSocialProofData = {
  totalUsers: 125000,
  activeUsers: 8500,
  totalReviews: 45000,
  averageRating: 4.8,
  completedJobs: 235000,
  totalEarnings: 15000000,
  countriesServed: 95,
  uptime: 99.9
};

const mockTestimonials = [
  {
    id: '1',
    userName: 'Emily Rodriguez',
    userAvatar: '/placeholder.svg',
    userTitle: 'Marketing Director',
    content: 'This platform transformed how we find and work with freelancers. The quality of talent is exceptional.',
    rating: 5,
    location: 'New York, NY',
    timestamp: new Date('2024-01-10'),
    verified: true,
    platform: 'web' as const
  }
];

const mockActivityFeed = [
  {
    id: '1',
    type: 'booking' as const,
    message: 'Sarah J. just booked a web development project',
    timestamp: new Date(),
    user: { name: 'Sarah Johnson', avatar: '/placeholder.svg' },
    metadata: { amount: 2500, location: 'Remote' }
  },
  {
    id: '2',
    type: 'review' as const,
    message: 'Michael C. left a 5-star review for logo design',
    timestamp: new Date(Date.now() - 300000),
    user: { name: 'Michael Chen', avatar: '/placeholder.svg' },
    metadata: { rating: 5 }
  }
];

const mockEnhancedProfile = {
  id: 'user1',
  name: 'Alexandra Rivera',
  avatar: '/placeholder.svg',
  coverImage: '/placeholder.svg',
  title: 'Senior Full-Stack Developer & UI/UX Designer',
  bio: 'Passionate about creating exceptional digital experiences through clean code and thoughtful design. With 8+ years in the industry, I specialize in React, Node.js, and modern web technologies.\n\nI believe in the power of collaboration and continuous learning. When I\'m not coding, you can find me mentoring junior developers or exploring the latest design trends.',
  location: 'San Francisco, CA',
  timezone: 'PST (UTC-8)',
  joinDate: new Date('2022-03-15'),
  lastActive: new Date(),
  isOnline: true,
  isVerified: true,
  stats: {
    completedJobs: 187,
    totalEarnings: 285000,
    rating: 4.9,
    reviewCount: 156,
    responseRate: 98,
    responseTime: '< 1 hour',
    repeatClients: 67,
    successRate: 96
  },
  social: {
    followers: 2840,
    following: 320,
    connections: 1250,
    endorsements: 89,
    profileViews: 12500,
    searchAppearances: 890
  },
  skills: [
    { name: 'React', level: 95, endorsements: 45, category: 'technical', verified: true },
    { name: 'Node.js', level: 90, endorsements: 38, category: 'technical', verified: true },
    { name: 'TypeScript', level: 88, endorsements: 42, category: 'technical', verified: false },
    { name: 'Communication', level: 94, endorsements: 67, category: 'soft', verified: true },
    { name: 'Leadership', level: 85, endorsements: 32, category: 'soft', verified: false }
  ],
  languages: ['English (Native)', 'Spanish (Fluent)', 'French (Conversational)'],
  certifications: ['AWS Certified Solutions Architect', 'Google UX Design Certificate', 'React Expert Certification'],
  workExperience: [
    {
      id: '1',
      title: 'Senior Full-Stack Developer',
      company: 'TechCorp Inc.',
      duration: '2022 - Present',
      description: 'Lead development of scalable web applications serving 1M+ users. Mentor junior developers and drive technical decisions.',
      skills: ['React', 'Node.js', 'AWS', 'TypeScript'],
      achievements: [
        'Increased application performance by 40%',
        'Led team of 6 developers',
        'Implemented CI/CD pipeline reducing deployment time by 60%'
      ]
    }
  ],
  portfolio: [
    {
      id: '1',
      title: 'E-commerce Platform Redesign',
      description: 'Complete redesign and development of a modern e-commerce platform with React and Node.js',
      images: ['/placeholder.svg'],
      tags: ['React', 'Node.js', 'E-commerce', 'UI/UX'],
      rating: 5,
      reviews: 12,
      completedDate: new Date('2024-01-01'),
      client: 'Fashion Boutique Co.',
      earnings: 15000
    }
  ],
  achievements: [
    {
      id: '1',
      title: 'Top Performer',
      description: 'Ranked in top 1% of developers',
      icon: 'trophy',
      earnedDate: new Date('2024-01-01'),
      rarity: 'legendary' as const,
      category: 'performance' as const
    }
  ],
  preferences: {
    showEarnings: true,
    showLocation: true,
    allowMessages: true,
    availableForWork: true,
    hourlyRate: 125,
    workingHours: ['9AM-6PM PST']
  },
  contact: {
    email: 'alex@example.com',
    website: 'https://alexrivera.dev',
    linkedin: 'https://linkedin.com/in/alexrivera'
  }
};

export default function SocialDemoPage() {
  const [activeDemo, setActiveDemo] = useState('reviews');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">
              Social Features & Community
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Experience our comprehensive social platform with advanced reviews, 
              community interaction, social proof widgets, and enhanced user profiles.
            </p>
            <div className="flex justify-center items-center space-x-8 text-lg">
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6" />
                <span>Community Platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6" />
                <span>Advanced Reviews</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6" />
                <span>Social Proof</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Demo Navigation */}
        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reviews" className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Review System</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Community</span>
            </TabsTrigger>
            <TabsTrigger value="social-proof" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Social Proof</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>User Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-8">
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-6 h-6 text-yellow-500" />
                    <span>Advanced Review System</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    AI-powered review system with sentiment analysis, trust scoring, 
                    and comprehensive social proof metrics. Features real-time insights 
                    and advanced filtering capabilities.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">4.8</div>
                      <div className="text-sm text-muted-foreground">Avg Rating</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">1,247</div>
                      <div className="text-sm text-muted-foreground">Total Reviews</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">94%</div>
                      <div className="text-sm text-muted-foreground">Trust Score</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">98%</div>
                      <div className="text-sm text-muted-foreground">Response Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <AdvancedReviewSystem
                serviceId="demo-service"
                providerId="demo-provider"
                reviews={mockReviews}
                socialProof={mockSocialProof}
                onSubmitReview={(review) => console.log('New review:', review)}
                onLikeReview={(reviewId) => console.log('Liked review:', reviewId)}
                onReportReview={(reviewId, reason) => console.log('Reported:', reviewId, reason)}
              />
            </div>
          </TabsContent>

          <TabsContent value="community" className="mt-8">
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-6 h-6 text-blue-500" />
                    <span>Community Platform</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Comprehensive community platform with social networking, groups, 
                    leaderboards, and real-time activity feeds. Connect and collaborate 
                    with professionals worldwide.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
                      <Users className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
                      <div className="text-lg font-bold">50K+</div>
                      <div className="text-sm text-muted-foreground">Community Members</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <MessageCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
                      <div className="text-lg font-bold">125K+</div>
                      <div className="text-sm text-muted-foreground">Posts & Discussions</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <Globe className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                      <div className="text-lg font-bold">150+</div>
                      <div className="text-sm text-muted-foreground">Professional Groups</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <CommunityPlatform
                currentUser={mockUserProfile}
                posts={mockCommunityPosts}
                groups={mockGroups}
                trendingTopics={['React', 'AI', 'RemoteWork', 'WebDev', 'Freelancing']}
                onCreatePost={(post) => console.log('New post:', post)}
                onLikePost={(postId) => console.log('Liked post:', postId)}
                onFollowUser={(userId) => console.log('Followed user:', userId)}
                onJoinGroup={(groupId) => console.log('Joined group:', groupId)}
              />
            </div>
          </TabsContent>

          <TabsContent value="social-proof" className="mt-8">
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-6 h-6 text-green-500" />
                    <span>Social Proof Widgets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Build trust and credibility with comprehensive social proof widgets. 
                    Features live activity feeds, rotating testimonials, trust badges, 
                    and real-time statistics with smooth animations.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                      <TrendingUp className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                      <div className="font-bold">125K+</div>
                      <div className="text-xs text-muted-foreground">Active Users</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                      <Star className="w-6 h-6 mx-auto text-amber-600 mb-1" />
                      <div className="font-bold">45K+</div>
                      <div className="text-xs text-muted-foreground">Reviews</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <Globe className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                      <div className="font-bold">95</div>
                      <div className="text-xs text-muted-foreground">Countries</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <Crown className="w-6 h-6 mx-auto text-purple-600 mb-1" />
                      <div className="font-bold">99.9%</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <SocialProofWidgets
                data={mockSocialProofData}
                testimonials={mockTestimonials}
                activityFeed={mockActivityFeed}
                showLiveActivity={true}
                showTestimonials={true}
                showTrustBadges={true}
                showStatsCounter={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-8">
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-6 h-6 text-gold-500" />
                    <span>Enhanced User Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Comprehensive user profiles with social features, skill endorsements, 
                    portfolio showcase, achievements system, and professional networking capabilities. 
                    Designed for maximum engagement and trust building.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">187</div>
                      <div className="text-xs text-muted-foreground">Jobs</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
                      <div className="text-lg font-bold text-green-600">$285K</div>
                      <div className="text-xs text-muted-foreground">Earned</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">2.8K</div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">98%</div>
                      <div className="text-xs text-muted-foreground">Response</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 rounded-lg">
                      <div className="text-lg font-bold text-cyan-600">12.5K</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 rounded-lg">
                      <div className="text-lg font-bold text-amber-600">15</div>
                      <div className="text-xs text-muted-foreground">Badges</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <EnhancedUserProfile
                profile={mockEnhancedProfile}
                isOwnProfile={true}
                onFollow={() => console.log('Follow user')}
                onMessage={() => console.log('Message user')}
                onEndorse={(skill) => console.log('Endorse skill:', skill)}
                onEditProfile={(updates) => console.log('Update profile:', updates)}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Feature Highlights */}
        <Card className="glass-card mt-12">
          <CardHeader>
            <CardTitle className="text-center">🎉 Social Features Completed!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <Star className="w-12 h-12 mx-auto text-yellow-500" />
                <h3 className="font-semibold">AI-Powered Reviews</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced sentiment analysis and trust scoring
                </p>
              </div>
              <div className="space-y-2">
                <Users className="w-12 h-12 mx-auto text-blue-500" />
                <h3 className="font-semibold">Community Platform</h3>
                <p className="text-sm text-muted-foreground">
                  Social networking with groups and discussions
                </p>
              </div>
              <div className="space-y-2">
                <Shield className="w-12 h-12 mx-auto text-green-500" />
                <h3 className="font-semibold">Social Proof</h3>
                <p className="text-sm text-muted-foreground">
                  Trust badges and real-time activity feeds
                </p>
              </div>
              <div className="space-y-2">
                <Award className="w-12 h-12 mx-auto text-purple-500" />
                <h3 className="font-semibold">Enhanced Profiles</h3>
                <p className="text-sm text-muted-foreground">
                  Professional networking and skill endorsements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
