'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Upload, 
  Globe, 
  Shield, 
  Zap,
  Settings,
  Eye,
  Download,
  Building,
  Paintbrush,
  Code,
  Smartphone
} from 'lucide-react';

interface WhiteLabelConfig {
  id: string;
  clientName: string;
  domain: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  customCSS: string;
  features: {
    marketplace: boolean;
    payments: boolean;
    analytics: boolean;
    mobile: boolean;
    ai: boolean;
  };
  status: 'draft' | 'review' | 'approved' | 'deployed';
  createdAt: string;
}

interface WhiteLabelManagerProps {
  className?: string;
}

export function WhiteLabelManager({ className = '' }: WhiteLabelManagerProps) {
  const [configs, setConfigs] = useState<WhiteLabelConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<WhiteLabelConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    // Load existing white-label configurations
    const mockConfigs: WhiteLabelConfig[] = [
      {
        id: 'wl_1',
        clientName: 'TechCorp Solutions',
        domain: 'services.techcorp.com',
        logo: '/logos/techcorp-logo.png',
        favicon: '/favicons/techcorp.ico',
        primaryColor: '#2563eb',
        secondaryColor: '#7c3aed',
        accentColor: '#059669',
        fontFamily: 'Inter',
        customCSS: `
          .hero-section { background: linear-gradient(135deg, #2563eb, #7c3aed); }
          .brand-accent { color: #059669; }
        `,
        features: {
          marketplace: true,
          payments: true,
          analytics: true,
          mobile: true,
          ai: true
        },
        status: 'deployed',
        createdAt: '2024-01-10'
      },
      {
        id: 'wl_2',
        clientName: 'LocalBiz Network',
        domain: 'platform.localbiz.net',
        logo: '/logos/localbiz-logo.png',
        favicon: '/favicons/localbiz.ico',
        primaryColor: '#dc2626',
        secondaryColor: '#ea580c',
        accentColor: '#16a34a',
        fontFamily: 'Roboto',
        customCSS: '',
        features: {
          marketplace: true,
          payments: true,
          analytics: false,
          mobile: true,
          ai: false
        },
        status: 'review',
        createdAt: '2024-01-15'
      }
    ];
    setConfigs(mockConfigs);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-500';
      case 'approved': return 'bg-blue-500';
      case 'review': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const deployConfig = (configId: string) => {
    setConfigs(prev => prev.map(config => 
      config.id === configId 
        ? { ...config, status: 'deployed' as const }
        : config
    ));
  };

  const generateDeploymentCode = (config: WhiteLabelConfig) => {
    return `
// White-label deployment configuration for ${config.clientName}
const whitelabelConfig = {
  domain: "${config.domain}",
  branding: {
    logo: "${config.logo}",
    primaryColor: "${config.primaryColor}",
    secondaryColor: "${config.secondaryColor}",
    accentColor: "${config.accentColor}",
    fontFamily: "${config.fontFamily}"
  },
  features: ${JSON.stringify(config.features, null, 2)},
  customCSS: \`${config.customCSS}\`
};

// Deploy to subdomain
deploy(whitelabelConfig);
    `.trim();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            White-Label Manager
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create branded instances of the platform for enterprise clients
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2"
        >
          <Building className="w-4 h-4" />
          New White-Label
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Clients</p>
                <p className="text-lg font-bold">{configs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Deployed</p>
                <p className="text-lg font-bold">{configs.filter(c => c.status === 'deployed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Eye className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">In Review</p>
                <p className="text-lg font-bold">{configs.filter(c => c.status === 'review').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Revenue/Month</p>
                <p className="text-lg font-bold">$47.2K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* White-Label Configurations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Client Configurations</h3>
        
        {configs.map((config) => (
          <Card key={config.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    {config.clientName.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{config.clientName}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{config.domain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`text-white ${getStatusColor(config.status)}`}
                  >
                    {config.status}
                  </Badge>
                  {config.status === 'approved' && (
                    <Button
                      size="sm"
                      onClick={() => deployConfig(config.id)}
                    >
                      Deploy
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedConfig(config)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="branding" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="branding">Branding</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="domain">Domain</TabsTrigger>
                  <TabsTrigger value="code">Deploy</TabsTrigger>
                </TabsList>
                
                <TabsContent value="branding" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: config.primaryColor }}
                        />
                        <code className="text-sm">{config.primaryColor}</code>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Secondary Color</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: config.secondaryColor }}
                        />
                        <code className="text-sm">{config.secondaryColor}</code>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Font Family</Label>
                      <code className="text-sm">{config.fontFamily}</code>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(config.features).map(([feature, enabled]) => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-sm capitalize">{feature}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="domain" className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium">{config.domain}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        SSL Certificate: Valid • CDN: Enabled
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="code" className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      <code>{generateDeploymentCode(config)}</code>
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Config
                    </Button>
                    <Button size="sm" variant="outline">
                      <Code className="w-4 h-4 mr-2" />
                      Copy Code
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}

        {configs.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No white-label configurations</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create branded platform instances for your enterprise clients
              </p>
              <Button onClick={() => setIsCreating(true)}>
                Create First Configuration
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default WhiteLabelManager;
