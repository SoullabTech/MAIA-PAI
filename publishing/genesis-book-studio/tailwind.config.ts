import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Soullab Elemental Colors
        fire: {
          DEFAULT: '#a94724',
          light: '#c25530',
          dark: '#8a3a1d',
        },
        air: {
          DEFAULT: '#cea22c',
          light: '#d9b23a',
          dark: '#b89023',
        },
        earth: {
          DEFAULT: '#6d7934',
          light: '#7e8a42',
          dark: '#5a6628',
        },
        water: {
          DEFAULT: '#236586',
          light: '#2a7499',
          dark: '#1a5670',
        },
        // Neutrals
        leather: '#8b7355',
        parchment: '#d4c5a9',
      },
      fontFamily: {
        heading: ['"Blair ITC"', 'Lato', 'system-ui', 'sans-serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
