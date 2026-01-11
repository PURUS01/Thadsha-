/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                primary: 'var(--primary)',
                secondary: 'var(--secondary)',
                accent: 'var(--accent)',
                text: 'var(--text)',
                muted: 'var(--text-muted)',
            },
            fontFamily: {
                sans: ['Georgia', 'serif'],
                outfit: ['Montserrat', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
