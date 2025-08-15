'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useResponsive } from '@/components/ui/responsive'

const responsiveCardVariants = cva(
  'card-responsive transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border shadow-responsive',
        elevated: 'bg-card text-card-foreground shadow-responsive border-0',
        glass: 'glass-responsive text-white',
        gradient:
          'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 text-white',
        solid:
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-0 shadow-lg',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3 md:p-4',
        default: 'p-4 md:p-6',
        lg: 'p-6 md:p-8',
        xl: 'p-8 md:p-12',
      },
      interactive: {
        true: 'hover-touch cursor-pointer hover:scale-[1.02] hover:shadow-lg',
        false: '',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      interactive: false,
      fullWidth: false,
    },
  }
)

export interface ResponsiveCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof responsiveCardVariants> {}

const ResponsiveCard = React.forwardRef<HTMLDivElement, ResponsiveCardProps>(
  ({ className, variant, padding, interactive, fullWidth, ...props }, ref) => {
    const deviceInfo = useResponsive()

    return (
      <div
        ref={ref}
        className={cn(
          responsiveCardVariants({
            variant,
            padding,
            interactive,
            fullWidth,
            className,
          }),
          // Auto-adjust for mobile
          deviceInfo.isMobile && 'rounded-lg', // Smaller border radius on mobile
          deviceInfo.isDesktop && 'rounded-xl' // Larger border radius on desktop
        )}
        {...props}
      />
    )
  }
)

ResponsiveCard.displayName = 'ResponsiveCard'

const ResponsiveCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-4 md:p-6', className)}
    {...props}
  />
))

ResponsiveCardHeader.displayName = 'ResponsiveCardHeader'

const ResponsiveCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'fluid-text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))

ResponsiveCardTitle.displayName = 'ResponsiveCardTitle'

const ResponsiveCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-responsive-sm text-muted-foreground', className)}
    {...props}
  />
))

ResponsiveCardDescription.displayName = 'ResponsiveCardDescription'

const ResponsiveCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4 md:p-6 pt-0', className)} {...props} />
))

ResponsiveCardContent.displayName = 'ResponsiveCardContent'

const ResponsiveCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-4 md:p-6 pt-0', className)}
    {...props}
  />
))

ResponsiveCardFooter.displayName = 'ResponsiveCardFooter'

export {
  ResponsiveCard,
  ResponsiveCardHeader,
  ResponsiveCardFooter,
  ResponsiveCardTitle,
  ResponsiveCardDescription,
  ResponsiveCardContent,
  responsiveCardVariants,
}
