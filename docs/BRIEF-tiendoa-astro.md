# Brief técnico — Landing Tiendoa en Astro

Este documento es la fuente de verdad. Si algo no está aquí, pregunta antes de improvisar.

Junto a este archivo tienes `tiendoa-referencia.html`: es el diseño original renderizable
(estilos inline, **solo desktop**). Úsalo como referencia visual exacta de colores,
tamaños y espaciados. **No lo copies tal cual**: hay que reescribirlo como componentes
Astro con CSS Modules y hacerlo responsive desde cero.

---

## 1. Stack y decisiones cerradas

| Decisión | Elección |
|---|---|
| Framework | Astro 5, output estático (`output: 'static'`) |
| Estilos | **CSS Modules** (`.module.css` por componente) + variables globales |
| UI framework | **Ninguno**. Cero React/Vue/Svelte. Cero Tailwind. |
| JS en cliente | El mínimo imprescindible (menú móvil). El FAQ va sin JS. |
| Fuentes | Self-hosted con `@fontsource-variable/manrope` y `@fontsource/space-grotesk` |
| CTA principal | **WhatsApp** (`wa.me`) |
| Deploy | **Cloudflare Pages** |
| Idioma | `es-ES` |

### No hacer
- No instalar Tailwind, ni styled-components, ni ninguna librería de UI.
- No añadir integraciones de Astro que no se usen.
- No dejar ni un `console.log` ni código comentado en el entregable.
- No inventar copy nuevo: el texto es exactamente el del HTML de referencia.

---

## 2. Estructura de archivos

```
src/
  layouts/
    Base.astro            # <head>, meta, fuentes, skip-link, slot
  components/
    Nav.astro
    Hero.astro
    LogosStrip.astro
    Servicios.astro
    Proceso.astro
    PorQue.astro
    Faq.astro
    CtaFinal.astro
    Footer.astro
    icons/                # SVGs de servicios, uno por archivo
  styles/
    tokens.css            # variables CSS
    global.css            # reset + base
  data/
    site.ts               # WhatsApp, email, nav, servicios, proceso, faq
  pages/
    index.astro
public/
  favicon.svg
  og.jpg
```

Cada componente lleva su `Componente.module.css` al lado.

**Todo el contenido textual vive en `src/data/site.ts`**, tipado. Los componentes iteran
sobre esos arrays. Nada de texto hardcodeado dentro del markup salvo el hero.

---

## 3. Design tokens → `src/styles/tokens.css`

```css
:root {
  /* Color */
  --c-crema:        #FAF8F2;  /* fondo base de página */
  --c-tinta:        #1B2A38;  /* texto principal y secciones oscuras */
  --c-beige:        #E4DCC8;  /* bloques claros, bordes, texto sobre oscuro */
  --c-beige-borde:  #cabf9f;  /* bordes dentro de bloques beige (FAQ) */
  --c-acento:       #8E7FB0;  /* CTAs, kickers, detalles */
  --c-oliva:        #4A5D4E;  /* texto secundario sobre claro */
  --c-humo:         #cfd6dc;  /* texto secundario sobre oscuro */
  --c-linea:        #E4DCC8;  /* bordes sobre fondo crema */

  /* Tipografía */
  --f-display: 'Space Grotesk', sans-serif;
  --f-texto:   'Manrope', sans-serif;

  /* Radio: la marca es angulosa, NO redondear más de esto */
  --radio: 3px;

  /* Ritmo vertical y contenedores */
  --pad-seccion: clamp(64px, 10vw, 100px);
  --pad-lateral: clamp(20px, 5vw, 40px);
  --ancho-max:   1200px;
}
```

Pesos de Manrope en uso: 400, 500, 600, 700. De Space Grotesk: solo 700.

Regla de oro: **ningún color ni fuente hardcodeados** en los `.module.css`. Todo por variable.

---

## 4. Responsive — la parte que hay que inventar

El diseño original **no tiene responsive ninguno**. Es lo más importante de este trabajo.
Mobile-first, y estos breakpoints:

```css
/* base: < 640px */
@media (min-width: 640px)  { }  /* tablet vertical */
@media (min-width: 900px)  { }  /* tablet horizontal */
@media (min-width: 1200px) { }  /* desktop */
```

| Bloque | Móvil | 640px | 900px | 1200px |
|---|---|---|---|---|
| Servicios (grid) | 1 col | 2 col | 3 col | 3 col |
| Proceso (grid) | 1 col | 2 col | 4 col | 4 col |
| Por qué (grid) | 1 col apilada | 1 col | `0.9fr 1.1fr` | `0.9fr 1.1fr` |
| Nav | hamburguesa | hamburguesa | completo | completo |

Tipografía fluida — sustituye los tamaños fijos del original por `clamp()`:

- H1 hero: `clamp(34px, 7vw, 58px)`
- H2 sección: `clamp(28px, 4.5vw, 38px)`
- H2 CTA final: `clamp(30px, 5vw, 40px)`
- Subtítulo hero: `clamp(17px, 2.2vw, 19px)`
- Cuerpo: 16px fijo. Texto de tarjeta: 14px fijo. Kicker: 13px fijo.

En móvil los botones del hero pasan a ancho completo y apilados.

---

## 5. Componentes, uno a uno

### Nav
Sticky, `z-index: 20`, fondo `rgba(250,248,242,0.92)` + `backdrop-filter: blur(8px)`,
borde inferior `--c-linea`.

El logo es una marca geométrica: una "T" formada por dos rectángulos en `--c-tinta` más
un cuadradito `--c-acento` abajo a la derecha. En el original está hecha con divs
posicionados en absoluto — **conviértela a un SVG inline** en `components/icons/Logo.astro`,
con prop `size`. Mismo resultado visual, escalable.

Wordmark: "TIENDOA", Space Grotesk 700, 18px, `letter-spacing: 0.2em`, mayúsculas.

Menú móvil: botón hamburguesa, panel a pantalla completa. Es el **único** JS de la página.
Vanilla, en una `<script>` del propio componente. Requisitos: `aria-expanded`,
`aria-controls`, cierre con `Escape`, foco atrapado dentro del panel mientras esté abierto,
y `overflow: hidden` en el body.

### Hero
El original tiene una prop `heroVariant` con dos valores. Impleméntala como prop de Astro:

```ts
interface Props { variante?: 'claro' | 'oscuro' }  // default: 'claro'
```

| | claro | oscuro |
|---|---|---|
| Fondo | `--c-beige` | `--c-tinta` |
| Titular | `--c-tinta` | `--c-beige` |
| Subtítulo | `--c-oliva` | `--c-humo` |

Resuélvelo con un `data-variante` en el elemento raíz y selectores CSS, no con estilos
inline calculados en JS.

`text-wrap: pretty` en el H1. Padding: `100px 40px 90px` en desktop, escalado con las
variables en móvil.

### LogosStrip
Prop booleana `mostrar` (default `true`) — si es `false` no se renderiza nada.
Son placeholders rayados a propósito (`repeating-linear-gradient` a 45°). Déjalos como
están y mantén la nota de "se reemplazan por logos reales".

### Servicios
Grid con truco de borde: `gap: 1px` sobre fondo `--c-linea` y tarjetas en `--c-crema`,
más un `border: 1px solid` en el contenedor. Así las líneas divisorias salen solas.
**Ojo**: en móvil a 1 columna ese truco sigue funcionando, pero verifícalo.

Seis servicios: SEO · Meta Ads / Social Ads · Email marketing · CRO / conversión ·
Tienda: diseño y desarrollo · Marketing de contenidos.

Cada uno tiene un icono geométrico de 34×34 construido con divs en el original
(lupa, play, barras decrecientes, gráfico de barras, ventana de navegador, rombo violeta).
**Pásalos todos a SVG inline** en `components/icons/`. Respeta la traza de 2.5px y el color
`currentColor` para que hereden.

### Proceso
Fondo `--c-tinta`. Cuatro pasos numerados `01`–`04` en Space Grotesk 700, 15px, color
`--c-acento`. Título del paso en `--c-beige`, descripción en `--c-humo`.

### PorQue
Grid asimétrico `0.9fr 1.1fr`, `gap: 64px`, `align-items: start`. Tres puntos, cada uno
con un cuadrado de 8px en `--c-acento` como viñeta (`margin-top: 8px`, `flex-shrink: 0`).

### Faq
Fondo `--c-beige`. Cinco preguntas. En el original es un acordeón con estado en JS que
abre solo una a la vez — y es **inaccesible**: son divs con onClick, sin teclado ni ARIA.

**Reimpleméntalo con `<details>` / `<summary>` nativo.** Sin JS. Accesible por defecto.
Detalles:
- Oculta el marcador nativo (`summary::-webkit-details-marker { display: none }` y
  `list-style: none`).
- El `+` / `–` a la derecha, 20px, `--c-acento`, alternado con `details[open]`.
- Bordes `1px solid var(--c-beige-borde)`: `border-top` en el contenedor, `border-bottom`
  en cada ítem salvo el último.
- Respuesta: 15px, `--c-oliva`, `line-height: 1.6`, `max-width: 640px`, `margin-top: 14px`.
- Estado de foco visible en el `summary`.

Si quieres el comportamiento de "solo una abierta a la vez", hazlo con el atributo `name`
compartido en los `<details>` (soporte nativo en navegadores actuales) — **nunca con JS**.

Añade además el JSON-LD de `FAQPage` con estas cinco preguntas (ver §7).

### CtaFinal
Fondo `--c-tinta`, centrado, padding `110px 40px`. El botón apunta a WhatsApp.

### Footer
Tres bloques en `space-between` con `flex-wrap`: logo + wordmark (22px), email
`hola@tiendoa.com`, y el copyright. En móvil se apilan centrados.

---

## 6. Enlaces y CTAs

Ahora mismo todos los CTAs del original apuntan a `#`. Todos los "Agendar llamada"
(nav, hero, CTA final) van a **WhatsApp**, centralizado en `src/data/site.ts`:

```ts
export const WHATSAPP = {
  numero: '34XXXXXXXXX',            // ← Javier lo rellena; sin + ni espacios
  mensaje: 'Hola, quiero agendar una llamada de 30 min para mi ecommerce.',
} as const;

export const whatsappUrl =
  `https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(WHATSAPP.mensaje)}`;
```

Los enlaces salientes: `target="_blank"` + `rel="noopener"`. Deja el número como
placeholder evidente para que no se cuele en producción.

---

## 7. SEO y `<head>`

En `Base.astro`:
- `<html lang="es">`
- Title y meta description (redáctalos a partir del copy del hero, ~155 caracteres)
- Open Graph + Twitter card, con `/og.jpg` (1200×630 — genera un placeholder con los
  colores de marca si no hay imagen)
- `<link rel="canonical">`
- Favicon SVG con la marca "T"
- `theme-color`: `#FAF8F2`
- JSON-LD: `Organization` (Tiendoa, agencia de marketing digital para ecommerce, email
  `hola@tiendoa.com`) y `FAQPage` con las cinco preguntas del FAQ
- Añade `@astrojs/sitemap` y un `robots.txt`

**Copy sin tocar.** Un apunte para Javier, no para ti: el FAQ dice "las principales
pasarelas de pago de Latam". Si el público es España, hay que cambiarlo — pero eso lo
decide él, no lo toques por tu cuenta.

---

## 8. Accesibilidad — criterios de aceptación

- Un solo `<h1>` (el del hero). Jerarquía de headings sin saltos.
- Landmarks reales: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`. El original es
  todo `div`s — corrígelo.
- Skip-link a `#main` como primer elemento enfocable.
- Foco visible en todos los interactivos (`:focus-visible`, no lo elimines).
- Contraste AA en todo. **Verifica en particular** `--c-oliva` (#4A5D4E) sobre
  `--c-beige` (#E4DCC8) en el texto de 15px del FAQ; si no llega a 4.5:1, oscurece
  la variable y anótalo.
- Los divs decorativos (iconos, viñetas, logos placeholder) con `aria-hidden="true"`.
- `prefers-reduced-motion`: sin transiciones si está activo.

---

## 9. Rendimiento

Objetivo: **100 en Lighthouse Performance y Accessibility** en móvil. No es negociable en
una landing estática de una sola página.

- Fuentes self-hosted vía `@fontsource`, subset latin, `font-display: swap`, con `preload`
  de los dos ficheros que se usan en el primer render.
- Cero JS salvo el menú móvil. Ni una hidratación.
- CSS crítico: Astro ya inlinea; verifica que no salga ningún CSS bloqueante extra.
- Sin peticiones a terceros. Nada de Google Fonts por CDN.
- CLS 0: reserva altura del nav sticky y evita saltos al cargar fuentes.

---

## 10. Deploy — Cloudflare Pages

- Build: `npm run build` · Output: `dist` · Node 20
- `site` configurado en `astro.config.mjs` (lo necesita el sitemap)
- Añade un `public/_headers` con cabeceras de seguridad:
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` restrictiva, y cache largo con `immutable` para `/_astro/*`

---

## 11. Definition of done

Antes de dar por terminado, comprueba y reporta:

- [ ] `npm run build` limpio, sin warnings
- [ ] Revisado a 375px, 768px, 1024px y 1440px sin scroll horizontal en ninguno
- [ ] Menú móvil: abre, cierra con Escape, cierra al pulsar un enlace, foco atrapado
- [ ] FAQ funciona con teclado y sin JS (desactiva JS y pruébalo)
- [ ] Lighthouse móvil: Performance ≥ 98, Accessibility 100, Best Practices 100, SEO 100
- [ ] Ni un color ni una fuente hardcodeados fuera de `tokens.css`
- [ ] Los tres CTAs apuntan al mismo `whatsappUrl` centralizado
- [ ] Comparación visual lado a lado contra `tiendoa-referencia.html` a 1440px

Al terminar, escribe un `README.md` corto: cómo arrancar, dónde tocar el contenido
(`site.ts`), dónde tocar los colores (`tokens.css`) y qué queda pendiente
(número de WhatsApp, logos de clientes, imagen OG).
