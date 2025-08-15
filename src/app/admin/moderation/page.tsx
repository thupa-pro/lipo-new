"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  Shield,
  Eye,
  Ban,
  CheckCircle,
  X,
  MessageSquare,
  Star,
  User,
  Calendar,
  Filter,
  Search,
  ExternalLink,
  Flag,
  Clock,
  TrendingUp,
  BarChart3,
  Users,
  AlertCircle,
  Download,
  RefreshCw,
  Mail,
  Phone
} from "lucide-react";

interface ModerationReport {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reported_content_type: string;
  reported_content_id: string;
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  admin_notes: string;
  created_at: string;
  reporter?: {
    display_name: string;
    email: string;
    avatar_url?: string;
  };
  reported_user?: {
    display_name: string;
    email: string;
    avatar_url?: string;
    role: string;
  };
  content?: any;
}

interface ModerationAction {
  type: 'approve' | 'reject' | 'suspend' | 'ban' | 'warn' | 'delete_content';
  reason: string;
  duration?: number; // for suspensions
  notifyUser: boolean;
}

interface ModerationStats {
  totalReports: number;
  pendingReports: number;
  resolvedToday: number;
  averageResolutionTime: number;
  topReasons: Array<{ reason: string; count: number }>;
  flaggedUsers: number;
  contentRemoved: number;
}

export default function ModerationPanel() {
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [stats, setStats] = useState<ModerationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all',
    search: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    loadModerationData();
  }, [filters]);

  const loadModerationData = async () => {
    setLoading(true);
    try {
      // Mock data - in production, this would fetch from the API
      const mockReports: ModerationReport[] = [
        {
          id: "1",
          reporter_id: "user1",
          reported_user_id: "user2",
          reported_content_type: "review",
          reported_content_id: "review1",
          reason: "Inappropriate content",
          description: "This review contains profanity and personal attacks against the service provider.",
          status: "pending",
          admin_notes: "",
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          reporter: {
            display_name: "John Smith",
            email: "john@example.com"
          },
          reported_user: {
            display_name: "Jane Doe",
            email: "jane@example.com",
            role: "customer"
          },
          content: {
            rating: 1,
            title: "Terrible service",
            content: "This provider was unprofessional and did a poor job. Would not recommend."
          }
        },
        {
          id: "2",
          reporter_id: "user3",
          reported_user_id: "user4",
          reported_content_type: "profile",
          reported_content_id: "profile1",
          reason: "Fake credentials",
          description: "This provider is claiming to have certifications they don't possess.",
          status: "investigating",
          admin_notes: "Contacted certification body for verification",
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          reporter: {
            display_name: "Mike Wilson",
            email: "mike@example.com"
          },
          reported_user: {
            display_name: "Sarah Johnson",
            email: "sarah@example.com",
            role: "provider"
          },
          content: {
            business_name: "Pro Cleaning Services",
            certifications: ["EPA Certified", "Bonded & Insured"],
            bio: "Professional cleaning service with 10+ years experience"
          }
        },
        {
          id: "3",
          reporter_id: "user5",
          reported_user_id: "user6",
          reported_content_type: "message",
          reported_content_id: "msg1",
          reason: "Harassment",
          description: "User is sending inappropriate messages and refusing to stop.",
          status: "resolved",
          admin_notes: "User warned and messaging restricted for 7 days",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          reporter: {
            display_name: "Lisa Brown",
            email: "lisa@example.com"
          },
          reported_user: {
            display_name: "Bob Anderson",
            email: "bob@example.com",
            role: "customer"
          },
          content: {
            message: "Hey there, interested in a different kind of service...",
            timestamp: new Date().toISOString()
          }
        }
      ];

      const mockStats: ModerationStats = {
        totalReports: 127,
        pendingReports: 8,
        resolvedToday: 12,
        averageResolutionTime: 4.2,
        topReasons: [
          { reason: "Inappropriate content", count: 34 },
          { reason: "Spam", count: 28 },
          { reason: "Harassment", count: 21 },
          { reason: "Fake credentials", count: 18 },
          { reason: "Pricing issues", count: 15 }
        ],
        flaggedUsers: 23,
        contentRemoved: 45
      };

      // Apply filters
      let filteredReports = mockReports;
      if (filters.status !== 'all') {
        filteredReports = filteredReports.filter(r => r.status === filters.status);
      }
      if (filters.type !== 'all') {
        filteredReports = filteredReports.filter(r => r.reported_content_type === filters.type);
      }
      if (filters.search) {
        filteredReports = filteredReports.filter(r => 
          r.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          r.reporter?.display_name.toLowerCase().includes(filters.search.toLowerCase()) ||
          r.reported_user?.display_name.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setReports(filteredReports);
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading moderation data:', error);
      toast({
        title: "Error",
        description: "Failed to load moderation data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModerationAction = async (reportId: string, action: ModerationAction) => {
    try {
      // Mock API call - in production, this would call the real API
      console.log('Moderation action:', { reportId, action });

      // Update the report status
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { 
              ...report, 
              status: action.type === 'approve' ? 'dismissed' : 'resolved',
              admin_notes: action.reason
            }
          : report
      ));

      toast({
        title: "Action Applied",
        description: `${action.type} action has been applied successfully`,
      });

      setActionDialogOpen(false);
      setSelectedReport(null);
    } catch (error) {
      console.error('Error applying moderation action:', error);
      toast({
        title: "Error",
        description: "Failed to apply moderation action",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'investigating': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'dismissed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (report: ModerationReport) => {
    if (report.reason.includes('harassment') || report.reason.includes('abuse')) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    if (report.reason.includes('fake') || report.reason.includes('fraud')) {
      return <Shield className="w-4 h-4 text-orange-500" />;
    }
    return <Flag className="w-4 h-4 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:bg-[var(--dark-navy)] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-gray-600 dark:text-gray-300">Loading moderation panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:bg-[var(--dark-navy)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Content Moderation
          </h1>
          <p className="text-gray-600 dark:text-[var(--mid-gray)]">
            Monitor and manage platform content and user behavior
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="card-premium border-gray-200 dark:border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Pending Reports</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingReports}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium border-gray-200 dark:border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Resolved Today</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.resolvedToday}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium border-gray-200 dark:border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Avg Resolution</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageResolutionTime}h</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium border-gray-200 dark:border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Flagged Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.flaggedUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="card-premium border-gray-200 dark:border-white/10 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search reports, users, or reasons..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="review">Reviews</SelectItem>
                  <SelectItem value="profile">Profiles</SelectItem>
                  <SelectItem value="message">Messages</SelectItem>
                  <SelectItem value="booking">Bookings</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={loadModerationData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports">Active Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="card-premium border-gray-200 dark:border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(report)}
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {report.reason}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {report.reported_content_type}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)] mb-3">
                          {report.description}
                        </p>

                        <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Reporter: {report.reporter?.display_name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Flag className="w-3 h-3" />
                            Reported: {report.reported_user?.display_name} ({report.reported_user?.role})
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(report.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        {report.admin_notes && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                              <strong>Admin Notes:</strong> {report.admin_notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReport(report)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      
                      {report.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedReport(report);
                            setActionDialogOpen(true);
                          }}
                          className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                        >
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-premium border-gray-200 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Top Report Reasons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats?.topReasons.map((reason, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">
                          {reason.reason}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                              style={{ width: `${(reason.count / 34) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                            {reason.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-premium border-gray-200 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Moderation Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">
                          Resolution Rate
                        </span>
                      </div>
                      <span className="font-semibold text-green-600 dark:text-green-400">94%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">
                          Daily Reports
                        </span>
                      </div>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">12.3 avg</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">
                          Response Time
                        </span>
                      </div>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">2.1h avg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="card-premium border-gray-200 dark:border-white/10">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Moderation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Auto-Moderation Rules</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">
                        Auto-flag reviews with profanity
                      </span>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">
                        AI content detection
                      </span>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">
                        Spam message detection
                      </span>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Export Data</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export Reports (CSV)
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export Analytics (PDF)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Dialog */}
        <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Take Moderation Action</DialogTitle>
              <DialogDescription>
                Choose an appropriate action for this report
              </DialogDescription>
            </DialogHeader>

            {selectedReport && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Report Details
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)] mb-2">
                    <strong>Reason:</strong> {selectedReport.reason}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">
                    <strong>Description:</strong> {selectedReport.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleModerationAction(selectedReport.id, {
                      type: 'approve',
                      reason: 'Report dismissed - no violation found',
                      notifyUser: false
                    })}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Dismiss Report
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                    onClick={() => handleModerationAction(selectedReport.id, {
                      type: 'warn',
                      reason: 'User warned for policy violation',
                      notifyUser: true
                    })}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Warn User
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleModerationAction(selectedReport.id, {
                      type: 'suspend',
                      reason: 'User suspended for policy violation',
                      duration: 7,
                      notifyUser: true
                    })}
                  >
                    <Ban className="w-4 h-4" />
                    Suspend (7 days)
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleModerationAction(selectedReport.id, {
                      type: 'delete_content',
                      reason: 'Content removed for policy violation',
                      notifyUser: true
                    })}
                  >
                    <X className="w-4 h-4" />
                    Remove Content
                  </Button>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
