"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Brain, Zap, Cpu, Activity } from 'lucide-react'

interface NeuralLoadingProps {
  variant?: 'neural' | 'quantum' | 'biometric' | 'holographic'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  message?: string
  showProgress?: boolean
  progress?: number
  className?: string
}

export function NeuralLoading({
  variant = 'neural',
  size = 'md',
  message = 'AI Processing...',
  showProgress = false,
  progress = 0,
  className
}: NeuralLoadingProps) {
  const variants = {
    neural: {
      colors: ['#8B5CF6', '#3B82F6', '#06B6D4'],
      icon: Brain,
      gradient: 'from-purple-500 via-blue-500 to-cyan-500'
    },
    quantum: {
      colors: ['#10B981', '#059669', '#047857'],
      icon: Zap,
      gradient: 'from-emerald-500 via-green-500 to-teal-500'
    },
    biometric: {
      colors: ['#F59E0B', '#EF4444', '#DC2626'],
      icon: Activity,
      gradient: 'from-amber-500 via-red-500 to-rose-500'
    },
    holographic: {
      colors: ['#EC4899', '#8B5CF6', '#6366F1'],
      icon: Cpu,
      gradient: 'from-pink-500 via-purple-500 to-indigo-500'
    }
  }

  const sizes = {
    sm: {
      container: 'w-24 h-24',
      nodes: 'w-2 h-2',
      icon: 'w-6 h-6',
      text: 'text-sm',
      progress: 'h-1'
    },
    md: {
      container: 'w-32 h-32',
      nodes: 'w-3 h-3',
      icon: 'w-8 h-8',
      text: 'text-base',
      progress: 'h-2'
    },
    lg: {
      container: 'w-40 h-40',
      nodes: 'w-4 h-4',
      icon: 'w-10 h-10',
      text: 'text-lg',
      progress: 'h-3'
    },
    xl: {
      container: 'w-48 h-48',
      nodes: 'w-5 h-5',
      icon: 'w-12 h-12',
      text: 'text-xl',
      progress: 'h-4'
    }
  }

  const variantConfig = variants[variant]
  const sizeConfig = sizes[size]
  const Icon = variantConfig.icon

  // Neural network node positions
  const nodePositions = [
    { x: 50, y: 20, delay: 0 },
    { x: 20, y: 40, delay: 0.2 },
    { x: 80, y: 40, delay: 0.4 },
    { x: 35, y: 65, delay: 0.6 },
    { x: 65, y: 65, delay: 0.8 },
    { x: 50, y: 85, delay: 1.0 }
  ]

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-6', className)}>
      {/* Neural Network Visualization */}
      <div className={cn('relative', sizeConfig.container)}>
        {/* Background grid */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(90deg, currentColor 1px, transparent 0),
                linear-gradient(0deg, currentColor 1px, transparent 0)
              `,
              backgroundSize: '10px 10px'
            }}
          />
        </div>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full">
          {nodePositions.map((node, i) => 
            nodePositions.slice(i + 1).map((targetNode, j) => (
              <motion.line
                key={`${i}-${j}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${targetNode.x}%`}
                y2={`${targetNode.y}%`}
                stroke={variantConfig.colors[i % variantConfig.colors.length]}
                strokeWidth="1"
                opacity="0.3"
                animate={{
                  opacity: [0.1, 0.6, 0.1],
                  strokeWidth: [0.5, 2, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: (i + j) * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))
          )}
        </svg>

        {/* Neural nodes */}
        {nodePositions.map((node, i) => (
          <motion.div
            key={i}
            className={cn(
              'absolute rounded-full',
              sizeConfig.nodes
            )}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              backgroundColor: variantConfig.colors[i % variantConfig.colors.length],
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              scale: [0.8, 1.5, 0.8],
              opacity: [0.5, 1, 0.5],
              boxShadow: [
                `0 0 0px ${variantConfig.colors[i % variantConfig.colors.length]}`,
                `0 0 20px ${variantConfig.colors[i % variantConfig.colors.length]}`,
                `0 0 0px ${variantConfig.colors[i % variantConfig.colors.length]}`
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: node.delay,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Central AI icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className={cn(
            'p-3 rounded-2xl bg-gradient-to-br shadow-2xl',
            variantConfig.gradient
          )}>
            <Icon className={cn('text-white', sizeConfig.icon)} />
          </div>
        </motion.div>

        {/* Orbital rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border rounded-full border-white/20"
            style={{
              margin: `${i * 8}px`
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1]
            }}
            transition={{
              rotate: { 
                duration: 10 + i * 2, 
                repeat: Infinity, 
                ease: "linear",
                direction: i % 2 === 0 ? "normal" : "reverse"
              },
              scale: { 
                duration: 3 + i, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.5
              }
            }}
          />
        ))}
      </div>

      {/* Loading message */}
      <motion.div
        className="text-center space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.h3
          className={cn(
            'font-semibold bg-gradient-to-r bg-clip-text text-transparent',
            variantConfig.gradient,
            sizeConfig.text
          )}
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.h3>

        {/* Animated dots */}
        <div className="flex items-center justify-center gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full bg-gradient-to-r',
                variantConfig.gradient
              )}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Progress bar */}
      {showProgress && (
        <motion.div
          className="w-full max-w-xs space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Processing</span>
            <span className="text-sm font-medium text-white/80">
              {Math.round(progress)}%
            </span>
          </div>
          <div className={cn(
            'w-full bg-white/10 rounded-full overflow-hidden',
            sizeConfig.progress
          )}>
            <motion.div
              className={cn(
                'rounded-full bg-gradient-to-r shadow-lg',
                variantConfig.gradient
              )}
              style={{ height: '100%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}

      {/* Pulse effect */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-full bg-gradient-to-r opacity-20',
          variantConfig.gradient
        )}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0, 0.3, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}
