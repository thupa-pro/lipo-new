'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Brain, Zap, Network } from 'lucide-react';

interface AICardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'neural' | 'quantum' | 'plasma';
  animated?: boolean;
}

export function AICard({
  children,
  className = '',
  variant = 'neural',
  animated = true,
}: AICardProps) {
  const variantClasses = {
    neural: 'bg-gradient-to-br from-blue-50/90 via-purple-50/90 to-cyan-50/90 border-blue-200/30',
    quantum: 'bg-gradient-to-br from-purple-50/90 via-pink-50/90 to-red-50/90 border-purple-200/30',
    plasma: 'bg-gradient-to-br from-green-50/90 via-emerald-50/90 to-teal-50/90 border-green-200/30'
  };

  const iconVariants = {
    neural: Brain,
    quantum: Zap,
    plasma: Network
  };

  const Icon = iconVariants[variant];

  const cardClasses = cn(
    'backdrop-blur-xl border rounded-2xl p-6 shadow-xl',
    variantClasses[variant],
    'hover:scale-[1.02] transition-all duration-500',
    className
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className={cardClasses}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
      {children}
    </div>
  );
}
