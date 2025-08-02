import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Semantic color tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // 2025 Premium Color System - OKLCH Based
        neural: {
          50: "oklch(0.98 0.01 250)",
          100: "oklch(0.95 0.02 250)",
          200: "oklch(0.90 0.04 250)",
          300: "oklch(0.82 0.08 250)",
          400: "oklch(0.72 0.12 250)",
          500: "oklch(0.65 0.15 250)", // Primary Neural Blue
          600: "oklch(0.58 0.18 250)",
          700: "oklch(0.48 0.20 250)",
          800: "oklch(0.38 0.18 250)",
          900: "oklch(0.28 0.15 250)",
          950: "oklch(0.18 0.10 250)",
        },
        quantum: {
          50: "oklch(0.98 0.01 200)",
          100: "oklch(0.95 0.03 200)",
          200: "oklch(0.88 0.06 200)",
          300: "oklch(0.80 0.09 200)",
          400: "oklch(0.72 0.11 200)",
          500: "oklch(0.75 0.12 200)", // Primary Quantum Cyan
          600: "oklch(0.65 0.14 200)",
          700: "oklch(0.55 0.16 200)",
          800: "oklch(0.45 0.14 200)",
          900: "oklch(0.35 0.12 200)",
          950: "oklch(0.25 0.08 200)",
        },
        trust: {
          50: "oklch(0.98 0.01 150)",
          100: "oklch(0.94 0.03 150)",
          200: "oklch(0.88 0.06 150)",
          300: "oklch(0.80 0.09 150)",
          400: "oklch(0.72 0.11 150)",
          500: "oklch(0.70 0.13 150)", // Primary Trust Green
          600: "oklch(0.62 0.15 150)",
          700: "oklch(0.52 0.16 150)",
          800: "oklch(0.42 0.14 150)",
          900: "oklch(0.32 0.12 150)",
          950: "oklch(0.22 0.08 150)",
        },
        plasma: {
          50: "oklch(0.98 0.01 300)",
          100: "oklch(0.94 0.04 300)",
          200: "oklch(0.88 0.08 300)",
          300: "oklch(0.80 0.12 300)",
          400: "oklch(0.70 0.16 300)",
          500: "oklch(0.60 0.18 300)", // Primary Plasma Purple
          600: "oklch(0.52 0.20 300)",
          700: "oklch(0.44 0.18 300)",
          800: "oklch(0.36 0.16 300)",
          900: "oklch(0.28 0.14 300)",
          950: "oklch(0.20 0.10 300)",
        },
        
        // Atmospheric Neutral System
        stratosphere: "oklch(0.98 0.01 250)",
        cirrus: "oklch(0.92 0.02 250)",
        nimbus: "oklch(0.65 0.03 250)",
        storm: "oklch(0.35 0.04 250)",
        eclipse: "oklch(0.15 0.05 250)",
        
        // Enhanced semantic colors
        success: "oklch(0.70 0.13 150)",
        warning: "oklch(0.75 0.15 80)",
        error: "oklch(0.65 0.18 25)",
        info: "oklch(0.70 0.12 250)",
        
        // Chart colors for data visualization
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      
      // Enhanced border radius system
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        "2xl": "calc(var(--radius) + 4px)",
        "3xl": "calc(var(--radius) + 8px)",
        "4xl": "calc(var(--radius) + 12px)",
      },
      
      // Fluid spacing system
      spacing: {
        "xs": "clamp(0.25rem, 1vw, 0.5rem)",
        "sm": "clamp(0.5rem, 2vw, 0.75rem)",
        "md": "clamp(1rem, 3vw, 1.5rem)",
        "lg": "clamp(1.5rem, 4vw, 2.5rem)",
        "xl": "clamp(2.5rem, 6vw, 4rem)",
        "2xl": "clamp(4rem, 8vw, 6rem)",
        "3xl": "clamp(6rem, 12vw, 10rem)",
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      
      // Enhanced typography system
      fontFamily: {
        sans: ["Inter Variable", "Inter", "system-ui", "sans-serif"],
        display: ["Satoshi Variable", "Satoshi", "Inter Variable", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono Variable", "JetBrains Mono", "Consolas", "monospace"],
      },
      
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "xs": ["0.75rem", { lineHeight: "1rem" }],
        "sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "base": ["1rem", { lineHeight: "1.5rem" }],
        "lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1.1" }],
        "6xl": ["3.75rem", { lineHeight: "1.1" }],
        "7xl": ["4.5rem", { lineHeight: "1.1" }],
        "8xl": ["6rem", { lineHeight: "1.1" }],
        "9xl": ["8rem", { lineHeight: "1.1" }],
        
        // Fluid typography
        "display-xl": ["clamp(2.5rem, 8vw, 4.5rem)", { lineHeight: "1.1", fontWeight: "800" }],
        "display-l": ["clamp(2rem, 6vw, 3.5rem)", { lineHeight: "1.15", fontWeight: "700" }],
        "display-m": ["clamp(1.75rem, 5vw, 2.5rem)", { lineHeight: "1.2", fontWeight: "600" }],
        "heading-l": ["clamp(1.5rem, 4vw, 2rem)", { lineHeight: "1.25", fontWeight: "600" }],
        "heading-m": ["clamp(1.25rem, 3vw, 1.5rem)", { lineHeight: "1.3", fontWeight: "500" }],
        "body-l": ["clamp(1.125rem, 2vw, 1.25rem)", { lineHeight: "1.5", fontWeight: "400" }],
        "body-m": ["clamp(1rem, 1.5vw, 1.125rem)", { lineHeight: "1.5", fontWeight: "400" }],
        "body-s": ["clamp(0.875rem, 1vw, 1rem)", { lineHeight: "1.4", fontWeight: "400" }],
      },
      
      // Enhanced shadow system
      boxShadow: {
        "xs": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "sm": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        "inner": "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        "inner-lg": "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        
        // Premium shadow effects
        "glow": "0 0 20px rgb(79 124 255 / 0.3)",
        "glow-lg": "0 0 40px rgb(79 124 255 / 0.2)",
        "glow-neural": "0 4px 20px rgb(79 124 255 / 0.3), 0 0 0 1px rgb(79 124 255 / 0.1)",
        "glow-quantum": "0 4px 20px rgb(0 212 255 / 0.3), 0 0 0 1px rgb(0 212 255 / 0.1)",
        "glow-trust": "0 4px 20px rgb(0 200 150 / 0.3), 0 0 0 1px rgb(0 200 150 / 0.1)",
        "glow-plasma": "0 4px 20px rgb(139 92 246 / 0.3), 0 0 0 1px rgb(139 92 246 / 0.1)",
        
        // Glassmorphism shadows
        "glass": "0 8px 32px rgba(0, 0, 0, 0.1)",
        "glass-lg": "0 12px 40px rgba(0, 0, 0, 0.15)",
        "glass-xl": "0 16px 48px rgba(0, 0, 0, 0.2)",
      },
      
      // Enhanced backdrop blur
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
      },
      
      // Advanced keyframe animations
      keyframes: {
        // Existing animations
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        
        // Enhanced entrance animations
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        
        // Premium effect animations
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(79, 124, 255, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(79, 124, 255, 0.6)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "particle-float": {
          "0%": { transform: "translateY(0px) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-100px) rotate(360deg)", opacity: "0" },
        },
        
        // AI processing animations
        "ai-thinking": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "neural-pulse": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      
      // Enhanced animation utilities
      animation: {
        // Existing animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        
        // Entrance animations
        "fade-in": "fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-left": "slide-in-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-right": "slide-in-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-up": "slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scale-in 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        
        // Premium effects
        "shimmer": "shimmer 2s linear infinite",
        "gradient-shift": "gradient-shift 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "particle-float": "particle-float 3s linear infinite",
        
        // AI animations
        "ai-thinking": "ai-thinking 1.5s ease-in-out infinite",
        "neural-pulse": "neural-pulse 2s ease-in-out infinite",
      },
      
      // Enhanced transition timing functions
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "smooth": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "premium": "cubic-bezier(0.4, 0, 0.2, 1)",
        "elastic": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-in-expo": "cubic-bezier(0.7, 0, 0.84, 0)",
      },
      
      // Enhanced background images
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-neural": "linear-gradient(135deg, oklch(0.65 0.15 250), oklch(0.60 0.18 300))",
        "gradient-quantum": "linear-gradient(135deg, oklch(0.75 0.12 200), oklch(0.65 0.15 250))",
        "gradient-trust": "linear-gradient(135deg, oklch(0.70 0.13 150), oklch(0.75 0.12 200))",
        "gradient-plasma": "linear-gradient(135deg, oklch(0.60 0.18 300), oklch(0.65 0.15 250))",
        "shimmer": "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        "glass": "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
      },
      
      // Enhanced max widths
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
        "10xl": "104rem",
        "container": "1400px",
      },
      
      // Enhanced aspect ratios
      aspectRatio: {
        "video": "16 / 9",
        "square": "1 / 1",
        "portrait": "3 / 4",
        "landscape": "4 / 3",
        "golden": "1.618 / 1",
        "card": "5 / 4",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Add container queries plugin if available
    // require("@tailwindcss/container-queries"),
  ],
} satisfies Config;

export default config;
