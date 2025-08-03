"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Shield,
  Brain,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Scale,
  FileText,
  Camera,
  Phone,
  Mail,
  ExternalLink,
  TrendingUp,
  Users,
  Gavel,
  Heart,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Dispute {
  id: string;
  booking_id: string;
  customer_id: string;
  provider_id: string;
  category: 'quality' | 'pricing' | 'no_show' | 'communication' | 'damage' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'mediation' | 'escalated' | 'resolved' | 'closed';
  description: string;
  evidence: {
    photos: string[];
    messages: string[];
    documents: string[];
  };
  timeline: DisputeEvent[];
  ai_analysis: AIAnalysis;
  resolution_suggestions: ResolutionSuggestion[];
  created_at: string;
  updated_at: string;
}

interface DisputeEvent {
  id: string;
  type: 'created' | 'evidence_added' | 'ai_analysis' | 'mediation_started' | 'resolution_proposed' | 'escalated' | 'resolved';
  actor: 'customer' | 'provider' | 'ai_agent' | 'support_agent';
  description: string;
  timestamp: string;
  data?: any;
}

interface AIAnalysis {
  confidence: number;
  fault_assessment: {
    customer_fault: number;
    provider_fault: number;
    external_factors: number;
  };
  sentiment_analysis: {
    customer_sentiment: 'positive' | 'neutral' | 'negative';
    provider_sentiment: 'positive' | 'neutral' | 'negative';
  };
  resolution_likelihood: number;
  escalation_risk: number;
  recommended_actions: string[];
}

interface ResolutionSuggestion {
  id: string;
  type: 'refund' | 'partial_refund' | 'credit' | 'redo_service' | 'compensation' | 'apology';
  description: string;
  cost_to_platform: number;
  likelihood_of_acceptance: number;
  ai_reasoning: string;
}

interface ConflictResolutionAgentProps {
  disputeId: string;
  userRole: 'customer' | 'provider' | 'admin';
  onResolutionComplete?: (resolution: any) => void;
  className?: string;
}

const MOCK_DISPUTE: Dispute = {
  id: "dispute_001",
  booking_id: "booking_123",
  customer_id: "user_456",
  provider_id: "provider_789",
  category: "quality",
  severity: "medium",
  status: "investigating",
  description: "The cleaning service was not completed as promised. Several areas were missed and the quality was below expectations.",
  evidence: {
    photos: ["/placeholder.svg", "/placeholder.svg"],
    messages: ["Initial complaint message", "Provider response"],
    documents: ["Service agreement", "Receipt"]
  },
  timeline: [
    {
      id: "1",
      type: "created",
      actor: "customer",
      description: "Dispute created regarding service quality",
      timestamp: "2024-01-10T14:00:00Z"
    },
    {
      id: "2",
      type: "evidence_added",
      actor: "customer",
      description: "Photos of incomplete work uploaded",
      timestamp: "2024-01-10T14:15:00Z"
    },
    {
      id: "3",
      type: "ai_analysis",
      actor: "ai_agent",
      description: "AI analysis completed with 85% confidence",
      timestamp: "2024-01-10T14:30:00Z"
    }
  ],
  ai_analysis: {
    confidence: 0.85,
    fault_assessment: {
      customer_fault: 0.1,
      provider_fault: 0.7,
      external_factors: 0.2
    },
    sentiment_analysis: {
      customer_sentiment: "negative",
      provider_sentiment: "neutral"
    },
    resolution_likelihood: 0.78,
    escalation_risk: 0.25,
    recommended_actions: [
      "Offer partial refund",
      "Schedule redo service",
      "Provide service credit"
    ]
  },
  resolution_suggestions: [
    {
      id: "1",
      type: "partial_refund",
      description: "Refund 40% of service cost ($30) for incomplete work",
      cost_to_platform: 15,
      likelihood_of_acceptance: 0.82,
      ai_reasoning: "Based on similar cases, partial refund addresses customer concerns while being fair to provider"
    },
    {
      id: "2",
      type: "redo_service",
      description: "Schedule complimentary service completion with different provider",
      cost_to_platform: 25,
      likelihood_of_acceptance: 0.75,
      ai_reasoning: "Customer priority appears to be completion of work rather than monetary compensation"
    }
  ],
  created_at: "2024-01-10T14:00:00Z",
  updated_at: "2024-01-10T14:30:00Z"
};

export function ConflictResolutionAgent({ 
  disputeId, 
  userRole, 
  onResolutionComplete, 
  className 
}: ConflictResolutionAgentProps) {
  const [dispute, setDispute] = useState<Dispute>(MOCK_DISPUTE);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<ResolutionSuggestion | null>(null);
  const [agentMessage, setAgentMessage] = useState("");
  const [showEvidenceUpload, setShowEvidenceUpload] = useState(false);

  const handleAcceptResolution = async (suggestion: ResolutionSuggestion) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update dispute status
    setDispute(prev => ({
      ...prev,
      status: "resolved",
      timeline: [
        ...prev.timeline,
        {
          id: Date.now().toString(),
          type: "resolved",
          actor: userRole,
          description: `Resolution accepted: ${suggestion.description}`,
          timestamp: new Date().toISOString()
        }
      ]
    }));

    setIsLoading(false);
    onResolutionComplete?.(suggestion);
  };

  const handleEscalate = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setDispute(prev => ({
      ...prev,
      status: "escalated",
      timeline: [
        ...prev.timeline,
        {
          id: Date.now().toString(),
          type: "escalated",
          actor: "ai_agent",
          description: "Case escalated to human support team",
          timestamp: new Date().toISOString()
        }
      ]
    }));

    setIsLoading(false);
  };

  const handleAddEvidence = async () => {
    // Simulate evidence upload
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setDispute(prev => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        {
          id: Date.now().toString(),
          type: "evidence_added",
          actor: userRole,
          description: "Additional evidence provided",
          timestamp: new Date().toISOString()
        }
      ]
    }));

    setIsLoading(false);
    setShowEvidenceUpload(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'investigating': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'mediation': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'escalated': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Conflict Resolution Agent
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  AI-Powered
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getSeverityColor(dispute.severity)}>
                  {dispute.severity} severity
                </Badge>
                <Badge className={getStatusColor(dispute.status)}>
                  {dispute.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Case #{dispute.id}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-sm font-medium">
                {formatDistanceToNow(new Date(dispute.created_at))} ago
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                AI Analysis
                <Badge variant="secondary">
                  {Math.round(dispute.ai_analysis.confidence * 100)}% confidence
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Fault Assessment */}
              <div>
                <h4 className="font-medium mb-3">Fault Assessment</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Provider Responsibility</span>
                    <span className="text-sm font-medium">
                      {Math.round(dispute.ai_analysis.fault_assessment.provider_fault * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={dispute.ai_analysis.fault_assessment.provider_fault * 100} 
                    className="h-2"
                  />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Customer Responsibility</span>
                    <span className="text-sm font-medium">
                      {Math.round(dispute.ai_analysis.fault_assessment.customer_fault * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={dispute.ai_analysis.fault_assessment.customer_fault * 100} 
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">External Factors</span>
                    <span className="text-sm font-medium">
                      {Math.round(dispute.ai_analysis.fault_assessment.external_factors * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={dispute.ai_analysis.fault_assessment.external_factors * 100} 
                    className="h-2"
                  />
                </div>
              </div>

              <Separator />

              {/* Resolution Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-sm font-medium">Resolution Likelihood</p>
                  <p className="text-lg font-bold text-green-600">
                    {Math.round(dispute.ai_analysis.resolution_likelihood * 100)}%
                  </p>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                  <p className="text-sm font-medium">Escalation Risk</p>
                  <p className="text-lg font-bold text-red-600">
                    {Math.round(dispute.ai_analysis.escalation_risk * 100)}%
                  </p>
                </div>
              </div>

              <Separator />

              {/* Recommended Actions */}
              <div>
                <h4 className="font-medium mb-2">AI Recommended Actions</h4>
                <ul className="space-y-1">
                  {dispute.ai_analysis.recommended_actions.map((action, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Resolution Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-green-600" />
                Resolution Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dispute.resolution_suggestions.map((suggestion) => (
                <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium capitalize">{suggestion.type.replace('_', ' ')}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {suggestion.description}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {Math.round(suggestion.likelihood_of_acceptance * 100)}% likely
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <strong>AI Reasoning:</strong> {suggestion.ai_reasoning}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      Platform cost: ${suggestion.cost_to_platform}
                    </span>
                    <div className="flex gap-2">
                      {userRole === 'admin' && (
                        <Button 
                          size="sm"
                          onClick={() => handleAcceptResolution(suggestion)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Apply Resolution
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Discuss
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Agent Communication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Communicate with AI Agent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Ask the AI agent questions about the dispute or provide additional context..."
                value={agentMessage}
                onChange={(e) => setAgentMessage(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Add Evidence
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Case Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                <p className="font-medium capitalize">{dispute.category.replace('_', ' ')}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                <p className="text-sm">{dispute.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Evidence</h4>
                <div className="text-sm space-y-1">
                  <p>{dispute.evidence.photos.length} photos</p>
                  <p>{dispute.evidence.messages.length} messages</p>
                  <p>{dispute.evidence.documents.length} documents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dispute.timeline.map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(event.timestamp))} ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dispute.status !== 'resolved' && dispute.status !== 'closed' && (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowEvidenceUpload(true)}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Add Evidence
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Request Call
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600"
                    onClick={handleEscalate}
                    disabled={isLoading}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Escalate to Human
                  </Button>
                </>
              )}
              
              {dispute.status === 'resolved' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    This dispute has been resolved. Both parties have been notified.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
