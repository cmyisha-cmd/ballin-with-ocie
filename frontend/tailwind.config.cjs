/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nbaPurple: '#6E2CF6',
        nbaDark: '#0A0A0A',
        nbaAccent: '#9B87F5'
      }
    }
  },
  plugins: []
}
