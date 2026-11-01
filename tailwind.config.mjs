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
          gold: '#C98B00',
          'gold-light': '#FEF8EA',
          champagne: '#FBF9F4',
          navy: '#061D20',
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
          'Manrope',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        serif: [
          'Playfair Display',
          'Fraunces',
          'Georgia',
          'serif'
        ],
        display: [
          'Playfair Display',
          'Fraunces',
          'Georgia',
          'serif'
        ]
      },
      boxShadow: {
        luxury: '0 4px 24px -2px rgba(11, 42, 46, 0.05), 0 0 0 1px rgba(14, 124, 134, 0.08)',
        'luxury-hover': '0 20px 40px -8px rgba(11, 42, 46, 0.12), 0 0 0 1px rgba(14, 124, 134, 0.2)',
        'luxury-card': '0 10px 30px -10px rgba(11, 42, 46, 0.08), 0 0 0 1px rgba(11, 42, 46, 0.06)',
        'gold-glow': '0 0 30px -5px rgba(255, 183, 3, 0.25)'
      },
      letterSpacing: {
        editorial: '-0.03em'
      },
      maxWidth: {
        prose: '70ch'
      }
    }
  },
  plugins: []
};
