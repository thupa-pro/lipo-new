"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wand2,
  MapPin, 
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Sparkles,
  Brain,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Target,
  TrendingUp,
  Users,
  Star,
  Lightbulb,
  Zap,
  Camera,
  FileText,
  Share2,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, isBefore, isAfter } from "date-fns";

interface JobPostData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  location: {
    address: string;
    coordinates?: [number, number];
    type: 'onsite' | 'remote' | 'hybrid';
  };
  scheduling: {
    type: 'asap' | 'scheduled' | 'flexible';
    dates: Date[];
    timeSlots: string[];
    duration: number;
    recurring: boolean;
    recurringPattern?: string;
  };
  budget: {
    type: 'fixed' | 'hourly' | 'negotiable';
    min?: number;
    max?: number;
    currency: string;
  };
  requirements: string[];
  benefits: string[];
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  photos: File[];
  tags: string[];
}

interface AIJobSuggestion {
  title: string;
  description: string;
  estimatedPrice: { min: number; max: number };
  suggestedTags: string[];
  timeEstimate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  confidence: number;
}

interface AIJobPostingWizardProps {
  onComplete: (jobData: JobPostData) => void;
  onCancel: () => void;
  className?: string;
}

const WIZARD_STEPS = [
  { id: 'basic', title: 'Basic Info', icon: FileText },
  { id: 'details', title: 'AI Enhancement', icon: Brain },
  { id: 'location', title: 'Location', icon: MapPin },
  { id: 'scheduling', title: 'Scheduling', icon: CalendarIcon },
  { id: 'pricing', title: 'Pricing', icon: DollarSign },
  { id: 'preview', title: 'Preview', icon: Eye },
];

const CATEGORIES = [
  'home-services',
  'personal-care',
  'transportation',
  'education',
  'health-fitness',
  'business-services',
  'events',
  'technology'
];

const TIME_SLOTS = [
  '6:00 AM - 8:00 AM',
  '8:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
  '6:00 PM - 8:00 PM',
  '8:00 PM - 10:00 PM',
];

export function AIJobPostingWizard({ onComplete, onCancel, className }: AIJobPostingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AIJobSuggestion | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  const [jobData, setJobData] = useState<JobPostData>({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    location: {
      address: '',
      type: 'onsite',
    },
    scheduling: {
      type: 'asap',
      dates: [],
      timeSlots: [],
      duration: 1,
      recurring: false,
    },
    budget: {
      type: 'fixed',
      currency: 'USD',
    },
    requirements: [],
    benefits: [],
    urgency: 'medium',
    photos: [],
    tags: [],
  });

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          // Auto-fill location
          reverseGeocode(position.coords.latitude, position.coords.longitude);
        },
        (error) => console.log('Location access denied:', error)
      );
    }
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Simulated reverse geocoding
      setJobData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          address: `San Francisco, CA, USA`,
          coordinates: [lat, lng]
        }
      }));
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const generateAISuggestion = useCallback(async () => {
    if (!jobData.title || !jobData.category) return;

    setIsLoading(true);
    
    // Simulate AI generation with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const suggestions: Record<string, AIJobSuggestion> = {
      'home-services': {
        title: `Professional ${jobData.title} Service`,
        description: `High-quality ${jobData.title.toLowerCase()} service with attention to detail. Our experienced professionals use eco-friendly products and guarantee satisfaction. Perfect for busy homeowners who value quality and reliability.`,
        estimatedPrice: { min: 75, max: 150 },
        suggestedTags: ['professional', 'eco-friendly', 'insured', 'same-day'],
        timeEstimate: '2-4 hours',
        difficulty: 'medium',
        confidence: 0.92
      },
      'education': {
        title: `Personalized ${jobData.title} Tutoring`,
        description: `Expert ${jobData.title.toLowerCase()} instruction tailored to your learning style. Whether you're a beginner or looking to advance your skills, our certified instructors provide engaging, results-driven sessions.`,
        estimatedPrice: { min: 45, max: 85 },
        suggestedTags: ['certified', 'personalized', 'results-driven', 'flexible'],
        timeEstimate: '1-2 hours per session',
        difficulty: 'easy',
        confidence: 0.88
      },
      'default': {
        title: `Premium ${jobData.title} Service`,
        description: `Professional ${jobData.title.toLowerCase()} service delivered with excellence. Our skilled providers are background-checked, insured, and committed to exceeding your expectations.`,
        estimatedPrice: { min: 50, max: 120 },
        suggestedTags: ['premium', 'background-checked', 'insured', 'reliable'],
        timeEstimate: '1-3 hours',
        difficulty: 'medium',
        confidence: 0.85
      }
    };

    const suggestion = suggestions[jobData.category] || suggestions.default;
    setAiSuggestion(suggestion);
    setIsLoading(false);
  }, [jobData.title, jobData.category]);

  const applyAISuggestion = () => {
    if (!aiSuggestion) return;

    setJobData(prev => ({
      ...prev,
      title: aiSuggestion.title,
      description: aiSuggestion.description,
      budget: {
        ...prev.budget,
        type: 'fixed',
        min: aiSuggestion.estimatedPrice.min,
        max: aiSuggestion.estimatedPrice.max,
      },
      tags: aiSuggestion.suggestedTags,
    }));
  };

  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0: // Basic Info
        return jobData.title.length > 2 && jobData.category;
      case 1: // AI Enhancement
        return jobData.description.length > 10;
      case 2: // Location
        return jobData.location.address.length > 5;
      case 3: // Scheduling
        return jobData.scheduling.type === 'asap' || jobData.scheduling.dates.length > 0;
      case 4: // Pricing
        return jobData.budget.type === 'negotiable' || (jobData.budget.min && jobData.budget.min > 0);
      default:
        return true;
    }
  }, [currentStep, jobData]);

  const handleComplete = () => {
    onComplete(jobData);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {WIZARD_STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              isActive && "bg-blue-600 text-white shadow-lg scale-110",
              isCompleted && "bg-green-600 text-white",
              !isActive && !isCompleted && "bg-gray-200 dark:bg-gray-700 text-gray-500"
            )}>
              {isCompleted ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </div>
            <div className="ml-2 hidden sm:block">
              <p className={cn(
                "text-sm font-medium",
                isActive && "text-blue-600",
                isCompleted && "text-green-600",
                !isActive && !isCompleted && "text-gray-500"
              )}>
                {step.title}
              </p>
            </div>
            {index < WIZARD_STEPS.length - 1 && (
              <div className={cn(
                "w-8 h-0.5 mx-4",
                index < currentStep ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Job Title</label>
        <Input
          placeholder="e.g., House Cleaning, Math Tutoring, Car Wash"
          value={jobData.title}
          onChange={(e) => setJobData(prev => ({ ...prev, title: e.target.value }))}
          className="text-lg"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Be specific about what you need done
        </p>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Category</label>
        <Select value={jobData.category} onValueChange={(value) => setJobData(prev => ({ ...prev, category: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home-services">Home Services</SelectItem>
            <SelectItem value="personal-care">Personal Care</SelectItem>
            <SelectItem value="transportation">Transportation</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="health-fitness">Health & Fitness</SelectItem>
            <SelectItem value="business-services">Business Services</SelectItem>
            <SelectItem value="events">Events</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Quick Description</label>
        <Textarea
          placeholder="Brief description of what you need..."
          value={jobData.description}
          onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      {jobData.title && jobData.category && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            Great start! In the next step, our AI will help enhance your job posting with professional descriptions and smart suggestions.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderAIEnhancement = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2">AI Enhancement</h3>
        <p className="text-muted-foreground">
          Let our AI optimize your job posting for maximum visibility and provider interest
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">
              {jobData.description || "No description yet..."}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Suggestion
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Generating suggestions...</span>
              </div>
            ) : aiSuggestion ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Title: {aiSuggestion.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{aiSuggestion.description}</p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Confidence: {Math.round(aiSuggestion.confidence * 100)}%</span>
                  <Badge variant="secondary">{aiSuggestion.difficulty}</Badge>
                </div>
                <Button onClick={applyAISuggestion} size="sm" className="w-full">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Apply Suggestion
                </Button>
              </div>
            ) : (
              <Button onClick={generateAISuggestion} disabled={!jobData.title || !jobData.category} className="w-full">
                <Brain className="w-4 h-4 mr-2" />
                Generate AI Suggestion
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Enhanced Description</label>
        <Textarea
          value={jobData.description}
          onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          placeholder="Detailed description of your job requirements..."
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Tags</label>
        <div className="flex flex-wrap gap-2">
          {jobData.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => {
              setJobData(prev => ({
                ...prev,
                tags: prev.tags.filter((_, i) => i !== index)
              }));
            }}>
              {tag} ×
            </Badge>
          ))}
        </div>
        {aiSuggestion && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-2">Suggested tags:</p>
            <div className="flex flex-wrap gap-2">
              {aiSuggestion.suggestedTags.filter(tag => !jobData.tags.includes(tag)).map((tag, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => {
                  setJobData(prev => ({
                    ...prev,
                    tags: [...prev.tags, tag]
                  }));
                }}>
                  + {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Service Location</label>
        <div className="space-y-3">
          <Input
            placeholder="Enter address or location"
            value={jobData.location.address}
            onChange={(e) => setJobData(prev => ({
              ...prev,
              location: { ...prev.location, address: e.target.value }
            }))}
          />
          
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={jobData.location.type === 'onsite' ? 'default' : 'outline'}
              onClick={() => setJobData(prev => ({
                ...prev,
                location: { ...prev.location, type: 'onsite' }
              }))}
              className="text-xs"
            >
              On-site
            </Button>
            <Button
              variant={jobData.location.type === 'remote' ? 'default' : 'outline'}
              onClick={() => setJobData(prev => ({
                ...prev,
                location: { ...prev.location, type: 'remote' }
              }))}
              className="text-xs"
            >
              Remote
            </Button>
            <Button
              variant={jobData.location.type === 'hybrid' ? 'default' : 'outline'}
              onClick={() => setJobData(prev => ({
                ...prev,
                location: { ...prev.location, type: 'hybrid' }
              }))}
              className="text-xs"
            >
              Hybrid
            </Button>
          </div>
        </div>
      </div>

      {userLocation && (
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            We've detected your current location. You can use this or specify a different address above.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderScheduling = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">When do you need this done?</label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={jobData.scheduling.type === 'asap' ? 'default' : 'outline'}
            onClick={() => setJobData(prev => ({
              ...prev,
              scheduling: { ...prev.scheduling, type: 'asap' }
            }))}
            className="text-xs"
          >
            ASAP
          </Button>
          <Button
            variant={jobData.scheduling.type === 'scheduled' ? 'default' : 'outline'}
            onClick={() => setJobData(prev => ({
              ...prev,
              scheduling: { ...prev.scheduling, type: 'scheduled' }
            }))}
            className="text-xs"
          >
            Scheduled
          </Button>
          <Button
            variant={jobData.scheduling.type === 'flexible' ? 'default' : 'outline'}
            onClick={() => setJobData(prev => ({
              ...prev,
              scheduling: { ...prev.scheduling, type: 'flexible' }
            }))}
            className="text-xs"
          >
            Flexible
          </Button>
        </div>
      </div>

      {(jobData.scheduling.type === 'scheduled' || jobData.scheduling.type === 'flexible') && (
        <div>
          <label className="text-sm font-medium mb-2 block">Preferred Dates</label>
          <Calendar
            mode="multiple"
            selected={jobData.scheduling.dates}
            onSelect={(dates) => setJobData(prev => ({
              ...prev,
              scheduling: { ...prev.scheduling, dates: dates || [] }
            }))}
            disabled={(date) => isBefore(date, new Date())}
            className="rounded-md border"
          />
        </div>
      )}

      <div>
        <label className="text-sm font-medium mb-2 block">Preferred Time Slots</label>
        <div className="grid grid-cols-2 gap-2">
          {TIME_SLOTS.map(slot => (
            <Button
              key={slot}
              variant={jobData.scheduling.timeSlots.includes(slot) ? 'default' : 'outline'}
              onClick={() => {
                setJobData(prev => ({
                  ...prev,
                  scheduling: {
                    ...prev.scheduling,
                    timeSlots: prev.scheduling.timeSlots.includes(slot)
                      ? prev.scheduling.timeSlots.filter(s => s !== slot)
                      : [...prev.scheduling.timeSlots, slot]
                  }
                }));
              }}
              className="text-xs justify-start"
            >
              {slot}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Recurring Service</label>
        <Switch
          checked={jobData.scheduling.recurring}
          onCheckedChange={(checked) => setJobData(prev => ({
            ...prev,
            scheduling: { ...prev.scheduling, recurring: checked }
          }))}
        />
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Budget Type</label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={jobData.budget.type === 'fixed' ? 'default' : 'outline'}
            onClick={() => setJobData(prev => ({
              ...prev,
              budget: { ...prev.budget, type: 'fixed' }
            }))}
            className="text-xs"
          >
            Fixed Price
          </Button>
          <Button
            variant={jobData.budget.type === 'hourly' ? 'default' : 'outline'}
            onClick={() => setJobData(prev => ({
              ...prev,
              budget: { ...prev.budget, type: 'hourly' }
            }))}
            className="text-xs"
          >
            Hourly Rate
          </Button>
          <Button
            variant={jobData.budget.type === 'negotiable' ? 'default' : 'outline'}
            onClick={() => setJobData(prev => ({
              ...prev,
              budget: { ...prev.budget, type: 'negotiable' }
            }))}
            className="text-xs"
          >
            Negotiable
          </Button>
        </div>
      </div>

      {jobData.budget.type !== 'negotiable' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Minimum {jobData.budget.type === 'hourly' ? 'per hour' : 'budget'}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="0"
                value={jobData.budget.min || ''}
                onChange={(e) => setJobData(prev => ({
                  ...prev,
                  budget: { ...prev.budget, min: parseFloat(e.target.value) || undefined }
                }))}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Maximum {jobData.budget.type === 'hourly' ? 'per hour' : 'budget'}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="0"
                value={jobData.budget.max || ''}
                onChange={(e) => setJobData(prev => ({
                  ...prev,
                  budget: { ...prev.budget, max: parseFloat(e.target.value) || undefined }
                }))}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      )}

      {aiSuggestion && jobData.budget.type !== 'negotiable' && (
        <Alert>
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            AI Suggestion: ${aiSuggestion.estimatedPrice.min} - ${aiSuggestion.estimatedPrice.max} 
            based on similar jobs in your area.
          </AlertDescription>
        </Alert>
      )}

      <div>
        <label className="text-sm font-medium mb-2 block">Urgency Level</label>
        <div className="grid grid-cols-4 gap-2">
          {['low', 'medium', 'high', 'urgent'].map(level => (
            <Button
              key={level}
              variant={jobData.urgency === level ? 'default' : 'outline'}
              onClick={() => setJobData(prev => ({ ...prev, urgency: level as any }))}
              className="text-xs capitalize"
            >
              {level}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Job Posting Preview</h3>
        <p className="text-muted-foreground">Review your job posting before publishing</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{jobData.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{jobData.category}</Badge>
                <Badge variant={jobData.urgency === 'urgent' ? 'destructive' : 'default'}>
                  {jobData.urgency}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              {jobData.budget.type === 'negotiable' ? (
                <p className="text-lg font-semibold">Negotiable</p>
              ) : (
                <p className="text-lg font-semibold">
                  ${jobData.budget.min} - ${jobData.budget.max}
                  {jobData.budget.type === 'hourly' && '/hr'}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{jobData.description}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Location</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {jobData.location.address} ({jobData.location.type})
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Scheduling</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {jobData.scheduling.type === 'asap' ? 'As soon as possible' : 
                 jobData.scheduling.type === 'flexible' ? 'Flexible timing' :
                 `Scheduled for ${jobData.scheduling.dates.length} date(s)`}
              </p>
            </div>

            {jobData.tags.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {jobData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderBasicInfo();
      case 1: return renderAIEnhancement();
      case 2: return renderLocation();
      case 3: return renderScheduling();
      case 4: return renderPricing();
      case 5: return renderPreview();
      default: return null;
    }
  };

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              AI Job Posting Wizard
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Create a professional job posting with AI assistance
            </p>
          </div>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          {renderStepIndicator()}
        </div>
      </CardHeader>

      <CardContent>
        <div className="min-h-[400px]">
          {renderCurrentStep()}
        </div>

        <Separator className="my-6" />

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === WIZARD_STEPS.length - 1 ? (
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Publish Job
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={!canProceed}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
