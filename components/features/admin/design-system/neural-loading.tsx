'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NeuralLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dots' | 'pulse' | 'neural';
  className?: string;
}

export function NeuralLoading({
  size = 'md',
  variant = 'neural',
  className = '',
}: NeuralLoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  if (variant === 'dots') {
    return (
      <div className={cn('flex space-x-1', className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              'rounded-full bg-gradient-to-r from-blue-500 to-purple-500',
              sizeClasses[size]
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.6, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={cn(
          'rounded-full bg-gradient-to-r from-blue-500 to-purple-500',
          sizeClasses[size],
          className
        )}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
    );
  }

  // Neural network style
  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <div className="absolute inset-0">
        <motion.div
          className="w-full h-full rounded-full border-2 border-blue-500/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-purple-500/50 border-t-purple-500"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      </div>
    </div>
  );
}
