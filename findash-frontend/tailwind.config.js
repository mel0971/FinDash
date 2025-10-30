/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ✅ IMPORTANT !
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1f2937",
        secondary: "#111827",
        accent: "#3b82f6",
      },
    },
  },
  plugins: [],
}
