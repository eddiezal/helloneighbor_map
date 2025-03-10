/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2A5D3C',
          light: '#e8f4ea',
        },
        secondary: '#FFDE7D',
      },
    },
  },
  plugins: [],
}
