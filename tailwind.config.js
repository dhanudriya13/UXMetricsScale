/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff', // white
        surface: '#f8fafc', // slate-50
        border: '#e2e8f0', // slate-200
        text: '#0f172a', // slate-900
        textMuted: '#64748b', // slate-500
        primary: '#a855f7', // purple-500
        success: '#22c55e', // green-500
        warning: '#eab308', // yellow-500
        danger: '#ef4444', // red-500
      }
    },
  },
  plugins: [],
}
