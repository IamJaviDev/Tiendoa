import type { APIRoute } from 'astro';

/* Se genera en build en vez de vivir en public/ para que el dominio siga
   declarado en un único sitio (astro.config.mjs). */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;

  const cuerpo = ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemap}`, ''].join(
    '\n'
  );

  return new Response(cuerpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
