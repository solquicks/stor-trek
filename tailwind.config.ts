/**
 * Stor Trek — Tailwind v4 Configuration
 *
 * NOTE: Tailwind v4 primarily uses CSS-based configuration via @theme in globals.css.
 * Brand color tokens are defined there via @theme inline {...}.
 * This file extends Tailwind for any JavaScript-based config needs.
 */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple:    "#2D1B3D",
        orange:    "#F59137",
        yellow:    "#FFEF46",
        cream:     "#F8F2E6",
        pink:      "#EB729A",
        storBlack: "#02050A",
        "purple-light": "#3d2654",
        "purple-dark":  "#1a0f26",
      },
      fontFamily: {
        heading: ["Orbitron", "sans-serif"],
        body:    ["Inter", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "bounce-slow": "bounce 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
