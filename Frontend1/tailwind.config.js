/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 👈 This is the key for v3
  theme: {
    extend: {
      colors: {
        primary: "#6366f1", // Match this to your app's purple color
      },
    },
  },
  plugins: [],
}