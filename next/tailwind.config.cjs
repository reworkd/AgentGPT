/** @type {import("tailwindcss").Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        transparent: "transparent",
        current: "currentColor",
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
                "xs": "0px 0px 0px 0.75px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.05)",
                // light
                "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                "tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                "tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                // dark
                "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                "dark-tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                "dark-tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",

                "depth-1": "0 2px 4px 0 rgba(0, 0, 0, 0.05), 0 0 0 0.75px rgba(0, 0, 0, 0.05), 0 0 12px -2px rgba(0, 0, 0, 0.05)",
                "depth-2": "0 0 0 0.75px rgba(0, 0, 0, 0.05), 0 8px 32px 0 rgba(39, 40, 51, 0.05), 0 4px 16px 0 rgba(39, 40, 51, 0.05)",
                "depth-3": "0 0 0 0.75px rgba(0, 0, 0, 0.05), 0 8px 32px 0 rgba(39, 40, 51, 0.05), 0 4px 16px 0 rgba(39, 40, 51, 0.05), 0 8px 24px -4px rgba(0, 0, 0, 0.20)"
            },
            borderRadius: {
                "tremor-small": "0.375rem",
                "tremor-default": "0.5rem",
                "tremor-full": "9999px",
            },
            fontSize: {
                "tremor-label": ["0.75rem"],
                "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
                "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
                "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
            },
            fontFamily: {
                inter: ["Inter", ...defaultTheme.fontFamily.sans]
            },

            colors: {
                slate: {
                    1: "#FBFCFD",
                    2: "#F8F9FA",
                    3: "#F1F3F5",
                    4: "#ECEEF0",
                    5: "#E6E8EB",
                    6: "#DFE3E6",
                    7: "#D7DBDF",
                    8: "#C1C8CD",
                    9: "#889096",
                    10: "#7E868C",
                    11: "#687076",
                    12: "#11181C",
                },
                // light mode
                tremor: {
                    brand: {
                        faint: "#eff6ff", // blue-50
                        muted: "#bfdbfe", // blue-200
                        subtle: "#60a5fa", // blue-400
                        DEFAULT: "#3b82f6", // blue-500
                        emphasis: "#1d4ed8", // blue-700
                        inverted: "#ffffff", // white
                    },
                    background: {
                        muted: "#f9fafb", // gray-50
                        subtle: "#f3f4f6", // gray-100
                        DEFAULT: "#ffffff", // white
                        emphasis: "#374151", // gray-700
                    },
                    border: {
                        DEFAULT: "#e5e7eb", // gray-200
                    },
                    ring: {
                        DEFAULT: "#e5e7eb", // gray-200
                    },
                    content: {
                        subtle: "#9ca3af", // gray-400
                        DEFAULT: "#6b7280", // gray-500
                        emphasis: "#374151", // gray-700
                        strong: "#111827", // gray-900
                        inverted: "#ffffff", // white
                    },
                },
                // dark mode
                "dark-tremor": {
                    brand: {
                        faint: "#0B1229", // custom
                        muted: "#172554", // blue-950
                        subtle: "#1e40af", // blue-800
                        DEFAULT: "#3b82f6", // blue-500
                        emphasis: "#60a5fa", // blue-400
                        inverted: "#030712", // gray-950
                    },
                    background: {
                        muted: "#131A2B", // custom
                        subtle: "#1f2937", // gray-800
                        DEFAULT: "#111827", // gray-900
                        emphasis: "#d1d5db", // gray-300
                    },
                    border: {
                        DEFAULT: "#1f2937", // gray-800
                    },
                    ring: {
                        DEFAULT: "#1f2937", // gray-800
                    },
                    content: {
                        subtle: "#4b5563", // gray-600
                        DEFAULT: "#6b7280", // gray-600
                        emphasis: "#e5e7eb", // gray-200
                        strong: "#f9fafb", // gray-50
                        inverted: "#000000", // black
                    },
                },
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
    safelist: [
        {
            pattern:
                /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ["hover", "ui-selected"],
        },
        {
            pattern:
                /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ["hover", "ui-selected"],
        },
        {
            pattern:
                /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ["hover", "ui-selected"],
        },
        {
            pattern:
                /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
        {
            pattern:
                /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
        {
            pattern:
                /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
    ],
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require("tailwindcss-radix"),
    ]
};
