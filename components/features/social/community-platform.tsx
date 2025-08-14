"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageCircle, Heart, Share2, Bookmark, Trophy, Star,
  MapPin, Calendar, Camera, Video, Mic, Plus, Filter, Search,
  TrendingUp, Award, Crown, Zap, Brain, Network, Globe, Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  location: string;
  joinDate: Date;
  reputation: number;
  level: number;
  badges: Badge[];
  stats: {
    completedJobs: number;
    totalEarnings: number;
    rating: number;
    reviewCount: number;
    responseRate: number;
    responseTime: string;
  };
  skills: string[];
  certifications: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  bio: string;
  isVerified: boolean;
  isOnline: boolean;
  lastSeen: Date;
  privacySettings: {
    showEarnings: boolean;
    showLocation: boolean;
    allowMessages: boolean;
  };
}

interface CommunityPost {
  id: string;
  authorId: string;
  author: UserProfile;
  content: string;
  type: 'text' | 'image' | 'video' | 'poll' | 'event' | 'tip';
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  tags: string[];
  attachments?: string[];
  location?: string;
  isPromoted: boolean;
  engagement: {
    views: number;
    clickthrough: number;
    saves: number;
  };
}

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  avatar: string;
  memberCount: number;
  category: string;
  isPrivate: boolean;
  tags: string[];
  rules: string[];
  moderators: string[];
  activity: number;
  createdDate: Date;
}

interface CommunityPlatformProps {
  currentUser: UserProfile;
  posts: CommunityPost[];
  groups: CommunityGroup[];
  trendingTopics: string[];
  onCreatePost?: (post: Partial<CommunityPost>) => void;
  onLikePost?: (postId: string) => void;
  onFollowUser?: (userId: string) => void;
  onJoinGroup?: (groupId: string) => void;
  className?: string;
}

export function CommunityPlatform({
  currentUser,
  posts,
  groups,
  trendingTopics,
  onCreatePost,
  onLikePost,
  onFollowUser,
  onJoinGroup,
  className = ""
}: CommunityPlatformProps) {
  const [activeTab, setActiveTab] = useState('feed');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState<'text' | 'image' | 'poll' | 'tip'>('text');
  const [newPost, setNewPost] = useState({
    content: '',
    tags: [] as string[],
    type: 'text' as const
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [feedFilter, setFeedFilter] = useState<'all' | 'following' | 'trending' | 'local'>('all');

  const getUserLevel = (reputation: number) => {
    if (reputation >= 10000) return { level: 'Master', icon: Crown, color: 'text-purple-500' };
    if (reputation >= 5000) return { level: 'Expert', icon: Award, color: 'text-gold-500' };
    if (reputation >= 2000) return { level: 'Professional', icon: Star, color: 'text-blue-500' };
    if (reputation >= 500) return { level: 'Skilled', icon: Trophy, color: 'text-green-500' };
    return { level: 'Starter', icon: Zap, color: 'text-gray-500' };
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleCreatePost = () => {
    if (onCreatePost && newPost.content.trim()) {
      onCreatePost({
        ...newPost,
        authorId: currentUser.id,
        timestamp: new Date()
      });
      setNewPost({ content: '', tags: [], type: 'text' });
      setShowCreatePost(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 ${className}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Community Hub
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Connect, collaborate, and grow with fellow professionals
            </p>
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold">{posts.length.toLocaleString()}</div>
                <div className="text-sm opacity-80">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{groups.length.toLocaleString()}</div>
                <div className="text-sm opacity-80">Groups</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm opacity-80">Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Feed */}
              <div className="lg:col-span-2 space-y-6">
                {/* Create Post */}
                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <button
                          onClick={() => setShowCreatePost(true)}
                          className="w-full text-left px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          What's on your mind, {currentUser.name.split(' ')[0]}?
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex space-x-4">
                        <Button variant="ghost" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          Photo
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="w-4 h-4 mr-2" />
                          Video
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mic className="w-4 h-4 mr-2" />
                          Audio
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Create Post Modal */}
                <AnimatePresence>
                  {showCreatePost && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                      onClick={() => setShowCreatePost(false)}
                    >
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl mx-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Create Post</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowCreatePost(false)}
                          >
                            ×
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={currentUser.avatar} />
                              <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold">{currentUser.name}</div>
                              <div className="text-sm text-muted-foreground">Public</div>
                            </div>
                          </div>

                          <Textarea
                            value={newPost.content}
                            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                            placeholder="What would you like to share?"
                            rows={4}
                            className="resize-none"
                          />

                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              {['text', 'image', 'poll', 'tip'].map((type) => (
                                <Button
                                  key={type}
                                  variant={selectedPostType === type ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setSelectedPostType(type as any)}
                                >
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Button>
                              ))}
                            </div>
                            <Button onClick={handleCreatePost}>
                              Post
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Feed Filters */}
                <div className="flex items-center space-x-2 mb-6">
                  {['all', 'following', 'trending', 'local'].map((filter) => (
                    <Button
                      key={filter}
                      variant={feedFilter === filter ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFeedFilter(filter as any)}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Button>
                  ))}
                </div>

                {/* Posts */}
                <div className="space-y-6">
                  {posts.map((post) => {
                    const levelInfo = getUserLevel(post.author.reputation);
                    const LevelIcon = levelInfo.icon;

                    return (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card className="glass-card">
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              {/* Post Header */}
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                  <div className="relative">
                                    <Avatar>
                                      <AvatarImage src={post.author.avatar} />
                                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                                    </Avatar>
                                    {post.author.isOnline && (
                                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-semibold">{post.author.name}</span>
                                      {post.author.isVerified && (
                                        <Badge variant="secondary" className="text-xs">
                                          Verified
                                        </Badge>
                                      )}
                                      <div className={`flex items-center space-x-1 ${levelInfo.color}`}>
                                        <LevelIcon className="w-4 h-4" />
                                        <span className="text-xs">{levelInfo.level}</span>
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {post.author.title} • {formatTimeAgo(post.timestamp)}
                                    </div>
                                  </div>
                                </div>

                                {post.isPromoted && (
                                  <Badge variant="outline" className="text-xs">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    Promoted
                                  </Badge>
                                )}
                              </div>

                              {/* Post Content */}
                              <div>
                                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                  {post.content}
                                </p>
                                {post.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {post.tags.map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        #{tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Post Actions */}
                              <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex items-center space-x-6">
                                  <button
                                    onClick={() => onLikePost?.(post.id)}
                                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                                  >
                                    <Heart className="w-4 h-4" />
                                    <span>{post.likes}</span>
                                  </button>
                                  <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{post.comments}</span>
                                  </button>
                                  <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-green-500 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                    <span>{post.shares}</span>
                                  </button>
                                  <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-yellow-500 transition-colors">
                                    <Bookmark className="w-4 h-4" />
                                    <span>{post.bookmarks}</span>
                                  </button>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {post.engagement.views} views
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-2 space-y-6">
                {/* User Profile Card */}
                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="relative inline-block mb-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={currentUser.avatar} />
                          <AvatarFallback className="text-2xl">{currentUser.name[0]}</AvatarFallback>
                        </Avatar>
                        {currentUser.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
                        )}
                      </div>
                      <h3 className="font-semibold text-lg">{currentUser.name}</h3>
                      <p className="text-muted-foreground mb-2">{currentUser.title}</p>
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{currentUser.location}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="font-semibold">{currentUser.stats.completedJobs}</div>
                          <div className="text-xs text-muted-foreground">Jobs</div>
                        </div>
                        <div>
                          <div className="font-semibold">{currentUser.stats.rating.toFixed(1)}</div>
                          <div className="text-xs text-muted-foreground">Rating</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trending Topics */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Trending Topics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {trendingTopics.map((topic, index) => (
                        <div key={topic} className="flex items-center justify-between">
                          <span className="text-sm">#{topic}</span>
                          <Badge variant="outline" className="text-xs">
                            {Math.floor(Math.random() * 1000) + 100}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Groups */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Popular Groups</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {groups.slice(0, 5).map((group) => (
                        <div key={group.id} className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={group.avatar} />
                            <AvatarFallback>{group.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{group.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {group.memberCount} members
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Join
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="groups">
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </div>

              {/* Groups Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="glass-card h-full">
                      <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                          <div className="relative">
                            <Avatar className="w-16 h-16 mx-auto">
                              <AvatarImage src={group.avatar} />
                              <AvatarFallback>{group.name[0]}</AvatarFallback>
                            </Avatar>
                            {group.isPrivate && (
                              <div className="absolute -top-1 -right-1">
                                <Lock className="w-4 h-4 text-orange-500" />
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <h3 className="font-semibold">{group.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {group.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{group.memberCount}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{group.activity}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap justify-center gap-1">
                            {group.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <Button 
                            className="w-full"
                            onClick={() => onJoinGroup?.(group.id)}
                          >
                            {group.isPrivate ? 'Request to Join' : 'Join Group'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Community Leaderboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Top 3 */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[2, 1, 3].map((position, index) => {
                      const user = posts[index]?.author;
                      if (!user) return null;
                      
                      return (
                        <div key={position} className={`text-center ${position === 1 ? 'order-1' : position === 2 ? 'order-0' : 'order-2'}`}>
                          <div className="relative">
                            <Avatar className={`mx-auto ${position === 1 ? 'w-20 h-20' : 'w-16 h-16'}`}>
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                              position === 1 ? 'bg-yellow-500' : position === 2 ? 'bg-gray-400' : 'bg-orange-500'
                            }`}>
                              {position}
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.reputation} pts</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Rest of leaderboard */}
                  <div className="space-y-3">
                    {posts.slice(3, 10).map((post, index) => (
                      <div key={post.id} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                        <div className="w-8 text-center font-bold text-muted-foreground">
                          {index + 4}
                        </div>
                        <Avatar>
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold">{post.author.name}</div>
                          <div className="text-sm text-muted-foreground">{post.author.title}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{post.author.reputation}</div>
                          <div className="text-sm text-muted-foreground">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Events Coming Soon</h3>
              <p className="text-muted-foreground">
                Community events and meetups will be available here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="network">
            <div className="text-center py-12">
              <Network className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Professional Network</h3>
              <p className="text-muted-foreground">
                Connect with professionals in your field and expand your network.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
