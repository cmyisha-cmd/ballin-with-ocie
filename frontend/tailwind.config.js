/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nbaBlack: '#0a0a0a',
        nbaPurple: '#6D28D9',
        nbaPurpleDark: '#4C1D95'
      }
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif']
    }
  },
  plugins: [],
}
