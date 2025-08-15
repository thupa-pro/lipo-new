"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Users, DollarSign, Mail, MessageSquare, Globe,
  Settings, CheckCircle, XCircle, AlertTriangle, Clock,
  Plus, Edit3, Trash2, RefreshCw, Eye, Key, Shield,
  Zap, Database, Smartphone, Video, FileText, Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'calendar' | 'crm' | 'accounting' | 'communication' | 'analytics' | 'storage' | 'productivity';
  logo: string;
  isConnected: boolean;
  isConfigured: boolean;
  status: 'active' | 'error' | 'pending' | 'disabled';
  lastSync?: Date;
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  features: string[];
  requiredCredentials: string[];
  webhookUrl?: string;
  apiKey?: string;
  settings: Record<string, any>;
  stats: {
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    lastError?: string;
  };
}

interface IntegrationHubProps {
  integrations: Integration[];
  onConnectIntegration?: (id: string, credentials: Record<string, string>) => void;
  onDisconnectIntegration?: (id: string) => void;
  onConfigureIntegration?: (id: string, settings: Record<string, any>) => void;
  onSyncIntegration?: (id: string) => void;
  className?: string;
}

export function IntegrationHub({
  integrations,
  onConnectIntegration,
  onDisconnectIntegration,
  onConfigureIntegration,
  onSyncIntegration,
  className = ""
}: IntegrationHubProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showConnectionForm, setShowConnectionForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'calendar': return <Calendar className="w-5 h-5" />;
      case 'crm': return <Users className="w-5 h-5" />;
      case 'accounting': return <DollarSign className="w-5 h-5" />;
      case 'communication': return <MessageSquare className="w-5 h-5" />;
      case 'analytics': return <Database className="w-5 h-5" />;
      case 'storage': return <FileText className="w-5 h-5" />;
      case 'productivity': return <Zap className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  const connectedIntegrations = integrations.filter(i => i.isConnected);
  const activeIntegrations = integrations.filter(i => i.status === 'active');
  const errorIntegrations = integrations.filter(i => i.status === 'error');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <Globe className="w-8 h-8 text-blue-600" />
            <span>Integration Hub</span>
          </h2>
          <p className="text-muted-foreground">
            Connect and manage third-party services and APIs
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Integration Store
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{integrations.length}</div>
                <div className="text-sm text-muted-foreground">Total Integrations</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">{connectedIntegrations.length}</div>
                <div className="text-sm text-muted-foreground">Connected</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-purple-600">{activeIntegrations.length}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-red-600">{errorIntegrations.length}</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </CardContent>
            </Card>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            {Object.entries(groupedIntegrations).map(([category, categoryIntegrations]) => (
              <Card key={category} className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 capitalize">
                    {getCategoryIcon(category)}
                    <span>{category} ({categoryIntegrations.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryIntegrations.slice(0, 6).map((integration) => (
                      <div key={integration.id} className="p-4 border rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                              {getCategoryIcon(integration.category)}
                            </div>
                            <div>
                              <div className="font-semibold">{integration.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {integration.features.length} features
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(integration.status)}
                            <Switch checked={integration.isConnected} />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {integration.description}
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setSelectedIntegration(integration)}
                        >
                          {integration.isConnected ? 'Configure' : 'Connect'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="connected" className="space-y-6">
          <div className="space-y-4">
            {connectedIntegrations.map((integration) => (
              <Card key={integration.id} className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(integration.category)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{integration.name}</h3>
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {integration.category}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {integration.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <Label className="text-xs text-muted-foreground">Last Sync</Label>
                            <div>{integration.lastSync?.toLocaleDateString() || 'Never'}</div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Frequency</Label>
                            <div className="capitalize">{integration.syncFrequency}</div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Success Rate</Label>
                            <div>
                              {integration.stats.totalSyncs > 0 
                                ? `${((integration.stats.successfulSyncs / integration.stats.totalSyncs) * 100).toFixed(1)}%`
                                : 'N/A'
                              }
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Total Syncs</Label>
                            <div>{integration.stats.totalSyncs.toLocaleString()}</div>
                          </div>
                        </div>

                        {integration.stats.lastError && (
                          <div className="mt-3 p-2 bg-red-50 dark:bg-red-950 rounded text-sm text-red-600">
                            Last Error: {integration.stats.lastError}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onSyncIntegration?.(integration.id)}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Sync Now
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onDisconnectIntegration?.(integration.id)}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.filter(i => !i.isConnected).map((integration) => (
              <Card key={integration.id} className="glass-card h-full">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(integration.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <Badge variant="outline" className="capitalize text-xs">
                          {integration.category}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>

                    <div>
                      <Label className="text-xs text-muted-foreground">Features</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {integration.features.slice(0, 3).map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {integration.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{integration.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Required</Label>
                      <div className="text-sm">
                        {integration.requiredCredentials.join(', ')}
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => {
                        setSelectedIntegration(integration);
                        setShowConnectionForm(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Global Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Default Sync Frequency</Label>
                  <select className="w-full mt-1 p-2 border rounded-lg">
                    <option value="realtime">Real-time</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <Label>Webhook Timeout</Label>
                  <Input type="number" placeholder="30" className="mt-1" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Integration Analytics</Label>
                    <div className="text-sm text-muted-foreground">
                      Track integration performance and usage
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-retry Failed Syncs</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically retry failed synchronizations
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Send Error Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Get notified when integrations fail
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
