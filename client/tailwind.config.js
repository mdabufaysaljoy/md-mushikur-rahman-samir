/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#05060f', 900: '#080a18', 800: '#0d1022', 700: '#141833' },
        brand: { 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5' },
        neon: { 400: '#22d3ee', 500: '#06b6d4' },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        shimmer: { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
      },
    },
  },
  plugins: [],
};
