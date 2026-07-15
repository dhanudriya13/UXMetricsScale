/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // slate-900
        surface: '#1e293b', // slate-800
        border: '#334155', // slate-700
        text: '#f8fafc', // slate-50
        textMuted: '#94a3b8', // slate-400
        primary: '#3b82f6', // blue-500
        success: '#22c55e', // green-500
        warning: '#eab308', // yellow-500
        danger: '#ef4444', // red-500
      }
    },
  },
  plugins: [],
}
