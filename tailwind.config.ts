import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-ibm-plex-mono)", "IBM Plex Mono", "monospace"],
      },
      colors: {
        vamp: {
          orange: "#FF6B35",
          "orange-light": "#FF8F5C",
          "orange-dark": "#E55A28",
          black: "#1A1A1A",
          charcoal: "#2D2D2D",
          grey: {
            dark: "#4A4A4A",
            DEFAULT: "#6B6B6B",
            light: "#9A9A9A",
            lighter: "#CFCFCF",
          },
          cream: "#FAF8F5",
          "warm-white": "#FEFCF9",
        },
        background: "rgb(245, 240, 232)",
        foreground: "#1A1A1A",
        border: "rgba(207, 207, 207, 0.5)",
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(26, 26, 26, 0.05)",
        DEFAULT:
          "0 4px 6px rgba(26, 26, 26, 0.07), 0 2px 4px rgba(26, 26, 26, 0.06)",
        lg: "0 10px 15px rgba(26, 26, 26, 0.1), 0 4px 6px rgba(26, 26, 26, 0.05)",
        bounce:
          "0 20px 25px rgba(26, 26, 26, 0.1), 0 8px 10px rgba(26, 26, 26, 0.04)",
        glow: "0 0 20px rgba(255, 107, 53, 0.3)",
      },
      animation: {
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        in: "animate-in 0.3s ease-out",
      },
      keyframes: {
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(255, 107, 53, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(255, 107, 53, 0.3)" },
        },
        "animate-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
