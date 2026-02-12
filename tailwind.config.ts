import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      colors: {
        accent: {
          DEFAULT: "#00E599",
          muted: "#00CC88",
          subtle: "rgba(0, 229, 153, 0.10)",
        },
        signal: {
          up: "#00E599",
          down: "#FF4D4D",
          neutral: "#7D8694",
        },
        surface: {
          base: "#0F1114",
          raised: "#161A1E",
          overlay: "#1C2127",
          border: "rgba(255, 255, 255, 0.06)",
        },
        ink: {
          DEFAULT: "#D4D9E0",
          strong: "#EDF0F4",
          muted: "#7D8694",
          faint: "#4A5260",
          ghost: "#2A2F38",
        },
      },
      spacing: {
        "4.5": "1.125rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },
      transitionDuration: {
        "150": "150ms",
        "200": "200ms",
        "250": "250ms",
        "300": "300ms",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-expo": "cubic-bezier(0.7, 0, 0.84, 0)",
      },
    },
  },
  plugins: [],
};

export default config;
