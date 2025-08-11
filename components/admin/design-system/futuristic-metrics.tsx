"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, Zap, Brain, Target, Activity } from 'lucide-react'

interface MetricData {
  value: number
  previousValue?: number
  target?: number
  unit?: string
  prefix?: string
  suffix?: string
}

interface FuturisticMetricsProps {
  title: string
  data: MetricData
  icon?: React.ComponentType<any>
  variant?: 'neural' | 'quantum' | 'holographic' | 'biometric'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  showTrend?: boolean
  showProgress?: boolean
  glowEffect?: boolean
  className?: string
}

export function FuturisticMetrics({
  title,
  data,
  icon: Icon = Activity,
  variant = 'neural',
  size = 'md',
  animated = true,
  showTrend = true,
  showProgress = true,
  glowEffect = true,
  className,
}: FuturisticMetricsProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Calculate trend
  const trend = data?.previousValue
    ? data.value > data.previousValue ? 'up'
    : data.value < data.previousValue ? 'down'
    : 'neutral'
    : 'neutral';
  
  const changePercent = data?.previousValue
    ? Math.abs(((data.value - data.previousValue) / data.previousValue) * 100)
    : 0;

  // Calculate progress percentage
  const progressPercent = data?.target
    ? Math.min((data.value / data.target) * 100, 100)
    : 0;

  // Animate value changes
  useEffect(() => {
    if (!animated) {
      setDisplayValue(data.value)
      return
    }

    setIsAnimating(true)
    const start = displayValue
    const end = data?.value || 0
    const duration = 2000
    const startTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = start + (end - start) * easeOut
      
      setDisplayValue(current)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }
    
    requestAnimationFrame(animate)
  }, [data?.value, animated, displayValue])

  const variants = {
    neural: {
      gradient: 'from-purple-500 via-blue-500 to-cyan-500',
      glow: 'shadow-purple-500/30',
      border: 'border-purple-500/30',
      text: 'text-purple-400'
    },
    quantum: {
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      glow: 'shadow-emerald-500/30',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400'
    },
    holographic: {
      gradient: 'from-pink-500 via-purple-500 to-indigo-500',
      glow: 'shadow-pink-500/30',
      border: 'border-pink-500/30',
      text: 'text-pink-400'
    },
    biometric: {
      gradient: 'from-orange-500 via-red-500 to-rose-500',
      glow: 'shadow-orange-500/30',
      border: 'border-orange-500/30',
      text: 'text-orange-400'
    }
  }

  const sizes = {
    sm: {
      container: 'p-4',
      icon: 'w-6 h-6',
      title: 'text-sm',
      value: 'text-2xl',
      trend: 'text-xs'
    },
    md: {
      container: 'p-6',
      icon: 'w-8 h-8',
      title: 'text-base',
      value: 'text-3xl',
      trend: 'text-sm'
    },
    lg: {
      container: 'p-8',
      icon: 'w-10 h-10',
      title: 'text-lg',
      value: 'text-4xl',
      trend: 'text-base'
    },
    xl: {
      container: 'p-10',
      icon: 'w-12 h-12',
      title: 'text-xl',
      value: 'text-5xl',
      trend: 'text-lg'
    }
  }

  const variantStyle = variants[variant]
  const sizeStyle = sizes[size]

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-3xl bg-black/20 backdrop-blur-xl border transition-all duration-500 group',
        variantStyle.border,
        glowEffect && `hover:${variantStyle.glow}`,
        sizeStyle.container,
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 50%, currentColor 50%),
              linear-gradient(0deg, transparent 50%, currentColor 50%)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Animated gradient overlay */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-3xl bg-gradient-to-br opacity-10',
          variantStyle.gradient
        )}
        animate={{
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className={cn(
              'p-2 rounded-2xl bg-gradient-to-br',
              variantStyle.gradient
            )}
            animate={isAnimating ? { 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 0.5 }}
          >
            <Icon className={cn('text-white', sizeStyle.icon)} />
          </motion.div>
          <div>
            <h3 className={cn(
              'font-semibold text-white/90',
              sizeStyle.title
            )}>
              {title}
            </h3>
          </div>
        </div>

        {/* AI Processing indicator */}
        {isAnimating && (
          <motion.div
            className="flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Brain className="w-4 h-4 text-cyan-400" />
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-cyan-400 rounded-full"
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Value */}
      <div className="mb-4">
        <motion.div
          className={cn(
            'font-bold bg-gradient-to-r bg-clip-text text-transparent',
            variantStyle.gradient,
            sizeStyle.value
          )}
          animate={isAnimating ? {
            textShadow: [
              '0 0 0px rgba(139, 92, 246, 0)',
              '0 0 20px rgba(139, 92, 246, 0.8)',
              '0 0 0px rgba(139, 92, 246, 0)'
            ]
          } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          {data?.prefix}
          {Math.round(displayValue).toLocaleString()}
          {data?.unit}
          {data?.suffix}
        </motion.div>
      </div>

      {/* Trend and Progress Section */}
      <div className="space-y-3">
        {/* Trend */}
        {showTrend && data?.previousValue && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
              trend === 'up' ? 'bg-green-500/20 text-green-400' :
              trend === 'down' ? 'bg-red-500/20 text-red-400' :
              'bg-gray-500/20 text-gray-400'
            )}>
              <TrendIcon className="w-3 h-3" />
              {trend !== 'neutral' && (
                <span>{changePercent.toFixed(1)}%</span>
              )}
            </div>
            <span className={cn('text-white/60', sizeStyle.trend)}>
              vs previous period
            </span>
          </motion.div>
        )}

        {/* Progress Bar */}
        {showProgress && data?.target && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={cn('text-white/60', sizeStyle.trend)}>
                Progress to target
              </span>
              <span className={cn('font-medium text-white/80', sizeStyle.trend)}>
                {progressPercent.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  'h-full rounded-full bg-gradient-to-r',
                  variantStyle.gradient
                )}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className={cn('text-white/40', sizeStyle.trend)}>
                Target: {data?.target?.toLocaleString()}{data?.unit}
              </span>
              {progressPercent >= 100 && (
                <motion.div
                  className="flex items-center gap-1 text-green-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2 }}
                >
                  <Target className="w-3 h-3" />
                  <span className={sizeStyle.trend}>Achieved!</span>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pulse effect for critical metrics */}
      {glowEffect && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-3xl',
            variantStyle.border
          )}
          animate={{
            boxShadow: [
              '0 0 0px rgba(139, 92, 246, 0)',
              '0 0 40px rgba(139, 92, 246, 0.3)',
              '0 0 0px rgba(139, 92, 246, 0)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  )
}
