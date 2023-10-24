/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/*.{html,js,css,ejs}",
    "./views/**/*.ejs",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss'), require('autoprefixer')],
  darkMode:'class'

};

// tailwind.config.js


