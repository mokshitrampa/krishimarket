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
          50: '#f2f8f4',
          100: '#e1efe6',
          200: '#c4dfcf',
          300: '#9ac7ae',
          400: '#6ca98a',
          500: '#488c6c',
          600: '#357155',
          700: '#2c5b45',
          800: '#254939',
          900: '#1b382c',
          950: '#0d1f18',
        },
        harvest: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        earth: {
          50: '#fbf9f6',
          100: '#f5f0e9',
          200: '#ebdccf',
          300: '#dec2ab',
          400: '#cda485',
          500: '#b88965',
          600: '#a37152',
          700: '#835741',
          800: '#6c4636',
          900: '#583a2d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}