
import { type Config } from "tailwindcss";

export default {
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
      colors: {
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
        // Bot colors for the Split or Steal game
        "bot-red": "#F87171",
        "bot-green": "#4ADE80",
        "bot-blue": "#60A5FA",
        "bot-yellow": "#FBBF24",
        "bot-purple": "#9b87f5",
        "split": "#4ADE80",
        "steal": "#F87171",
        "neutral": "#8E9196",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "slide-up": {
          "0%": { 
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": { 
            opacity: "1", 
            transform: "translateY(0)" 
          },
        },
        "bounce-in": {
          "0%": { 
            opacity: "0",
            transform: "scale(0.95)"
          },
          "70%": { 
            opacity: "1",
            transform: "scale(1.05)"
          },
          "100%": { 
            transform: "scale(1)"
          },
        },
        "pulse-split": {
          "0%, 100%": { color: "hsl(var(--foreground))" },
          "50%": { color: "rgb(74 222 128)" },
        },
        "pulse-steal": {
          "0%, 100%": { color: "hsl(var(--foreground))" },
          "50%": { color: "rgb(248 113 113)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "bounce-in": "bounce-in 0.5s ease-out",
        "pulse-split": "pulse-split 2s infinite",
        "pulse-steal": "pulse-steal 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
