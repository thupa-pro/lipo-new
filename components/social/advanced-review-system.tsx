"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ThumbsUp, MessageCircle, Share2, Flag, Award, TrendingUp, Brain, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  timestamp: Date;
  likes: number;
  dislikes: number;
  replies: number;
  verified: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
  aiInsights: {
    trustScore: number;
    keyPoints: string[];
    emotion: string;
    authenticity: number;
  };
  categories: string[];
  helpfulVotes: number;
  reportedCount: number;
  isEdited: boolean;
  photos?: string[];
  serviceId: string;
  providerId: string;
}

interface SocialProof {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  recentTrend: 'up' | 'down' | 'stable';
  trustScore: number;
  verifiedReviews: number;
  responseRate: number;
  responseTime: string;
}

interface AdvancedReviewSystemProps {
  serviceId: string;
  providerId: string;
  reviews: Review[];
  socialProof: SocialProof;
  onSubmitReview?: (review: Partial<Review>) => void;
  onLikeReview?: (reviewId: string) => void;
  onReportReview?: (reviewId: string, reason: string) => void;
  className?: string;
}

export function AdvancedReviewSystem({
  serviceId,
  providerId,
  reviews,
  socialProof,
  onSubmitReview,
  onLikeReview,
  onReportReview,
  className = ""
}: AdvancedReviewSystemProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [filterBy, setFilterBy] = useState<'all' | 'verified' | '5' | '4' | '3' | '2' | '1'>('all');
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
    categories: [] as string[]
  });

  const filteredReviews = reviews.filter(review => {
    if (filterBy === 'all') return true;
    if (filterBy === 'verified') return review.verified;
    return review.rating === parseInt(filterBy);
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'helpful':
        return b.helpfulVotes - a.helpfulVotes;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleSubmitReview = () => {
    if (onSubmitReview && newReview.content.trim()) {
      onSubmitReview({
        ...newReview,
        serviceId,
        providerId,
        timestamp: new Date()
      });
      setNewReview({ rating: 5, title: '', content: '', categories: [] });
      setShowReviewForm(false);
    }
  };

  const renderStars = (rating: number, size = 'sm') => {
    const sizeClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Social Proof Overview */}
      <Card className="glass-card border-glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span>Social Proof & Trust Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {socialProof.averageRating.toFixed(1)}
              </div>
              {renderStars(socialProof.averageRating, 'lg')}
              <div className="text-sm text-muted-foreground mt-1">
                {socialProof.totalReviews} reviews
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold">{socialProof.trustScore}%</span>
              </div>
              <div className="text-sm text-muted-foreground">Trust Score</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <TrendingUp className={`w-5 h-5 ${
                  socialProof.recentTrend === 'up' ? 'text-green-500' : 
                  socialProof.recentTrend === 'down' ? 'text-red-500' : 'text-gray-500'
                }`} />
                <span className="text-2xl font-bold">{socialProof.verifiedReviews}</span>
              </div>
              <div className="text-sm text-muted-foreground">Verified Reviews</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {socialProof.responseRate}%
              </div>
              <div className="text-sm text-muted-foreground">
                Response Rate
              </div>
              <div className="text-xs text-muted-foreground">
                Avg: {socialProof.responseTime}
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Rating Distribution</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = socialProof.ratingDistribution[rating] || 0;
                const percentage = (count / socialProof.totalReviews) * 100;
                return (
                  <div key={rating} className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 w-16">
                      <span className="text-sm">{rating}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Management */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Recent Highlights</h3>
                  <div className="space-y-3">
                    {reviews.slice(0, 3).map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={review.userAvatar} />
                            <AvatarFallback>{review.userName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              {renderStars(review.rating)}
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {review.content}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Trust Indicators</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-sm">Response Rate</span>
                      <span className="font-semibold">{socialProof.responseRate}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-sm">Verified Reviews</span>
                      <span className="font-semibold">{socialProof.verifiedReviews}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-sm">Avg Response Time</span>
                      <span className="font-semibold">{socialProof.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-4">
            {/* Filters and Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="recent">Most Recent</option>
                  <option value="helpful">Most Helpful</option>
                  <option value="rating">Highest Rating</option>
                </select>
                
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as any)}
                  className="px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="all">All Reviews</option>
                  <option value="verified">Verified Only</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="glass-button"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Write Review
              </Button>
            </div>

            {/* Review Form */}
            <AnimatePresence>
              {showReviewForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="glass-card">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Rating
                          </label>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setNewReview({...newReview, rating: star})}
                                className="transition-colors"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    star <= newReview.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300 hover:text-yellow-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Review Title
                          </label>
                          <input
                            type="text"
                            value={newReview.title}
                            onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg bg-background"
                            placeholder="Summarize your experience..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Your Review
                          </label>
                          <Textarea
                            value={newReview.content}
                            onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                            placeholder="Share your detailed experience..."
                            rows={4}
                          />
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowReviewForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSubmitReview}>
                            Submit Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass-card">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <Avatar>
                              <AvatarImage src={review.userAvatar} />
                              <AvatarFallback>{review.userName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold">{review.userName}</span>
                                {review.verified && (
                                  <Badge variant="secondary">Verified</Badge>
                                )}
                                <div className="flex items-center space-x-1">
                                  <Brain className={`w-4 h-4 ${getSentimentColor(review.sentiment)}`} />
                                  <span className="text-xs text-muted-foreground">
                                    {Math.round(review.aiInsights.authenticity * 100)}% authentic
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                {renderStars(review.rating)}
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          {review.title && (
                            <h4 className="font-semibold mb-2">{review.title}</h4>
                          )}
                          <p className="text-muted-foreground">{review.content}</p>
                        </div>

                        {review.aiInsights.keyPoints.length > 0 && (
                          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                            <h5 className="text-sm font-semibold mb-2 flex items-center">
                              <Brain className="w-4 h-4 mr-1" />
                              AI Key Points
                            </h5>
                            <ul className="text-sm space-y-1">
                              {review.aiInsights.keyPoints.map((point, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => onLikeReview?.(review.id)}
                              className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span>{review.helpfulVotes}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span>{review.replies}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                              <Share2 className="w-4 h-4" />
                              <span>Share</span>
                            </button>
                          </div>
                          <button
                            onClick={() => onReportReview?.(review.id, 'inappropriate')}
                            className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>AI-Powered Review Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Sentiment Analysis</h4>
                  <div className="space-y-3">
                    {['positive', 'neutral', 'negative'].map((sentiment) => {
                      const count = reviews.filter(r => r.sentiment === sentiment).length;
                      const percentage = (count / reviews.length) * 100;
                      return (
                        <div key={sentiment} className="flex items-center justify-between">
                          <span className={`capitalize ${getSentimentColor(sentiment)}`}>
                            {sentiment}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  sentiment === 'positive' ? 'bg-green-500' :
                                  sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Top Emotions</h4>
                  <div className="space-y-2">
                    {Array.from(new Set(reviews.map(r => r.aiInsights.emotion)))
                      .slice(0, 5)
                      .map((emotion) => (
                        <div key={emotion} className="flex items-center justify-between">
                          <span className="capitalize">{emotion}</span>
                          <Badge variant="outline">
                            {reviews.filter(r => r.aiInsights.emotion === emotion).length}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Common Themes</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(reviews.flatMap(r => r.categories)))
                    .slice(0, 10)
                    .map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
