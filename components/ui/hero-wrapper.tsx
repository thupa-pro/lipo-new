'use client';

import { useState, useEffect } from 'react';
import { SimpleHero } from './simple-hero';

interface HeroWrapperProps {
  stats: {
    userCount: number;
    providerCount: number;
    bookingCount: number;
    averageRating: number;
    responseTime: string;
    successRate: string;
  };
}

// Dynamically import ModernHero with error handling
const loadModernHero = () => {
  return import('./modern-hero').then(module => module.ModernHero).catch(error => {
    console.error('Failed to load ModernHero component:', error);
    return null;
  });
};

export function HeroWrapper({ stats }: HeroWrapperProps) {
  const [ModernHero, setModernHero] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadComponent = async () => {
      try {
        const component = await loadModernHero();
        if (mounted) {
          if (component) {
            setModernHero(() => component);
          } else {
            setHasError(true);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading ModernHero:', error);
        if (mounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      mounted = false;
    };
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-6"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-4xl mx-auto mb-6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-2xl mx-auto mb-8"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use ModernHero if loaded successfully, otherwise use SimpleHero
  if (ModernHero && !hasError) {
    return <ModernHero stats={stats} />;
  }

  // Fallback to SimpleHero
  return <SimpleHero stats={stats} />;
}
