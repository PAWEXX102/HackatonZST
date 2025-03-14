import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#FFFFFF",
          foreground: "#60a5fa",
        },
        secondary: {
          DEFAULT: "#60a5fa",
          foreground: "#f87171",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;