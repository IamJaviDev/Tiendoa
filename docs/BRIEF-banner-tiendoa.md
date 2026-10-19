# Brief — Aviso informativo de cookies (Tiendoa)

> **Nota (19/10/2026): brief sustituido en la implementación.** No se usó
> vanilla-cookieconsent: el aviso es un componente propio
> (`src/components/CookieNotice.astro`), la cookie se llama `tiendoa_aviso`
> (valor `"1"`, 182 días) y el texto se acortó a "Esta web solo usa cookies
> técnicas." con el enlace a la política dentro. La referencia vigente es el
> **README** (apartados "Aviso de cookies informativo, no de consentimiento" y
> "Pasar a consentimiento completo"). Este documento se conserva como registro.

Añadir un **aviso informativo** de cookies. No es un banner de consentimiento: la web
sigue sin instalar cookies que lo requieran, y el aviso debe decir eso, sin botones de
"Rechazar" ni panel de preferencias que no harían nada.

Se monta con **vanilla-cookieconsent v3**, la misma librería que usa el plugin `rogtagwp`
en el resto de sitios de Javier. Así, el día que entre analítica, pasar a consentimiento
completo es un cambio de configuración y no una reescritura.

---

## 1. Qué tiene que hacer

- Aparece en la primera visita, en todas las páginas.
- Un texto corto, un botón **"Entendido"** y un enlace a la política de cookies.
- Al pulsar "Entendido" se cierra y no vuelve a salir.
- **No bloquea la navegación**: nada de overlay, nada de `inert` en el resto de la página.
  Se puede usar la web con el aviso abierto.
- Sin JS, no aparece. Es aceptable: sin JS tampoco hay nada que avisar.

Texto, literal:

> Esta web solo usa cookies técnicas, necesarias para su funcionamiento.

Botón: **Entendido** · Enlace: **Política de cookies** → `/politica-de-cookies/`

---

## 2. Implementación

**Instalación.** `vanilla-cookieconsent` por npm, última versión de la rama 3.x. Verifica
la versión antes de instalar y repórtala. **Self-hosted**: lo empaqueta Astro. Nada de
CDN, que rompería las "cero peticiones a terceros" del proyecto.

**Componente.** `src/components/CookieNotice.astro`, montado una sola vez en `Base.astro`
para que salga en las cuatro páginas. El texto y la ruta de la política salen de
`site.ts`, como el resto del contenido.

**Configuración:**

- Una sola categoría: `necessary`, con `enabled: true` y `readOnly: true`.
- `consentModal` con un único botón, `acceptAllBtn: 'Entendido'`. Sin `acceptNecessaryBtn`
  ni `showPreferencesBtn`.
- **Sin `preferencesModal`.** Con una sola categoría de solo lectura no hay nada que configurar.
- Layout compacto: `box` abajo a la derecha en escritorio y ancho completo abajo en móvil.
  En móvil tiene que ser **bajo**: dos o tres líneas de texto como mucho, y sin tapar el
  CTA principal del hero a 375px.
- Nombre de la cookie: el de por defecto, `cc_cookie`. Caducidad: **182 días**.
  `sameSite: 'Lax'`.
- No hay Consent Mode, ni gtag, ni GTM, ni ningún script de terceros. **No los añadas
  "preparados".**

**Cuándo se instala la cookie.** `cc_cookie` solo debe crearse **al pulsar "Entendido"**,
no al cargar la página. Verifícalo: antes del clic, cero cookies.

---

## 3. Estilo

El estilo por defecto de la librería no encaja con la marca. Sobrescribe sus variables
CSS (`--cc-*`) con los tokens del proyecto:

- Fondo `--c-crema`, texto `--c-tinta`, borde `1px solid var(--c-linea)`.
- Botón con fondo `--c-acento-fuerte` y texto `--c-crema`, el mismo tratamiento que los
  CTA sobre fondo claro.
- Enlace a la política en `--c-acento-fuerte` y subrayado.
- Tipografía `--f-texto`, 14px. `border-radius: var(--radio)` en la caja y en el botón.
  La marca es angulosa: no redondees más.
- `:focus-visible` con `--c-foco`.
- Una sombra discreta para separarlo del contenido, sin efectos ni animaciones llamativas.
  Respeta `prefers-reduced-motion`.

Cero literales de color o fuente: todo por token, como en el resto del proyecto.

---

## 4. Accesibilidad y rendimiento

- Contraste AA en texto, botón y enlace.
- El aviso se alcanza con teclado y el botón se activa con Enter y con Espacio.
- **No robes el foco al cargar la página.** El foco no debe saltar al aviso: tiene que
  seguir funcionando el skip-link como primer elemento de la página.
- Revisa el `aria` que pone la librería. Si lo marca como `role="dialog"` modal, cámbialo:
  no es modal y no bloquea la página.
- Lighthouse móvil: Accesibilidad 100, Buenas prácticas 100, Rendimiento ≥ 98, **CLS 0**.
  El aviso va en `position: fixed`, así que no debe mover el layout.
- Repórtame cuánto pesan el JS y el CSS que añade la librería, ya minificados.

---

## 5. Política de cookies — cambios en el texto

Ahora sí se instala una cookie, así que la política tiene que declararla. En
`/politica-de-cookies/`, sustituye el apartado **"Cookies que utiliza este sitio web"**
completo por este texto, literal:

**Cookies que utiliza este sitio web**

Este sitio web **no utiliza cookies de análisis, de publicidad, de personalización ni de
redes sociales**, y no instala ninguna cookie que requiera tu consentimiento previo.

La única cookie propia que utilizamos es la siguiente:

| Cookie | Titular | Finalidad | Duración |
|---|---|---|---|
| `cc_cookie` | Propia ({web}) | Recordar que has visto el aviso de cookies, para no volver a mostrártelo en cada visita | 6 meses |

Esta cookie se instala solo cuando pulsas "Entendido" en el aviso y no contiene datos que
te identifiquen. Al servir únicamente para recordar una preferencia que tú mismo has
expresado, está exenta del deber de consentimiento previo conforme al artículo 22.2 de la
LSSI-CE.

Además:

- No empleamos herramientas de analítica web ni de medición de audiencias.
- No incorporamos píxeles ni etiquetas publicitarias de terceros.
- No cargamos scripts, tipografías ni contenidos externos desde servidores de terceros.
- No utilizamos el almacenamiento local del navegador con fines de seguimiento.

El proveedor que aloja y protege este sitio web puede instalar cookies estrictamente
técnicas, necesarias para la seguridad y el correcto funcionamiento de la página, como la
detección de tráfico automatizado. Conforme al artículo 22.2 de la LSSI-CE, estas cookies
están exentas del deber de obtener consentimiento, al ser imprescindibles para la
prestación del servicio.

---

El resto de la política (qué son las cookies, servicios de terceros, cómo gestionarlas y
actualización) **no se toca**. Actualiza también la sección 5.3 de
`docs/BRIEF-legales-tiendoa.md` para que no se contradiga con la página publicada.

---

## 6. README

- Actualiza la parte que dice que el sitio tiene "cero JS" o "solo el JS del menú":
  ahora también lleva el del aviso.
- Añade un apartado **"Pasar a consentimiento completo"** con los pasos para el día que
  entre GA4, GTM, un vídeo embebido o un píxel:
  1. Añadir la categoría `analytics` (o la que toque) con `autoClear`.
  2. Añadir el botón de rechazar y el panel de preferencias.
  3. Definir Consent Mode 2 por defecto en `denied` **antes** de cargar GTM o gtag.
  4. Bloquear los scripts con `type="text/plain" data-category="..."`.
  5. Añadir un enlace permanente "Configurar cookies" en el footer, para poder retirar
     el consentimiento.
  6. Actualizar la política de cookies con cada cookie nueva.

  **Solo documéntalo. No lo implementes.**

---

## 7. Definition of done

- [ ] El aviso aparece en la primera visita en las cuatro páginas, a 375px y a 1440px.
- [ ] Antes de pulsar "Entendido": cero cookies. Después: solo `cc_cookie`, con 182 días
      de caducidad y `SameSite=Lax`.
- [ ] Recargando, y navegando entre la home y las páginas legales, no vuelve a salir.
- [ ] Borrando la cookie, vuelve a salir.
- [ ] A 375px no tapa el CTA principal del hero.
- [ ] La librería va empaquetada en el build: cero peticiones a terceros.
- [ ] El skip-link sigue siendo el primer elemento enfocable de la página.
- [ ] La tabla de la política de cookies muestra `cc_cookie` y el texto es literal.
- [ ] `astro check` en 0, build limpio, `npm audit` en 0.
- [ ] Lighthouse en local: los valores de la sección 4, con CLS 0.
- [ ] README actualizado con el apartado de la sección 6.

Commit y push solo cuando todo esté en verde. Después, verifícalo en producción en
https://tiendoa.com.
