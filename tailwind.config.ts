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
        lg: "3rem",
        xl: "4rem",
        "2xl": "5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    extend: {
      spacing: {
        'section': {
          sm: '2rem',    // 32px
          md: '3rem',    // 48px
          lg: '4rem',    // 64px
          xl: '5rem',    // 80px
        },
        'component': {
          sm: '1rem',    // 16px
          md: '1.5rem',  // 24px
          lg: '2rem',    // 32px
        }
      },
      colors: {
        admin: {
          DEFAULT: "rgb(var(--admin-DEFAULT) / <alpha-value>)",
          secondary: "rgb(var(--admin-secondary) / <alpha-value>)",
          accent: "rgb(var(--admin-accent) / <alpha-value>)",
          muted: "rgb(var(--admin-muted) / <alpha-value>)",
          background: "rgb(var(--admin-background) / <alpha-value>)",
          foreground: "rgb(var(--admin-foreground) / <alpha-value>)",
          border: "rgb(var(--admin-border) / <alpha-value>)",
          hover: {
            DEFAULT: "rgb(var(--admin-hover-DEFAULT) / <alpha-value>)",
            secondary: "rgb(var(--admin-hover-secondary) / <alpha-value>)",
          },
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          secondary: "hsl(var(--background-secondary))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          hover: "hsl(var(--secondary-hover))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          hover: "hsl(var(--accent-hover))",
          foreground: "hsl(var(--accent-foreground))",
        },
        highlight: {
          DEFAULT: "hsl(var(--highlight))",
          hover: "hsl(var(--highlight-hover))",
          foreground: "hsl(var(--highlight-foreground))",
        },
        textLight: "hsl(var(--textLight))",
        card: {
          DEFAULT: "hsl(var(--card))",
          hover: "hsl(var(--card-hover))",
        },
        switch: {
          DEFAULT: "hsl(var(--switch))",
          active: "hsl(var(--switch-active))",
        },
      },
      backgroundImage: {
        'admin-gradient': 'linear-gradient(to right, rgb(var(--admin-DEFAULT)), rgb(var(--admin-secondary)))',
        'admin-gradient-hover': 'linear-gradient(to right, rgb(var(--admin-hover-DEFAULT)), rgb(var(--admin-hover-secondary)))',
      },
      boxShadow: {
        'admin': 'var(--shadow-admin)',
        'admin-hover': 'var(--shadow-admin-hover)',
        'admin-card': 'var(--shadow-admin-card)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;