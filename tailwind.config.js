/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green': '#2db56f',
        'green-light': '#45e58d',
        'accent': '#33334f',
        'accent-text': '#fff',
        'link': '#c36',
        'link-hover': '#336',
        'app-bg': '#eafaef',
      },
      fontFamily: {
        'mukta': ['Mukta', 'sans-serif'],
      },
    },
  },
  plugins: [],
}