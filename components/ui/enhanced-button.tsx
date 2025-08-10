"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl",
        destructive: "bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white shadow-xl hover:shadow-2xl",
        glass: "bg-background/80 backdrop-blur-md border border-white/20 shadow-lg hover:bg-background/90",
        glow: "bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonMotionVariants = {
  tap: { scale: 0.95 },
  hover: { scale: 1.02, y: -2 },
  loading: {
    opacity: [1, 0.7, 1],
    transition: { duration: 1.5, repeat: Infinity }
  }
};

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  pulse?: boolean;
  animate?: boolean;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    pulse = false,
    animate = true,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    const buttonContent = (
      <>
        {/* Ripple effect overlay */}
        <div className="absolute inset-0 overflow-hidden rounded-inherit">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full" />
        </div>
        
        {/* Content */}
        <div className="relative flex items-center gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {loadingText && <span>{loadingText}</span>}
            </>
          ) : (
            <>
              {leftIcon}
              {children}
              {rightIcon}
            </>
          )}
        </div>
        
        {/* Pulse effect */}
        {pulse && !loading && (
          <div className="absolute inset-0 rounded-inherit animate-ping bg-current opacity-20" />
        )}
      </>
    );

    const buttonElement = (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), "group")}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {buttonContent}
      </Comp>
    );

    if (animate && !isDisabled) {
      return (
        <motion.div
          whileTap="tap"
          whileHover="hover"
          variants={buttonMotionVariants}
          animate={loading ? "loading" : ""}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {buttonElement}
        </motion.div>
      );
    }

    return buttonElement;
  }
);
EnhancedButton.displayName = "EnhancedButton";

// Pre-built button compositions
export function LoadingButton({ 
  loading, 
  children, 
  loadingText = "Loading...", 
  ...props 
}: EnhancedButtonProps & { loadingText?: string }) {
  return (
    <EnhancedButton loading={loading} loadingText={loadingText} {...props}>
      {children}
    </EnhancedButton>
  );
}

export function IconButton({ 
  icon, 
  children, 
  position = "left",
  ...props 
}: EnhancedButtonProps & { 
  icon: React.ReactNode; 
  position?: "left" | "right" 
}) {
  return (
    <EnhancedButton 
      leftIcon={position === "left" ? icon : undefined}
      rightIcon={position === "right" ? icon : undefined}
      {...props}
    >
      {children}
    </EnhancedButton>
  );
}

export function GlowButton({ children, ...props }: EnhancedButtonProps) {
  return (
    <EnhancedButton variant="glow" pulse {...props}>
      {children}
    </EnhancedButton>
  );
}

export { EnhancedButton, buttonVariants };
