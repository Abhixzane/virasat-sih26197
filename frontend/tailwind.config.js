/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          saffron: "#FF671F",
          terracotta: "#C2410C",
          terracottaDark: "#9A3412",
          gold: "#D97706",
          goldLight: "#FDE68A",
          green: "#046A38",
          indigo: "#1E1B4B",
          navy: "#0B192C",
          ivory: "#FAF8F5",
          sand: "#FFFDF9",
          stone: "#1C1917",
          border: "#EFE8DF"
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'heritage': '0 4px 20px -2px rgba(11, 25, 44, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'heritage-hover': '0 12px 30px -4px rgba(11, 25, 44, 0.09), 0 4px 12px -2px rgba(255, 103, 31, 0.08)',
      }
    },
  },
  plugins: [],
}
