import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        background: "var(--background)",
        "card-bg": "var(--card-bg)",
        muted: "var(--muted)",
        divider: "var(--divider)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
      },
      maxWidth: {
        container: "var(--max-width)",
      },
      spacing: {
        nav: "var(--nav-height)",
      },
    },
  },
  plugins: [],
};

export default config;
