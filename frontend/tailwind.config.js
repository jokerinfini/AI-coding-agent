/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['VT323', 'monospace'],
      },
      colors: {
        'terminal-bg': '#0f1f0f',     // Very dark green background
        'terminal-window-bg': '#1a2e1a', // Dark green for windows
        'terminal-dark': '#0a140a',     // Almost black for borders
        'terminal-accent': '#2f5e2f',  // Medium green for accents
        'terminal-text': '#e9ffe1',     // Bright green text
        'terminal-border': '#0b1a0b',   // Dark border color
      },
      boxShadow: {
        'terminal': '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'terminal-inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
        'terminal-button': '0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      },
      animation: {
        'terminal-glow': 'terminal-glow 2s ease-in-out infinite alternate',
        'cursor-blink': 'cursor-blink 1s infinite',
      },
      keyframes: {
        'terminal-glow': {
          '0%': { 'box-shadow': '0 0 5px rgba(46, 125, 50, 0.3)' },
          '100%': { 'box-shadow': '0 0 20px rgba(46, 125, 50, 0.6)' },
        },
        'cursor-blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      }
    },
  },
  plugins: [],
}
