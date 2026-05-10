import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--bg) / <alpha-value>)",
        foreground: "hsl(var(--text) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        brand: {
          DEFAULT: "hsl(var(--brand) / <alpha-value>)",
          soft: "hsl(var(--brand-soft) / <alpha-value>)",
          deep: "hsl(var(--brand-deep) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          soft: "hsl(var(--accent-soft) / <alpha-value>)",
        },
        success: "hsl(var(--success) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",
        danger: "hsl(var(--danger) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Sora", "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 60px -28px rgba(59, 130, 246, 0.45)",
        soft: "0 20px 40px -28px rgba(15, 23, 42, 0.25)",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top left, rgba(125, 211, 252, 0.32), transparent 36%), radial-gradient(circle at top right, rgba(165, 180, 252, 0.34), transparent 28%), radial-gradient(circle at 20% 80%, rgba(103, 232, 249, 0.24), transparent 20%)",
        "grid-soft":
          "linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "42px 42px",
      },
    },
  },
  plugins: [forms],
};
