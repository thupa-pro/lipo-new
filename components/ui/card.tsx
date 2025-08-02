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
      "rounded-3xl bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-glass-lg",
      {
        "border bg-card": variant === "default",
        "glass": variant === "glass",
        "glass-strong": variant === "glass-strong",
        "glass border-neural-200/30 hover:shadow-neural": variant === "neural",
        "glass border-quantum-200/30 hover:shadow-quantum": variant === "quantum",
        "glass border-trust-200/30 hover:shadow-trust": variant === "trust",
        "glass border-plasma-200/30 hover:shadow-plasma": variant === "plasma",
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
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
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
