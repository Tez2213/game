import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-nunito-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        // Design Brief Color Palette
        cream: "#F7F5F3",
        beige: "#E8DDD4",
        taupe: "#D4C4B0",
        gold: "#B8A082",
        
        // Accent Colors
        mint: "#A8D5A8",
        peach: "#F4C2A1",
        powder: "#B8D4E3",
        rose: "#E8B4B8",
        
        // Animal Colors
        lion: "#F4D03F",
        turtle: "#82C09A",
        rabbit: "#E8B4CB",
        bear: "#C8A882",
        owl: "#A8B8D4",
        
        // Ingredient Colors
        protein: "#E8B4B8",
        carbs: "#F4C2A1",
        fats: "#A8D5A8",
        vitamins: "#D4A8E8",
      },
      animation: {
        'bounce-gentle': 'bounce 2s infinite',
        'pulse-soft': 'pulse 3s infinite',
      },
      boxShadow: {
        'soft': '0px 4px 8px rgba(0,0,0,0.1)',
        'lift': '0px 6px 12px rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [],
} satisfies Config;
