"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { y: -4, scale: 1.02 }
};

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated" | "interactive" | "premium";
  size?: "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  animate?: boolean;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = "default", size = "md", hover = true, animate = true, children, ...props }, ref) => {
    const baseStyles = "rounded-2xl border transition-all duration-300";
    
    const variantStyles = {
      default: "bg-card text-card-foreground shadow-sm border-border",
      glass: "bg-background/80 backdrop-blur-xl border-white/10 shadow-lg",
      elevated: "bg-card shadow-xl border-border/50 hover:shadow-2xl",
      interactive: "bg-card border-border hover:border-primary/50 cursor-pointer",
      premium: "bg-gradient-to-br from-background to-background/50 border-gradient-to-r from-primary/20 to-accent/20 shadow-xl"
    };

    const sizeStyles = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
      xl: "p-10"
    };

    const hoverStyles = hover ? "hover:shadow-lg hover:-translate-y-1" : "";

    const cardContent = (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          hoverStyles,
          className
        )}
        role="article"
        tabIndex={hover ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );

    if (animate) {
      return (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={hover ? "hover" : undefined}
          transition={{ duration: 0.3 }}
        >
          {cardContent}
        </motion.div>
      );
    }

    return cardContent;
  }
);
EnhancedCard.displayName = "EnhancedCard";

const EnhancedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-6", className)}
    {...props}
  />
));
EnhancedCardHeader.displayName = "EnhancedCardHeader";

const EnhancedCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
  }
>(({ className, level = 3, children, ...props }, ref) => {
  const Heading = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Heading
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </Heading>
  );
});
EnhancedCardTitle.displayName = "EnhancedCardTitle";

const EnhancedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
EnhancedCardDescription.displayName = "EnhancedCardDescription";

const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
EnhancedCardContent.displayName = "EnhancedCardContent";

const EnhancedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6", className)}
    {...props}
  />
));
EnhancedCardFooter.displayName = "EnhancedCardFooter";

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardFooter,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
};
