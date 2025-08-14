'use client';

import { ReactNode, HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/lib/utils/device-detection';

// Responsive Container Component
interface ResponsiveContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const ResponsiveContainer = forwardRef<HTMLDivElement, ResponsiveContainerProps>(
  ({ children, maxWidth = 'lg', padding = 'md', className, ...props }, ref) => {
    const maxWidthClasses = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      '7xl': 'max-w-7xl'
    };

    const paddingClasses = {
      none: '',
      sm: 'px-3 md:px-4',
      md: 'px-4 md:px-6 lg:px-8',
      lg: 'px-6 md:px-8 lg:px-12 xl:px-16'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full mx-auto',
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveContainer.displayName = 'ResponsiveContainer';

// Responsive Text Component
interface ResponsiveTextProps extends HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  children: ReactNode;
}

export const ResponsiveText = forwardRef<HTMLElement, ResponsiveTextProps>(
  ({ as: Component = 'p', size = 'base', children, className, ...props }, ref) => {
    const sizeClasses = {
      xs: 'text-responsive-xs',
      sm: 'text-responsive-sm',
      base: 'text-responsive-base',
      lg: 'text-responsive-lg',
      xl: 'text-responsive-xl',
      '2xl': 'text-responsive-2xl',
      '3xl': 'text-responsive-3xl',
      '4xl': 'text-responsive-4xl'
    };

    return (
      <Component
        ref={ref as any}
        className={cn(sizeClasses[size], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ResponsiveText.displayName = 'ResponsiveText';

// Responsive Grid Component
interface ResponsiveGridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  cols?: '1-2' | '1-2-3' | '1-2-4' | '2-3-4';
  gap?: 'sm' | 'md' | 'lg';
}

export const ResponsiveGrid = forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ children, cols = '1-2-3', gap = 'md', className, ...props }, ref) => {
    const colsClasses = {
      '1-2': 'grid-responsive-1-2',
      '1-2-3': 'grid-responsive-1-2-3',
      '1-2-4': 'grid-responsive-1-2-4',
      '2-3-4': 'grid-responsive-2-3-4'
    };

    const gapClasses = {
      sm: 'gap-3 md:gap-4',
      md: 'gap-4 md:gap-6 lg:gap-8',
      lg: 'gap-6 md:gap-8 lg:gap-12'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          colsClasses[cols],
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveGrid.displayName = 'ResponsiveGrid';

// Responsive Card Component
interface ResponsiveCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
}

export const ResponsiveCard = forwardRef<HTMLDivElement, ResponsiveCardProps>(
  ({ children, variant = 'default', padding = 'md', className, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      glass: 'glass-responsive',
      elevated: 'bg-white dark:bg-gray-800 shadow-responsive border-0'
    };

    const paddingClasses = {
      sm: 'p-3 md:p-4',
      md: 'p-4 md:p-6 lg:p-8',
      lg: 'p-6 md:p-8 lg:p-12'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'card-responsive',
          variantClasses[variant],
          paddingClasses[padding],
          'hover-touch',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveCard.displayName = 'ResponsiveCard';

// Device-specific components
export const MobileOnly = ({ children }: { children: ReactNode }) => (
  <div className="mobile-only">{children}</div>
);

export const TabletOnly = ({ children }: { children: ReactNode }) => (
  <div className="tablet-only">{children}</div>
);

export const DesktopOnly = ({ children }: { children: ReactNode }) => (
  <div className="desktop-only">{children}</div>
);

export const MobileTablet = ({ children }: { children: ReactNode }) => (
  <div className="mobile-tablet">{children}</div>
);

export const TabletDesktop = ({ children }: { children: ReactNode }) => (
  <div className="tablet-desktop">{children}</div>
);

// Responsive Button Component
interface ResponsiveButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  touchOptimized?: boolean;
}

export const ResponsiveButton = forwardRef<HTMLButtonElement, ResponsiveButtonProps>(
  ({ 
    children, 
    size = 'md', 
    variant = 'primary', 
    fullWidth = false,
    touchOptimized = true,
    className, 
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: 'btn-responsive-sm',
      md: 'btn-responsive',
      lg: 'btn-responsive-lg'
    };

    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
      ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800'
    };

    return (
      <button
        ref={ref}
        className={cn(
          sizeClasses[size],
          variantClasses[variant],
          fullWidth && 'w-full',
          touchOptimized && 'touch-target hover-touch',
          'transition-all duration-200 font-medium',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ResponsiveButton.displayName = 'ResponsiveButton';

// Hook to get current device info
export const useResponsive = () => {
  const deviceInfo = useDeviceDetection();
  
  return {
    ...deviceInfo,
    isMobileOrTablet: deviceInfo.isMobile || deviceInfo.isTablet,
    isDesktop: deviceInfo.isDesktop,
    canHover: deviceInfo.isDesktop,
    shouldOptimizeForTouch: deviceInfo.isMobile || deviceInfo.isTablet
  };
};
