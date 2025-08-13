"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Plus, Trash2, Settings, Clock, 
  Mail, MessageSquare, Bell, Calendar, User,
  ChevronRight, ChevronDown, Edit3, Copy,
  Zap, GitBranch, Filter, CheckCircle, AlertTriangle,
  Timer, Repeat, ArrowRight, MoreHorizontal, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface WorkflowTrigger {
  id: string;
  type: 'time' | 'event' | 'condition' | 'webhook' | 'manual';
  name: string;
  description: string;
  config: {
    schedule?: string;
    event?: string;
    conditions?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
    webhookUrl?: string;
  };
  isActive: boolean;
}

interface WorkflowAction {
  id: string;
  type: 'email' | 'sms' | 'notification' | 'webhook' | 'delay' | 'condition' | 'custom';
  name: string;
  description: string;
  config: {
    template?: string;
    recipient?: string;
    message?: string;
    url?: string;
    delay?: number;
    conditions?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
    customScript?: string;
  };
  position: { x: number; y: number };
  connections: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  createdAt: Date;
  lastRun?: Date;
  executions: number;
  successRate: number;
  tags: string[];
}

interface WorkflowRun {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  steps: Array<{
    actionId: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    startedAt: Date;
    completedAt?: Date;
    output?: any;
    error?: string;
  }>;
  logs: Array<{
    timestamp: Date;
    level: 'info' | 'warn' | 'error';
    message: string;
    details?: any;
  }>;
}

interface WorkflowAutomationProps {
  workflows: Workflow[];
  runs: WorkflowRun[];
  onCreateWorkflow?: (workflow: Partial<Workflow>) => void;
  onUpdateWorkflow?: (id: string, updates: Partial<Workflow>) => void;
  onDeleteWorkflow?: (id: string) => void;
  onRunWorkflow?: (id: string) => void;
  onStopWorkflow?: (id: string) => void;
  className?: string;
}

export function WorkflowAutomation({
  workflows,
  runs,
  onCreateWorkflow,
  onUpdateWorkflow,
  onDeleteWorkflow,
  onRunWorkflow,
  onStopWorkflow,
  className = ""
}: WorkflowAutomationProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [workflowFilter, setWorkflowFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [expandedRuns, setExpandedRuns] = useState<string[]>([]);

  const filteredWorkflows = workflows.filter(workflow => {
    if (workflowFilter === 'active') return workflow.isActive;
    if (workflowFilter === 'inactive') return !workflow.isActive;
    return true;
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

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'time': return <Clock className="w-4 h-4" />;
      case 'event': return <Zap className="w-4 h-4" />;
      case 'condition': return <Filter className="w-4 h-4" />;
      case 'webhook': return <GitBranch className="w-4 h-4" />;
      case 'manual': return <User className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'notification': return <Bell className="w-4 h-4" />;
      case 'webhook': return <GitBranch className="w-4 h-4" />;
      case 'delay': return <Timer className="w-4 h-4" />;
      case 'condition': return <Filter className="w-4 h-4" />;
      case 'custom': return <Settings className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const toggleRunExpanded = (runId: string) => {
    setExpandedRuns(prev =>
      prev.includes(runId)
        ? prev.filter(id => id !== runId)
        : [...prev, runId]
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <Zap className="w-8 h-8 text-blue-600" />
            <span>Workflow Automation</span>
          </h2>
          <p className="text-muted-foreground">
            Create and manage automated business workflows
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={workflowFilter} onValueChange={setWorkflowFilter as any}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workflows</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => setShowWorkflowBuilder(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Workflow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => {
          const latestRun = runs
            .filter(run => run.workflowId === workflow.id)
            .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];

          return (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedWorkflow(workflow)}
              className="cursor-pointer"
            >
              <Card className="glass-card h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-2">
                        <span>{workflow.name}</span>
                        {workflow.isActive && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Active
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        {workflow.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Toggle workflow menu
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Triggers */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Triggers</h4>
                      <div className="flex flex-wrap gap-1">
                        {workflow.triggers.map((trigger) => (
                          <Badge key={trigger.id} variant="secondary" className="text-xs">
                            {getTriggerIcon(trigger.type)}
                            <span className="ml-1">{trigger.name}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Actions ({workflow.actions.length})</h4>
                      <div className="flex flex-wrap gap-1">
                        {workflow.actions.slice(0, 3).map((action) => (
                          <Badge key={action.id} variant="outline" className="text-xs">
                            {getActionIcon(action.type)}
                            <span className="ml-1">{action.name}</span>
                          </Badge>
                        ))}
                        {workflow.actions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{workflow.actions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold">{workflow.executions}</div>
                        <div className="text-xs text-muted-foreground">Executions</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{workflow.successRate.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Success Rate</div>
                      </div>
                    </div>

                    {/* Latest Run */}
                    {latestRun && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Latest Run</span>
                          <Badge className={getStatusColor(latestRun.status)}>
                            {latestRun.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {latestRun.startedAt.toLocaleDateString()} at{' '}
                          {latestRun.startedAt.toLocaleTimeString()}
                          {latestRun.duration && (
                            <span> • {formatDuration(latestRun.duration)}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRunWorkflow?.(workflow.id);
                        }}
                        disabled={!workflow.isActive}
                        className="flex-1"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Run
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWorkflow(workflow);
                          setIsEditing(true);
                        }}
                        className="flex-1"
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Workflow Details */}
      <AnimatePresence>
        {selectedWorkflow && !isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span>{selectedWorkflow.name}</span>
                    <Switch
                      checked={selectedWorkflow.isActive}
                      onCheckedChange={(checked) => {
                        onUpdateWorkflow?.(selectedWorkflow.id, { isActive: checked });
                      }}
                    />
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRunWorkflow?.(selectedWorkflow.id)}
                      disabled={!selectedWorkflow.isActive}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Run Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedWorkflow(null)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Workflow Details */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Triggers</h4>
                      <div className="space-y-3">
                        {selectedWorkflow.triggers.map((trigger) => (
                          <div key={trigger.id} className="p-3 border rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              {getTriggerIcon(trigger.type)}
                              <span className="font-medium">{trigger.name}</span>
                              <Badge variant={trigger.isActive ? 'default' : 'secondary'}>
                                {trigger.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {trigger.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Actions</h4>
                      <div className="space-y-3">
                        {selectedWorkflow.actions.map((action, index) => (
                          <div key={action.id} className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
                              <span className="text-xs font-semibold">{index + 1}</span>
                            </div>
                            <div className="flex-1 p-3 border rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                {getActionIcon(action.type)}
                                <span className="font-medium">{action.name}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {action.description}
                              </p>
                            </div>
                            {index < selectedWorkflow.actions.length - 1 && (
                              <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Runs */}
                  <div>
                    <h4 className="font-semibold mb-3">Recent Runs</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {runs
                        .filter(run => run.workflowId === selectedWorkflow.id)
                        .slice(0, 10)
                        .map((run) => (
                          <div key={run.id} className="border rounded-lg">
                            <div
                              className="p-3 cursor-pointer hover:bg-white/5"
                              onClick={() => toggleRunExpanded(run.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Badge className={getStatusColor(run.status)}>
                                    {run.status}
                                  </Badge>
                                  <span className="text-sm">
                                    {run.startedAt.toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {run.duration && (
                                    <span className="text-xs text-muted-foreground">
                                      {formatDuration(run.duration)}
                                    </span>
                                  )}
                                  {expandedRuns.includes(run.id) ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {expandedRuns.includes(run.id) && (
                              <div className="px-3 pb-3 border-t">
                                <div className="space-y-2 mt-3">
                                  {run.steps.map((step, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-sm">
                                      <div className={`w-2 h-2 rounded-full ${
                                        step.status === 'completed' ? 'bg-green-500' :
                                        step.status === 'failed' ? 'bg-red-500' :
                                        step.status === 'running' ? 'bg-blue-500' :
                                        'bg-gray-300'
                                      }`} />
                                      <span className="flex-1">
                                        {selectedWorkflow.actions.find(a => a.id === step.actionId)?.name || 'Unknown Action'}
                                      </span>
                                      <Badge variant="outline" className="text-xs">
                                        {step.status}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                                
                                {run.logs.length > 0 && (
                                  <div className="mt-3 pt-3 border-t">
                                    <h5 className="text-xs font-semibold mb-2">Logs</h5>
                                    <div className="space-y-1 max-h-32 overflow-y-auto">
                                      {run.logs.slice(-5).map((log, index) => (
                                        <div key={index} className="text-xs flex items-start space-x-2">
                                          <span className={`w-1 h-1 rounded-full mt-1.5 ${
                                            log.level === 'error' ? 'bg-red-500' :
                                            log.level === 'warn' ? 'bg-yellow-500' :
                                            'bg-blue-500'
                                          }`} />
                                          <span className="text-muted-foreground">
                                            {log.timestamp.toLocaleTimeString()}
                                          </span>
                                          <span className="flex-1">{log.message}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workflow Builder Modal */}
      <AnimatePresence>
        {showWorkflowBuilder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowWorkflowBuilder(false)}
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
                  <h3 className="text-2xl font-bold">Create New Workflow</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setShowWorkflowBuilder(false)}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Workflow Name</Label>
                      <Input placeholder="Enter workflow name" />
                    </div>
                    <div>
                      <Label>Tags</Label>
                      <Input placeholder="Enter tags (comma separated)" />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="Describe what this workflow does"
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Workflow Template</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          name: 'Welcome New Users',
                          description: 'Send welcome email and setup notifications for new user registrations',
                          triggers: ['User Registration'],
                          actions: ['Send Email', 'Create Notification', 'Add to Mailing List']
                        },
                        {
                          name: 'Order Processing',
                          description: 'Automate order confirmation, payment processing, and fulfillment',
                          triggers: ['New Order'],
                          actions: ['Send Confirmation', 'Process Payment', 'Notify Fulfillment']
                        },
                        {
                          name: 'Customer Support',
                          description: 'Auto-assign support tickets and send acknowledgment emails',
                          triggers: ['Support Ticket'],
                          actions: ['Auto-assign', 'Send Acknowledgment', 'Set Priority']
                        },
                        {
                          name: 'Custom Workflow',
                          description: 'Build a workflow from scratch with custom triggers and actions',
                          triggers: ['Custom'],
                          actions: ['Custom']
                        }
                      ].map((template) => (
                        <Card key={template.name} className="cursor-pointer hover:border-blue-500 transition-colors">
                          <CardContent className="pt-4">
                            <h5 className="font-semibold">{template.name}</h5>
                            <p className="text-sm text-muted-foreground mt-1 mb-3">
                              {template.description}
                            </p>
                            <div className="space-y-2">
                              <div>
                                <span className="text-xs font-medium">Triggers:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {template.triggers.map((trigger) => (
                                    <Badge key={trigger} variant="outline" className="text-xs">
                                      {trigger}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-xs font-medium">Actions:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {template.actions.map((action) => (
                                    <Badge key={action} variant="secondary" className="text-xs">
                                      {action}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowWorkflowBuilder(false)}
                    >
                      Cancel
                    </Button>
                    <Button>
                      Create Workflow
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
