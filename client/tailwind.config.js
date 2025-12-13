/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primavera-gold': '#D4A5A5', // Palo de Rosa (Dusty Rose)
                'primavera-black': '#000000', // Deep Black
                'primavera-white': '#FFFFFF', // Pure White
                'primavera-gray': '#F5F5F5', // Light Gray for backgrounds
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            }
        },
    },
    plugins: [],
}
