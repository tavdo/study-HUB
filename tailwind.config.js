/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        study: {
          bg: "var(--sh-bg)",
          panel: "var(--sh-panel)",
          surface: "var(--sh-surface)",
          hover: "var(--sh-surface-hover)",
          accent: "var(--sh-accent)",
          "accent-strong": "var(--sh-accent-strong)",
          text: "var(--sh-text)",
          muted: "var(--sh-text-muted)",
          border: "var(--sh-border-color)",
        },
      },
    },
  },
  plugins: [],
};
