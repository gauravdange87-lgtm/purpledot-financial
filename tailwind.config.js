/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          400: '#b06ecf',
          500: '#9B4DCA',
          600: '#7B2D8B',
          700: '#5f1f6d',
          900: '#2d0d40',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
