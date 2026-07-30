/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette orientée trading / finance
        trade: {
          bg: '#0b0f19',         // Fond principal noir profond
          surface: '#111827',    // Surfaces (header, cartes)
          elevated: '#1f2937',   // Éléments surélevés
          border: '#374151',     // Bordures discrètes
          text: '#e5e7eb',       // Texte principal
          muted: '#9ca3af',      // Texte secondaire
          accent: '#3b82f6',     // Bleu accent
          up: '#10b981',         // Hausses
          down: '#ef4444',       // Baisses
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
