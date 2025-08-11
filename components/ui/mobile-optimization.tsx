"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MobileOptimizationProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileOptimization({ children, className }: MobileOptimizationProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={cn(
      "w-full",
      isMobile && "px-4 py-2",
      className
    )}>
      {children}
    </div>
  );
}

export function ResponsiveContainer({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn(
      "container mx-auto",
      "px-4 sm:px-6 lg:px-8",
      "max-w-7xl",
      className
    )}>
      {children}
    </div>
  );
}

export function ResponsiveGrid({ 
  children, 
  cols = "1 md:2 lg:3",
  gap = "6",
  className 
}: { 
  children: React.ReactNode; 
  cols?: string;
  gap?: string;
  className?: string; 
}) {
  return (
    <div className={cn(
      `grid grid-cols-${cols} gap-${gap}`,
      "w-full",
      className
    )}>
      {children}
    </div>
  );
}

export function MobileCard({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn(
      "glass rounded-2xl p-4 sm:p-6",
      "border border-white/20",
      "backdrop-blur-xl",
      "hover:scale-[1.02] transition-all duration-300",
      "touch-manipulation", // Better mobile touch
      className
    )}>
      {children}
    </div>
  );
}
