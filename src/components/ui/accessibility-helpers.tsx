"use client"

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useRef, 
  forwardRef,
  useCallback,
  ReactNode,
  HTMLAttributes,
  KeyboardEvent,
  FocusEvent
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Accessibility Context for global settings
interface AccessibilityContextType {
  reducedMotion: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  screenReaderMode: boolean
  keyboardNavigation: boolean
  colorBlindMode: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia'
  focusVisible: boolean
  announcements: string[]
  setReducedMotion: (value: boolean) => void
  setHighContrast: (value: boolean) => void
  setFontSize: (size: 'small' | 'medium' | 'large' | 'extra-large') => void
  setScreenReaderMode: (value: boolean) => void
  setKeyboardNavigation: (value: boolean) => void
  setColorBlindMode: (mode: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia') => void
  announce: (message: string, priority?: 'polite' | 'assertive') => void
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'extra-large'>('medium')
  const [screenReaderMode, setScreenReaderMode] = useState(false)
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)
  const [colorBlindMode, setColorBlindMode] = useState<'none' | 'deuteranopia' | 'protanopia' | 'tritanopia'>('none')
  const [focusVisible, setFocusVisible] = useState(false)
  const [announcements, setAnnouncements] = useState<string[]>([])

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Detect user preferences on mount
  useEffect(() => {
    // SSR and mounting safety guard
    if (!mounted || typeof window === 'undefined') return;

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)

    // Check for high contrast preference
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    setHighContrast(contrastQuery.matches)

    const handleContrastChange = (e: MediaQueryListEvent) => setHighContrast(e.matches)
    contrastQuery.addEventListener('change', handleContrastChange)

    // Detect keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setKeyboardNavigation(true)
        setFocusVisible(true)
      }
    }

    const handleMouseDown = () => {
      setFocusVisible(false)
    }

    document.addEventListener('keydown', handleKeyDown as any)
    document.addEventListener('mousedown', handleMouseDown)

    // Load saved preferences with error handling
    try {
      const savedPrefs = localStorage.getItem('accessibility-preferences')
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs)
        setFontSize(prefs.fontSize || 'medium')
        setScreenReaderMode(prefs.screenReaderMode || false)
        setColorBlindMode(prefs.colorBlindMode || 'none')
      }
    } catch (error) {
      console.error('Failed to load accessibility preferences:', error)
    }

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
      contrastQuery.removeEventListener('change', handleContrastChange)
      document.removeEventListener('keydown', handleKeyDown as any)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  // Save preferences when they change
  useEffect(() => {
    const prefs = {
      fontSize,
      screenReaderMode,
      colorBlindMode,
      highContrast,
      reducedMotion
    }
    localStorage.setItem('accessibility-preferences', JSON.stringify(prefs))
  }, [fontSize, screenReaderMode, colorBlindMode, highContrast, reducedMotion])

  // Apply CSS classes based on preferences
  useEffect(() => {
    const root = document.documentElement
    
    // Font size
    root.className = root.className.replace(/font-size-\w+/g, '')
    root.classList.add(`font-size-${fontSize}`)
    
    // High contrast
    if (highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }
    
    // Color blind mode
    root.className = root.className.replace(/color-blind-\w+/g, '')
    if (colorBlindMode !== 'none') {
      root.classList.add(`color-blind-${colorBlindMode}`)
    }
    
    // Screen reader mode
    if (screenReaderMode) {
      root.classList.add('screen-reader-mode')
    } else {
      root.classList.remove('screen-reader-mode')
    }
    
    // Focus visible
    if (focusVisible) {
      root.classList.add('focus-visible')
    } else {
      root.classList.remove('focus-visible')
    }
  }, [fontSize, highContrast, reducedMotion, colorBlindMode, screenReaderMode, focusVisible])

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, message])
    
    // Create live region announcement
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    // Remove after announcement
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement)
      }
    }, 1000)
    
    // Clean up announcements array
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1))
    }, 5000)
  }, [])

  return (
    <AccessibilityContext.Provider value={{
      reducedMotion,
      highContrast,
      fontSize,
      screenReaderMode,
      keyboardNavigation,
      colorBlindMode,
      focusVisible,
      announcements,
      setReducedMotion,
      setHighContrast,
      setFontSize,
      setScreenReaderMode,
      setKeyboardNavigation,
      setColorBlindMode,
      announce
    }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

// Screen Reader Only component
export function ScreenReaderOnly({ children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className="sr-only" {...props}>
      {children}
    </span>
  )
}

// Skip Link component
export function SkipLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {children}
    </a>
  )
}

// High Contrast Button
export function HighContrastToggle() {
  const { highContrast, setHighContrast } = useAccessibility()
  
  return (
    <button
      onClick={() => setHighContrast(!highContrast)}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-background border border-border hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast mode`}
      aria-pressed={highContrast}
    >
      <div className="w-4 h-4 border-2 border-current rounded-sm flex items-center justify-center">
        {highContrast && <div className="w-2 h-2 bg-current rounded-xs" />}
      </div>
      High Contrast
    </button>
  )
}

// Font Size Controls
export function FontSizeControls() {
  const { fontSize, setFontSize } = useAccessibility()
  
  const sizes = [
    { value: 'small', label: 'Small', size: 'A' },
    { value: 'medium', label: 'Medium', size: 'A' },
    { value: 'large', label: 'Large', size: 'A' },
    { value: 'extra-large', label: 'Extra Large', size: 'A' }
  ] as const
  
  return (
    <div className="flex items-center gap-1">
      <span className="text-sm font-medium mr-2">Text Size:</span>
      {sizes.map((size, index) => (
        <button
          key={size.value}
          onClick={() => setFontSize(size.value)}
          className={cn(
            "inline-flex items-center justify-center w-8 h-8 rounded-md border border-border hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            fontSize === size.value && "bg-primary text-primary-foreground"
          )}
          style={{ 
            fontSize: `${0.75 + index * 0.125}rem`,
            fontWeight: fontSize === size.value ? 'bold' : 'normal'
          }}
          aria-label={`Set font size to ${size.label}`}
          aria-pressed={fontSize === size.value}
        >
          {size.size}
        </button>
      ))}
    </div>
  )
}

// Motion Toggle
export function MotionToggle() {
  const { reducedMotion, setReducedMotion } = useAccessibility()
  
  return (
    <button
      onClick={() => setReducedMotion(!reducedMotion)}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-background border border-border hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label={`${reducedMotion ? 'Enable' : 'Disable'} animations`}
      aria-pressed={reducedMotion}
    >
      <div className="w-4 h-4 border-2 border-current rounded-sm flex items-center justify-center">
        {reducedMotion && <div className="w-2 h-2 bg-current rounded-xs" />}
      </div>
      Reduce Motion
    </button>
  )
}

// Color Blind Mode Selector
export function ColorBlindModeSelector() {
  const { colorBlindMode, setColorBlindMode } = useAccessibility()
  
  const modes = [
    { value: 'none', label: 'Normal Vision' },
    { value: 'deuteranopia', label: 'Deuteranopia (Green-Blind)' },
    { value: 'protanopia', label: 'Protanopia (Red-Blind)' },
    { value: 'tritanopia', label: 'Tritanopia (Blue-Blind)' }
  ] as const
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Color Vision Support:</label>
      <div className="grid grid-cols-1 gap-1">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => setColorBlindMode(mode.value)}
            className={cn(
              "text-left px-3 py-2 text-sm rounded-md border border-border hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              colorBlindMode === mode.value && "bg-primary text-primary-foreground"
            )}
            aria-pressed={colorBlindMode === mode.value}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// Accessible Focus Manager
export function FocusManager({ children, restoreFocus = true, autoFocus = true }: {
  children: ReactNode
  restoreFocus?: boolean
  autoFocus?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<Element | null>(null)
  
  useEffect(() => {
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement
    }
    
    if (autoFocus && containerRef.current) {
      const firstFocusable = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      
      if (firstFocusable) {
        firstFocusable.focus()
      }
    }
    
    return () => {
      if (restoreFocus && previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus()
      }
    }
  }, [restoreFocus, autoFocus])
  
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      if (!focusableElements || focusableElements.length === 0) return
      
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
  }
  
  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className="focus-manager"
    >
      {children}
    </div>
  )
}

// Accessible Button with enhanced keyboard support
export const AccessibleButton = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
    describedBy?: string
  }
>(({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  describedBy,
  onClick,
  onKeyDown,
  ...props 
}, ref) => {
  const { announce } = useAccessibility()
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    
    onClick?.(e)
    
    // Announce button action for screen readers
    if (children && typeof children === 'string') {
      announce(`${children} activated`, 'polite')
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick(e as any)
    }
    
    onKeyDown?.(e)
  }
  
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'hover:bg-accent hover:text-accent-foreground': variant === 'ghost'
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg'
        },
        className
      )}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-describedby={describedBy}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
})

AccessibleButton.displayName = 'AccessibleButton'

// Live Region for announcements
export function LiveRegion() {
  const { announcements } = useAccessibility()
  
  return (
    <div className="sr-only">
      <div aria-live="polite" aria-atomic="true">
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>
    </div>
  )
}

// Keyboard Navigation Indicator
export function KeyboardNavigationIndicator() {
  const { keyboardNavigation } = useAccessibility()
  
  if (!keyboardNavigation) return null
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium shadow-lg">
      Keyboard Navigation Active
    </div>
  )
}

// Accessibility Toolbar
export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-primary-foreground w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Accessibility Options"
        aria-expanded={isOpen}
        aria-controls="accessibility-toolbar"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="accessibility-toolbar"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 w-80 bg-background border border-border rounded-lg shadow-xl p-4 space-y-4"
          >
            <h3 className="font-semibold text-lg mb-4">Accessibility Options</h3>
            
            <FontSizeControls />
            <HighContrastToggle />
            <MotionToggle />
            <ColorBlindModeSelector />
            
            <div className="pt-4 border-t border-border">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper for creating accessible form fields
export function AccessibleFormField({
  label,
  description,
  error,
  required = false,
  children
}: {
  label: string
  description?: string
  error?: string
  required?: boolean
  children: ReactNode
}) {
  const fieldId = `field-${Math.random().toString(36).substr(2, 9)}`
  const descriptionId = description ? `${fieldId}-description` : undefined
  const errorId = error ? `${fieldId}-error` : undefined
  
  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="block text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      <div>
        {React.cloneElement(children as React.ReactElement, {
          id: fieldId,
          'aria-describedby': [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
          'aria-invalid': !!error,
          'aria-required': required
        })}
      </div>
      
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
