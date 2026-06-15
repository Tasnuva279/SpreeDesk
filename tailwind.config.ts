import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand
        midnight: "#002B45",
        spree: {
          DEFAULT: "#1ABC9C",
          hover: "#17A58B",
          subtle: "#E6F7F4",
        },
        ice: "#F9FAFB",
        // Neutrals (11.2)
        ink: {
          900: "#111827",
          600: "#475569",
          100: "#F9FAFB",
        },
        ok: "#22C55E",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        head: ["Poppins", "Inter", "sans-serif"],
      },
      fontSize: {
        // 11.3 type scale
        h1: ["36px", { lineHeight: "42px", fontWeight: "700" }],
        h2: ["28px", { lineHeight: "36px", fontWeight: "700" }],
        h3: ["22px", { lineHeight: "32px", fontWeight: "600" }],
        body: ["16px", { lineHeight: "26px" }],
        small: ["14px", { lineHeight: "22px" }],
      },
      borderRadius: {
        lg: "12px",
        "2xl": "24px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,43,69,0.06)",
        md: "0 4px 16px rgba(0,43,69,0.08)",
        lg: "0 12px 32px rgba(0,43,69,0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 250ms ease-out both",
        "fade-in": "fade-in 250ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
