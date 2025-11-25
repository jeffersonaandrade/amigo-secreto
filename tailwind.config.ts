import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "christmas-red": "#c41e3a",
        "christmas-red-dark": "#8b0000",
        "christmas-green": "#165b33",
        "christmas-green-light": "#2d8659",
        "christmas-gold": "#d4af37",
        "christmas-gold-light": "#ffd700",
        background: "#fef5f0",
        foreground: "#2c1810",
        muted: "#e8d5c4",
        "muted-foreground": "#6b5d52",
        border: "#d4c4b0",
        // Mantendo compatibilidade com shadcn/ui
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#c41e3a",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#165b33",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#c41e3a",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#e8d5c4",
          foreground: "#2c1810",
        },
      },
      fontFamily: {
        christmas: ["var(--font-christmas)", "cursive"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;

