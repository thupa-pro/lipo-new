"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface GlassmorphicContainerProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'intense' | 'subtle' | 'neon'
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: boolean
  animated?: boolean
  floating?: boolean
}

export function GlassmorphicContainer({
  children,
  className,
  variant = 'default',
  blur = 'md',
  glow = false,
  animated = true,
  floating = false,
  ...props
}: GlassmorphicContainerProps) {
  const variants = {
    default: 'bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10',
    intense: 'bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20',
    subtle: 'bg-white/5 dark:bg-white/3 border-white/10 dark:border-white/5',
    neon: 'bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-gradient-to-r from-purple-500/30 to-cyan-500/30'
  }

  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  }

  const baseClasses = cn(
    'rounded-3xl border shadow-2xl transition-all duration-500',
    blurClasses[blur],
    variants[variant],
    glow && 'shadow-purple-500/20 dark:shadow-purple-400/30',
    floating && 'shadow-lg hover:shadow-xl transform hover:-translate-y-1',
    className
  )

  const MotionDiv = animated ? motion.div : 'div'

  const animationProps = animated ? {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { 
      duration: 0.6, 
      ease: [0.23, 1, 0.32, 1],
      staggerChildren: 0.1 
    },
    whileHover: floating ? { 
      y: -4, 
      scale: 1.02,
      transition: { duration: 0.3 }
    } : undefined
  } : {}

  return (
    <MotionDiv
      className={baseClasses}
      {...animationProps}
      {...props}
    >
      {/* Inner glow effect */}
      {glow && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Floating particles effect */}
      {animated && (
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full opacity-60"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      )}
    </MotionDiv>
  )
}
