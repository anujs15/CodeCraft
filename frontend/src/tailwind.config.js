/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        dark: {
          100: '#1e293b',
          200: '#172033',
          300: '#131a2b',
          400: '#0f1623',
          500: '#0a0e17',
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'blob': 'blob 7s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'animation-delay-2000': 'animation-delay-2000',
        'animation-delay-4000': 'animation-delay-4000',
      },
      keyframes: {
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        glow: {
          '0%': {
            boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)'
          },
          '100%': {
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)'
          }
        },
        slideIn: {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: 1,
          },
        },
        fadeIn: {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        breathe: {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.8)',
          },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '3rem',
        '5xl': '4rem',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 25px rgba(59, 130, 246, 0.6)',
        'glow-yellow': '0 0 15px rgba(252, 211, 77, 0.5)',
        'glow-orange': '0 0 15px rgba(251, 146, 60, 0.6)',
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.5)',
        'inner-glow': 'inset 0 0 15px rgba(59, 130, 246, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow-purple-lg': '0 0 30px rgba(139, 92, 246, 0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1))',
        'grid-pattern': 'radial-gradient(circle, #ffffff11 1px, transparent 1px)',
        'noise-pattern': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        codecrafttheme: {
          "primary": "#0ea5e9",
          "secondary": "#8b5cf6",
          "accent": "#4ade80",
          "neutral": "#1e293b",
          "base-100": "#0f1623",
          "info": "#3abff8",
          "success": "#22c55e",
          "warning": "#fbbd23",
          "error": "#f87171",
        },
      },
    ],
  },
}
