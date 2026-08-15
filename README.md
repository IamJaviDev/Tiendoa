# Tiendoa — landing

Landing estática de una sola página. Astro 7, salida estática, CSS Modules,
sin framework de UI y sin Tailwind. El único JavaScript del cliente es el menú
móvil.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/ en http://localhost:4322
npx astro check  # comprobación de tipos
```

Node 20 no vale: Astro 7 exige **Node >= 22.12** (ver `.nvmrc`). El brief pedía
Node 20 porque asumía Astro 5; se subió a 7 para partir de un `npm audit`
limpio (Astro 5 arrastra 8 avisos *high* sin arreglo en su rama).

## Dónde tocar las cosas

| Qué | Dónde |
|---|---|
| **Todo el texto visible** | `src/data/site.ts` |
| **Colores, tipografía, ritmo** | `src/styles/tokens.css` |
| Reset y estilos base | `src/styles/global.css` |
| `@font-face` | `src/styles/fonts.css` |
| `<head>`, SEO, JSON-LD | `src/layouts/Base.astro` |
| Dominio del sitio | `astro.config.mjs` → `SITE` (**declarado una sola vez**) |
| Cabeceras de seguridad y caché | `public/_headers` |
| Estilos de un bloque | `src/components/<Componente>.module.css` |

Los componentes solo iteran sobre los arrays de `site.ts`. Para cambiar un
texto no hay que abrir ningún `.astro`.

## Pendientes

1. ~~**Número de WhatsApp.**~~ Hecho: `src/data/site.ts` → `TELEFONO`
   (`+34 631 729 603`). De ahí salen los tres CTAs de WhatsApp, el enlace
   `tel:` del footer y el `telephone` del JSON-LD.
2. **Dominio real.** `astro.config.mjs` usa `https://tiendoa.com` como
   placeholder. De ahí salen el canonical, las URLs de Open Graph, el
   `sitemap-index.xml` y el `robots.txt`.
3. **Logos de clientes.** La franja está **oculta** de momento:
   `src/pages/index.astro` → `<LogosStrip mostrar={false} />`. Cuando haya
   logos reales, sustituir los placeholders (`site.ts` → `LOGOS`), quitar la
   nota y volver a poner `mostrar` en `true` (o quitar la prop).
4. **Imagen Open Graph.** `public/og.jpg` es un placeholder generado con la
   marca. El wordmark va en la fuente de sistema, no en Space Grotesk.
5. **Lighthouse sobre la URL real.** Medido 100/100/100/100 en móvil sobre
   `dist` en local (FCP 0.8s, LCP 1.2s, CLS 0). Falta repetirlo sobre
   Cloudflare Pages, donde sí hay TTFB y latencia.
6. **Copy del FAQ.** La pregunta 2 dice "las principales pasarelas de pago de
   **Latam**". Si el público objetivo es España, hay que cambiarlo. Decisión de
   Javier; no se ha tocado.

## Dos decisiones que conviene conocer

### El violeta de marca cambia en textos y botones

`#8E7FB0` no llega a AA en ningún uso de texto: 3.40:1 sobre crema, 2.64:1
sobre beige, 4.05:1 sobre tinta. Y ningún violeta único resuelve las tres
superficies a la vez. Se partió en tres tokens:

```css
--c-acento:        #8E7FB0;  /* SOLO decorativo: viñetas, rombo del icono */
--c-acento-fuerte: #5F5182;  /* texto y fondos de botón sobre crema o beige */
--c-acento-claro:  #9C8DBE;  /* texto y fondos de botón sobre tinta */
```

**Regla:** si es texto, o el fondo de un elemento interactivo, nunca
`--c-acento` a secas. El violeta original se conserva en lo decorativo, pero
los CTAs usan una versión más oscura por accesibilidad. Es un cambio visible
respecto al diseño original.

El anillo de foco tiene su propio token, `--c-foco`, y se contrasta contra la
**superficie**, no contra el elemento: `currentColor` daba anillos invisibles
en los botones rellenos (1.00:1). Las secciones oscuras lo redefinen a
`--c-beige`.

### Las fuentes se copian a mano

Los `.woff2` de `public/fonts/` vienen de `node_modules/@fontsource*`, copiados
a mano. No se importan desde el paquete porque Vite los emitiría con hash bajo
`/_astro/` y entonces sería imposible escribir el `<link rel="preload">` con
una ruta estable — que es lo que mantiene el CLS en 0.

**Actualizar `@fontsource` no actualiza los ficheros copiados.** Si se sube de
versión hay que volver a copiarlos:

```
node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2
node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2
                                          ↓
                                  public/fonts/
```

Las licencias OFL van al lado, en `public/fonts/LICENSE-*.txt`: es requisito de
la licencia al auto-hospedar.

`public/_headers` marca `/fonts/*` como `immutable` durante un año, así que
**si se cambia un fichero de fuente hay que renombrarlo**, o los clientes
seguirán sirviendo el viejo.

## Deploy — Cloudflare Pages

| Ajuste | Valor |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Variable de entorno | `NODE_VERSION` = `22` |

`public/_headers` viaja a `dist/` y Cloudflare lo aplica solo.

## Estructura

```
src/
  layouts/Base.astro          <head>, meta, JSON-LD, preloads, skip-link
  components/                 un .astro + un .module.css por bloque
    icons/                    SVGs de servicios y logo
  styles/                     tokens.css · fonts.css · global.css
  data/site.ts                todo el contenido, tipado
  pages/
    index.astro               monta los nueve componentes
    robots.txt.ts             generado en build para no duplicar el dominio
public/                       fuentes, favicon, og.jpg, _headers
docs/                         brief original y referencia visual
```
