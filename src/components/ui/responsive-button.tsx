'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useResponsive } from '@/components/ui/responsive'

const responsiveButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target hover-touch',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient:
          'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl',
        glass: 'glass-responsive text-white border-white/20 hover:bg-white/10',
      },
      size: {
        default: 'btn-responsive',
        sm: 'btn-responsive-sm',
        lg: 'btn-responsive-lg',
        icon: 'h-9 w-9 md:h-10 md:w-10',
        'icon-sm': 'h-8 w-8 md:h-9 md:w-9',
        'icon-lg': 'h-11 w-11 md:h-12 md:w-12',
      },
      responsive: {
        true: 'w-full sm:w-auto',
        false: '',
      },
      touchOptimized: {
        true: 'touch-target-lg',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      responsive: false,
      touchOptimized: true,
    },
  }
)

export interface ResponsiveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof responsiveButtonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const ResponsiveButton = React.forwardRef<
  HTMLButtonElement,
  ResponsiveButtonProps
>(
  (
    {
      className,
      variant,
      size,
      responsive,
      touchOptimized,
      asChild = false,
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const deviceInfo = useResponsive()
    const Comp = asChild ? Slot : 'button'

    // Auto-enable touch optimization on mobile/tablet
    const shouldOptimizeForTouch =
      touchOptimized || deviceInfo.shouldOptimizeForTouch

    return (
      <Comp
        className={cn(
          responsiveButtonVariants({
            variant,
            size,
            responsive,
            touchOptimized: shouldOptimizeForTouch,
            className,
          })
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </div>
        )}
      </Comp>
    )
  }
)

ResponsiveButton.displayName = 'ResponsiveButton'

export { ResponsiveButton, responsiveButtonVariants }
