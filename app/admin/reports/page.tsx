"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, TrendingDown, Users, DollarSign, Star, Calendar,
  Download, Filter, BarChart3, PieChart, LineChart, Activity,
  Clock, CheckCircle, AlertTriangle, RefreshCw
} from "lucide-react";
import {
  ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart as RechartsBarChart, Bar,
  PieChart as RechartsPieChart, Cell, Pie, AreaChart, Area
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
  bookings: { label: "Bookings", color: "hsl(var(--chart-2))" },
  users: { label: "Users", color: "hsl(var(--chart-3))" },
  providers: { label: "Providers", color: "hsl(var(--chart-4))" },
};

export default function AdminReportsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [reportType, setReportType] = useState("overview");

  // Sample data for charts
  const revenueData = [
    { month: "Jan", revenue: 45000, bookings: 320, users: 1200 },
    { month: "Feb", revenue: 52000, bookings: 385, users: 1450 },
    { month: "Mar", revenue: 48000, bookings: 355, users: 1380 },
    { month: "Apr", revenue: 61000, bookings: 420, users: 1650 },
    { month: "May", revenue: 58000, bookings: 395, users: 1580 },
    { month: "Jun", revenue: 67000, bookings: 465, users: 1820 },
  ];

  const categoryData = [
    { name: "Home Cleaning", value: 35, color: "#8884d8" },
    { name: "Tech Repair", value: 25, color: "#82ca9d" },
    { name: "Automotive", value: 20, color: "#ffc658" },
    { name: "Gardening", value: 12, color: "#ff7300" },
    { name: "Tutoring", value: 8, color: "#00ff88" },
  ];

  const performanceData = [
    { day: "Mon", bookings: 45, cancellations: 3, completions: 42 },
    { day: "Tue", bookings: 52, cancellations: 2, completions: 48 },
    { day: "Wed", bookings: 38, cancellations: 4, completions: 35 },
    { day: "Thu", bookings: 61, cancellations: 1, completions: 58 },
    { day: "Fri", bookings: 70, cancellations: 5, completions: 63 },
    { day: "Sat", bookings: 85, cancellations: 3, completions: 80 },
    { day: "Sun", bookings: 43, cancellations: 2, completions: 41 },
  ];

  const kpiData = [
    { 
      title: "Total Revenue", 
      value: "$127,450", 
      change: "+12.5%", 
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    { 
      title: "Total Bookings", 
      value: "2,847", 
      change: "+8.2%", 
      trend: "up",
      icon: Calendar,
      color: "text-blue-600"
    },
    { 
      title: "Active Users", 
      value: "12,943", 
      change: "+15.3%", 
      trend: "up",
      icon: Users,
      color: "text-purple-600"
    },
    { 
      title: "Avg Rating", 
      value: "4.8/5", 
      change: "+0.2", 
      trend: "up",
      icon: Star,
      color: "text-yellow-600"
    },
  ];

  const topProviders = [
    { name: "Sarah Mitchell", category: "Home Cleaning", bookings: 89, revenue: 12450, rating: 4.9 },
    { name: "Mike Rodriguez", category: "Tech Repair", bookings: 67, revenue: 8900, rating: 4.8 },
    { name: "Emma Thompson", category: "Gardening", bookings: 54, revenue: 7200, rating: 5.0 },
    { name: "David Kim", category: "Automotive", bookings: 45, revenue: 6750, rating: 4.7 },
    { name: "Lisa Wang", category: "Tutoring", bookings: 78, revenue: 5850, rating: 4.9 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Analytics & Reports
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Comprehensive platform analytics and performance insights
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {kpi.value}
                    </p>
                    <div className="flex items-center mt-1">
                      {kpi.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        kpi.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                  <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={reportType} onValueChange={setReportType} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="var(--color-revenue)" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Service Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Categories</CardTitle>
                  <CardDescription>Distribution of bookings by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Providers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Providers</CardTitle>
                <CardDescription>Highest earning providers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProviders.map((provider, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {provider.name}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {provider.category}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {provider.bookings}
                          </p>
                          <p className="text-slate-600 dark:text-slate-400">Bookings</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            ${provider.revenue.toLocaleString()}
                          </p>
                          <p className="text-slate-600 dark:text-slate-400">Revenue</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {provider.rating}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400">Rating</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
                <CardDescription>Bookings, completions, and cancellations</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
                  <ResponsiveContainer width="100%" height={350}>
                    <RechartsBarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
                      <Bar dataKey="completions" fill="#82ca9d" name="Completions" />
                      <Bar dataKey="cancellations" fill="#ff7300" name="Cancellations" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
