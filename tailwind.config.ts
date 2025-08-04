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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "var(--dark-navy)",
        foreground: "var(--light-gray)",
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
        
        // Neural Network Colors
        neural: {
          50: "hsl(var(--neural-50))",
          100: "hsl(var(--neural-100))",
          200: "hsl(var(--neural-200))",
          300: "hsl(var(--neural-300))",
          400: "hsl(var(--neural-400))",
          500: "hsl(var(--neural-500))",
          600: "hsl(var(--neural-600))",
          700: "hsl(var(--neural-700))",
          800: "hsl(var(--neural-800))",
          900: "hsl(var(--neural-900))",
          950: "hsl(var(--neural-950))",
        },
        quantum: {
          50: "hsl(var(--quantum-50))",
          100: "hsl(var(--quantum-100))",
          200: "hsl(var(--quantum-200))",
          300: "hsl(var(--quantum-300))",
          400: "hsl(var(--quantum-400))",
          500: "hsl(var(--quantum-500))",
          600: "hsl(var(--quantum-600))",
          700: "hsl(var(--quantum-700))",
          800: "hsl(var(--quantum-800))",
          900: "hsl(var(--quantum-900))",
          950: "hsl(var(--quantum-950))",
        },
        trust: {
          50: "hsl(var(--trust-50))",
          100: "hsl(var(--trust-100))",
          200: "hsl(var(--trust-200))",
          300: "hsl(var(--trust-300))",
          400: "hsl(var(--trust-400))",
          500: "hsl(var(--trust-500))",
          600: "hsl(var(--trust-600))",
          700: "hsl(var(--trust-700))",
          800: "hsl(var(--trust-800))",
          900: "hsl(var(--trust-900))",
          950: "hsl(var(--trust-950))",
        },
        plasma: {
          50: "hsl(var(--plasma-50))",
          100: "hsl(var(--plasma-100))",
          200: "hsl(var(--plasma-200))",
          300: "hsl(var(--plasma-300))",
          400: "hsl(var(--plasma-400))",
          500: "hsl(var(--plasma-500))",
          600: "hsl(var(--plasma-600))",
          700: "hsl(var(--plasma-700))",
          800: "hsl(var(--plasma-800))",
          900: "hsl(var(--plasma-900))",
          950: "hsl(var(--plasma-950))",
        },
        
        // Atmospheric Colors
        stratosphere: "hsl(250 100% 98%)",
        cirrus: "hsl(250 100% 92%)",
        nimbus: "hsl(250 100% 65%)",
        storm: "hsl(250 100% 35%)",
        eclipse: "hsl(250 100% 15%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "3xl": "calc(var(--radius) + 8px)",
        "4xl": "calc(var(--radius) + 12px)",
        "5xl": "calc(var(--radius) + 16px)",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
        "3xl": "64px",
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 12px 40px rgba(0, 0, 0, 0.15)',
        'glass-xl': '0 16px 48px rgba(0, 0, 0, 0.2)',
        'neural': '0 0 20px hsl(var(--neural-500) / 0.3)',
        'quantum': '0 0 20px hsl(var(--quantum-500) / 0.3)',
        'trust': '0 0 20px hsl(var(--trust-500) / 0.3)',
        'plasma': '0 0 20px hsl(var(--plasma-500) / 0.3)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
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
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--neural-500) / 0.3)" },
          "50%": { boxShadow: "0 0 30px hsl(var(--neural-500) / 0.5)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.4s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite alternate",
        "float": "float 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
