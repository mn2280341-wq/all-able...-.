/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                main: ['Tajawal', 'sans-serif'],
            },
            colors: {
                'sky-blue': 'var(--color-sky-blue)',
                'sky-blue-light': 'var(--color-sky-blue-light)',
                'mint-green': 'var(--color-mint-green)',
                'mint-green-dark': 'var(--color-mint-green-dark)',
                'lavender': 'var(--color-lavender)',
                'purple-light': 'var(--color-purple-light)',
                'warm-beige': 'var(--color-warm-beige)',
                'off-white': 'var(--color-off-white)',
                'text-primary': 'var(--color-text-primary)',
                'text-secondary': 'var(--color-text-secondary)',
                'text-light': 'var(--color-text-light)',
            },
            borderRadius: {
                'sm': 'var(--radius-sm)',
                'md': 'var(--radius-md)',
                'lg': 'var(--radius-lg)',
                'xl': 'var(--radius-xl)',
            },
            boxShadow: {
                'sm': 'var(--shadow-sm)',
                'md': 'var(--shadow-md)',
                'lg': 'var(--shadow-lg)',
            }
        },
    },
    plugins: [],
}
