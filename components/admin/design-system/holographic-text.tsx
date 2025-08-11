"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HolographicTextProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'accent' | 'rainbow'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  animated?: boolean
  glitch?: boolean
  glow?: boolean
}

export function HolographicText({
  children,
  className,
  variant = 'primary',
  size = 'md',
  animated = true,
  glitch = false,
  glow = true,
  ...props
}: HolographicTextProps) {
  const variants = {
    primary: 'from-purple-400 via-blue-400 to-cyan-400',
    secondary: 'from-emerald-400 via-green-400 to-teal-400',
    accent: 'from-pink-400 via-purple-400 to-indigo-400',
    rainbow: 'from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400'
  }

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  }

  const baseClasses = cn(
    'font-bold bg-gradient-to-r bg-clip-text text-transparent inline-block',
    variants[variant],
    sizes[size],
    glow && 'drop-shadow-lg',
    className
  )

  if (!animated && !glitch) {
    return (
      <span className={baseClasses} {...props}>
        {children}
      </span>
    )
  }

  return (
    <motion.span
      className={baseClasses}
      animate={animated ? {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        ...(glow && {
          filter: [
            'drop-shadow(0 0 0px rgba(139, 92, 246, 0))',
            'drop-shadow(0 0 20px rgba(139, 92, 246, 0.8))',
            'drop-shadow(0 0 0px rgba(139, 92, 246, 0))'
          ]
        })
      } : {}}
      transition={{
        backgroundPosition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        },
        filter: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      style={{
        backgroundSize: '200% 200%'
      }}
      {...props}
    >
      {glitch ? (
        <motion.span
          animate={{
            x: [0, -2, 2, 0],
            textShadow: [
              '0 0 0px rgba(255, 0, 0, 0)',
              '2px 0px 0px rgba(255, 0, 0, 0.7), -2px 0px 0px rgba(0, 255, 255, 0.7)',
              '0 0 0px rgba(255, 0, 0, 0)'
            ]
          }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut"
          }}
        >
          {children}
        </motion.span>
      ) : (
        children
      )}
    </motion.span>
  )
}
