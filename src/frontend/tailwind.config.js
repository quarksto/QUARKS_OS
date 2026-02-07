/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            borderRadius: {
                'md': '6px',
                'pill': '9999px',
                'sm': '4px',
            },
            colors: {
                canvas: '#F1F5F9', // System Background (Slate-100)
                petroleum: {
                    DEFAULT: '#0F4C5C',
                    50: '#f0f6f8',
                    100: '#e0ecef',
                    200: '#c2dbe3',
                    300: '#95c2ce',
                    400: '#60a2b5',
                    500: '#3e879c',
                    600: '#2d6d81',
                    700: '#265869',
                    800: '#155c6e',
                    900: '#0F4C5C',
                    950: '#08323d',
                },
                solar: {
                    DEFAULT: '#F59E0B',
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#F59E0B',
                    600: '#D97706',
                    700: '#b45309',
                }
            },
            fontFamily: {
                "sans": ["Geist", "sans-serif"],
                "display": ["Geist", "sans-serif"], // Adds support for font-display class used in titles
                "mono": ["Geist Mono", "monospace"], // Fixes mono to use the correct font
            }
        },
    },
    plugins: [],
}
