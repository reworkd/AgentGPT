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
        blue: {
          base: {
            dark: "hsl(210, 100%, 52%)",
            light: "hsl(211, 100%, 50%)",
          },
          hover: {
            dark: "hsl(210, 70%, 45%)",
            light: "hsl(211, 100%, 38%)",
          },
          focusVisible: {
            dark: "hsl(210, 100%, 70%)",
            light: "hsl(211, 100%, 65%)",
          },
        },
        amber: {
          base: {
            dark: "hsl(39, 100%, 50%)",
            light: "hsl(45, 100%, 50%)",
          },
          hover: {
            dark: "hsl(39, 100%, 40%)",
            light: "hsl(45, 100%, 45%)",
          },
          focusVisible: {
            dark: "hsl(39, 100%, 60%)",
            light: "hsl(45, 100%, 60%)",
          }
        },
        red: {
          base: {
            dark: "hsl(3, 100%, 61%)",
            light: "hsl(3, 100%, 59%)",
          },
          hover: {
            dark: "hsl(3, 100% 45%)",
            light: "hsl(3, 100%, 40%)",
          },
          focusVisible: {
            dark: "hsl(3, 100%, 70%)",
            light: "hsl(3, 100%, 65%)",
          }
        },
        shade: {
          100: {
            dark: "hsl(0, 0%, 100%)",
            light: "hsl(0, 0%, 0%)",
          },
          200: {
            dark: "hsl(240, 3%, 69%)",
            light: "hsl(240, 2%, 30%)",
          },
          300: {
            dark: "hsl(240, 2%, 49%)",
            light: "hsl(240, 2%, 57%)",
          },
          400: {
            dark: "hsl(240, 1%, 33%)",
            light: "hsl(240, 3%, 69%)",
          },
          500: {
            dark: "hsl(240, 1%, 27%)",
            light: "hsl(240, 5%, 79%)",
          },
          600: {
            dark: "hsl(240, 2%, 22%)",
            light: "hsl(240, 6%, 83%)",
          },
          700: {
            dark: "hsl(240, 3%, 15%)",
            light: "hsl(240, 11%, 91%)",
          },
          800: {
            dark: "hsl(240, 6%, 10%)",
            light: "hsl(240, 24%, 96%)",
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
