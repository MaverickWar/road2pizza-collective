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
        DEFAULT: "var(--container-padding-DEFAULT)",
        sm: "var(--container-padding-sm)",
        lg: "var(--container-padding-lg)",
        xl: "var(--container-padding-xl)",
        "2xl": "var(--container-padding-2xl)",
      },
      screens: {
        "2xl": "var(--screen-2xl)",
      },
    },
    extend: {
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