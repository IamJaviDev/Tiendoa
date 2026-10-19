# Tiendoa — landing

Landing estática más tres páginas legales. Astro 7, salida estática, CSS
Modules, sin framework de UI y sin Tailwind. El JavaScript del cliente son dos
scripts inline, sin librerías: el menú móvil y el aviso de cookies (~400
bytes).

## Rutas

| Ruta | Página |
|---|---|
| `/` | Landing |
| `/aviso-legal/` | Aviso legal |
| `/politica-de-privacidad/` | Política de privacidad |
| `/politica-de-cookies/` | Política de cookies |

Las legales se enlazan solo desde el footer (no desde el nav), usan
`src/layouts/Legal.astro` y entran solas en el sitemap. Los enlaces del nav son
`/#servicios`, `/#proceso` y `/#faq` — rutas absolutas, para que funcionen
también desde una página legal.

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
| **Todo el texto visible** de la landing | `src/data/site.ts` |
| Datos del titular (legales) | `src/data/site.ts` → `LEGAL` |
| Texto de las páginas legales | `src/pages/<ruta>.astro` (literal, no se reescribe sin aprobación) |
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
2. ~~**Dominio real.**~~ Hecho: `https://tiendoa.com`, en producción. Vive
   solo en `astro.config.mjs`; de ahí salen el canonical, Open Graph, el
   JSON-LD, el sitemap, el `robots.txt` y `LEGAL.web`.
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

## Decisiones que conviene conocer

### Aviso de cookies informativo, no de consentimiento

El sitio no instala ninguna cookie que requiera consentimiento: cero
peticiones a terceros, fuentes self-hosted, sin analítica ni píxeles, sin
formularios, y ningún script usa `localStorage`. El art. 22.2 LSSI solo exige
consentimiento previo para cookies no exentas, así que no hay nada que
aceptar ni rechazar: solo se **informa**.

`src/components/CookieNotice.astro` es un componente propio, sin librería
(textos en `site.ts` → `AVISO_COOKIES`):

- El marcado sale en el HTML con `hidden`; un script inline lo muestra si no
  existe la cookie. Sin JS no aparece.
- Al pulsar "Entendido" crea `tiendoa_aviso=1; Max-Age=15724800; Path=/;
  SameSite=Lax; Secure` (182 días, valor "1" y nada más) y se oculta. Antes
  de pulsar no hay ninguna cookie.
- Es una `<section aria-label>`, no un diálogo: no bloquea la página y nunca
  mueve el foco. Si el foco estaba en el botón al cerrarlo, pasa a `<main>`.
- Nombre y duración de la cookie están declarados en la tabla de
  `/politica-de-cookies/`: si cambian en `site.ts`, cambian allí también.

Los navegadores pueden acortar la vida de las cookies creadas desde
JavaScript, aunque se pidan 182 días: Brave las limita a 180 días y Safari
(ITP) a 7, así que en Safari el aviso vuelve a salir tras una semana sin
visitar el sitio. Chrome y Firefox respetan los 182. No es un fallo del sitio:
para evitarlo, la cookie tendría que ponerla el servidor con `Set-Cookie`.

**Bloqueadores de avisos.** Brave (Shields) oculta el aviso en producción: su
lista de avisos de cookies tiene un filtro para el id `#aviso-cookies`, y
seguramente también uBlock Origin y AdGuard con sus listas de "annoyances".
Para esos usuarios el aviso no aparece y el resto de la web funciona igual.
**Es deliberado: no se cambia el id para saltarse los filtros del usuario**,
que ha elegido no ver estos avisos. Para probarlo en Brave, desactivar los
Shields en `tiendoa.com` (en `localhost` no actúan).

### Pasar a consentimiento completo

Para el día que entre analítica (GA4, GTM…), un vídeo embebido de
YouTube/Vimeo, un mapa de Google, un reCAPTCHA o un píxel publicitario. **Solo
está documentado; no hay nada de esto implementado.**

1. Sustituir `CookieNotice` por **vanilla-cookieconsent v3** (la misma base
   que el plugin `rogtagwp` del resto de sitios), empaquetada por Astro, nunca
   por CDN, y con **Consent Mode 2**. Revisar al integrarla que no robe el
   foco ni atrape el Tab: la 3.1.0 lo hace por defecto, y su caja lleva
   `role="dialog"` + `aria-modal="true"`.
2. Añadir la categoría `analytics` (o la que toque) con `autoClear`, para que
   al retirar el consentimiento se borren sus cookies.
3. Añadir el botón de rechazar y el panel de preferencias.
4. Definir Consent Mode 2 por defecto en `denied` **antes** de cargar GTM o
   gtag.
5. Bloquear los scripts con `type="text/plain" data-category="..."` hasta que
   haya consentimiento.
6. Añadir un enlace permanente "Configurar cookies" en el footer, para poder
   retirar el consentimiento.
7. Actualizar la política de cookies con cada cookie nueva (la tabla de
   `/politica-de-cookies/`), y quitar o renombrar `tiendoa_aviso`.

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
  layouts/Legal.astro         layout de prosa de las páginas legales
  components/                 un .astro + un .module.css por bloque
    CookieNotice.astro        aviso de cookies (script inline propio)
    icons/                    SVGs de servicios y logo
  styles/                     tokens.css · fonts.css · global.css
  data/site.ts                todo el contenido, tipado
  pages/
    index.astro               monta los nueve componentes
    aviso-legal.astro         \
    politica-de-privacidad.astro  > texto legal literal, sobre Legal.astro
    politica-de-cookies.astro /
    robots.txt.ts             generado en build para no duplicar el dominio
public/                       fuentes, favicon, og.jpg, _headers
docs/                         brief original y referencia visual
```
