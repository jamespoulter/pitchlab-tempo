import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-montserrat)", "var(--font-work-sans)"],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.125rem' }],    // 12px with 1.5 line height
        sm: ['0.875rem', { lineHeight: '1.313rem' }],   // 14px with 1.5 line height
        base: ['1rem', { lineHeight: '1.5rem' }],       // 16px with 1.5 line height
        lg: ['1.2rem', { lineHeight: '1.8rem' }],       // 19.2px with 1.5 line height
        xl: ['1.44rem', { lineHeight: '2.16rem' }],     // 23.04px with 1.5 line height
        '2xl': ['1.728rem', { lineHeight: '2.592rem' }], // 27.65px with 1.5 line height
        '3xl': ['2.074rem', { lineHeight: '3.111rem' }], // 33.18px with 1.5 line height
        '4xl': ['2.488rem', { lineHeight: '3.732rem' }], // 39.81px with 1.5 line height
      },
      letterSpacing: {
        tighter: '-0.01em',
        normal: '0em',
      },
      colors: {
        // Knicks-inspired color palette
        "knicks-blue": {
          DEFAULT: "#006BB6",
          dark: "#005A9C",
          light: "#1A7DC9",
        },
        "knicks-orange": {
          DEFAULT: "#F58426",
          dark: "#E06C0F",
          light: "#FF9B4D",
        },
        "silver": {
          DEFAULT: "#BEC0C2",
          dark: "#A3A5A7",
          light: "#D9DADC",
        },
        "midnight-blue": "#00487C",
        "navy": "#003366",
        "light-gray": "#E5E7EB",
        "charcoal": "#2C2D2F",
        "off-white": "#F8F9FA",
        
        // System colors
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 8px rgba(0,0,0,0.08)',
        'dropdown': '0 2px 8px rgba(0,0,0,0.08)',
        'button': '0 1px 2px rgba(0,0,0,0.05)',
      },
      spacing: {
        '2': '0.5rem',   // 8px
        '4': '1rem',     // 16px
        '6': '1.5rem',   // 24px
        '8': '2rem',     // 32px
        '10': '2.5rem',  // 40px
        '12': '3rem',    // 48px
      },
      transitionDuration: {
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
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
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-in-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        "slide-in-left": "slide-in-left 0.5s ease-out forwards",
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000) forwards",
      },
      backgroundImage: {
        'gradient-header': 'linear-gradient(to right, #006BB6, #00487C)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
