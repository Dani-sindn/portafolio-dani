/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        zinc: {
          950: "oklch(.141 .005 285.823)",
          // Add other custom colors if needed, but Tailwind's default zinc is usually fine.
          // We'll stick to the defaults for now unless specific overrides are needed.
        }
      },
      fontFamily: {
        sans: ['"ITC Avant Garde Gothic Pro"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
