'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassmorphicContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'intense' | 'subtle';
  glow?: boolean;
  animated?: boolean;
}

export function GlassmorphicContainer({
  children,
  className = '',
  variant = 'default',
  glow = false,
  animated = false,
}: GlassmorphicContainerProps) {
  const baseClasses = 'backdrop-blur-xl border border-white/20';
  
  const variantClasses = {
    default: 'bg-white/10',
    intense: 'bg-white/20',
    subtle: 'bg-white/5'
  };

  const glowClasses = glow 
    ? 'shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-shadow duration-500'
    : '';

  const containerClasses = cn(
    baseClasses,
    variantClasses[variant],
    glowClasses,
    'rounded-2xl',
    className
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={containerClasses}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}
