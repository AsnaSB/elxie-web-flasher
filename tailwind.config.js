/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        elxie: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Primary vibrant cyber cyan
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        slate: {
          850: '#151e2e',
          900: '#0f172a',
          950: '#090d16',
        },
        neon: {
          teal: '#00f5d4',
          cyan: '#00bbf9',
          amber: '#fee440',
          rose: '#f15bb5',
          purple: '#9b5de5',
          emerald: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'scanline': 'scanline 6s linear infinite',
        'glint': 'glint 2s ease-in-out infinite',
        'blink': 'blink 4s infinite',
        'spin-slow': 'spin 12s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        blink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.1)' }
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(14, 165, 233, 0.35)',
        'glow-teal': '0 0 25px -5px rgba(0, 245, 212, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'oled': 'inset 0 2px 10px rgba(0,0,0,0.8), 0 0 15px rgba(0, 245, 212, 0.15)'
      }
    },
  },
  plugins: [],
}
