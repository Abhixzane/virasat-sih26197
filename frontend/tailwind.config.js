/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Section 4.1 Grandmaster Indian Tricolor Design Tokens
        saffron: {
          50: '#FFF6EC',
          100: '#FFE9CC',
          300: '#FFC77D',
          500: '#FF9933',
          700: '#CC7A29',
          900: '#663D14',
        },
        indiaGreen: {
          50: '#EAF6EC',
          100: '#CDEAD2',
          300: '#5FBE72',
          500: '#138808',
          700: '#0F6D07',
          900: '#083E04',
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FAF9F6',
          200: '#F2F0EA',
        },
        charcoal: {
          100: '#EDEDED',
          400: '#6B6B6B',
          700: '#2B2B2B',
          900: '#161616',
        },
        // Backward-compatible aliases mapped to tricolor tokens
        heritage: {
          saffron: "#FF9933",
          terracotta: "#CC7A29",
          terracottaDark: "#663D14",
          gold: "#FF9933",
          goldLight: "#FFE9CC",
          green: "#138808",
          indigo: "#2B2B2B",
          navy: "#161616",
          ivory: "#FAF9F6",
          sand: "#FFFFFF",
          stone: "#161616",
          border: "#EDEDED"
        }
      },
      fontFamily: {
        serif: ['Arial', 'Helvetica', 'sans-serif'],
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        'heritage': '0 4px 20px -2px rgba(22, 22, 22, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'heritage-hover': '0 12px 30px -4px rgba(22, 22, 22, 0.09), 0 4px 12px -2px rgba(255, 153, 51, 0.08)',
      }
    },
  },
  plugins: [],
}
