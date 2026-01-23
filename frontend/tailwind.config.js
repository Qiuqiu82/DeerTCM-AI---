/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-emerald': '#059669',
        'secondary-teal': '#0ea5a4',
        'accent-orange': '#f97316',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
}
