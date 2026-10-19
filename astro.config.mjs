// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Dominio de producción.
// Este es el ÚNICO sitio donde se declara el dominio: canonical, Open Graph,
// sitemap y JSON-LD lo derivan vía Astro.site, y los datos legales de
// site.ts vía import.meta.env.SITE.
const SITE = 'https://tiendoa.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  integrations: [sitemap()],
  build: {
    // 'auto' solo inlinea por debajo de ~4KB, y al completar los componentes
    // la hoja pasó a 12KB: salía un <link> que bloquea el render. Con una
    // sola página, inlinearla siempre es una petición menos y cero bloqueo
    // (§9 del brief). El coste — no cachear el CSS aparte — no aplica aquí.
    inlineStylesheets: 'always',
  },
});
