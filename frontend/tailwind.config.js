/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ Your frontend folder structure
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'), // ✅ Make sure this is present
  ],
};
