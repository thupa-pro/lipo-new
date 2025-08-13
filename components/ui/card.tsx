import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "glass" | "glass-strong" | "neural" | "quantum" | "trust" | "plasma"
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-3xl text-slate-800 dark:text-white shadow-sm transition-all duration-300 card-glow",
      {
        "bg-white/95 dark:bg-glass border border-slate-200/50 dark:border-white/10": variant === "default",
        "bg-white/90 dark:bg-glass border border-slate-200/30 dark:border-white/10": variant === "glass",
        "bg-white dark:bg-glass-strong border border-slate-200 dark:border-white/20": variant === "glass-strong",
        "bg-white/95 dark:bg-glass border border-indigo-200 dark:border-purple-400/30 hover:shadow-lg dark:hover:shadow-neural": variant === "neural",
        "bg-white/95 dark:bg-glass border border-sky-200 dark:border-cyan-400/30 hover:shadow-lg dark:hover:shadow-quantum": variant === "quantum",
        "bg-white/95 dark:bg-glass border border-emerald-200 dark:border-green-400/30 hover:shadow-lg dark:hover:shadow-trust": variant === "trust",
        "bg-white/95 dark:bg-glass border border-pink-200 dark:border-pink-400/30 hover:shadow-lg dark:hover:shadow-plasma": variant === "plasma",
      },
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-8", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "gradient-neural" | "gradient-quantum" | "gradient-trust" | "gradient-plasma"
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight text-white",
      {
        "gradient-text": variant === "gradient-neural",
        "gradient-text": variant === "gradient-quantum",
        "gradient-text": variant === "gradient-trust",
        "gradient-text": variant === "gradient-plasma",
      },
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-[var(--mid-gray)] leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-8 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-8 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
