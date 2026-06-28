import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#bcd2ff",
          300: "#8eb4ff",
          400: "#598bff",
          500: "#3563ff",
          600: "#1f43f5",
          700: "#1832e1",
          800: "#1a2cb6",
          900: "#1c2c8f",
        },
        accent: {
          400: "#a855f7",
          500: "#9333ea",
          600: "#7e22ce",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 0%, rgba(53,99,255,0.18), transparent 40%), radial-gradient(circle at 80% 100%, rgba(168,85,247,0.18), transparent 45%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.18)",
        glow: "0 0 24px rgba(99,102,241,0.35)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
