"use client";

import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Skip to content link for keyboard navigation
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 transition-all duration-200"
    >
      Skip to main content
    </a>
  );
}

// Accessible heading component with proper semantic structure
interface AccessibleHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  visualLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export const AccessibleHeading = forwardRef<HTMLHeadingElement, AccessibleHeadingProps>(
  ({ level, visualLevel, className, children, ...props }, ref) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    const visualClass = visualLevel ? `text-${visualLevel === 1 ? '4xl' : visualLevel === 2 ? '3xl' : visualLevel === 3 ? '2xl' : visualLevel === 4 ? 'xl' : visualLevel === 5 ? 'lg' : 'base'}` : '';

    return (
      <Tag
        ref={ref}
        className={cn("font-bold text-foreground", visualClass, className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
AccessibleHeading.displayName = "AccessibleHeading";

// High contrast mode support
export function HighContrastProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="supports-[forced-colors:active]:forced-colors-adjust-auto">
      {children}
    </div>
  );
}

// Screen reader only text
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

// Focus indicator for better keyboard navigation
export function FocusIndicator({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn(
      "focus-within:ring-2 focus-within:ring-neural-500 focus-within:ring-offset-2 rounded-xl transition-all duration-200",
      className
    )}>
      {children}
    </div>
  );
}

// Accessible button with proper states
interface AccessibleButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-neural-500 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "hover:scale-105 active:scale-95",
          variant === "primary" && "bg-gradient-neural text-white hover:shadow-lg",
          variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          variant === "outline" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          size === "sm" && "h-8 px-3 text-sm rounded-lg",
          size === "md" && "h-10 px-4 py-2 rounded-xl",
          size === "lg" && "h-12 px-6 py-3 text-lg rounded-2xl",
          className
        )}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);
AccessibleButton.displayName = "AccessibleButton";

// Color contrast checker utility
export function useColorContrast() {
  const checkContrast = (foreground: string, background: string): boolean => {
    // Simplified contrast check - in production, use a proper contrast calculation
    const fg = parseInt(foreground.replace('#', ''), 16);
    const bg = parseInt(background.replace('#', ''), 16);
    const contrast = Math.abs(fg - bg);
    return contrast > 0x7f7f7f; // Rough WCAG AA compliance check
  };

  return { checkContrast };
}
