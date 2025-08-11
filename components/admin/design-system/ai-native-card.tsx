"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Brain, Sparkles, Zap, TrendingUp } from 'lucide-react'

interface AICardProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  aiInsight?: string
  confidence?: number
  status?: 'learning' | 'active' | 'optimized' | 'predicting'
  variant?: 'neural' | 'quantum' | 'holographic' | 'biometric'
  interactive?: boolean
  glowOnHover?: boolean
}

export function AICard({
  children,
  className,
  title,
  subtitle,
  aiInsight,
  confidence = 0,
  status = 'active',
  variant = 'neural',
  interactive = true,
  glowOnHover = true,
  ...props
}: AICardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  // Mouse tracking for interactive effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]))
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]))

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !interactive) return
      
      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      mouseX.set((e.clientX - centerX) / rect.width)
      mouseY.set((e.clientY - centerY) / rect.height)
    }

    if (interactive) {
      document.addEventListener('mousemove', handleMouseMove)
      return () => document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [interactive, mouseX, mouseY])

  const statusIcons = {
    learning: Brain,
    active: Zap,
    optimized: TrendingUp,
    predicting: Sparkles
  }

  const StatusIcon = statusIcons[status]

  const variantStyles = {
    neural: 'bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 border-purple-500/30',
    quantum: 'bg-gradient-to-br from-green-900/20 via-emerald-900/20 to-teal-900/20 border-emerald-500/30',
    holographic: 'bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-indigo-900/20 border-pink-500/30',
    biometric: 'bg-gradient-to-br from-orange-900/20 via-red-900/20 to-rose-900/20 border-orange-500/30'
  }

  const statusColors = {
    learning: 'text-blue-400',
    active: 'text-green-400',
    optimized: 'text-purple-400',
    predicting: 'text-cyan-400'
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden rounded-3xl backdrop-blur-xl border transition-all duration-500 group',
        variantStyles[variant],
        glowOnHover && 'hover:shadow-2xl',
        interactive && 'cursor-pointer',
        className
      )}
      style={interactive ? {
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      {...props}
    >
      {/* Neural network background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, currentColor 1px, transparent 0),
              radial-gradient(circle at 75% 75%, currentColor 1px, transparent 0),
              radial-gradient(circle at 50% 50%, currentColor 1px, transparent 0)
            `,
            backgroundSize: '50px 50px, 70px 70px, 90px 90px'
          }}
        />
      </div>

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"
        animate={{
          opacity: isHovered ? 0.8 : 0.4,
          background: isHovered 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)'
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Header with AI status */}
      {(title || status) && (
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              {title && (
                <h3 className="text-xl font-bold text-white/90">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-white/60">
                  {subtitle}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <motion.div
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm',
                  statusColors[status]
                )}
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <StatusIcon className="w-4 h-4" />
                <span className="text-xs font-medium capitalize">
                  {status}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insight Banner */}
      {aiInsight && (
        <motion.div
          className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-b border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-4 h-4 text-purple-400" />
            </motion.div>
            <div className="flex-1">
              <p className="text-sm text-white/80 font-medium">
                AI Insight: {typeof aiInsight === 'string'
                  ? aiInsight
                  : aiInsight?.title || aiInsight?.description || 'No insight available'
                }
              </p>
              {confidence > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-white/50">Confidence:</span>
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-400 to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence}%` }}
                      transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-xs text-white/70 font-medium">
                    {confidence}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Floating AI particles */}
      {interactive && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"
              style={{
                left: `${10 + i * 20}%`,
                top: `${20 + i * 15}%`,
              }}
              animate={{
                y: [-5, 5, -5],
                opacity: isHovered ? [0.5, 1, 0.5] : [0.2, 0.4, 0.2],
                scale: isHovered ? [0.8, 1.5, 0.8] : [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      )}

      {/* Border glow effect */}
      {glowOnHover && (
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `linear-gradient(90deg, 
              transparent, 
              rgba(139, 92, 246, 0.3), 
              transparent
            )`,
            opacity: 0,
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  )
}
