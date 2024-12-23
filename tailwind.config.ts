import type { Config } from "tailwindcss";

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
          dark: "#1A1F2C",
        },
        secondary: {
          DEFAULT: "#FFE4E7",
          hover: "#FFD1D6",
          dark: "#2A2F3C",
          foreground: "#2D2B2F",
        },
        accent: {
          DEFAULT: "#E86565",
          hover: "#D45555",
          foreground: "#FFFFFF",
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
          dark: "#222632",
          "dark-hover": "#272B36",
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
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
      },
      backgroundImage: {
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