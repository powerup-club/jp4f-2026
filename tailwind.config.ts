import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-teko)", "sans-serif"],
        body: ["var(--font-rajdhani)", "sans-serif"]
      },
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        panel: "var(--panel)",
        edge: "var(--edge)",
        accent: "var(--accent)",
        accent2: "var(--accent2)",
        signal: "var(--signal)"
      },
      boxShadow: {
        halo: "0 14px 40px rgba(249, 115, 22, 0.28)",
        card: "0 20px 44px rgba(31, 41, 55, 0.18)"
      },
      backgroundImage: {
        "mesh-dark":
          "radial-gradient(circle at 14% -4%, rgba(139, 92, 246, 0.3), transparent 34%), radial-gradient(circle at 92% 0%, rgba(249, 115, 22, 0.2), transparent 35%), linear-gradient(160deg, #101827 0%, #17223a 52%, #1f2937 100%)",
        "mesh-light":
          "radial-gradient(circle at 14% -4%, rgba(139, 92, 246, 0.16), transparent 34%), radial-gradient(circle at 92% 0%, rgba(249, 115, 22, 0.14), transparent 35%), linear-gradient(160deg, #f8fafc 0%, #f1f3f7 52%, #eef2f6 100%)"
      }
    }
  },
  plugins: []
};

export default config;
