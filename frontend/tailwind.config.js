/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8A2BE2",
        dark: "#0d0d0d"
      }
    },
  },
  plugins: [],
}
