/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors will be defined after inspection
        primary: '#f97316',
        secondary: '#0ea5e9',
        accent: '#ec4899',
      },
      spacing: {
        // Spacing scale to be defined after inspection
      },
      borderRadius: {
        // Border radius to be defined after inspection
      },
    },
  },
  plugins: [],
}