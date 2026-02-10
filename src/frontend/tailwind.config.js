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
                'lg': '8px',
            },
            colors: {
                canvas: '#F8FAFC', // System Background (Slate-50)
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
                "sans": ["Geist", "system-ui", "-apple-system", "sans-serif"],
                "display": ["Geist", "system-ui", "-apple-system", "sans-serif"],
                "mono": ["Geist Mono", "ui-monospace", "monospace"],
            }
        },
    },
    plugins: [],
}
