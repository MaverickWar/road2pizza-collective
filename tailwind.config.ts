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
        // Admin Dashboard Colors
        admin: {
          DEFAULT: "#F97316", // Primary orange - Made more vibrant
          secondary: "#FEC6A1", // Soft orange
          accent: "#FFE4E7", // Light pink
          muted: "#94A3B8", // Slate gray
          background: "#F8FAFC", // Light background
          foreground: "#1E293B", // Dark text
          border: "#E2E8F0", // Border color
          hover: {
            DEFAULT: "#EA580C", // Darker orange
            secondary: "#FEB088", // Darker soft orange
          },
        },
        // Original Site Colors (preserved with enhanced vibrancy)
        background: {
          DEFAULT: "#F3F3F3",
          secondary: "#EAEAEA",
        },
        primary: {
          DEFAULT: "#F97316", // Made more vibrant to match admin theme
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
      // Admin-specific styles
      backgroundImage: {
        'admin-gradient': 'linear-gradient(to right, #F97316, #FEC6A1)',
        'admin-gradient-hover': 'linear-gradient(to right, #EA580C, #FEB088)',
      },
      boxShadow: {
        'admin': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'admin-hover': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'admin-card': '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;