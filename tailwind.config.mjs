/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0E7C86',
          'primary-dark': '#0A5A62',
          'primary-light': '#E3F4F5',
          accent: '#FFB703',
          text: '#0B2A2E',
          muted: '#3D5A5E',
          surface: '#FFFFFF',
          'surface-subtle': '#F5FAFA',
          success: '#1B7F4B',
          error: '#B3261E'
        }
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ]
      },
      maxWidth: {
        prose: '70ch'
      }
    }
  },
  plugins: []
};
