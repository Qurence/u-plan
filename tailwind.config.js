/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#02315E",
          accent: "#00457E",
          secondary: "#2F70AF",
          soft: "#B9848C",
          ui: "#806491",
        },
        background: "#ffffff",
        foreground: "#171717",
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 24px 0 rgba(32, 32, 64, 0.08)',
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}; 