"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Command, 
  Zap, 
  DollarSign, 
  Share2, 
  X,
  Keyboard,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommandPalette } from "@/components/providers/command-palette-provider";

interface CommandPaletteHintProps {
  className?: string;
  showTrigger?: boolean;
  variant?: 'floating' | 'inline' | 'banner';
}

export function CommandPaletteHint({ 
  className, 
  showTrigger = true,
  variant = 'floating' 
}: CommandPaletteHintProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { openCommandPalette } = useCommandPalette();

  useEffect(() => {
    // Check if user has seen the hint before
    const hasSeenHint = localStorage.getItem('command-palette-hint-seen');
    
    if (!hasSeenHint) {
      // Show hint after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('command-palette-hint-seen', 'true');
  };

  const handleOpenPalette = () => {
    openCommandPalette();
    setHasInteracted(true);
    handleDismiss();
  };

  if (!isVisible && variant === 'floating') return null;

  const shortcuts = [
    { icon: DollarSign, name: "/tip", description: "Send tips" },
    { icon: Zap, name: "/boost", description: "Boost gigs" },
    { icon: Share2, name: "/refer", description: "Refer friends" },
  ];

  if (variant === 'banner') {
    return (
      <div className={cn(
        "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b",
        className
      )}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Command className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Quick Commands:</span>
              </div>
              
              <div className="flex items-center gap-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <shortcut.icon className="w-3 h-3 text-muted-foreground" />
                    <code className="text-xs bg-white dark:bg-gray-800 px-1 py-0.5 rounded border">
                      {shortcut.name}
                    </code>
                  </div>
                ))}
                <Badge variant="outline" className="text-xs">
                  Press ⌘K
                </Badge>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium">Quick Commands</h4>
            </div>
            <Badge variant="secondary" className="text-xs">⌘K</Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            Use slash commands for quick actions
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded border">
                <shortcut.icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <code className="text-xs font-mono">{shortcut.name}</code>
                  <p className="text-xs text-muted-foreground">{shortcut.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Floating variant
  return (
    <Card className={cn(
      "fixed bottom-6 right-6 w-80 shadow-lg border-blue-200 dark:border-blue-800 z-50 animate-in slide-in-from-bottom-5 fade-in",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Command className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Quick Commands</h4>
              <p className="text-xs text-muted-foreground">New feature!</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-3">
          Use slash commands for lightning-fast actions:
        </p>

        <div className="space-y-2 mb-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <shortcut.icon className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <code className="text-sm font-mono text-blue-600">{shortcut.name}</code>
                <span className="text-sm text-muted-foreground ml-2">{shortcut.description}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleOpenPalette} size="sm" className="flex-1">
            <Keyboard className="w-4 h-4 mr-2" />
            Try it now
          </Button>
          <Button onClick={handleDismiss} variant="outline" size="sm">
            Later
          </Button>
        </div>

        <div className="mt-3 text-center">
          <Badge variant="outline" className="text-xs">
            Press ⌘K anytime
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook to show command palette hint
export function useCommandPaletteHint() {
  const showHint = () => {
    localStorage.removeItem('command-palette-hint-seen');
    // Force re-render of hint component
    window.location.reload();
  };

  return { showHint };
}
