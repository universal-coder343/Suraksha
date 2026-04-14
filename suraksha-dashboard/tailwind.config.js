/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkNavy: '#0d1b2a',
        policeBlue: '#1b263b',
        policeAccent: '#415a77',
      }
    },
  },
  plugins: [],
}
