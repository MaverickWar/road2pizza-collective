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
        secondary: {
          DEFAULT: "#FFE4E7",
          hover: "#FFD1D6",
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
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
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
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;