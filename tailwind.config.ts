import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-barlow)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"]
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
        halo: "0 16px 38px rgba(232, 134, 10, 0.28)",
        card: "0 18px 36px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        "mesh-dark":
          "radial-gradient(circle at 18% 6%, rgba(0, 194, 178, 0.12), transparent 38%), radial-gradient(circle at 92% -6%, rgba(232, 134, 10, 0.14), transparent 36%), linear-gradient(180deg, #1a1a1a 0%, #151515 55%, #121212 100%)",
        "mesh-light":
          "radial-gradient(circle at 18% 6%, rgba(0, 194, 178, 0.08), transparent 38%), radial-gradient(circle at 92% -6%, rgba(232, 134, 10, 0.08), transparent 36%), linear-gradient(180deg, #262626 0%, #1c1c1c 55%, #141414 100%)"
      }
    }
  },
  plugins: []
};

export default config;
