import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        ink: "#17251f",
        cream: "#6e7cf6",
        paper: "#fffdf7",
        mint: "#6ee7c1",
        lavender: "#aeb7ff",
        coral: "#ff9e9e",
        sun: "#ffd95a",
      },
      boxShadow: {
        card: "4px 5px 0 #17251f",
        "card-lg": "6px 6px 0 #17251f",
        "card-xl": "8px 8px 0 #17251f",
      },
    },
  },
  plugins: [],
} satisfies Config;
