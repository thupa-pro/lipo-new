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
      "rounded-3xl text-white shadow-sm transition-all duration-300 card-glow",
      {
        "bg-glass border border-white/10": variant === "default",
        "bg-glass": variant === "glass",
        "bg-glass-strong": variant === "glass-strong",
        "bg-glass border border-purple-400/30 hover:shadow-neural": variant === "neural",
        "bg-glass border border-cyan-400/30 hover:shadow-quantum": variant === "quantum",
        "bg-glass border border-green-400/30 hover:shadow-trust": variant === "trust",
        "bg-glass border border-pink-400/30 hover:shadow-plasma": variant === "plasma",
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
      "text-2xl font-bold leading-none tracking-tight",
      {
        "text-gradient-neural": variant === "gradient-neural",
        "text-gradient-quantum": variant === "gradient-quantum",
        "text-gradient-trust": variant === "gradient-trust",
        "text-gradient-plasma": variant === "gradient-plasma",
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
