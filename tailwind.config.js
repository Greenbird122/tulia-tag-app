/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',   // Keep this
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e3f2fd',
          100: '#bbdefb',
          500: '#1e88e5',
          600: '#1976d2',
          900: '#004d40',
        }
      }
    },
  },
  plugins: [],
}