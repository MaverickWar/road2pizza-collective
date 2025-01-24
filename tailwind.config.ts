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
        dashboard: {
          primary: "rgb(var(--dashboard-primary) / <alpha-value>)",
          secondary: "rgb(var(--dashboard-secondary) / <alpha-value>)",
          accent: "rgb(var(--dashboard-accent) / <alpha-value>)",
          muted: "rgb(var(--dashboard-muted) / <alpha-value>)",
          background: "rgb(var(--dashboard-background) / <alpha-value>)",
          foreground: "rgb(var(--dashboard-foreground) / <alpha-value>)",
          border: "rgb(var(--dashboard-border) / <alpha-value>)",
        }
      },
      backgroundImage: {
        'admin-gradient': 'linear-gradient(to right, rgb(var(--admin-DEFAULT)), rgb(var(--admin-secondary)))',
        'admin-gradient-hover': 'linear-gradient(to right, rgb(var(--admin-hover-DEFAULT)), rgb(var(--admin-hover-secondary)))',
      },
      boxShadow: {
        'admin': 'var(--shadow-admin)',
        'admin-hover': 'var(--shadow-admin-hover)',
        'admin-card': 'var(--shadow-admin-card)',
        'dashboard': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'dashboard-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;