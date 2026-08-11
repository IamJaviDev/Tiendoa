// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// PENDIENTE: dominio real. Placeholder acordado en revisión del plan.
// Este es el ÚNICO sitio donde se declara el dominio: canonical, Open Graph
// y sitemap lo derivan de aquí vía Astro.site.
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
