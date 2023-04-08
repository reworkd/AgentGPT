/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "xs": "350px",
        "sm-h": { "raw": "(min-height: 700px)" },
        "md-h": { "raw": "(min-height: 900px)" },
        "lg-h": { "raw": "(min-height: 1000px)" }
      }
    }
  },
  plugins: []
};
