"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, MapPin, Calendar, Clock, Phone, Mail, Globe, 
  Edit3, Camera, Award, Trophy, Crown, Zap, Heart,
  MessageCircle, Users, Share2, Shield, CheckCircle,
  TrendingUp, DollarSign, BarChart, Target, Brain,
  Briefcase, GraduationCap, Languages, Settings,
  Eye, ThumbsUp, BookOpen, Network, Gift, Badge as BadgeIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'performance' | 'social' | 'milestone' | 'special';
}

interface Skill {
  name: string;
  level: number;
  endorsements: number;
  category: string;
  verified: boolean;
}

interface WorkExperience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  skills: string[];
  achievements: string[];
}

interface Portfolio {
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  rating: number;
  reviews: number;
  completedDate: Date;
  client: string;
  earnings: number;
}

interface EnhancedUserProfileData {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
  title: string;
  bio: string;
  location: string;
  timezone: string;
  joinDate: Date;
  lastActive: Date;
  isOnline: boolean;
  isVerified: boolean;
  
  // Stats
  stats: {
    completedJobs: number;
    totalEarnings: number;
    rating: number;
    reviewCount: number;
    responseRate: number;
    responseTime: string;
    repeatClients: number;
    successRate: number;
  };

  // Social
  social: {
    followers: number;
    following: number;
    connections: number;
    endorsements: number;
    profileViews: number;
    searchAppearances: number;
  };

  // Professional
  skills: Skill[];
  languages: string[];
  certifications: string[];
  workExperience: WorkExperience[];
  portfolio: Portfolio[];
  achievements: Achievement[];
  
  // Preferences
  preferences: {
    showEarnings: boolean;
    showLocation: boolean;
    allowMessages: boolean;
    availableForWork: boolean;
    hourlyRate: number;
    workingHours: string[];
  };

  // Contact
  contact: {
    email?: string;
    phone?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
  };
}

interface EnhancedUserProfileProps {
  profile: EnhancedUserProfileData;
  isOwnProfile?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onEndorse?: (skill: string) => void;
  onEditProfile?: (updates: Partial<EnhancedUserProfileData>) => void;
  className?: string;
}

export function EnhancedUserProfile({
  profile,
  isOwnProfile = false,
  onFollow,
  onMessage,
  onEndorse,
  onEditProfile,
  className = ""
}: EnhancedUserProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);

  const getAchievementColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-purple-500 bg-purple-100 dark:bg-purple-900';
      case 'epic': return 'text-blue-500 bg-blue-100 dark:bg-blue-900';
      case 'rare': return 'text-green-500 bg-green-100 dark:bg-green-900';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getSkillLevelLabel = (level: number) => {
    if (level >= 90) return { label: 'Expert', color: 'text-purple-500' };
    if (level >= 70) return { label: 'Advanced', color: 'text-blue-500' };
    if (level >= 50) return { label: 'Intermediate', color: 'text-green-500' };
    return { label: 'Beginner', color: 'text-gray-500' };
  };

  const formatEarnings = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const handleSaveProfile = () => {
    if (onEditProfile) {
      onEditProfile(editData);
    }
    setIsEditing(false);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 ${className}`}>
      {/* Cover Image and Basic Info */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
          {profile.coverImage && (
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
          
          {isOwnProfile && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 glass-button"
            >
              <Camera className="w-4 h-4 mr-2" />
              Edit Cover
            </Button>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-24 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <Avatar className="w-48 h-48 border-8 border-white shadow-2xl">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-4xl">{profile.name[0]}</AvatarFallback>
              </Avatar>
              {profile.isOnline && (
                <div className="absolute bottom-6 right-6 w-8 h-8 bg-green-500 border-4 border-white rounded-full" />
              )}
              {isOwnProfile && (
                <Button
                  size="sm"
                  className="absolute bottom-2 right-2 rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-white md:mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold">{profile.name}</h1>
                {profile.isVerified && (
                  <CheckCircle className="w-8 h-8 text-blue-400" />
                )}
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= profile.stats.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-semibold">
                    {profile.stats.rating.toFixed(1)} ({profile.stats.reviewCount} reviews)
                  </span>
                </div>
              </div>
              
              <p className="text-2xl opacity-90 mb-3">{profile.title}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm opacity-80">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile.location}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {profile.timezone}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {new Date(profile.joinDate).toLocaleDateString()}
                </div>
                {profile.preferences.availableForWork && (
                  <Badge className="bg-green-500 text-white">
                    Available for Work
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 md:mb-6">
              {!isOwnProfile ? (
                <>
                  <Button onClick={onFollow} className="glass-button">
                    <Users className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                  <Button onClick={onMessage} variant="outline" className="glass-button">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" className="glass-button">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="glass-button"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="glass-card text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">
                {profile.stats.completedJobs}
              </div>
              <div className="text-sm text-muted-foreground">Jobs Done</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">
                {profile.preferences.showEarnings 
                  ? formatEarnings(profile.stats.totalEarnings)
                  : '---'
                }
              </div>
              <div className="text-sm text-muted-foreground">Earned</div>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-600">
                {profile.social.followers}
              </div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-orange-600">
                {profile.stats.responseRate}%
              </div>
              <div className="text-sm text-muted-foreground">Response</div>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600">
                {profile.social.profileViews}
              </div>
              <div className="text-sm text-muted-foreground">Views</div>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-indigo-600">
                {profile.achievements.length}
              </div>
              <div className="text-sm text-muted-foreground">Badges</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* About */}
              <Card className="glass-card lg:col-span-2">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <Textarea
                        value={editData.bio}
                        onChange={(e) => setEditData({...editData, bio: e.target.value})}
                        rows={6}
                        placeholder="Tell us about yourself..."
                      />
                      <Button onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {profile.bio || "No bio available."}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Contact & Social */}
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile.contact.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{profile.contact.email}</span>
                      </div>
                    )}
                    {profile.contact.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{profile.contact.phone}</span>
                      </div>
                    )}
                    {profile.contact.website && (
                      <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <a href={profile.contact.website} className="text-sm text-blue-600 hover:underline">
                          {profile.contact.website}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.map((language) => (
                        <Badge key={language} variant="secondary">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Work Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Hourly Rate</span>
                      <span className="font-semibold">
                        ${profile.preferences.hourlyRate}/hr
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Response Time</span>
                      <span className="font-semibold">{profile.stats.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Success Rate</span>
                      <span className="font-semibold">{profile.stats.successRate}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.portfolio.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass-card h-full">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {item.images[0] && (
                          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= item.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-1">
                              ({item.reviews})
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-green-600">
                            {formatEarnings(item.earnings)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.skills
                      .filter(skill => skill.category === 'technical')
                      .map((skill) => {
                        const levelInfo = getSkillLevelLabel(skill.level);
                        return (
                          <div key={skill.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{skill.name}</span>
                                {skill.verified && (
                                  <CheckCircle className="w-4 h-4 text-blue-500" />
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs ${levelInfo.color}`}>
                                  {levelInfo.label}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onEndorse?.(skill.name)}
                                  className="text-xs"
                                >
                                  <ThumbsUp className="w-3 h-3 mr-1" />
                                  {skill.endorsements}
                                </Button>
                              </div>
                            </div>
                            <Progress value={skill.level} className="h-2" />
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Soft Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.skills
                      .filter(skill => skill.category === 'soft')
                      .map((skill) => {
                        const levelInfo = getSkillLevelLabel(skill.level);
                        return (
                          <div key={skill.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{skill.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs ${levelInfo.color}`}>
                                  {levelInfo.label}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onEndorse?.(skill.name)}
                                  className="text-xs"
                                >
                                  <ThumbsUp className="w-3 h-3 mr-1" />
                                  {skill.endorsements}
                                </Button>
                              </div>
                            </div>
                            <Progress value={skill.level} className="h-2" />
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="experience">
            <div className="space-y-6">
              {profile.workExperience.map((exp) => (
                <Card key={exp.id} className="glass-card">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{exp.title}</h3>
                        <p className="text-muted-foreground">{exp.company} • {exp.duration}</p>
                        <p className="mt-2 text-sm">{exp.description}</p>
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Key Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {exp.achievements.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Achievements</h4>
                            <ul className="text-sm space-y-1">
                              {exp.achievements.map((achievement, index) => (
                                <li key={index} className="flex items-start">
                                  <Award className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className={`glass-card h-full ${getAchievementColor(achievement.rarity)}`}>
                    <CardContent className="pt-6 text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
                          <BadgeIcon className="w-8 h-8" />
                        </div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm opacity-90 mt-1">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="text-xs opacity-75">
                        Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                      </div>
                      <Badge className="mt-2" variant="outline">
                        {achievement.rarity}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Activity Feed Coming Soon</h3>
              <p className="text-muted-foreground">
                View recent activities, project updates, and social interactions.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
