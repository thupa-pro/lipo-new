"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { 
  AlertTriangle, 
  Bug, 
  Clock, 
  Download, 
  RefreshCw, 
  TrendingUp,
  TrendingDown,
  XCircle,
  Wifi,
  WifiOff,
  Server,
  Globe,
  User,
  Calendar,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Minus,
  Eye,
  Filter,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useErrorMonitoring } from "@/lib/error-monitoring";
import type { ErrorReport, ErrorStats, ErrorPattern } from "@/lib/error-monitoring";

export default function ErrorMonitoringDashboard() {
  const [stats, setStats] = useState<ErrorStats | null>(null);
  const [selectedError, setSelectedError] = useState<ErrorReport | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { getStats, clearErrors } = useErrorMonitoring();
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = () => {
    setLoading(true);
    try {
      const currentStats = getStats();
      setStats(currentStats);
    } catch (error) {
      console.error('Failed to load error stats:', error);
      toast({
        title: "Error",
        description: "Failed to load error statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearErrors = () => {
    clearErrors();
    setStats(null);
    setSelectedError(null);
    toast({
      title: "Success",
      description: "All error data has been cleared",
    });
  };

  const handleExportErrors = () => {
    if (!stats) return;
    
    const dataStr = JSON.stringify({
      stats,
      exportedAt: new Date().toISOString(),
    }, null, 2);
    
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Error report exported successfully",
    });
  };

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'timeout': return <Clock className="w-4 h-4" />;
      case 'abort': return <XCircle className="w-4 h-4" />;
      case 'network': return <WifiOff className="w-4 h-4" />;
      case 'fetch': return <Server className="w-4 h-4" />;
      case 'javascript': return <Bug className="w-4 h-4" />;
      case 'resource': return <Globe className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const filteredErrors = stats?.recentErrors.filter(error => {
    if (filter !== 'all' && error.type !== filter) return false;
    if (searchTerm && !error.message.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !error.url?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }) || [];

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:bg-[var(--dark-navy)] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className={cn("w-8 h-8 mx-auto mb-4 text-purple-500", loading && "animate-spin")} />
              <p className="text-gray-600 dark:text-gray-300">
                {loading ? "Loading error monitoring data..." : "No error data available"}
              </p>
              <Button onClick={loadStats} className="mt-4">
                Load Statistics
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:bg-[var(--dark-navy)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Error Monitoring Dashboard
            </h1>
            <p className="text-gray-600 dark:text-[var(--mid-gray)]">
              Real-time error tracking and analysis for system health monitoring
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={loadStats} disabled={loading}>
              <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExportErrors}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="destructive" onClick={handleClearErrors}>
              Clear All
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-premium border-gray-200 dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Total Errors</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600 dark:text-red-400">
                  Monitoring active
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium border-gray-200 dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Network Errors</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(stats.byType.network || 0) + (stats.byType.timeout || 0) + (stats.byType.abort || 0)}
                  </p>
                </div>
                <WifiOff className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium border-gray-200 dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">JS Errors</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.byType.javascript || 0}
                  </p>
                </div>
                <Bug className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium border-gray-200 dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)]">Critical Patterns</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.patterns.filter(p => p.severity === 'critical').length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="errors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="errors">Recent Errors</TabsTrigger>
            <TabsTrigger value="patterns">Error Patterns</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="details">Error Details</TabsTrigger>
          </TabsList>

          <TabsContent value="errors" className="space-y-6">
            {/* Filters */}
            <Card className="card-premium border-gray-200 dark:border-white/10">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="border rounded px-3 py-1 text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="fetch">Fetch Errors</option>
                      <option value="timeout">Timeouts</option>
                      <option value="abort">Aborted</option>
                      <option value="network">Network</option>
                      <option value="javascript">JavaScript</option>
                      <option value="resource">Resources</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-1">
                    <Search className="w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search errors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border rounded px-3 py-1 text-sm flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error List */}
            <div className="space-y-4">
              {filteredErrors.map((error) => (
                <Card 
                  key={error.id} 
                  className="card-premium border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
                  onClick={() => setSelectedError(error)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/10">
                          {getErrorIcon(error.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {error.type}
                            </Badge>
                            {error.status && (
                              <Badge variant="outline" className="text-xs">
                                {error.status}
                              </Badge>
                            )}
                            {error.retryAttempts && error.retryAttempts > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {error.retryAttempts} retries
                              </Badge>
                            )}
                          </div>
                          
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {error.message}
                          </p>
                          
                          {error.url && (
                            <p className="text-sm text-gray-600 dark:text-[var(--mid-gray)] truncate">
                              {error.url}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {error.timestamp.toLocaleString()}
                            </span>
                            {error.userId && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {error.userId}
                              </span>
                            )}
                            {error.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {error.duration}ms
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredErrors.length === 0 && (
                <Card className="card-premium border-gray-200 dark:border-white/10">
                  <CardContent className="p-16 text-center">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      No Errors Found
                    </h3>
                    <p className="text-gray-600 dark:text-[var(--mid-gray)]">
                      {filter === 'all' && !searchTerm 
                        ? "No errors have been recorded yet."
                        : "No errors match your current filters."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <div className="grid gap-4">
              {stats.patterns.map((pattern, index) => (
                <Card key={index} className="card-premium border-gray-200 dark:border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(pattern.severity)}>
                            {pattern.severity}
                          </Badge>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {pattern.pattern}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-[var(--mid-gray)]">
                          <span>{pattern.count} occurrences</span>
                          <span>{(pattern.frequency * 100).toFixed(1)}% frequency</span>
                          <span>Last: {pattern.lastOccurrence.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                          style={{ width: `${Math.min(pattern.frequency * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-premium border-gray-200 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Errors by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.byType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getErrorIcon(type)}
                          <span className="capitalize font-medium text-gray-900 dark:text-white">
                            {type}
                          </span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-premium border-gray-200 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Errors by Status Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.byStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          HTTP {status}
                        </span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {selectedError ? (
              <Card className="card-premium border-gray-200 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    {getErrorIcon(selectedError.type)}
                    Error Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Type:</strong> {selectedError.type}</div>
                        <div><strong>Message:</strong> {selectedError.message}</div>
                        <div><strong>Timestamp:</strong> {selectedError.timestamp.toLocaleString()}</div>
                        {selectedError.url && <div><strong>URL:</strong> {selectedError.url}</div>}
                        {selectedError.status && <div><strong>Status:</strong> {selectedError.status}</div>}
                        {selectedError.method && <div><strong>Method:</strong> {selectedError.method}</div>}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Session Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Session ID:</strong> {selectedError.sessionId}</div>
                        {selectedError.userId && <div><strong>User ID:</strong> {selectedError.userId}</div>}
                        <div><strong>User Agent:</strong> {selectedError.userAgent}</div>
                        {selectedError.duration && <div><strong>Duration:</strong> {selectedError.duration}ms</div>}
                        {selectedError.retryAttempts && <div><strong>Retries:</strong> {selectedError.retryAttempts}</div>}
                      </div>
                    </div>
                  </div>
                  
                  {selectedError.stack && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Stack Trace</h4>
                      <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                        {selectedError.stack}
                      </pre>
                    </div>
                  )}
                  
                  {selectedError.context && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Context</h4>
                      <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                        {JSON.stringify(selectedError.context, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {selectedError.networkStatus && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Network Status</h4>
                      <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                        {JSON.stringify(selectedError.networkStatus, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="card-premium border-gray-200 dark:border-white/10">
                <CardContent className="p-16 text-center">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Select an Error
                  </h3>
                  <p className="text-gray-600 dark:text-[var(--mid-gray)]">
                    Click on an error from the Recent Errors tab to view detailed information.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
