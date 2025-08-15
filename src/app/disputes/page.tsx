"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Brain,
  TrendingUp,
  Users,
  Scale,
  FileText,
  MoreVertical
} from "lucide-react";
import { ConflictResolutionAgent } from "@/components/support/conflict-resolution-agent";
import { formatDistanceToNow } from "date-fns";

interface DisputeListItem {
  id: string;
  booking_id: string;
  customer_name: string;
  provider_name: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  created_at: string;
  ai_confidence: number;
  resolution_likelihood: number;
}

const MOCK_DISPUTES: DisputeListItem[] = [
  {
    id: "dispute_001",
    booking_id: "booking_123",
    customer_name: "Sarah Johnson",
    provider_name: "CleanCo Services",
    category: "quality",
    severity: "medium",
    status: "investigating",
    created_at: "2024-01-10T14:00:00Z",
    ai_confidence: 0.85,
    resolution_likelihood: 0.78
  },
  {
    id: "dispute_002", 
    booking_id: "booking_456",
    customer_name: "Mike Rodriguez",
    provider_name: "Quick Fix Plumbing",
    category: "no_show",
    severity: "high",
    status: "mediation",
    created_at: "2024-01-09T10:30:00Z",
    ai_confidence: 0.92,
    resolution_likelihood: 0.65
  },
  {
    id: "dispute_003",
    booking_id: "booking_789",
    customer_name: "Emma Thompson",
    provider_name: "Green Lawn Care",
    category: "pricing",
    severity: "low",
    status: "resolved",
    created_at: "2024-01-08T16:15:00Z",
    ai_confidence: 0.88,
    resolution_likelihood: 0.95
  }
];

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<DisputeListItem[]>(MOCK_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch = 
      dispute.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.provider_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || dispute.status === statusFilter;
    const matchesSeverity = severityFilter === "all" || dispute.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const stats = {
    total: disputes.length,
    open: disputes.filter(d => ['open', 'investigating', 'mediation'].includes(d.status)).length,
    resolved: disputes.filter(d => d.status === 'resolved').length,
    escalated: disputes.filter(d => d.status === 'escalated').length,
    avgResolutionTime: "2.3 hours",
    aiSuccessRate: "87%"
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
      case 'investigating':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'mediation':
        return <Scale className="w-4 h-4 text-blue-600" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'escalated':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (selectedDispute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedDispute(null)}
              className="mb-4"
            >
              ← Back to Disputes
            </Button>
          </div>
          <ConflictResolutionAgent
            disputeId={selectedDispute}
            userRole="admin"
            onResolutionComplete={() => {
              // Refresh disputes list
              setSelectedDispute(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dispute Resolution
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-powered conflict resolution and mediation
            </p>
          </div>
          
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Report Dispute
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Cases</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.open}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.resolved}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.escalated}</p>
              <p className="text-sm text-muted-foreground">Escalated</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.avgResolutionTime}</p>
              <p className="text-sm text-muted-foreground">Avg Resolution</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Brain className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.aiSuccessRate}</p>
              <p className="text-sm text-muted-foreground">AI Success Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search disputes by customer, provider, or case ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="mediation">Mediation</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Disputes List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDisputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedDispute(dispute.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">Case #{dispute.id}</h3>
                        <Badge className={getSeverityColor(dispute.severity)}>
                          {dispute.severity}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(dispute.status)}
                          <span className="text-sm capitalize">{dispute.status}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Customer</p>
                          <p className="font-medium">{dispute.customer_name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Provider</p>
                          <p className="font-medium">{dispute.provider_name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Category</p>
                          <p className="font-medium capitalize">{dispute.category.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(dispute.created_at))} ago
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Brain className="w-3 h-3 mr-1" />
                          {Math.round(dispute.ai_confidence * 100)}%
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {Math.round(dispute.resolution_likelihood * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredDisputes.length === 0 && (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No disputes found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== "all" || severityFilter !== "all"
                      ? "Try adjusting your filters"
                      : "All disputes have been resolved or no disputes exist"
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
