/** @type {import("tailwindcss").Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      "xs": "300px",

      "sm-h": { "raw": "(min-height: 700px)" },
      "md-h": { "raw": "(min-height: 900px)" },
      "lg-h": { "raw": "(min-height: 1000px)" },

      ...defaultTheme.screens
    },
    extend: {}
  },
  plugins: []
};
