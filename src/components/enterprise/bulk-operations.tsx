"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Upload, Download, Play, Pause, CheckCircle, 
  XCircle, Clock, AlertTriangle, BarChart3, FileText,
  Users, Mail, DollarSign, Package, Settings, Trash2,
  Eye, Copy, Filter, Search, RefreshCw, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface BulkOperation {
  id: string;
  name: string;
  type: 'import' | 'export' | 'update' | 'delete' | 'notification' | 'migration';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  resource: 'users' | 'orders' | 'products' | 'payments' | 'notifications' | 'reviews';
  totalItems: number;
  processedItems: number;
  successfulItems: number;
  failedItems: number;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  createdBy: string;
  parameters: Record<string, any>;
  errors: Array<{
    item: string;
    error: string;
    line?: number;
  }>;
  logs: Array<{
    timestamp: Date;
    level: 'info' | 'warn' | 'error';
    message: string;
  }>;
}

interface BulkTemplate {
  id: string;
  name: string;
  description: string;
  type: 'import' | 'export' | 'update' | 'delete';
  resource: string;
  fields: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'email';
    required: boolean;
    description: string;
  }>;
  validations: Array<{
    field: string;
    rule: string;
    message: string;
  }>;
  usageCount: number;
  createdAt: Date;
}

interface BulkOperationsProps {
  operations: BulkOperation[];
  templates: BulkTemplate[];
  onCreateOperation?: (operation: Partial<BulkOperation>) => void;
  onCancelOperation?: (id: string) => void;
  onRetryOperation?: (id: string) => void;
  onCreateTemplate?: (template: Partial<BulkTemplate>) => void;
  className?: string;
}

export function BulkOperations({
  operations,
  templates,
  onCreateOperation,
  onCancelOperation,
  onRetryOperation,
  onCreateTemplate,
  className = ""
}: BulkOperationsProps) {
  const [activeTab, setActiveTab] = useState('operations');
  const [selectedOperation, setSelectedOperation] = useState<BulkOperation | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredOperations = operations.filter(op => {
    const matchesStatus = statusFilter === 'all' || op.status === statusFilter;
    const matchesType = typeFilter === 'all' || op.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'cancelled': return <Pause className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'import': return <Upload className="w-4 h-4" />;
      case 'export': return <Download className="w-4 h-4" />;
      case 'update': return <Settings className="w-4 h-4" />;
      case 'delete': return <Trash2 className="w-4 h-4" />;
      case 'notification': return <Mail className="w-4 h-4" />;
      case 'migration': return <Database className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'users': return <Users className="w-4 h-4" />;
      case 'orders': return <Package className="w-4 h-4" />;
      case 'products': return <Package className="w-4 h-4" />;
      case 'payments': return <DollarSign className="w-4 h-4" />;
      case 'notifications': return <Mail className="w-4 h-4" />;
      case 'reviews': return <FileText className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const calculateProgress = (operation: BulkOperation) => {
    if (operation.totalItems === 0) return 0;
    return (operation.processedItems / operation.totalItems) * 100;
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <Database className="w-8 h-8 text-blue-600" />
            <span>Bulk Operations</span>
          </h2>
          <p className="text-muted-foreground">
            Manage large-scale data operations and batch processing
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Zap className="w-4 h-4 mr-2" />
            New Operation
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {operations.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Operations</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {operations.filter(op => op.status === 'running').length}
                </div>
                <div className="text-sm text-muted-foreground">Running</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {operations.filter(op => op.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {operations.filter(op => op.status === 'failed').length}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="import">Import</SelectItem>
                    <SelectItem value="export">Export</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                    <SelectItem value="migration">Migration</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Operations List */}
          <div className="space-y-4">
            {filteredOperations.map((operation) => (
              <motion.div
                key={operation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(operation.type)}
                            {getResourceIcon(operation.resource)}
                          </div>
                          <h3 className="font-semibold text-lg">{operation.name}</h3>
                          <Badge className={getStatusColor(operation.status)}>
                            {getStatusIcon(operation.status)}
                            <span className="ml-1">{operation.status}</span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Type</Label>
                            <div className="capitalize">{operation.type}</div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Resource</Label>
                            <div className="capitalize">{operation.resource}</div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Progress</Label>
                            <div>
                              {operation.processedItems.toLocaleString()} / {operation.totalItems.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Created By</Label>
                            <div>{operation.createdBy}</div>
                          </div>
                        </div>

                        {operation.status === 'running' && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>{calculateProgress(operation).toFixed(1)}%</span>
                            </div>
                            <Progress value={calculateProgress(operation)} className="h-2" />
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                            <div className="font-semibold text-green-600">
                              {operation.successfulItems.toLocaleString()}
                            </div>
                            <div className="text-muted-foreground">Successful</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                            <div className="font-semibold text-red-600">
                              {operation.failedItems.toLocaleString()}
                            </div>
                            <div className="text-muted-foreground">Failed</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <div className="font-semibold text-blue-600">
                              {operation.startedAt ? operation.startedAt.toLocaleDateString() : 'Not started'}
                            </div>
                            <div className="text-muted-foreground">Started</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                            <div className="font-semibold text-purple-600">
                              {operation.duration ? formatDuration(operation.duration) : 'N/A'}
                            </div>
                            <div className="text-muted-foreground">Duration</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOperation(operation)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        {operation.status === 'running' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onCancelOperation?.(operation.id)}
                          >
                            <Pause className="w-3 h-3" />
                          </Button>
                        )}
                        {operation.status === 'failed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRetryOperation?.(operation.id)}
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Operation Templates</h3>
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="glass-card">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{template.name}</h4>
                      <Badge variant="outline" className="capitalize">
                        {template.type}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Resource</span>
                        <span className="capitalize">{template.resource}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Fields</span>
                        <span>{template.fields.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Used</span>
                        <span>{template.usageCount} times</span>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Created: {template.createdAt.toLocaleDateString()}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Copy className="w-3 h-3 mr-1" />
                        Use
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Operation Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['import', 'export', 'update', 'delete', 'notification'].map((type) => {
                    const count = operations.filter(op => op.type === type).length;
                    const percentage = operations.length > 0 ? (count / operations.length) * 100 : 0;
                    
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{type}</span>
                          <span>{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Success Rate Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operations.reduce((acc, op) => {
                    if (!acc[op.resource]) {
                      acc[op.resource] = { total: 0, successful: 0, failed: 0 };
                    }
                    acc[op.resource].total += op.totalItems;
                    acc[op.resource].successful += op.successfulItems;
                    acc[op.resource].failed += op.failedItems;
                    return acc;
                  }, {} as Record<string, any>)}

                  {Object.entries(operations.reduce((acc, op) => {
                    if (!acc[op.resource]) {
                      acc[op.resource] = { total: 0, successful: 0, failed: 0 };
                    }
                    acc[op.resource].total += op.totalItems;
                    acc[op.resource].successful += op.successfulItems;
                    acc[op.resource].failed += op.failedItems;
                    return acc;
                  }, {} as Record<string, any>)).map(([resource, stats]: [string, any]) => {
                    const successRate = stats.total > 0 ? (stats.successful / stats.total) * 100 : 0;
                    
                    return (
                      <div key={resource} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{resource}</span>
                          <span>{successRate.toFixed(1)}% success</span>
                        </div>
                        <Progress value={successRate} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {stats.successful.toLocaleString()} / {stats.total.toLocaleString()} items
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Operation Details Modal */}
      <AnimatePresence>
        {selectedOperation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOperation(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Operation Details</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedOperation(null)}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Operation Name</Label>
                      <div className="font-semibold">{selectedOperation.name}</div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={getStatusColor(selectedOperation.status)}>
                        {selectedOperation.status}
                      </Badge>
                    </div>
                  </div>

                  {selectedOperation.errors.length > 0 && (
                    <div>
                      <Label>Errors ({selectedOperation.errors.length})</Label>
                      <div className="mt-2 max-h-32 overflow-y-auto space-y-2">
                        {selectedOperation.errors.slice(0, 10).map((error, index) => (
                          <div key={index} className="p-2 bg-red-50 dark:bg-red-950 rounded text-sm">
                            <div className="font-medium text-red-600">
                              Item: {error.item} {error.line && `(Line ${error.line})`}
                            </div>
                            <div className="text-red-500">{error.error}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedOperation.logs.length > 0 && (
                    <div>
                      <Label>Operation Logs</Label>
                      <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                        {selectedOperation.logs.slice(-20).map((log, index) => (
                          <div key={index} className="text-xs flex items-start space-x-2">
                            <span className="text-muted-foreground">
                              {log.timestamp.toLocaleTimeString()}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {log.level}
                            </Badge>
                            <span className="flex-1">{log.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
