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
          DEFAULT: "var(--admin-DEFAULT)",
          secondary: "var(--admin-secondary)",
          accent: "var(--admin-accent)",
          muted: "var(--admin-muted)",
          background: "var(--admin-background)",
          foreground: "var(--admin-foreground)",
          border: "var(--admin-border)",
          hover: {
            DEFAULT: "var(--admin-hover-DEFAULT)",
            secondary: "var(--admin-hover-secondary)",
          },
        },
        background: {
          DEFAULT: "var(--background)",
          secondary: "var(--background-secondary)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          hover: "var(--secondary-hover)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          foreground: "var(--accent-foreground)",
        },
        highlight: {
          DEFAULT: "var(--highlight)",
          hover: "var(--highlight-hover)",
          foreground: "var(--highlight-foreground)",
        },
        textLight: "var(--textLight)",
        card: {
          DEFAULT: "var(--card)",
          hover: "var(--card-hover)",
        },
        switch: {
          DEFAULT: "var(--switch)",
          active: "var(--switch-active)",
        },
      },
      backgroundImage: {
        'admin-gradient': 'linear-gradient(to right, var(--admin-DEFAULT), var(--admin-secondary))',
        'admin-gradient-hover': 'linear-gradient(to right, var(--admin-hover-DEFAULT), var(--admin-hover-secondary))',
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