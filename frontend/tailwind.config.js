/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#F8F9FA',
        'app-surface': '#FFFFFF',
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          glow: 'rgba(79, 70, 229, 0.15)',
        },
        accent: {
          DEFAULT: '#0EA5E9',
          glow: 'rgba(14, 165, 233, 0.15)',
        },
        'app-muted': '#64748B',
        glass: {
          border: 'rgba(0, 0, 0, 0.05)',
          background: 'rgba(255, 255, 255, 0.7)',
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow-pulse 2s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: 0.8, filter: 'blur(10px)' },
          '50%': { opacity: 0.4, filter: 'blur(15px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
      boxShadow: {
        'spatial': '0 20px 50px -12px rgba(0, 0, 0, 0.08)',
        'spatial-lg': '0 30px 60px -15px rgba(0, 0, 0, 0.12)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [],
}
