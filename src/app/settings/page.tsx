"use client";

import { useState } from "react";
import { ModernNavigation } from "@/components/modern-navigation";
import { ModernFooter } from "@/components/modern-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, Bell, Shield, CreditCard, Settings as SettingsIcon,
  Mail, Phone, MapPin, Camera, Save, Trash2, Lock
} from "lucide-react";

export default function SettingsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Experienced service provider with 10+ years in home maintenance."
  });

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailMessages: true,
    emailPromotions: false,
    pushBookings: true,
    pushMessages: true,
    pushPromotions: false,
    smsBookings: false,
    smsMessages: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    dataProcessing: true,
    analytics: true
  });

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  const user = {
    name: "John Doe",
    email: "john@example.com"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stratosphere via-cirrus to-white dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
      {/* Neural Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, hsl(var(--neural-500)) 2px, transparent 0),
                           radial-gradient(circle at 75px 75px, hsl(var(--quantum-500)) 1px, transparent 0)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <ModernNavigation currentPath="/settings" user={user} />

      <div className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className={`mb-12 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <h1 className="text-4xl font-bold text-gradient-neural mb-4">Account Settings</h1>
            <p className="text-lg text-muted-foreground">
              Manage your account preferences and personal information
            </p>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="general" variant="glass" className={`transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <TabsList variant="glass" className="w-full max-w-2xl mb-8">
              <TabsTrigger value="general" variant="glass" className="flex-1">
                <User className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications" variant="glass" className="flex-1">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" variant="glass" className="flex-1">
                <Shield className="w-4 h-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="billing" variant="glass" className="flex-1">
                <CreditCard className="w-4 h-4 mr-2" />
                Billing
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card variant="glass" className="mb-8">
                    <CardHeader>
                      <CardTitle variant="gradient-neural">Profile Information</CardTitle>
                      <CardDescription>
                        Update your personal details and profile information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            variant="glass"
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            variant="glass"
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            variant="glass"
                            value={profile.phone}
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            variant="glass"
                            value={profile.location}
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          className="w-full h-24 px-4 py-3 glass border-white/30 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-neural-500/50 focus:border-neural-500/50 transition-all duration-300"
                          placeholder="Tell us about yourself..."
                          value={profile.bio}
                          onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        />
                      </div>

                      <Button className="bg-gradient-neural text-white hover:shadow-glow-neural">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </CardContent>
                  </Card>

                  <Card variant="glass">
                    <CardHeader>
                      <CardTitle variant="gradient-trust">Security</CardTitle>
                      <CardDescription>
                        Manage your password and security preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" variant="glass" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" variant="glass" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" variant="glass" />
                      </div>
                      
                      <Button className="bg-gradient-trust text-white hover:shadow-glow-trust">
                        <Lock className="w-4 h-4 mr-2" />
                        Update Password
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card variant="neural" className="mb-8">
                    <CardHeader>
                      <CardTitle variant="gradient-neural">Profile Photo</CardTitle>
                      <CardDescription>
                        Upload a professional profile photo
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="w-32 h-32 bg-gradient-neural rounded-full flex items-center justify-center mx-auto">
                        <span className="text-4xl font-bold text-white">JD</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                    </CardContent>
                  </Card>

                  <Card variant="quantum">
                    <CardHeader>
                      <CardTitle variant="gradient-quantum">Account Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Member since</span>
                        <span className="font-semibold">Jan 2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total bookings</span>
                        <span className="font-semibold text-gradient-quantum">127</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rating</span>
                        <span className="font-semibold text-gradient-quantum">4.9/5</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle variant="gradient-neural">Email Notifications</CardTitle>
                    <CardDescription>
                      Choose what emails you want to receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Booking confirmations</Label>
                        <p className="text-sm text-muted-foreground">Get notified when bookings are confirmed</p>
                      </div>
                      <Switch
                        checked={notifications.emailBookings}
                        onCheckedChange={(checked) => setNotifications({...notifications, emailBookings: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Messages</Label>
                        <p className="text-sm text-muted-foreground">New message notifications</p>
                      </div>
                      <Switch
                        checked={notifications.emailMessages}
                        onCheckedChange={(checked) => setNotifications({...notifications, emailMessages: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Promotions</Label>
                        <p className="text-sm text-muted-foreground">Special offers and updates</p>
                      </div>
                      <Switch
                        checked={notifications.emailPromotions}
                        onCheckedChange={(checked) => setNotifications({...notifications, emailPromotions: checked})}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader>
                    <CardTitle variant="gradient-quantum">Push Notifications</CardTitle>
                    <CardDescription>
                      Manage mobile and browser notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Booking updates</Label>
                        <p className="text-sm text-muted-foreground">Real-time booking notifications</p>
                      </div>
                      <Switch
                        checked={notifications.pushBookings}
                        onCheckedChange={(checked) => setNotifications({...notifications, pushBookings: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Messages</Label>
                        <p className="text-sm text-muted-foreground">Instant message alerts</p>
                      </div>
                      <Switch
                        checked={notifications.pushMessages}
                        onCheckedChange={(checked) => setNotifications({...notifications, pushMessages: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Promotions</Label>
                        <p className="text-sm text-muted-foreground">Marketing notifications</p>
                      </div>
                      <Switch
                        checked={notifications.pushPromotions}
                        onCheckedChange={(checked) => setNotifications({...notifications, pushPromotions: checked})}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle variant="gradient-trust">Privacy & Data</CardTitle>
                  <CardDescription>
                    Control how your data is used and what others can see
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Profile Visibility</Label>
                    <Select value={privacy.profileVisibility} onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value})}>
                      <SelectTrigger className="glass rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="contacts">Contacts Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show email on profile</Label>
                      <p className="text-sm text-muted-foreground">Let others see your email address</p>
                    </div>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) => setPrivacy({...privacy, showEmail: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show phone on profile</Label>
                      <p className="text-sm text-muted-foreground">Display phone number publicly</p>
                    </div>
                    <Switch
                      checked={privacy.showPhone}
                      onCheckedChange={(checked) => setPrivacy({...privacy, showPhone: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data processing</Label>
                      <p className="text-sm text-muted-foreground">Allow data processing for better experience</p>
                    </div>
                    <Switch
                      checked={privacy.dataProcessing}
                      onCheckedChange={(checked) => setPrivacy({...privacy, dataProcessing: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Analytics</Label>
                      <p className="text-sm text-muted-foreground">Help improve our services with usage data</p>
                    </div>
                    <Switch
                      checked={privacy.analytics}
                      onCheckedChange={(checked) => setPrivacy({...privacy, analytics: checked})}
                    />
                  </div>

                  <Button className="bg-gradient-trust text-white hover:shadow-glow-trust">
                    Save Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Settings */}
            <TabsContent value="billing">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle variant="gradient-plasma">Payment Methods</CardTitle>
                    <CardDescription>
                      Manage your payment information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="glass rounded-2xl p-4 border border-plasma-200/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-plasma rounded-lg"></div>
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/25</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader>
                    <CardTitle variant="gradient-plasma">Billing History</CardTitle>
                    <CardDescription>
                      View your recent transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Premium Subscription</p>
                          <p className="text-sm text-muted-foreground">Dec 1, 2024</p>
                        </div>
                        <span className="font-bold text-gradient-plasma">$29.99</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Service Fee</p>
                          <p className="text-sm text-muted-foreground">Nov 15, 2024</p>
                        </div>
                        <span className="font-bold text-gradient-plasma">$4.99</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View All Transactions
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ModernFooter />
    </div>
  );
}
