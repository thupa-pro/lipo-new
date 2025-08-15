'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface HolographicTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'gradient' | 'shimmer' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export function HolographicText({
  children,
  className = '',
  variant = 'gradient',
  size = 'md',
  animated = true,
}: HolographicTextProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const variantClasses = {
    gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent',
    shimmer: 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-size-200 animate-gradient-shift',
    glow: 'text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]'
  };

  const textClasses = cn(
    'font-bold tracking-tight',
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  if (animated && variant === 'shimmer') {
    return (
      <motion.span
        className={textClasses}
        style={{
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {children}
      </motion.span>
    );
  }

  if (animated) {
    return (
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={textClasses}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className={textClasses}>
      {children}
    </span>
  );
}
