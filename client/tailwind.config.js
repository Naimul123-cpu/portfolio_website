/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "var(--bg-base)",
          surface: "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
          card: "var(--bg-card)",
          "card-hover": "var(--bg-card-hover)",
          // Backwards compatibility
          primary: "var(--bg-base)",
          secondary: "var(--bg-surface)",
        },
        accent: {
          violet: "var(--accent-violet)",
          blue: "var(--accent-blue)",
          cyan: "var(--accent-cyan)",
          emerald: "var(--accent-emerald)",
          pink: "var(--accent-pink)",
          amber: "var(--accent-amber)",
          // Backwards compatibility
          primary: "var(--accent-violet)",
          secondary: "var(--accent-cyan)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        border: {
          subtle: "var(--border-subtle)",
          card: "var(--border-card)",
          glow: "var(--border-glow)",
        }
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        'gradient-primary': "var(--gradient-primary)",
        'gradient-secondary': "var(--gradient-secondary)",
        'gradient-tertiary': "var(--gradient-tertiary)",
        'gradient-danger': "var(--gradient-danger)",
        'gradient-warm': "var(--gradient-warm)",
        'gradient-aurora': "var(--gradient-aurora)",
        'text-gradient': "var(--text-gradient)",
      },
      boxShadow: {
        'glow-violet': "var(--glow-violet)",
        'glow-blue': "var(--glow-blue)",
        'glow-cyan': "var(--glow-cyan)",
        'glow-pink': "var(--glow-pink)",
      },
      animation: {
        'drift': 'drift 20s infinite alternate',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'pulse-ring': 'pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(80px, -60px) scale(1.1)' },
          '66%': { transform: 'translate(-40px, 40px) scale(0.95)' },
          '100%': { transform: 'translate(30px, -20px) scale(1.05)' },
        },
        gradientShift: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        orbit: {
          'from': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          'to': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        }
      }
    },
  },
  plugins: [],
}
