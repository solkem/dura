/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                // Dura Primary Theme (Warm Amber/Stone - Knowledge Granary)
                dura: {
                    50: '#fefdfb',
                    100: '#fdfaf5',
                    200: '#faf0e4',
                    300: '#f5e1c8',
                    400: '#f59e0b',   // amber-500 accent
                    500: '#b45309',   // amber-600 primary
                    600: '#92400e',   // amber-700 dark
                    700: '#78350f',
                    800: '#451a03',
                    900: '#1c1917',   // stone-900 background
                    950: '#0c0a09',   // stone-950 deep
                },
                // Content type colors
                concept: '#0ea5e9',       // sky-500
                protocol: '#8b5cf6',      // violet-500
                implementation: '#10b981', // emerald-500
                'case-study': '#f97316',  // orange-500
                research: '#ec4899',      // pink-500
                // Project colors (existing - kept for continuity)
                edgechain: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                    950: '#022c22'
                },
                msingi: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                    950: '#451a03'
                },
                ndani: {
                    50: '#ecfeff',
                    100: '#cffafe',
                    200: '#a5f3fc',
                    300: '#67e8f9',
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                    700: '#0e7490',
                    800: '#155e75',
                    900: '#164e63',
                    950: '#083344'
                }
            }
        }
    },
    plugins: []
};
