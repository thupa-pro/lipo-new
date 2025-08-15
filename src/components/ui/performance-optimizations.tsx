"use client";

import { Suspense, lazy, memo, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

// Lazy loading wrapper for heavy components
export function LazyComponentWrapper({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
}) {
  return (
    <Suspense fallback={fallback || <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>}>
      {children}
    </Suspense>
  );
}

// Optimized image component with lazy loading and WebP support
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false
}: OptimizedImageProps) {
  const webpSrc = useMemo(() => {
    if (src.includes('.jpg') || src.includes('.png')) {
      return src.replace(/\.(jpg|png)$/i, '.webp');
    }
    return src;
  }, [src]);

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("transition-opacity duration-300", className)}
        onLoad={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        style={{ opacity: 0 }}
      />
    </picture>
  );
});

// Virtualized list for large datasets
interface VirtualizedListProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  className?: string;
}

export function VirtualizedList({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  className
}: VirtualizedListProps) {
  const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
  const [startIndex, setStartIndex] = useState(0);
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    setStartIndex(newStartIndex);
  }, [itemHeight]);

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, startIndex + visibleItemsCount + 1);
  }, [items, startIndex, visibleItemsCount]);

  return (
    <div
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
}

// Debounced search component
interface DebouncedSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
}

export function DebouncedSearch({ 
  onSearch, 
  placeholder = "Search...", 
  delay = 300,
  className 
}: DebouncedSearchProps) {
  const [query, setQuery] = useState("");

  const debouncedSearch = useMemo(
    () => debounce(onSearch, delay),
    [onSearch, delay]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "glass rounded-2xl px-4 py-2 border border-white/20 focus:border-neural-500 transition-all duration-300",
        className
      )}
    />
  );
}

// Performance monitoring hook
export function usePerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
  }, []);
}

// Utility functions
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

function useState<T>(initialState: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = React.useState(initialState);
  return [state, setState];
}

function useEffect(effect: () => void | (() => void), deps?: React.DependencyList) {
  React.useEffect(effect, deps);
}

import React from 'react';
