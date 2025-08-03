"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { CommandPalette } from "@/components/ui/command-palette";
import { useToast } from "@/hooks/use-toast";

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

interface CommandPaletteContextType {
  isOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  executeCommand: (commandId: string, params?: Record<string, any>) => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined);

export const useCommandPalette = () => {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error('useCommandPalette must be used within a CommandPaletteProvider');
  }
  return context;
};

interface CommandPaletteProviderProps {
  children: ReactNode;
}

export function CommandPaletteProvider({ children }: CommandPaletteProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const openCommandPalette = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleCommandPalette = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const executeCommand = useCallback((commandId: string, params?: Record<string, any>) => {
    // Handle command execution with different implementations
    switch (commandId) {
      case 'tip':
        if (params?.amount) {
          toast({
            title: "Tip Sent",
            description: `You sent a $${params.amount} tip${params.message ? ` with message: "${params.message}"` : ''}`,
          });
        }
        break;
        
      case 'boost':
        if (params?.duration && params?.budget) {
          toast({
            title: "Gig Boosted",
            description: `Your listing is now boosted for ${params.duration} with a budget of $${params.budget}`,
          });
        }
        break;
        
      case 'refer':
        if (params?.email) {
          toast({
            title: "Invitation Sent",
            description: `Referral invitation sent to ${params.email}`,
          });
        }
        break;
        
      case 'schedule':
        if (params?.service && params?.date && params?.time) {
          toast({
            title: "Service Scheduled",
            description: `${params.service} scheduled for ${params.date} at ${params.time}`,
          });
        }
        break;
        
      case 'rate':
        if (params?.provider && params?.rating) {
          toast({
            title: "Rating Submitted",
            description: `You rated ${params.provider} ${params.rating} star${params.rating !== '1' ? 's' : ''}`,
          });
        }
        break;
        
      case 'save':
        if (params?.provider) {
          toast({
            title: "Provider Saved",
            description: `${params.provider} has been added to your bookmarks`,
          });
        }
        break;
        
      case 'share-service':
        if (params?.service_id && params?.platform) {
          toast({
            title: "Service Shared",
            description: `Service shared via ${params.platform}`,
          });
        }
        break;
        
      case 'verify-provider':
        if (params?.provider_id) {
          toast({
            title: "Provider Verified",
            description: `Provider ${params.provider_id} has been verified`,
          });
        }
        break;
        
      default:
        toast({
          title: "Command Executed",
          description: `Command "${commandId}" has been executed`,
        });
        break;
    }
  }, [toast]);

  const handleCommand = useCallback((command: SlashCommand, params?: Record<string, any>) => {
    executeCommand(command.id, params);
  }, [executeCommand]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        closeCommandPalette();
      }

      // Individual command shortcuts
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        switch (e.key) {
          case 't':
            e.preventDefault();
            openCommandPalette();
            // Pre-select tip command
            break;
          case 'b':
            e.preventDefault();
            openCommandPalette();
            // Pre-select boost command
            break;
          case 'r':
            e.preventDefault();
            openCommandPalette();
            // Pre-select refer command
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleCommandPalette, closeCommandPalette, openCommandPalette]);

  // Listen for slash commands in text inputs
  useEffect(() => {
    const handleSlashCommand = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      
      // Only trigger on inputs that are not focused on form fields
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      
      if (e.key === '/') {
        e.preventDefault();
        openCommandPalette();
      }
    };

    document.addEventListener('keydown', handleSlashCommand);
    return () => document.removeEventListener('keydown', handleSlashCommand);
  }, [openCommandPalette]);

  const contextValue: CommandPaletteContextType = {
    isOpen,
    openCommandPalette,
    closeCommandPalette,
    toggleCommandPalette,
    executeCommand,
  };

  return (
    <CommandPaletteContext.Provider value={contextValue}>
      {children}
      <CommandPalette
        isOpen={isOpen}
        onClose={closeCommandPalette}
        onCommand={handleCommand}
      />
    </CommandPaletteContext.Provider>
  );
}
