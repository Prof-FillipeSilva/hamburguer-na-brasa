import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#4A4E69",
        input: "#2B2D42",
        ring: "#F4A261",
        background: "#1e0f0f",
        foreground: "#f9dcda",
        primary: {
          DEFAULT: "#ffb3b1",
          foreground: "#680011",
        },
        secondary: {
          DEFAULT: "#c4c4df",
          foreground: "#2d2f44",
        },
        destructive: {
          DEFAULT: "#ffb4ab",
          foreground: "#690005",
        },
        muted: {
          DEFAULT: "#271717",
          foreground: "#e4bebc",
        },
        accent: {
          DEFAULT: "#2c1b1b",
          foreground: "#f9dcda",
        },
        card: {
          DEFAULT: "#2B2D42",
          foreground: "#f9dcda",
        },
        cta: {
          DEFAULT: "#F4A261",
          foreground: "#180a0a",
        },
        "on-surface": "#f9dcda",
        "surface-container": "#2c1b1b",
        "flame-orange": "#F4A261",
        "ember-red": "#E84450",
        "ember-red-deep": "#C6283A",
      },
      fontFamily: {
        heading: ["Oswald", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.75rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
