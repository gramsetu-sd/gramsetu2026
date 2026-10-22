/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#1b4332', // Deep forest green brand
          900: '#143627',
          950: '#0b2016',
        },
        sage: {
          50: '#f4f9f5',
          100: '#e5f3e9',
          200: '#cbe7d4',
          300: '#a3d4b4',
          400: '#74c69d',
          500: '#52b788',
          600: '#389a6c',
          700: '#2d7a56',
        },
        civic: {
          slate: '#334155',
          charcoal: '#0f172a',
          card: '#ffffff',
          subtle: '#f8fafc',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
