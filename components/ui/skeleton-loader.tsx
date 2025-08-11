"use client";

import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  variant?: "default" | "card" | "text" | "avatar" | "button";
  animated?: boolean;
  lines?: number;
}

export function SkeletonLoader({ 
  className, 
  variant = "default", 
  animated = true, 
  lines = 3 
}: SkeletonLoaderProps) {
  const baseClasses = animated 
    ? "bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded-md animate-pulse" 
    : "bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded-md";
  
  const variantClasses = {
    default: "h-4 w-full",
    card: "h-48 w-full rounded-xl",
    text: "h-4",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-24 rounded-lg"
  };

  const SkeletonElement = ({ className: elementClassName }: { className?: string }) => (
    <div 
      className={cn(baseClasses, variantClasses[variant], elementClassName)}
      aria-label="Loading content"
      role="status"
    />
  );

  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonElement 
            key={i}
            className={i === lines - 1 ? "w-3/4" : "w-full"}
          />
        ))}
      </div>
    );
  }

  return <SkeletonElement className={className} />;
}

// Pre-built skeleton patterns
export function CardSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <SkeletonLoader variant="avatar" />
        <div className="space-y-2 flex-1">
          <SkeletonLoader className="h-4 w-1/2" />
          <SkeletonLoader className="h-3 w-1/3" />
        </div>
      </div>
      <SkeletonLoader variant="text" lines={3} />
      <div className="flex justify-between">
        <SkeletonLoader variant="button" />
        <SkeletonLoader className="h-10 w-16" />
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <SkeletonLoader variant="avatar" />
          <div className="space-y-2 flex-1">
            <SkeletonLoader className="h-4 w-3/4" />
            <SkeletonLoader className="h-3 w-1/2" />
          </div>
          <SkeletonLoader variant="button" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <SkeletonLoader className="h-8 w-48" />
        <SkeletonLoader variant="button" />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-xl space-y-4">
            <SkeletonLoader className="h-6 w-24" />
            <SkeletonLoader className="h-10 w-16" />
            <SkeletonLoader className="h-3 w-20" />
          </div>
        ))}
      </div>
      
      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonLoader variant="card" />
        <SkeletonLoader variant="card" />
      </div>
    </div>
  );
}
