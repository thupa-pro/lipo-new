"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Filter, MoreHorizontal, Star, MapPin, Phone, Mail, 
  CheckCircle, XCircle, Clock, AlertTriangle, Eye, Edit, Trash2,
  UserCheck, Shield, Award, TrendingUp, DollarSign
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  status: "active" | "pending" | "suspended" | "verified";
  joinDate: string;
  totalEarnings: number;
  completedJobs: number;
  avatar: string;
}

export default function AdminProvidersPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const providers: Provider[] = [
    {
      id: "1",
      name: "Sarah Mitchell",
      email: "sarah@example.com",
      phone: "(555) 123-4567",
      category: "Home Cleaning",
      location: "Downtown District",
      rating: 4.9,
      reviews: 127,
      status: "verified",
      joinDate: "2024-01-15",
      totalEarnings: 12450,
      completedJobs: 89,
      avatar: "/avatar-fallback.svg"
    },
    {
      id: "2",
      name: "Mike Rodriguez",
      email: "mike@techrepair.com",
      phone: "(555) 234-5678",
      category: "Tech Repair",
      location: "Metro Area",
      rating: 4.8,
      reviews: 93,
      status: "active",
      joinDate: "2024-02-01",
      totalEarnings: 8900,
      completedJobs: 67,
      avatar: "/avatar-fallback.svg"
    },
    {
      id: "3",
      name: "Emma Thompson",
      email: "emma@greenthumb.com",
      phone: "(555) 345-6789",
      category: "Gardening",
      location: "Uptown Area",
      rating: 5.0,
      reviews: 54,
      status: "pending",
      joinDate: "2024-03-10",
      totalEarnings: 3200,
      completedJobs: 28,
      avatar: "/avatar-fallback.svg"
    },
    {
      id: "4",
      name: "David Kim",
      email: "david@autocare.com",
      phone: "(555) 456-7890",
      category: "Automotive",
      location: "Industrial Zone",
      rating: 4.7,
      reviews: 76,
      status: "suspended",
      joinDate: "2023-11-20",
      totalEarnings: 15600,
      completedJobs: 112,
      avatar: "/avatar-fallback.svg"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <Shield className="w-4 h-4" />;
      case "active": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "suspended": return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleApprove = (providerId: string) => {
    toast({
      title: "Provider Approved",
      description: "The provider has been approved and can now accept bookings.",
    });
  };

  const handleSuspend = (providerId: string) => {
    toast({
      title: "Provider Suspended",
      description: "The provider has been suspended pending investigation.",
      variant: "destructive",
    });
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || provider.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || provider.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Provider Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage service providers, review applications, and monitor performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Providers</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">1,247</p>
                </div>
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Review</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">23</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Verified Providers</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">987</p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg. Rating</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">4.8</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Provider Directory</CardTitle>
            <CardDescription>
              Manage all service providers on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search providers by name, email, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Home Cleaning">Home Cleaning</SelectItem>
                  <SelectItem value="Tech Repair">Tech Repair</SelectItem>
                  <SelectItem value="Gardening">Gardening</SelectItem>
                  <SelectItem value="Automotive">Automotive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Provider List */}
            <div className="space-y-4">
              {filteredProviders.map((provider) => (
                <div key={provider.id} className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={provider.avatar} alt={provider.name} />
                        <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {provider.name}
                          </h3>
                          <Badge className={getStatusColor(provider.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(provider.status)}
                              <span className="capitalize">{provider.status}</span>
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {provider.email}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {provider.location}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            {provider.rating} ({provider.reviews} reviews)
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                          <span>{provider.category}</span>
                          <span>•</span>
                          <span>{provider.completedJobs} jobs completed</span>
                          <span>•</span>
                          <span>${provider.totalEarnings.toLocaleString()} total earnings</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      
                      {provider.status === "pending" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(provider.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                      )}
                      
                      {provider.status !== "suspended" && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleSuspend(provider.id)}
                        >
                          Suspend
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredProviders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">No providers found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
