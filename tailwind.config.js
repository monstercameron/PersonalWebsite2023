/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/components/*.ejs", "./views/pages/*.ejs"],
  theme: {
    extend: {
      backgroundImage: {
        'url': {},
        'cover': {}
      }
    },
  },
  plugins: [],
};
