'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Command, 
  X,
  Keyboard,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandPaletteHintProps {
  className?: string;
  showTrigger?: boolean;
}

export function CommandPaletteHint({ 
  className,
  showTrigger = true 
}: CommandPaletteHintProps = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Show hint after a delay for first-time users
    const hasSeenHint = localStorage.getItem('commandPaletteHintSeen');
    if (!hasSeenHint && showTrigger) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showTrigger]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('commandPaletteHintSeen', 'true');
  };

  const handleOpenPalette = () => {
    // Simple keyboard shortcut hint
    setHasInteracted(true);
    handleDismiss();
  };

  if (!isVisible || hasInteracted) return null;

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 max-w-sm",
      className
    )}>
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Command className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Quick Actions
                </h3>
                <Badge variant="secondary" className="mt-1 text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  New Feature
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Press{" "}
            <Badge variant="outline" className="mx-1 text-xs font-mono">
              <Keyboard className="w-3 h-3 mr-1" />
              Cmd+K
            </Badge>
            {" "}to access the command palette for quick actions.
          </p>

          <Button
            onClick={handleOpenPalette}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            Try it now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
