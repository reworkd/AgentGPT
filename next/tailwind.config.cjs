/** @type {import("tailwindcss").Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        screens: {
            "xs": "300px",
            "xmd": "850px",
            "sm-h": { "raw": "(min-height: 700px)" },
            "md-h": { "raw": "(min-height: 800px)" },
            "lg-h": { "raw": "(min-height: 1000px)" },

            ...defaultTheme.screens
        },
        extend: {
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray.900'),  // Change color as per your need
                        a: {
                            color: theme('colors.blue.500'),  // Change color as per your need
                            '&:hover': {
                                color: theme('colors.blue.600'),  // Change color as per your need
                            },
                        },
                        'h1,h2,h3,h4': {
                            color: theme('colors.white'),  // This is where you change your heading color
                        },
                        'b,strong': {
                            color: theme('colors.gray.500'),  // This is where you change your bold text color
                        },
                    },
                },
            }),
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))', // Add bg-gradient-radial for radial gradients
            },
            boxShadow: {
                "xs": "0px 0px 0px 0.75px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.05)"
            },
            fontFamily: {
                inter: ["Inter", ...defaultTheme.fontFamily.sans]
            },

            colors: {
                blue: {
                    base: {
                        dark: "hsl(199, 89%, 48%)",
                        light: "hsl(199, 89%, 48%)",
                    },
                    hover: {
                        dark: "hsl(199, 80%, 30%)",
                        light: "hsl(199, 90%, 40%)",
                    },
                    focusVisible: {
                        dark: "hsl(208, 79%, 51%)",
                        light: "hsl(208, 79%, 55%)",
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
                        dark: "hsl(39, 85%, 30%)",
                        light: "hsl(45, 85%, 35%)",
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
                        dark: "hsl(3, 85%, 40%)",
                        light: "hsl(3, 85%, 35%)",
                    }
                },
                green: {
                    base: {
                        dark: "hsl(143, 71%, 45%)",
                        light: "hsl(143, 71%, 40%)",
                    },
                    hover: {
                        dark: "hsl(143, 65%, 40%)",
                        light: "hsl(143, 71%, 33%)",
                    },
                    focusVisible: {
                        dark: "hsl(143, 65%, 35%)",
                        light: "hsl(143, 71%, 30%)",
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
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require("tailwindcss-radix"),
    ]
};
