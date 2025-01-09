import type { Config } from "tailwindcss";

export default {
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
        background: {
          DEFAULT: "#F3F3F3",
          secondary: "#EAEAEA",
        },
        primary: {
          DEFAULT: "#F97316",
          hover: "#EA580C",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFE4E7",
          hover: "#FFD1D6",
          foreground: "#2D2B2F",
        },
        accent: {
          DEFAULT: "#FEC6A1",
          hover: "#FEB088",
          foreground: "#2D2B2F",
        },
        highlight: {
          DEFAULT: "#FEB088",
          hover: "#FEA575",
          foreground: "#2D2B2F",
        },
        textLight: "#2D2B2F",
        card: {
          DEFAULT: "#FFFFFF",
          hover: "#F8F8F8",
        },
        switch: {
          DEFAULT: "#E2E2E2",
          active: "#FEB088",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;