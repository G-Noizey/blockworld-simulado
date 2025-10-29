/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'edu-primary': '#3B82F6',
        'edu-secondary': '#10B981',
        'edu-accent': '#F59E0B',
        'edu-warning': '#F59E0B',
        'edu-success': '#10B981',
        'edu-error': '#EF4444',
      },
      fontFamily: {
        'edu': ['Comic Neue', 'cursive'],
        'comic': ['Comic Neue', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      boxShadow: {
        'edu': '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
        'edu-lg': '0 10px 28px 0 rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}