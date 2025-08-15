"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Star, Award, Crown, Zap, Target, Gift,
  TrendingUp, Users, Calendar, CheckCircle, Lock,
  Coins, Medal, Gem, Heart, Fire, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'engagement' | 'performance' | 'social' | 'milestone' | 'special';
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  requirements: string[];
}

interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'badge' | 'points' | 'discount' | 'feature' | 'physical';
  value: number;
  cost: number;
  isAvailable: boolean;
  isRedeemed: boolean;
  redeemedAt?: Date;
  expiresAt?: Date;
  category: string;
}

interface UserProgress {
  totalPoints: number;
  level: number;
  pointsToNextLevel: number;
  currentLevelPoints: number;
  nextLevelPoints: number;
  streak: number;
  longestStreak: number;
  totalAchievements: number;
  rareAchievements: number;
  rank: number;
  totalUsers: number;
}

interface GamificationSystemProps {
  userProgress: UserProgress;
  achievements: Achievement[];
  rewards: Reward[];
  className?: string;
}

export function GamificationSystem({
  userProgress,
  achievements,
  rewards,
  className = ""
}: GamificationSystemProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-purple-600 bg-purple-100 dark:bg-purple-900';
      case 'epic': return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
      case 'rare': return 'text-green-600 bg-green-100 dark:bg-green-900';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'engagement': return <Heart className="w-4 h-4" />;
      case 'performance': return <TrendingUp className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      case 'milestone': return <Target className="w-4 h-4" />;
      case 'special': return <Crown className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const availableRewards = rewards.filter(r => r.isAvailable && !r.isRedeemed);
  const progressPercentage = ((userProgress.currentLevelPoints) / (userProgress.nextLevelPoints)) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <span>Gamification & Rewards</span>
          </h2>
          <p className="text-muted-foreground">
            Track your progress, unlock achievements, and redeem rewards
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{userProgress.totalPoints}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">#{userProgress.rank}</div>
            <div className="text-sm text-muted-foreground">Global Rank</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* User Progress */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Your Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Level {userProgress.level}</span>
                    <span className="text-sm text-muted-foreground">
                      {userProgress.pointsToNextLevel} points to next level
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{userProgress.currentLevelPoints} points</span>
                    <span>{userProgress.nextLevelPoints} points</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <Fire className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                    <div className="text-2xl font-bold">{userProgress.streak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <Trophy className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                    <div className="text-2xl font-bold">{userProgress.totalAchievements}</div>
                    <div className="text-sm text-muted-foreground">Achievements</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unlockedAchievements.slice(0, 3).map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
                    >
                      <div className={`p-3 rounded-full ${getRarityColor(achievement.rarity)}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <div className="text-xs text-muted-foreground mt-1">
                          Unlocked {achievement.unlockedAt?.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600">+{achievement.points}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Available Rewards */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Available Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableRewards.slice(0, 3).map((reward) => (
                  <div key={reward.id} className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Gift className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold">{reward.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Coins className="w-4 h-4 text-yellow-600" />
                        <span className="font-semibold">{reward.cost}</span>
                      </div>
                      <Button 
                        size="sm" 
                        disabled={userProgress.totalPoints < reward.cost}
                      >
                        {userProgress.totalPoints >= reward.cost ? 'Redeem' : 'Not Enough Points'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              const isLocked = !achievement.isUnlocked;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: isLocked ? 1 : 1.05 }}
                >
                  <Card className={`glass-card h-full ${isLocked ? 'opacity-60' : ''}`}>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div className="relative">
                          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${getRarityColor(achievement.rarity)}`}>
                            {isLocked ? <Lock className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
                          </div>
                          {achievement.isUnlocked && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {achievement.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-center space-x-2">
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                          {getCategoryIcon(achievement.category)}
                        </div>

                        {!achievement.isUnlocked && achievement.maxProgress > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-center space-x-1">
                          <Coins className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold">{achievement.points} points</span>
                        </div>

                        {achievement.isUnlocked && achievement.unlockedAt && (
                          <div className="text-xs text-muted-foreground">
                            Unlocked {achievement.unlockedAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <Card key={reward.id} className={`glass-card ${reward.isRedeemed ? 'opacity-60' : ''}`}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Gift className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{reward.title}</h3>
                        <Badge variant="outline" className="text-xs capitalize">
                          {reward.type}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {reward.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Coins className="w-4 h-4 text-yellow-600" />
                        <span className="font-semibold">{reward.cost} points</span>
                      </div>
                      {reward.value > 0 && (
                        <div className="text-sm text-green-600">
                          Value: ${reward.value}
                        </div>
                      )}
                    </div>

                    {reward.expiresAt && (
                      <div className="text-xs text-red-600">
                        Expires: {reward.expiresAt.toLocaleDateString()}
                      </div>
                    )}

                    <Button 
                      className="w-full"
                      disabled={
                        reward.isRedeemed || 
                        !reward.isAvailable || 
                        userProgress.totalPoints < reward.cost
                      }
                    >
                      {reward.isRedeemed ? 'Redeemed' :
                       !reward.isAvailable ? 'Unavailable' :
                       userProgress.totalPoints < reward.cost ? 'Not Enough Points' :
                       'Redeem'}
                    </Button>

                    {reward.isRedeemed && reward.redeemedAt && (
                      <div className="text-xs text-muted-foreground text-center">
                        Redeemed {reward.redeemedAt.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Global Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((position) => (
                  <div 
                    key={position}
                    className={`flex items-center space-x-4 p-3 rounded-lg ${
                      position === userProgress.rank ? 'bg-blue-50 dark:bg-blue-950 border border-blue-200' : 'bg-white/5'
                    }`}
                  >
                    <div className="w-8 text-center font-bold">
                      {position === 1 && <Crown className="w-6 h-6 text-yellow-600 mx-auto" />}
                      {position === 2 && <Medal className="w-6 h-6 text-gray-400 mx-auto" />}
                      {position === 3 && <Medal className="w-6 h-6 text-orange-600 mx-auto" />}
                      {position > 3 && <span>#{position}</span>}
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-semibold">
                        {position === userProgress.rank ? 'You' : `User ${position}`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Level {Math.floor(Math.random() * 20) + 1}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {(userProgress.totalPoints - (position - userProgress.rank) * 1000).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
