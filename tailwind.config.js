/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./jobwin/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter Tight', 'sans-serif'],
      },
      colors: {
        'neo-bg': '#F5F5F7',
        'neo-black': '#1D1D1F',
        'neo-orange': '#0071E3',
        'neo-orange-hover': '#0077ED',
        'neo-blue': '#2997FF',
        'neo-green': '#34C759',
        'neo-yellow': '#FFCC00',
        'neo-muted': '#86868B',
        'neo-border-soft': '#D2D2D7',
      },
      boxShadow: {
        'neo': '0 2px 12px rgba(0, 0, 0, 0.04)',
        'neo-hover': '0 12px 24px rgba(0, 0, 0, 0.08)',
        'neo-sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'neo-xl': '0 20px 40px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      animation: {
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        'pulse-soft': 'pulse-soft 3s infinite',
        scroll: 'scroll 2s ease-in-out infinite',
        shine: 'shine var(--duration) infinite linear',
        shake: 'shake 2.5s ease-in-out infinite',
        'gradient-flow': 'gradient-flow 4s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(0, 113, 227, 0.4)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(0, 113, 227, 0)' },
        },
        scroll: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' },
        },
        shine: {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          to: { backgroundPosition: '0% 0%' },
        },
        shake: {
          '0%, 20%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '2%': { transform: 'rotate(-15deg) scale(1.1)' },
          '4%': { transform: 'rotate(15deg) scale(1.15)' },
          '6%': { transform: 'rotate(-15deg) scale(1.1)' },
          '8%': { transform: 'rotate(15deg) scale(1.15)' },
          '10%': { transform: 'rotate(-10deg) scale(1.05)' },
          '12%': { transform: 'rotate(10deg) scale(1.05)' },
          '14%': { transform: 'rotate(-5deg) scale(1.02)' },
          '16%': { transform: 'rotate(5deg) scale(1.02)' },
          '18%': { transform: 'rotate(0deg) scale(1)' }
        },
        'gradient-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      }
    }
  },
  plugins: [],
}
