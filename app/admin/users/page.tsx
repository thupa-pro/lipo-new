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
  Search, Filter, MoreHorizontal, Mail, Phone, MapPin, Calendar,
  UserPlus, Users, Shield, Ban, Edit, Trash2, Eye, Star,
  TrendingUp, Activity, Clock, CheckCircle, AlertTriangle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  lastActive: string;
  status: "active" | "inactive" | "suspended" | "verified";
  role: "customer" | "provider" | "admin";
  totalBookings: number;
  totalSpent: number;
  rating: number;
  avatar: string;
}

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("customers");

  const users: User[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      location: "Downtown District",
      joinDate: "2024-01-15",
      lastActive: "2 hours ago",
      status: "active",
      role: "customer",
      totalBookings: 23,
      totalSpent: 2850,
      rating: 4.8,
      avatar: "/avatar-fallback.svg"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "(555) 234-5678",
      location: "Metro Area",
      joinDate: "2024-02-01",
      lastActive: "15 minutes ago",
      status: "verified",
      role: "customer",
      totalBookings: 45,
      totalSpent: 5200,
      rating: 4.9,
      avatar: "/avatar-fallback.svg"
    },
    {
      id: "3",
      name: "Mike Rodriguez",
      email: "mike@techrepair.com",
      phone: "(555) 345-6789",
      location: "Tech District",
      joinDate: "2023-12-10",
      lastActive: "3 days ago",
      status: "active",
      role: "provider",
      totalBookings: 67,
      totalSpent: 0,
      rating: 4.8,
      avatar: "/avatar-fallback.svg"
    },
    {
      id: "4",
      name: "Emily Chen",
      email: "emily.chen@example.com",
      phone: "(555) 456-7890",
      location: "Uptown Area",
      joinDate: "2024-03-05",
      lastActive: "5 days ago",
      status: "suspended",
      role: "customer",
      totalBookings: 8,
      totalSpent: 450,
      rating: 3.2,
      avatar: "/avatar-fallback.svg"
    },
    {
      id: "5",
      name: "David Kim",
      email: "david@admin.loconomy.com",
      phone: "(555) 567-8901",
      location: "Corporate Office",
      joinDate: "2023-01-01",
      lastActive: "Just now",
      status: "active",
      role: "admin",
      totalBookings: 0,
      totalSpent: 0,
      rating: 5.0,
      avatar: "/avatar-fallback.svg"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-800";
      case "provider": return "bg-orange-100 text-orange-800";
      case "customer": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleSuspendUser = (userId: string) => {
    toast({
      title: "User Suspended",
      description: "The user has been suspended pending investigation.",
      variant: "destructive",
    });
  };

  const handleActivateUser = (userId: string) => {
    toast({
      title: "User Activated",
      description: "The user account has been reactivated.",
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesTab = activeTab === "all" || 
                      (activeTab === "customers" && user.role === "customer") ||
                      (activeTab === "providers" && user.role === "provider") ||
                      (activeTab === "admins" && user.role === "admin");
    
    return matchesSearch && matchesStatus && matchesRole && matchesTab;
  });

  const userStats = {
    total: users.length,
    customers: users.filter(u => u.role === "customer").length,
    providers: users.filter(u => u.role === "provider").length,
    admins: users.filter(u => u.role === "admin").length,
    active: users.filter(u => u.status === "active" || u.status === "verified").length,
    suspended: users.filter(u => u.status === "suspended").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              User Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage users, track activity, and maintain platform security
            </p>
          </div>
          
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{userStats.total}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{userStats.customers}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Customers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{userStats.providers}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Providers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{userStats.admins}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Admins</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{userStats.active}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Ban className="w-6 h-6 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{userStats.suspended}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Suspended</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
            <TabsTrigger value="all">All Users</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>
                  Manage all platform users and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Search users by name or email..."
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
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="provider">Provider</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* User List */}
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {user.name}
                              </h3>
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                              <Badge className={getRoleColor(user.role)}>
                                {user.role}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                              <span className="flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {user.email}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {user.location}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Last active: {user.lastActive}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                              <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                              {user.role === "customer" && (
                                <>
                                  <span>•</span>
                                  <span>{user.totalBookings} bookings</span>
                                  <span>•</span>
                                  <span>${user.totalSpent.toLocaleString()} spent</span>
                                </>
                              )}
                              {user.rating > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center">
                                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                    {user.rating}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          
                          {user.status === "suspended" ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleActivateUser(user.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Activate
                            </Button>
                          ) : (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleSuspendUser(user.id)}
                            >
                              Suspend
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400">No users found matching your criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
