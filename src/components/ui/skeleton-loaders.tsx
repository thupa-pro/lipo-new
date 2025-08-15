"use client";

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200/60 via-gray-100/80 to-gray-200/60 dark:from-gray-800/60 dark:via-gray-700/80 dark:to-gray-800/60",
        "bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("card-elite p-6 space-y-4", className)}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonStats({ className }: { className?: string }) {
  return (
    <div className={cn("card-elite p-8 text-center space-y-4", className)}>
      <div className="flex justify-center">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-20 mx-auto" />
      <Skeleton className="h-4 w-32 mx-auto" />
      <Skeleton className="h-3 w-24 mx-auto" />
    </div>
  );
}

export function SkeletonHero({ className }: { className?: string }) {
  return (
    <div className={cn("text-center space-y-8 py-24", className)}>
      <div className="flex justify-center">
        <Skeleton className="h-8 w-64 rounded-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-16 w-full max-w-4xl mx-auto" />
        <Skeleton className="h-16 w-5/6 max-w-3xl mx-auto" />
      </div>
      <Skeleton className="h-6 w-3/4 max-w-2xl mx-auto" />
      <div className="flex justify-center space-x-4">
        <Skeleton className="h-12 w-40 rounded-full" />
        <Skeleton className="h-12 w-40 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonServiceCard({ className }: { className?: string }) {
  return (
    <div className={cn("card-elite p-8 space-y-4", className)}>
      <Skeleton className="h-12 w-12 mb-4" />
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
    </div>
  );
}

export function SkeletonTestimonial({ className }: { className?: string }) {
  return (
    <div className={cn("card-elite p-8 space-y-6", className)}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-5" />
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function SkeletonSearch({ className }: { className?: string }) {
  return (
    <div className={cn("card-elite p-8 space-y-6", className)}>
      <div className="space-y-2 text-center">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
      <div className="space-y-4">
        <div className="flex space-x-2 p-3 rounded-full border border-gray-200 dark:border-gray-700">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 flex-1" />
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 flex-1" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
        <div className="flex justify-center space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

interface SkeletonGridProps {
  items: number;
  component: React.ComponentType<{ className?: string }>;
  className?: string;
  itemClassName?: string;
}

export function SkeletonGrid({ 
  items, 
  component: Component, 
  className,
  itemClassName 
}: SkeletonGridProps) {
  return (
    <div className={cn("grid gap-6", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <Component key={i} className={itemClassName} />
      ))}
    </div>
  );
}

// Loading states for different sections
export const LoadingStates = {
  Hero: () => <SkeletonHero />,
  Search: () => <SkeletonSearch />,
  Stats: () => (
    <SkeletonGrid 
      items={4} 
      component={SkeletonStats}
      className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    />
  ),
  Services: () => (
    <SkeletonGrid 
      items={6} 
      component={SkeletonServiceCard}
      className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    />
  ),
  Testimonials: () => (
    <SkeletonGrid 
      items={3} 
      component={SkeletonTestimonial}
      className="grid-cols-1 md:grid-cols-3"
    />
  ),
  Cards: (count: number = 3) => (
    <SkeletonGrid 
      items={count} 
      component={SkeletonCard}
      className="grid-cols-1 md:grid-cols-3"
    />
  ),
};
