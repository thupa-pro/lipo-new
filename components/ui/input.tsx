import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "glass" | "neural" | "quantum" | "trust" | "plasma"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border bg-background px-4 py-3 text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          {
            "border-input focus:ring-2 focus:ring-ring focus:ring-offset-2": variant === "default",
            "glass border-white/30 backdrop-blur-sm focus:ring-2 focus:ring-neural-500/50 focus:border-neural-500/50": variant === "glass",
            "glass border-neural-200/50 focus:ring-2 focus:ring-neural-500/50 focus:border-neural-500 shadow-glow-neural": variant === "neural",
            "glass border-quantum-200/50 focus:ring-2 focus:ring-quantum-500/50 focus:border-quantum-500 shadow-glow-quantum": variant === "quantum",
            "glass border-trust-200/50 focus:ring-2 focus:ring-trust-500/50 focus:border-trust-500 shadow-glow-trust": variant === "trust",
            "glass border-plasma-200/50 focus:ring-2 focus:ring-plasma-500/50 focus:border-plasma-500 shadow-glow-plasma": variant === "plasma",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
