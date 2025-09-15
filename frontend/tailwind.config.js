export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nbaPurple: '#6E34B8',
        nbaDark: '#0B0B0F'
      },
      boxShadow: {
        glow: '0 8px 30px rgba(110,52,184,0.35)'
      }
    }
  },
  plugins: [],
};
