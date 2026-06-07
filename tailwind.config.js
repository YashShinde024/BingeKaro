/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#080808',
        surface: '#111111',
        card: '#1a1a1a',
        accent: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
        },
        muted: '#A1A1AA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '18': '4.5rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(139,92,246,0.2), 0 0 80px rgba(139,92,246,0.08)',
        'glow-sm': '0 0 24px rgba(139,92,246,0.2), 0 0 48px rgba(139,92,246,0.08)',
        'card': '0 2px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 12px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)',
        'poster': '0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
