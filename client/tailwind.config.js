/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#FCFBF7",
          secondary: "#F4F2EE",
          card: "#FFFFFF",
        },
        accent: {
          primary: "#7C9082",
          secondary: "#5D6D7E",
          tertiary: "#D4A373",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#666666",
        },
        border: "#E5E5E5",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
