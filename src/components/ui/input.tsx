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
          "flex h-12 w-full rounded-xl border bg-black/20 px-4 py-3 text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium text-white placeholder-[var(--mid-gray)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          {
            "border-white/10 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50": variant === "default",
            "bg-glass border-white/30 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50": variant === "glass",
            "bg-glass border-purple-400/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 shadow-glow-neural": variant === "neural",
            "bg-glass border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 shadow-glow-quantum": variant === "quantum",
            "bg-glass border-green-400/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 shadow-glow-trust": variant === "trust",
            "bg-glass border-pink-400/50 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 shadow-glow-plasma": variant === "plasma",
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
