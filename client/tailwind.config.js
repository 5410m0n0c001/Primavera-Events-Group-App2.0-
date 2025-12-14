/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primavera-gold': '#D4AF37', // More elegant gold
                'system-blue': '#0071e3',
                'system-gray': '#F5F5F7',
                'system-text': '#1D1D1F',
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                display: ['SF Pro Display', 'Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'], // Keep strictly for headings if needed
            },
            boxShadow: {
                'apple': '0 4px 24px rgba(0,0,0,0.06)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            }
        },
    },
    plugins: [],
}
