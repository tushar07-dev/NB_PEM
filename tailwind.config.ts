import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add your fluid design tokens here
      // spacing: {
      //   'nav-h': 'clamp(70px, 4.68vw, 90px)',     // Transitions from 70px to 90px
      //   'nav-px': 'clamp(12px, 1.5vw, 20px)',    // Fluid horizontal padding
      //   'search-w': 'clamp(200px, 16vw, 320px)', // Fluid search width (replaces w-64)
      //   'icon-base': 'clamp(33.33px, 2.6vw, 50px)', // Your logo/button size
      // },
      // boxShadow: {
      //   'tooltip': '0 0 20px 0 rgba(0, 0, 0, 0.06)',
      // },
    },
  },
  plugins: [],
}

export default config
