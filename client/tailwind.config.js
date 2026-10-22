/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'emerald-ink': {
          700: '#0F5238',
          800: '#0B3D2A',
          900: '#072A1D',
          950: '#04140E',
        },
        emerald: {
          50: '#F0FBF6',
          100: '#D5F4E6',
          200: '#ADEACB',
          300: '#7FDDB8',
          400: '#3CC391',
          500: '#1AA373',
          600: '#12805A',
          700: '#0F5238',
          800: '#0B3D2A',
          900: '#072A1D',
          950: '#04140E',
        },
        sage: {
          50: '#F4F8F5',
          100: '#E6EFE9',
          200: '#CFE0D4',
          300: '#AFC9B6',
          400: '#92B39B',
          500: '#7C9C86',
          600: '#64836D',
          700: '#4D6855',
        },
        stone: {
          50: '#FAFAF8',
          100: '#F3F3EF',
          200: '#E7E7E1',
          300: '#D5D5CD',
          400: '#A3A39A',
          500: '#7B7B72',
          600: '#5C5C55',
          700: '#42423C',
          800: '#2A2A26',
          900: '#1C1C19',
          950: '#11110F',
        },
        amber: {
          400: '#F5B83D',
          500: '#E39F13',
          600: '#C2830B',
        },
        rose: {
          500: '#D6455D',
          600: '#BF354C',
        },
        sky: {
          500: '#3B82C4',
          600: '#2C6DA8',
        },
        gold: {
          DEFAULT: '#C9A24B',
          light: '#E2BF6D',
          dark: '#A37F2F',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'card': '20px',
        'panel': '14px',
        'control': '10px',
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px rgba(4, 20, 14, 0.04), 0 8px 24px -4px rgba(4, 20, 14, 0.06)',
        'lift': '0 4px 6px -1px rgba(4, 20, 14, 0.05), 0 16px 32px -4px rgba(4, 20, 14, 0.12)',
        'float': '0 24px 48px -12px rgba(4, 20, 14, 0.22)',
        'glow-emerald': '0 0 24px -4px rgba(26, 163, 115, 0.40)',
        'glow-gold': '0 0 20px -3px rgba(201, 162, 75, 0.35)',
        'inner-highlight': 'inset 0 1px 0 rgba(255, 255, 255, 0.60)',
        'inner-dark-highlight': 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.4' },
          '100%': { transform: 'scale(0.95)', opacity: '1' },
        },
        'grow': {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
