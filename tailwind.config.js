/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Obsidian Electric Spec Colors
        obsidian: {
          DEFAULT: "#07090F",
          900: "#07090F",
          800: "#0C0E14",
          700: "#11131A",
          surface: "#111827",
          border: "rgba(187, 216, 255, 0.12)",
        },
        electric: {
          DEFAULT: "#247BFF",
          kinetic: "#247BFF",
          neon: "#398BFF",
          ice: "#BBD8FF",
          primary: "#afc6ff",
          container: "#518dff",
          deep: "#0272e4",
        },
        cloud: {
          canvas: "#F5F7FC",
          card: "#FFFFFF",
          border: "rgba(7, 9, 15, 0.08)",
        },
        // Legacy compatibility mappings
        midnight: "#07090F",
        pure: "#FFFFFF",
        surface: {
          dark: "#111827",
          border: "#202938",
          light: "#F5F7FC",
          lightCard: "#FFFFFF",
          lightBorder: "#E2E8F0",
        },
      },
      fontFamily: {
        headline: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
      boxShadow: {
        'electric-glow': '0 0 28px rgba(36, 123, 255, 0.55)',
        'electric-lg': '0 0 36px rgba(57, 139, 255, 0.75)',
        'card-ambient': '0 4px 20px -2px rgba(7, 9, 15, 0.06)',
        'card-elevated': '0 12px 28px -4px rgba(7, 9, 15, 0.12)',
      },
    },
  },
  plugins: [],
};
