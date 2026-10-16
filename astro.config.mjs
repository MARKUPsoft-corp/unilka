import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Configuration Astro pour unilka
export default defineConfig({
  site: 'https://unilka.ca',
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: false }
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    sitemap({
      filter: (page) =>
        !page.includes('/soumission/merci') &&
        !page.includes('/carrieres/merci') &&
        !page.includes('/404')
    })
  ]
});
