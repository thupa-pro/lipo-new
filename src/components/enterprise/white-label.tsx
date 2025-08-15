"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, Upload, Eye, Download, Copy, Settings,
  Smartphone, Monitor, Tablet, Globe, Code, Paintbrush
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

interface WhiteLabelConfig {
  branding: {
    logo: string;
    favicon: string;
    companyName: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
  customization: {
    hideFooter: boolean;
    customDomain: string;
    customCSS: string;
    customJS: string;
    analytics: {
      googleAnalytics?: string;
      facebookPixel?: string;
      customTracking?: string;
    };
  };
  features: {
    enabledModules: string[];
    customPages: Array<{
      id: string;
      title: string;
      slug: string;
      content: string;
      isPublic: boolean;
    }>;
  };
}

interface WhiteLabelProps {
  config: WhiteLabelConfig;
  onUpdateConfig?: (config: Partial<WhiteLabelConfig>) => void;
  className?: string;
}

export function WhiteLabel({
  config,
  onUpdateConfig,
  className = ""
}: WhiteLabelProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState('branding');

  const updateBranding = (updates: Partial<WhiteLabelConfig['branding']>) => {
    onUpdateConfig?.({
      branding: { ...config.branding, ...updates }
    });
  };

  const updateColors = (colorKey: string, value: string) => {
    updateBranding({
      colors: { ...config.branding.colors, [colorKey]: value }
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <Palette className="w-8 h-8 text-purple-600" />
            <span>White Label Configuration</span>
          </h2>
          <p className="text-muted-foreground">
            Customize branding, styling, and features for your white-label solution
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="styling">Styling</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="branding" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Brand Identity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Company Name</Label>
                    <Input
                      value={config.branding.companyName}
                      onChange={(e) => updateBranding({ companyName: e.target.value })}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <Label>Logo</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        {config.branding.logo ? (
                          <img 
                            src={config.branding.logo} 
                            alt="Logo" 
                            className="w-full h-full object-contain rounded-lg"
                          />
                        ) : (
                          <Paintbrush className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Favicon</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                        {config.branding.favicon ? (
                          <img 
                            src={config.branding.favicon} 
                            alt="Favicon" 
                            className="w-full h-full object-contain rounded"
                          />
                        ) : (
                          <Globe className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="w-3 h-3 mr-2" />
                        Upload Favicon
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="styling" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Color Scheme</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(config.branding.colors).map(([key, value]) => (
                    <div key={key}>
                      <Label className="capitalize">{key} Color</Label>
                      <div className="flex items-center space-x-4 mt-2">
                        <div 
                          className="w-12 h-12 rounded-lg border-2 border-gray-200"
                          style={{ backgroundColor: value }}
                        />
                        <Input
                          type="color"
                          value={value}
                          onChange={(e) => updateColors(key, e.target.value)}
                          className="w-20 h-12 p-1 border rounded-lg"
                        />
                        <Input
                          value={value}
                          onChange={(e) => updateColors(key, e.target.value)}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Typography</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Heading Font</Label>
                    <Input
                      value={config.branding.fonts.heading}
                      onChange={(e) => updateBranding({ 
                        fonts: { ...config.branding.fonts, heading: e.target.value }
                      })}
                      placeholder="Inter, sans-serif"
                    />
                  </div>
                  <div>
                    <Label>Body Font</Label>
                    <Input
                      value={config.branding.fonts.body}
                      onChange={(e) => updateBranding({ 
                        fonts: { ...config.branding.fonts, body: e.target.value }
                      })}
                      placeholder="Inter, sans-serif"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Feature Modules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    'Dashboard', 'Analytics', 'User Management', 'Payments', 
                    'Notifications', 'Integrations', 'API Access', 'Support'
                  ].map((module) => (
                    <div key={module} className="flex items-center justify-between">
                      <Label>{module}</Label>
                      <Switch 
                        checked={config.features.enabledModules.includes(module.toLowerCase())}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Custom Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {config.features.customPages.map((page) => (
                      <div key={page.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{page.title}</div>
                            <div className="text-sm text-muted-foreground">/{page.slug}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch checked={page.isPublic} />
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      Add Custom Page
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Domain & Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Custom Domain</Label>
                    <Input
                      value={config.customization.customDomain}
                      placeholder="app.yourcompany.com"
                    />
                  </div>
                  <div>
                    <Label>Google Analytics ID</Label>
                    <Input
                      value={config.customization.analytics.googleAnalytics || ''}
                      placeholder="GA-XXXXXXXXX-X"
                    />
                  </div>
                  <div>
                    <Label>Facebook Pixel ID</Label>
                    <Input
                      value={config.customization.analytics.facebookPixel || ''}
                      placeholder="123456789012345"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Custom Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Custom CSS</Label>
                    <textarea
                      value={config.customization.customCSS}
                      placeholder="/* Your custom CSS here */"
                      className="w-full h-32 p-3 border rounded-lg font-mono text-sm"
                    />
                  </div>
                  <div>
                    <Label>Custom JavaScript</Label>
                    <textarea
                      value={config.customization.customJS}
                      placeholder="// Your custom JavaScript here"
                      className="w-full h-32 p-3 border rounded-lg font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live Preview</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'tablet' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('tablet')}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className={`border rounded-lg overflow-hidden ${
                  previewMode === 'desktop' ? 'w-full h-96' :
                  previewMode === 'tablet' ? 'w-80 h-96 mx-auto' :
                  'w-64 h-96 mx-auto'
                }`}
                style={{
                  backgroundColor: config.branding.colors.background,
                  fontFamily: config.branding.fonts.body
                }}
              >
                {/* Mock Header */}
                <div 
                  className="p-4 flex items-center justify-between"
                  style={{ backgroundColor: config.branding.colors.primary }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                      {config.branding.logo ? (
                        <img 
                          src={config.branding.logo} 
                          alt="Logo" 
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <Paintbrush className="w-4 h-4" />
                      )}
                    </div>
                    <span 
                      className="font-bold text-white"
                      style={{ fontFamily: config.branding.fonts.heading }}
                    >
                      {config.branding.companyName || 'Your Company'}
                    </span>
                  </div>
                </div>

                {/* Mock Content */}
                <div className="p-4 space-y-4">
                  <div>
                    <h2 
                      className="text-xl font-bold mb-2"
                      style={{ 
                        color: config.branding.colors.text,
                        fontFamily: config.branding.fonts.heading 
                      }}
                    >
                      Welcome Dashboard
                    </h2>
                    <p style={{ color: config.branding.colors.text }}>
                      This is how your white-label application will look with your custom branding.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: config.branding.colors.secondary }}
                    >
                      <div className="text-lg font-bold text-white">142</div>
                      <div className="text-sm text-white/80">Total Users</div>
                    </div>
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: config.branding.colors.accent }}
                    >
                      <div className="text-lg font-bold text-white">$12.5K</div>
                      <div className="text-sm text-white/80">Revenue</div>
                    </div>
                  </div>

                  <button 
                    className="w-full py-2 px-4 rounded-lg text-white font-medium"
                    style={{ backgroundColor: config.branding.colors.primary }}
                  >
                    Primary Button
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Company Name</span>
                  <span className="font-medium">{config.branding.companyName || 'Not set'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Custom Domain</span>
                  <span className="font-medium">{config.customization.customDomain || 'Not set'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Enabled Modules</span>
                  <span className="font-medium">{config.features.enabledModules.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Custom Pages</span>
                  <span className="font-medium">{config.features.customPages.length}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  <Copy className="w-3 h-3 mr-2" />
                  Copy Config
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Download className="w-3 h-3 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
