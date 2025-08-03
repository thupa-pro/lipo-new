"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  Search,
  Zap,
  DollarSign,
  Share2,
  MessageSquare,
  Calendar,
  Map,
  Star,
  Settings,
  User,
  CreditCard,
  Bell,
  HelpCircle,
  Bookmark,
  History,
  TrendingUp,
  Shield,
  Gift,
  Users,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  Hash,
  Command as CommandIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SlashCommand {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
  category: 'actions' | 'navigation' | 'tools' | 'social' | 'admin';
  shortcut?: string;
  premium?: boolean;
  action: () => void | Promise<void>;
  params?: {
    name: string;
    type: 'text' | 'number' | 'select';
    options?: string[];
    required?: boolean;
  }[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand?: (command: SlashCommand, params?: Record<string, any>) => void;
}

const SLASH_COMMANDS: SlashCommand[] = [
  // Quick Actions
  {
    id: 'tip',
    name: 'Tip Provider',
    description: 'Send a tip to a service provider',
    icon: DollarSign,
    keywords: ['tip', 'money', 'gratuity', 'payment'],
    category: 'actions',
    shortcut: 'Ctrl+T',
    action: () => console.log('Opening tip modal'),
    params: [
      { name: 'amount', type: 'number', required: true },
      { name: 'message', type: 'text', required: false }
    ]
  },
  {
    id: 'boost',
    name: 'Boost Gig',
    description: 'Boost your service listing for more visibility',
    icon: Zap,
    keywords: ['boost', 'promote', 'visibility', 'featured'],
    category: 'actions',
    shortcut: 'Ctrl+B',
    premium: true,
    action: () => console.log('Opening boost modal'),
    params: [
      { name: 'duration', type: 'select', options: ['1 day', '3 days', '1 week'], required: true },
      { name: 'budget', type: 'number', required: true }
    ]
  },
  {
    id: 'refer',
    name: 'Refer Friend',
    description: 'Invite friends and earn rewards',
    icon: Share2,
    keywords: ['refer', 'invite', 'share', 'friend', 'reward'],
    category: 'social',
    shortcut: 'Ctrl+R',
    action: () => console.log('Opening referral modal'),
    params: [
      { name: 'email', type: 'text', required: true },
      { name: 'message', type: 'text', required: false }
    ]
  },

  // Navigation
  {
    id: 'browse',
    name: 'Browse Services',
    description: 'Explore available services in your area',
    icon: Search,
    keywords: ['browse', 'services', 'search', 'find'],
    category: 'navigation',
    action: () => window.location.href = '/browse'
  },
  {
    id: 'map',
    name: 'Open Gig Map',
    description: 'View real-time gigs on interactive map',
    icon: Map,
    keywords: ['map', 'location', 'gigs', 'nearby'],
    category: 'navigation',
    action: () => window.location.href = '/gig-map'
  },
  {
    id: 'messages',
    name: 'Open Messages',
    description: 'View your conversations',
    icon: MessageSquare,
    keywords: ['messages', 'chat', 'conversations'],
    category: 'navigation',
    action: () => window.location.href = '/messages'
  },
  {
    id: 'bookings',
    name: 'My Bookings',
    description: 'View your upcoming appointments',
    icon: Calendar,
    keywords: ['bookings', 'appointments', 'schedule'],
    category: 'navigation',
    action: () => window.location.href = '/my-bookings'
  },

  // Tools
  {
    id: 'schedule',
    name: 'Schedule Service',
    description: 'Book a new service appointment',
    icon: Calendar,
    keywords: ['schedule', 'book', 'appointment', 'service'],
    category: 'tools',
    action: () => console.log('Opening booking wizard'),
    params: [
      { name: 'service', type: 'text', required: true },
      { name: 'date', type: 'text', required: true },
      { name: 'time', type: 'text', required: true }
    ]
  },
  {
    id: 'rate',
    name: 'Rate Provider',
    description: 'Leave a review for a service provider',
    icon: Star,
    keywords: ['rate', 'review', 'feedback', 'rating'],
    category: 'tools',
    action: () => console.log('Opening rating modal'),
    params: [
      { name: 'provider', type: 'text', required: true },
      { name: 'rating', type: 'select', options: ['1', '2', '3', '4', '5'], required: true },
      { name: 'review', type: 'text', required: false }
    ]
  },
  {
    id: 'support',
    name: 'Contact Support',
    description: 'Get help from our support team',
    icon: HelpCircle,
    keywords: ['support', 'help', 'contact', 'assistance'],
    category: 'tools',
    action: () => window.location.href = '/customer-support'
  },
  {
    id: 'optimize',
    name: 'Optimize Service',
    description: 'AI-powered tip and boost optimization',
    icon: TrendingUp,
    keywords: ['optimize', 'boost', 'tip', 'ai', 'enhance', 'visibility'],
    category: 'tools',
    action: () => window.location.href = '/optimize-service'
  },

  // Social
  {
    id: 'save',
    name: 'Save Provider',
    description: 'Bookmark a provider for later',
    icon: Bookmark,
    keywords: ['save', 'bookmark', 'favorite', 'later'],
    category: 'social',
    action: () => console.log('Saving provider'),
    params: [
      { name: 'provider', type: 'text', required: true }
    ]
  },
  {
    id: 'share-service',
    name: 'Share Service',
    description: 'Share a service with friends',
    icon: Share2,
    keywords: ['share', 'send', 'recommend'],
    category: 'social',
    action: () => console.log('Sharing service'),
    params: [
      { name: 'service_id', type: 'text', required: true },
      { name: 'platform', type: 'select', options: ['Email', 'SMS', 'WhatsApp', 'Copy Link'], required: true }
    ]
  },

  // Admin (if user has permissions)
  {
    id: 'analytics',
    name: 'View Analytics',
    description: 'Check platform performance metrics',
    icon: TrendingUp,
    keywords: ['analytics', 'metrics', 'performance', 'stats'],
    category: 'admin',
    action: () => window.location.href = '/admin/reports'
  },
  {
    id: 'verify-provider',
    name: 'Verify Provider',
    description: 'Verify a service provider account',
    icon: Shield,
    keywords: ['verify', 'approve', 'validate'],
    category: 'admin',
    action: () => console.log('Opening verification panel'),
    params: [
      { name: 'provider_id', type: 'text', required: true }
    ]
  }
];

export function CommandPalette({ isOpen, onClose, onCommand }: CommandPaletteProps) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCommand, setSelectedCommand] = useState<SlashCommand | null>(null);
  const [commandParams, setCommandParams] = useState<Record<string, any>>({});

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!searchValue) return SLASH_COMMANDS;
    
    const query = searchValue.toLowerCase();
    return SLASH_COMMANDS.filter(command => 
      command.name.toLowerCase().includes(query) ||
      command.description.toLowerCase().includes(query) ||
      command.keywords.some(keyword => keyword.includes(query))
    );
  }, [searchValue]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, SlashCommand[]> = {};
    filteredCommands.forEach(command => {
      if (!groups[command.category]) {
        groups[command.category] = [];
      }
      groups[command.category].push(command);
    });
    return groups;
  }, [filteredCommands]);

  const categoryLabels = {
    actions: 'Quick Actions',
    navigation: 'Navigation',
    tools: 'Tools',
    social: 'Social',
    admin: 'Admin'
  };

  const handleCommandSelect = useCallback((command: SlashCommand) => {
    if (command.params && command.params.length > 0) {
      setSelectedCommand(command);
      setCommandParams({});
    } else {
      command.action();
      onCommand?.(command);
      onClose();
      setSearchValue("");
    }
  }, [onCommand, onClose]);

  const handleParameterSubmit = useCallback(() => {
    if (!selectedCommand) return;

    // Validate required parameters
    const missingParams = selectedCommand.params?.filter(param => 
      param.required && !commandParams[param.name]
    ) || [];

    if (missingParams.length > 0) {
      return; // Show validation error
    }

    selectedCommand.action();
    onCommand?.(selectedCommand, commandParams);
    setSelectedCommand(null);
    setCommandParams({});
    onClose();
    setSearchValue("");
  }, [selectedCommand, commandParams, onCommand, onClose]);

  const handleClose = useCallback(() => {
    onClose();
    setSearchValue("");
    setSelectedCommand(null);
    setCommandParams({});
  }, [onClose]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCommand(null);
      setCommandParams({});
      setSearchValue("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 max-w-2xl">
        <Command className="rounded-lg border-0">
          <div className="flex items-center border-b px-3">
            <CommandIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder={selectedCommand ? `Parameters for ${selectedCommand.name}` : "Type a command or search..."}
              value={searchValue}
              onValueChange={setSearchValue}
              className="border-0 focus:ring-0"
            />
            <Badge variant="secondary" className="ml-auto text-xs">
              ⌘K
            </Badge>
          </div>

          {selectedCommand ? (
            // Parameter input form
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <selectedCommand.icon className="w-5 h-5" />
                <div>
                  <h3 className="font-medium">{selectedCommand.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCommand.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedCommand.params?.map((param) => (
                  <div key={param.name} className="space-y-1">
                    <label className="text-sm font-medium capitalize">
                      {param.name.replace('_', ' ')}
                      {param.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {param.type === 'select' ? (
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={commandParams[param.name] || ''}
                        onChange={(e) => setCommandParams(prev => ({
                          ...prev,
                          [param.name]: e.target.value
                        }))}
                      >
                        <option value="">Select {param.name}</option>
                        {param.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        type={param.type}
                        placeholder={`Enter ${param.name}`}
                        value={commandParams[param.name] || ''}
                        onChange={(e) => setCommandParams(prev => ({
                          ...prev,
                          [param.name]: e.target.value
                        }))}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleParameterSubmit}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Execute Command
                </button>
                <button
                  onClick={() => setSelectedCommand(null)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            // Command list
            <CommandList>
              <CommandEmpty>No commands found.</CommandEmpty>
              
              {Object.entries(groupedCommands).map(([category, commands]) => (
                <div key={category}>
                  <CommandGroup heading={categoryLabels[category as keyof typeof categoryLabels]}>
                    {commands.map((command) => (
                      <CommandItem
                        key={command.id}
                        value={`${command.name} ${command.description} ${command.keywords.join(' ')}`}
                        onSelect={() => handleCommandSelect(command)}
                        className="flex items-center gap-3 px-3 py-2"
                      >
                        <command.icon className="w-4 h-4" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{command.name}</span>
                            {command.premium && (
                              <Badge variant="secondary" className="text-xs">Pro</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{command.description}</p>
                        </div>
                        {command.shortcut && (
                          <Badge variant="outline" className="text-xs">
                            {command.shortcut}
                          </Badge>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {Object.keys(groupedCommands).indexOf(category) < Object.keys(groupedCommands).length - 1 && (
                    <CommandSeparator />
                  )}
                </div>
              ))}
            </CommandList>
          )}
        </Command>
      </DialogContent>
    </Dialog>
  );
}
