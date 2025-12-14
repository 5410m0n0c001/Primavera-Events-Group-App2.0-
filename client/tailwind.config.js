/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            colors: {
                'primavera-gold': '#D4AF37',
                'primavera-black': '#1D1D1F',
                // Apple-inspired System Colors
                'system-gray': '#F5F5F7',
                'system-text': '#1D1D1F',
                'system-blue': '#007AFF',
                'dark-bg': '#1c1c1e',      // Apple Dark Background
                'dark-card': '#2c2c2e',    // Apple Dark Card
                'dark-text': '#e5e5e7',    // Apple Dark Text
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['SF Pro Display', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                'apple': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                'glow': '0 0 15px rgba(212, 175, 55, 0.3)', // Gold glow
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.5s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
