"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Mail, MessageSquare, Phone, Smartphone, Globe,
  Settings, Users, Target, Clock, Calendar, Zap,
  CheckCircle, AlertTriangle, Info, XCircle, Filter,
  Search, Plus, Edit3, Trash2, Copy, Eye, BarChart3,
  Send, Pause, Play, RefreshCw, Download, Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface NotificationChannel {
  id: string;
  type: 'email' | 'sms' | 'push' | 'in_app' | 'webhook' | 'slack';
  name: string;
  description: string;
  isEnabled: boolean;
  config: {
    provider?: string;
    apiKey?: string;
    endpoint?: string;
    template?: string;
  };
  deliveryRate: number;
  openRate?: number;
  clickRate?: number;
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'transactional' | 'marketing' | 'system' | 'alert';
  channels: string[];
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
  usage: number;
}

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    event: string;
    conditions: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };
  audience: {
    segments: string[];
    users?: string[];
    filters: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };
  channels: string[];
  template: string;
  scheduling: {
    immediate: boolean;
    delay?: number;
    timeZone?: string;
    quietHours?: {
      start: string;
      end: string;
    };
    frequency?: {
      type: 'once' | 'daily' | 'weekly' | 'monthly';
      limit?: number;
    };
  };
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  analytics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
  };
}

interface NotificationCampaign {
  id: string;
  name: string;
  description: string;
  type: 'one_time' | 'recurring' | 'triggered';
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'failed';
  template: string;
  audience: {
    total: number;
    segments: string[];
  };
  channels: string[];
  scheduling: {
    startDate: Date;
    endDate?: Date;
    timeZone: string;
  };
  analytics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    revenue?: number;
  };
  createdAt: Date;
}

interface SmartNotificationsProps {
  channels: NotificationChannel[];
  templates: NotificationTemplate[];
  rules: NotificationRule[];
  campaigns: NotificationCampaign[];
  onCreateTemplate?: (template: Partial<NotificationTemplate>) => void;
  onCreateRule?: (rule: Partial<NotificationRule>) => void;
  onCreateCampaign?: (campaign: Partial<NotificationCampaign>) => void;
  onUpdateChannel?: (id: string, updates: Partial<NotificationChannel>) => void;
  className?: string;
}

export function SmartNotifications({
  channels,
  templates,
  rules,
  campaigns,
  onCreateTemplate,
  onCreateRule,
  onCreateCampaign,
  onUpdateChannel,
  className = ""
}: SmartNotificationsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<NotificationChannel | null>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showRuleEditor, setShowRuleEditor] = useState(false);
  const [showCampaignEditor, setShowCampaignEditor] = useState(false);

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'push': return <Smartphone className="w-4 h-4" />;
      case 'in_app': return <Bell className="w-4 h-4" />;
      case 'webhook': return <Globe className="w-4 h-4" />;
      case 'slack': return <MessageSquare className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'scheduled': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const calculateDeliveryRate = (analytics: any) => {
    if (analytics.sent === 0) return 0;
    return (analytics.delivered / analytics.sent) * 100;
  };

  const calculateOpenRate = (analytics: any) => {
    if (analytics.delivered === 0) return 0;
    return (analytics.opened / analytics.delivered) * 100;
  };

  const calculateClickRate = (analytics: any) => {
    if (analytics.opened === 0) return 0;
    return (analytics.clicked / analytics.opened) * 100;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <Bell className="w-8 h-8 text-blue-600" />
            <span>Smart Notifications</span>
          </h2>
          <p className="text-muted-foreground">
            Manage multi-channel notifications and automated messaging
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
                    <div className="text-2xl font-bold">
                      {campaigns.reduce((sum, c) => sum + c.analytics.sent, 0).toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      +12.5% from last month
                    </div>
                  </div>
                  <div className="p-3 bg-blue-500 rounded-full">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Delivery Rate</p>
                    <div className="text-2xl font-bold">
                      {calculateDeliveryRate(campaigns.reduce((acc, c) => ({
                        sent: acc.sent + c.analytics.sent,
                        delivered: acc.delivered + c.analytics.delivered
                      }), { sent: 0, delivered: 0 })).toFixed(1)}%
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      +2.3% from last month
                    </div>
                  </div>
                  <div className="p-3 bg-green-500 rounded-full">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Open Rate</p>
                    <div className="text-2xl font-bold">
                      {calculateOpenRate(campaigns.reduce((acc, c) => ({
                        delivered: acc.delivered + c.analytics.delivered,
                        opened: acc.opened + c.analytics.opened
                      }), { delivered: 0, opened: 0 })).toFixed(1)}%
                    </div>
                    <div className="flex items-center text-sm text-blue-600">
                      <Eye className="w-3 h-3 mr-1" />
                      Industry average: 18.5%
                    </div>
                  </div>
                  <div className="p-3 bg-purple-500 rounded-full">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Rules</p>
                    <div className="text-2xl font-bold">
                      {rules.filter(r => r.isActive).length}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Zap className="w-3 h-3 mr-1" />
                      {rules.length} total rules
                    </div>
                  </div>
                  <div className="p-3 bg-orange-500 rounded-full">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Channel Performance */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channels.map((channel) => (
                  <div key={channel.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getChannelIcon(channel.type)}
                      <div>
                        <div className="font-semibold">{channel.name}</div>
                        <div className="text-sm text-muted-foreground">{channel.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{channel.deliveryRate.toFixed(1)}%</div>
                        <div className="text-muted-foreground">Delivery</div>
                      </div>
                      {channel.openRate && (
                        <div className="text-center">
                          <div className="font-semibold">{channel.openRate.toFixed(1)}%</div>
                          <div className="text-muted-foreground">Open</div>
                        </div>
                      )}
                      {channel.clickRate && (
                        <div className="text-center">
                          <div className="font-semibold">{channel.clickRate.toFixed(1)}%</div>
                          <div className="text-muted-foreground">Click</div>
                        </div>
                      )}
                      <div>
                        <Switch
                          checked={channel.isEnabled}
                          onCheckedChange={(checked) => 
                            onUpdateChannel?.(channel.id, { isEnabled: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Campaigns */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.slice(0, 5).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-semibold">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.description}
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {campaign.audience.total.toLocaleString()} recipients
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {campaign.analytics.sent.toLocaleString()} sent
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {calculateDeliveryRate(campaign.analytics).toFixed(1)}% delivered
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {calculateOpenRate(campaign.analytics).toFixed(1)}% opened
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Notification Channels</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Channel
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel) => (
              <Card key={channel.id} className="glass-card">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getChannelIcon(channel.type)}
                        <span className="font-semibold">{channel.name}</span>
                      </div>
                      <Switch
                        checked={channel.isEnabled}
                        onCheckedChange={(checked) => 
                          onUpdateChannel?.(channel.id, { isEnabled: checked })
                        }
                      />
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {channel.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Delivery Rate</span>
                        <span className="font-semibold">{channel.deliveryRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={channel.deliveryRate} className="h-2" />
                    </div>

                    {channel.openRate && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Open Rate</span>
                          <span className="font-semibold">{channel.openRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={channel.openRate} className="h-2" />
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Notification Templates</h3>
            <Button onClick={() => setShowTemplateEditor(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="transactional">Transactional</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates
              .filter(template => 
                template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.subject.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((template) => (
                <Card key={template.id} className="glass-card">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">{template.subject}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge variant={template.isActive ? 'default' : 'secondary'}>
                            {template.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Badge variant="outline" className="capitalize">
                          {template.type}
                        </Badge>
                      </div>

                      <div>
                        <span className="text-sm font-medium">Channels:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.channels.map((channelId) => {
                            const channel = channels.find(c => c.id === channelId);
                            return channel ? (
                              <Badge key={channelId} variant="outline" className="text-xs">
                                {getChannelIcon(channel.type)}
                                <span className="ml-1">{channel.name}</span>
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Used {template.usage} times</span>
                        <span>
                          {template.lastUsed
                            ? `Last used ${template.lastUsed.toLocaleDateString()}`
                            : 'Never used'
                          }
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Copy className="w-3 h-3 mr-1" />
                          Clone
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Automation Rules</h3>
            <Button onClick={() => setShowRuleEditor(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Rule
            </Button>
          </div>

          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id} className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{rule.name}</h4>
                        <Badge className={getPriorityColor(rule.priority)}>
                          {rule.priority}
                        </Badge>
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={(checked) => {
                            // Handle rule activation toggle
                          }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {rule.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm font-medium">Trigger:</span>
                          <div className="text-sm text-muted-foreground mt-1">
                            {rule.trigger.event}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Audience:</span>
                          <div className="text-sm text-muted-foreground mt-1">
                            {rule.audience.segments.join(', ')}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Channels:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rule.channels.map((channelId) => {
                              const channel = channels.find(c => c.id === channelId);
                              return channel ? (
                                <Badge key={channelId} variant="outline" className="text-xs">
                                  {getChannelIcon(channel.type)}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold">{rule.analytics.sent.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Sent</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{rule.analytics.delivered.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Delivered</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{rule.analytics.opened.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Opened</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{rule.analytics.clicked.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Clicked</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">
                            {calculateDeliveryRate(rule.analytics).toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Success Rate</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Notification Campaigns</h3>
            <Button onClick={() => setShowCampaignEditor(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{campaign.name}</h4>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {campaign.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {campaign.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium">Audience:</span>
                          <div className="text-sm text-muted-foreground">
                            {campaign.audience.total.toLocaleString()} recipients
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Channels:</span>
                          <div className="flex space-x-1 mt-1">
                            {campaign.channels.map((channelId) => {
                              const channel = channels.find(c => c.id === channelId);
                              return channel ? (
                                <Badge key={channelId} variant="outline" className="text-xs">
                                  {getChannelIcon(channel.type)}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Start Date:</span>
                          <div className="text-sm text-muted-foreground">
                            {campaign.scheduling.startDate.toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Created:</span>
                          <div className="text-sm text-muted-foreground">
                            {campaign.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold">{campaign.analytics.sent.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Sent</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{campaign.analytics.delivered.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Delivered</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{campaign.analytics.opened.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Opened</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{campaign.analytics.clicked.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Clicked</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{campaign.analytics.bounced.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Bounced</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">
                            {campaign.analytics.revenue ? `$${campaign.analytics.revenue.toLocaleString()}` : '-'}
                          </div>
                          <div className="text-xs text-muted-foreground">Revenue</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        {campaign.status === 'running' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
