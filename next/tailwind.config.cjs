/** @type {import("tailwindcss").Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      "xs": "300px",

      "sm-h": { "raw": "(min-height: 700px)" },
      "md-h": { "raw": "(min-height: 800px)" },
      "lg-h": { "raw": "(min-height: 1000px)" },

      ...defaultTheme.screens
    },
    extend: {
      boxShadow: {
        "3xl": "0 40px 70px -15px rgba(0, 0, 0, 0.40)" // Customize the shadow value according to your preferences.
      },
      colors: {
        primary: {
          main: {
            dark: "#409CFF",
          },
          active: {
            dark: "#267BD5",
          },
          focusVisible: {
            dark: "#6BB3FF",
          },
          hover: {
            dark: "#5c95D1",
          },
        },
        secondary: {
          main: {
            dark: "#ff9f0a",
          },
        },
        shade: {
          100: {
            dark: "#FFFFFF",
          },
          200: {
            dark: "#AEAEB2",
          },
          300: {
            dark: "#7C7C80",
          },
          400: {
            dark: "#545456",
          },
          500: {
            dark: "#444446",
          },
          600: {
            dark: "#363638",
          },
          700: {
            dark: "#242426",
          },
          800: {
            dark: "#18181B",
          }
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require("tailwindcss-radix"),
  ]
};
