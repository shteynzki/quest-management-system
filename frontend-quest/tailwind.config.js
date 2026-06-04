/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blood: '#8a0303',
        darkblood: '#4a0000',
        void: '#070707', // Глубокий черный фон
        surface: '#141414', // Темно-серый для карточек (вместо белого!)
        surfaceHover: '#1f1f1f', // Чуть светлее для наведения
        textPrimary: '#e5e5e5', // Комфортный для глаз белый/серый
        textMuted: '#888888', // Для второстепенного текста
        wonderTeal: '#5bc0be', 
        wonderYellow: '#f3c623'
      },
      fontFamily: {
        horror: ['"Nosifer"', 'cursive'],
        sans: ['"Oswald"', 'sans-serif'],
      },
      animation: {
        glitch: 'glitch 1s linear infinite',
        pulseSlow: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glitch: {
          '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
          '62%': { transform: 'translate(0,0) skew(5deg)' },
        }
      }
    },
  },
  plugins: [],
}