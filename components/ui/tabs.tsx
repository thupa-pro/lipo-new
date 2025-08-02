import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: "default" | "glass" | "neural" | "quantum" | "trust" | "plasma"
  }
>(({ className, variant = "default", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-2xl p-1 text-muted-foreground transition-all duration-300",
      {
        "bg-muted": variant === "default",
        "glass": variant === "glass",
        "glass border-neural-200/30": variant === "neural",
        "glass border-quantum-200/30": variant === "quantum", 
        "glass border-trust-200/30": variant === "trust",
        "glass border-plasma-200/30": variant === "plasma",
      },
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "default" | "glass" | "neural" | "quantum" | "trust" | "plasma"
  }
>(({ className, variant = "default", ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      {
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm": variant === "default",
        "data-[state=active]:glass-strong data-[state=active]:text-neural-700 hover:bg-white/10": variant === "glass",
        "data-[state=active]:bg-gradient-neural data-[state=active]:text-white data-[state=active]:shadow-glow-neural hover:bg-neural-50": variant === "neural",
        "data-[state=active]:bg-gradient-quantum data-[state=active]:text-white data-[state=active]:shadow-glow-quantum hover:bg-quantum-50": variant === "quantum",
        "data-[state=active]:bg-gradient-trust data-[state=active]:text-white data-[state=active]:shadow-glow-trust hover:bg-trust-50": variant === "trust",
        "data-[state=active]:bg-gradient-plasma data-[state=active]:text-white data-[state=active]:shadow-glow-plasma hover:bg-plasma-50": variant === "plasma",
      },
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-fade-in",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
