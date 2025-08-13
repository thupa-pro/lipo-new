"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Users, TrendingUp, Award, Shield, CheckCircle, 
  Heart, MessageCircle, Clock, MapPin, Zap, Crown,
  Eye, ThumbsUp, Share2, Globe, Camera, Video
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SocialProofData {
  totalUsers: number;
  activeUsers: number;
  totalReviews: number;
  averageRating: number;
  completedJobs: number;
  totalEarnings: number;
  countriesServed: number;
  uptime: number;
}

interface TestimonialData {
  id: string;
  userName: string;
  userAvatar: string;
  userTitle: string;
  content: string;
  rating: number;
  location: string;
  timestamp: Date;
  verified: boolean;
  platform: 'web' | 'mobile' | 'api';
}

interface ActivityFeedItem {
  id: string;
  type: 'booking' | 'review' | 'milestone' | 'feature' | 'user_join';
  message: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar: string;
  };
  metadata?: {
    rating?: number;
    amount?: number;
    location?: string;
  };
}

interface SocialProofWidgetsProps {
  data: SocialProofData;
  testimonials: TestimonialData[];
  activityFeed: ActivityFeedItem[];
  showLiveActivity?: boolean;
  showTestimonials?: boolean;
  showTrustBadges?: boolean;
  showStatsCounter?: boolean;
  className?: string;
}

export function SocialProofWidgets({
  data,
  testimonials,
  activityFeed,
  showLiveActivity = true,
  showTestimonials = true,
  showTrustBadges = true,
  showStatsCounter = true,
  className = ""
}: SocialProofWidgetsProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [visibleActivities, setVisibleActivities] = useState(5);
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalReviews: 0,
    completedJobs: 0
  });

  // Animate stats counter
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const animate = () => {
      let step = 0;
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setAnimatedStats({
          totalUsers: Math.floor(data.totalUsers * easeOut),
          activeUsers: Math.floor(data.activeUsers * easeOut),
          totalReviews: Math.floor(data.totalReviews * easeOut),
          completedJobs: Math.floor(data.completedJobs * easeOut)
        });

        if (step === steps) {
          clearInterval(interval);
        }
      }, stepDuration);
    };

    animate();
  }, [data]);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'review': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'milestone': return <Award className="w-4 h-4 text-purple-500" />;
      case 'feature': return <Zap className="w-4 h-4 text-green-500" />;
      case 'user_join': return <Users className="w-4 h-4 text-blue-500" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const trustBadges = [
    { icon: Shield, label: 'SSL Secured', color: 'text-green-500' },
    { icon: CheckCircle, label: 'Verified Platform', color: 'text-blue-500' },
    { icon: Award, label: 'Industry Leader', color: 'text-purple-500' },
    { icon: Crown, label: 'Premium Service', color: 'text-yellow-500' },
    { icon: Globe, label: 'Global Reach', color: 'text-indigo-500' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Counter */}
      {showStatsCounter && (
        <Card className="glass-card overflow-hidden">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-blue-500 mr-2" />
                  <span className="text-3xl font-bold text-primary">
                    {formatNumber(animatedStats.totalUsers)}+
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Total Users</div>
                <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% this month
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-yellow-500 mr-2" />
                  <span className="text-3xl font-bold text-primary">
                    {formatNumber(animatedStats.totalReviews)}+
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Reviews</div>
                <div className="flex items-center justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= data.averageRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs ml-1">({data.averageRating.toFixed(1)})</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                  <span className="text-3xl font-bold text-primary">
                    {formatNumber(animatedStats.completedJobs)}+
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Jobs Completed</div>
                <div className="text-xs text-blue-600 flex items-center justify-center mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  99.2% on time
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <Eye className="w-6 h-6 text-purple-500 mr-2" />
                  <span className="text-3xl font-bold text-primary">
                    {formatNumber(animatedStats.activeUsers)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Online Now</div>
                <div className="flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                  <span className="text-xs text-green-600">Live</span>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Activity Feed */}
        {showLiveActivity && (
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                  Live Activity
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {activityFeed.length} recent
                </Badge>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                <AnimatePresence>
                  {activityFeed.slice(0, visibleActivities).map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {activity.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {activity.metadata?.location && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3 mr-1" />
                              {activity.metadata.location}
                            </div>
                          )}
                        </div>
                      </div>
                      {activity.user && (
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={activity.user.avatar} />
                          <AvatarFallback className="text-xs">
                            {activity.user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {activityFeed.length > visibleActivities && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => setVisibleActivities(prev => prev + 5)}
                >
                  Show More Activities
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Rotating Testimonials */}
        {showTestimonials && testimonials.length > 0 && (
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Customer Stories</h3>
                <div className="flex space-x-1">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= testimonials[currentTestimonial].rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <blockquote className="text-gray-900 dark:text-gray-100 italic">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>

                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={testimonials[currentTestimonial].userAvatar} />
                      <AvatarFallback>
                        {testimonials[currentTestimonial].userName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold flex items-center">
                        {testimonials[currentTestimonial].userName}
                        {testimonials[currentTestimonial].verified && (
                          <CheckCircle className="w-4 h-4 text-blue-500 ml-1" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonials[currentTestimonial].userTitle}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {testimonials[currentTestimonial].location}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Trust Badges */}
      {showTrustBadges && (
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <h3 className="font-semibold mb-2">Trusted by Thousands</h3>
              <p className="text-sm text-muted-foreground">
                Your security and satisfaction are our top priorities
              </p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {trustBadges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${badge.color}`} />
                    <div className="text-xs font-medium">{badge.label}</div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  {data.countriesServed}+ countries
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {data.uptime}% uptime
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Bank-level security
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Media Proof */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-semibold mb-4">Join Our Growing Community</h3>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <Heart className="w-8 h-8 mx-auto text-red-500 mb-2" />
                <div className="font-bold text-lg">{formatNumber(125000)}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <Share2 className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                <div className="font-bold text-lg">{formatNumber(89000)}</div>
                <div className="text-xs text-muted-foreground">Shares</div>
              </div>
              <div className="text-center">
                <ThumbsUp className="w-8 h-8 mx-auto text-green-500 mb-2" />
                <div className="font-bold text-lg">{formatNumber(234000)}</div>
                <div className="text-xs text-muted-foreground">Likes</div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button size="sm" variant="outline">
                <Camera className="w-4 h-4 mr-2" />
                Instagram
              </Button>
              <Button size="sm" variant="outline">
                <Video className="w-4 h-4 mr-2" />
                YouTube
              </Button>
              <Button size="sm" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Twitter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
