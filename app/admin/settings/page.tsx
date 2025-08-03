"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, Shield, Bell, Database, Mail, CreditCard, 
  Save, RefreshCw, AlertTriangle, CheckCircle, Key, Globe
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { EnvironmentCheck } from "@/components/environment-check";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [platformSettings, setPlatformSettings] = useState({
    siteName: "Loconomy",
    siteDescription: "Premier local services marketplace",
    supportEmail: "support@loconomy.com",
    maintenanceMode: false,
    allowNewRegistrations: true,
    requireEmailVerification: true,
    enableNotifications: true,
    maxBookingsPerUser: 10,
    defaultCurrency: "USD",
    timeZone: "America/New_York"
  });

  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    passwordMinLength: 8,
    sessionTimeout: 30,
    enableRateLimiting: true,
    maxLoginAttempts: 5,
    enableCaptcha: false,
    allowedDomains: "loconomy.com, *.loconomy.com"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNewUser: true,
    emailNewBooking: true,
    emailPaymentReceived: true,
    smsBookingReminder: false,
    pushNotifications: true,
    slackWebhook: "",
    discordWebhook: ""
  });

  const handleSaveSettings = async (category: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: `${category} settings have been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Platform Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Configure platform settings, security, and integrations
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Basic platform configuration and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={platformSettings.siteName}
                      onChange={(e) => setPlatformSettings({...platformSettings, siteName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={platformSettings.supportEmail}
                      onChange={(e) => setPlatformSettings({...platformSettings, supportEmail: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={platformSettings.siteDescription}
                    onChange={(e) => setPlatformSettings({...platformSettings, siteDescription: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="defaultCurrency">Default Currency</Label>
                    <Input
                      id="defaultCurrency"
                      value={platformSettings.defaultCurrency}
                      onChange={(e) => setPlatformSettings({...platformSettings, defaultCurrency: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxBookings">Max Bookings Per User</Label>
                    <Input
                      id="maxBookings"
                      type="number"
                      value={platformSettings.maxBookingsPerUser}
                      onChange={(e) => setPlatformSettings({...platformSettings, maxBookingsPerUser: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Platform Controls</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Temporarily disable the platform for maintenance
                      </p>
                    </div>
                    <Switch
                      checked={platformSettings.maintenanceMode}
                      onCheckedChange={(checked) => setPlatformSettings({...platformSettings, maintenanceMode: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow New Registrations</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Allow new users to create accounts
                      </p>
                    </div>
                    <Switch
                      checked={platformSettings.allowNewRegistrations}
                      onCheckedChange={(checked) => setPlatformSettings({...platformSettings, allowNewRegistrations: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Email Verification</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Users must verify email before accessing platform
                      </p>
                    </div>
                    <Switch
                      checked={platformSettings.requireEmailVerification}
                      onCheckedChange={(checked) => setPlatformSettings({...platformSettings, requireEmailVerification: checked})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleSaveSettings("General")} 
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save General Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security policies and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="passwordLength">Minimum Password Length</Label>
                    <Input
                      id="passwordLength"
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Security Features</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Two-Factor Authentication</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Require 2FA for admin accounts
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.enableTwoFactor}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableTwoFactor: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Rate Limiting</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Protect against abuse and DDoS attacks
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.enableRateLimiting}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableRateLimiting: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable CAPTCHA</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Add CAPTCHA verification for forms
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.enableCaptcha}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableCaptcha: checked})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleSaveSettings("Security")} 
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure email, SMS, and push notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Email Notifications</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New User Registration</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Send notification when new users register
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNewUser}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNewUser: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Booking Created</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Send notification for new bookings
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNewBooking}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNewBooking: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Payment Received</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Send notification for successful payments
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailPaymentReceived}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailPaymentReceived: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Webhook Integrations</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
                    <Input
                      id="slackWebhook"
                      placeholder="https://hooks.slack.com/services/..."
                      value={notificationSettings.slackWebhook}
                      onChange={(e) => setNotificationSettings({...notificationSettings, slackWebhook: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="discordWebhook">Discord Webhook URL</Label>
                    <Input
                      id="discordWebhook"
                      placeholder="https://discord.com/api/webhooks/..."
                      value={notificationSettings.discordWebhook}
                      onChange={(e) => setNotificationSettings({...notificationSettings, discordWebhook: e.target.value})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleSaveSettings("Notifications")} 
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="environment">
            <EnvironmentCheck />
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  External Integrations
                </CardTitle>
                <CardDescription>
                  Configure third-party services and API integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Integration status cards */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Database className="w-6 h-6 text-blue-600" />
                          <div>
                            <h4 className="font-semibold">Supabase</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Database & Auth</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-6 h-6 text-purple-600" />
                          <div>
                            <h4 className="font-semibold">Stripe</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Payment Processing</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-6 h-6 text-green-600" />
                          <div>
                            <h4 className="font-semibold">Clerk</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Authentication</p>
                          </div>
                        </div>
                        <Badge className="bg-gray-100 text-gray-800">
                          Optional
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-6 h-6 text-orange-600" />
                          <div>
                            <h4 className="font-semibold">Resend</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Email Service</p>
                          </div>
                        </div>
                        <Badge className="bg-gray-100 text-gray-800">
                          Optional
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Integration Status
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    The platform is designed to work with mock data when integrations are not configured. 
                    Add API keys to enable full functionality for production use.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
