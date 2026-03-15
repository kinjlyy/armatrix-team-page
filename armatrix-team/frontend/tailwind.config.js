/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        obsidian: "#080810",
        void: "#0a0a14",
        "card-bg": "#0f0f1a",
        "card-border": "#1e1e2e",
        aurora: {
          purple: "#8b5cf6",
          orange: "#f97316",
          gold: "#eab308",
          pink: "#ec4899",
          cyan: "#06b6d4",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        pulse_slow: "pulse 4s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "scroll-bounce": "scrollBounce 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        scrollBounce: {
          "0%, 100%": { transform: "translateY(0)", opacity: 0.4 },
          "50%": { transform: "translateY(8px)", opacity: 1 },
        },
      },
      backgroundImage: {
        "shimmer-gradient":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
      },
    },
  },
  plugins: [],
};
