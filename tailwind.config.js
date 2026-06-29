/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dpec: {
          blue: '#1E3A5F',
          lightblue: '#2563EB',
          teal: '#0891B2',
          green: '#059669',
          orange: '#EA580C',
          red: '#DC2626',
          yellow: '#D97706',
        }
      }
    },
  },
  plugins: [],
}

