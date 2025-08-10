"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search, ArrowRight, Sparkles, User, Settings, Home, Briefcase, HelpCircle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
  category: 'navigation' | 'search' | 'actions' | 'ai';
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand?: (command: any, params?: Record<string, any>) => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const commands: Command[] = [
    {
      id: 'home',
      title: 'Go to Homepage',
      description: 'Navigate to the main dashboard',
      icon: Home,
      action: () => router.push('/'),
      shortcut: 'G H',
      category: 'navigation',
    },
    {
      id: 'search',
      title: 'Find Services',
      description: 'Search for local service providers',
      icon: Search,
      action: () => router.push('/browse'),
      shortcut: '/',
      category: 'search',
    },
    {
      id: 'book',
      title: 'Book a Service',
      description: 'Quick book a service with AI assistance',
      icon: Zap,
      action: () => router.push('/post-job'),
      shortcut: 'B',
      category: 'actions',
    },
    {
      id: 'provider',
      title: 'Become a Provider',
      description: 'Start earning with Loconomy',
      icon: Briefcase,
      action: () => router.push('/become-provider'),
      shortcut: 'P',
      category: 'actions',
    },
    {
      id: 'profile',
      title: 'View Profile',
      description: 'Manage your account settings',
      icon: User,
      action: () => router.push('/profile'),
      shortcut: 'G P',
      category: 'navigation',
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure your preferences',
      icon: Settings,
      action: () => router.push('/settings'),
      shortcut: 'G S',
      category: 'navigation',
    },
    {
      id: 'help',
      title: 'Help Center',
      description: 'Get support and documentation',
      icon: HelpCircle,
      action: () => router.push('/help'),
      shortcut: '?',
      category: 'navigation',
    },
    {
      id: 'ai-search',
      title: 'AI-Powered Search',
      description: 'Let AI find the perfect service for you',
      icon: Sparkles,
      action: () => {
        // Implement AI search functionality
        router.push('/browse?ai=true');
      },
      shortcut: 'A I',
      category: 'ai',
    },
  ];

  const filteredCommands = commands.filter(
    command =>
      command.title.toLowerCase().includes(query.toLowerCase()) ||
      command.description.toLowerCase().includes(query.toLowerCase())
  );

  const executeCommand = useCallback((command: Command) => {
    command.action();
    onClose();
    setQuery('');
    setSelectedIndex(0);
  }, [onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [filteredCommands, selectedIndex, executeCommand, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation': return 'text-blue-400';
      case 'search': return 'text-purple-400';
      case 'actions': return 'text-green-400';
      case 'ai': return 'text-fuchsia-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 bg-gray-900/95 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <div className="command-palette-container">
          {/* Search Input */}
          <div className="flex items-center px-6 py-4 border-b border-gray-700/50">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none font-ui text-lg"
              autoFocus
            />
            <div className="flex items-center gap-1 text-xs text-gray-500 font-ui">
              <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-300">⌘</kbd>
              <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-300">K</kbd>
            </div>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400 font-body">
                <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No commands found</p>
                <p className="text-sm mt-1">Try typing something else</p>
              </div>
            ) : (
              <div className="py-2">
                {filteredCommands.map((command, index) => {
                  const Icon = command.icon;
                  const isSelected = index === selectedIndex;
                  
                  return (
                    <button
                      key={command.id}
                      onClick={() => executeCommand(command)}
                      className={cn(
                        "w-full flex items-center justify-between px-6 py-3 text-left transition-all duration-200",
                        isSelected 
                          ? "bg-purple-600/20 border-l-2 border-purple-500" 
                          : "hover:bg-gray-800/50"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          isSelected ? "bg-purple-500/20" : "bg-gray-800"
                        )}>
                          <Icon className={cn(
                            "w-4 h-4",
                            isSelected ? "text-purple-400" : getCategoryColor(command.category)
                          )} />
                        </div>
                        <div>
                          <p className={cn(
                            "font-ui font-medium",
                            isSelected ? "text-white" : "text-gray-200"
                          )}>
                            {command.title}
                          </p>
                          <p className={cn(
                            "text-sm font-body",
                            isSelected ? "text-gray-300" : "text-gray-400"
                          )}>
                            {command.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {command.shortcut && (
                          <div className="flex items-center space-x-1">
                            {command.shortcut.split(' ').map((key, i) => (
                              <kbd 
                                key={i} 
                                className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded font-ui"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        )}
                        <ArrowRight className={cn(
                          "w-4 h-4 transition-transform",
                          isSelected ? "text-purple-400 translate-x-1" : "text-gray-500"
                        )} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-700/50 bg-gray-900/50">
            <div className="flex items-center justify-between text-xs text-gray-500 font-ui">
              <div className="flex items-center space-x-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">⏎</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">ESC</kbd>
                  Close
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span className="text-purple-400">AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
