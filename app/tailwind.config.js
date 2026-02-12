/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                momentum: {
                    deep: "#050B18",
                    blue: "#1152d4",
                    gold: "#D4AF37",
                    accent: "#3AB0FF",
                    glass: "rgba(255, 255, 255, 0.05)",
                    border: "rgba(255, 255, 255, 0.1)",
                },
            },
            fontFamily: {
                sans: ["Inter", "Outfit", "system-ui", "sans-serif"],
            },
            backgroundImage: {
                'gradient-premium': 'linear-gradient(135deg, #050B18 0%, #0A192F 100%)',
                'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F1D279 100%)',
            }
        },
    },
    plugins: [],
}
