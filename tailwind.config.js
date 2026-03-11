/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Ciepłe cienie tła (fantasy – brąz / ciemna ziemia)
        void: {
          950: '#1a1612',
          900: '#242019',
          800: '#2e2820',
          700: '#3d352b',
          600: '#4a4035',
          500: '#5c5042'
        },
        // Zieleń – magia, energia, przyroda
        forest: {
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        // Brąz – drewno, ziemia, ramki
        earth: {
          400: '#a16207',
          500: '#854d0e',
          600: '#713f12',
          700: '#5c3310',
          800: '#4a2910',
          900: '#3d2210'
        },
        // Złoto / mosiądz – skarby
        gold: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309'
        },
        // Akcent „zły” pozostawiony jako ciemna zieleń
        evil: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d'
        }
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Crimson Text', 'Georgia', 'serif']
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite'
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.9', filter: 'brightness(1.08)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        'shimmer': {
          '0%, 100%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      },
      boxShadow: {
        'fantasy': '0 4px 20px -4px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(74, 64, 53, 0.4)',
        'fantasy-glow': '0 0 20px -4px rgba(34, 197, 94, 0.25), 0 0 40px -8px rgba(245, 158, 11, 0.15)',
        'inner-fantasy': 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.2)'
      }
    }
  },
  plugins: []
}
