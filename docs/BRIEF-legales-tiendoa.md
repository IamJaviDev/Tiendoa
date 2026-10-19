# Brief — Páginas legales para Tiendoa (Astro)

Añadir tres páginas legales al sitio, enlazarlas desde el footer y arreglar un bug
de navegación que aparece al existir páginas internas.

**No se implanta banner de cookies.** Está decidido y justificado abajo. No lo añadas
ni lo sugieras.

Los textos legales de la sección 5 son **definitivos**: cópialos tal cual. No reescribas,
no resumas, no añadas cláusulas, no cambies la redacción. Si algo te parece incorrecto o
incompleto, **pregunta antes de tocarlo** en vez de corregirlo por tu cuenta.

---

## 1. Por qué no hay banner

> **Nota (19/10/2026):** esta sección queda sustituida por
> `docs/BRIEF-banner-tiendoa.md`. Ahora hay un aviso informativo propio
> (`CookieNotice.astro`, sin librería) que instala la cookie `tiendoa_aviso`
> al pulsar "Entendido", y su JS se suma al del menú móvil. El texto de abajo
> se conserva como registro de la decisión original.

El sitio no instala ninguna cookie que requiera consentimiento:

- Cero peticiones a terceros, cero scripts externos, cero hojas de estilo externas
  (verificado en el build final).
- Las fuentes son self-hosted.
- No hay analítica: ni GA4, ni GTM, ni píxeles.
- No hay formularios.
- El único JS es el menú móvil, y su estado se deriva del DOM, sin `localStorage`.

El artículo 22.2 de la LSSI solo exige consentimiento previo para cookies no exentas.
Sin ellas no hay nada que consentir, así que un banner sería decorativo y además
añadiría JS a una página que hoy no tiene ninguno.

**Esto cambia el día que entre analítica, un vídeo embebido de YouTube/Vimeo, un mapa
de Google, un reCAPTCHA o un píxel publicitario.** Déjalo anotado en el README como
condición: si se incorpora cualquiera de esos, hay que implantar consentimiento previo
con bloqueo por defecto y actualizar la política de cookies.

---

## 2. Qué hay que crear

```
src/
  data/
    site.ts                        # añadir el bloque LEGAL (sección 3)
  layouts/
    Legal.astro                    # NUEVO — layout de prosa para páginas legales
    Legal.module.css               # NUEVO
  pages/
    aviso-legal.astro              # NUEVO
    politica-de-privacidad.astro   # NUEVO
    politica-de-cookies.astro      # NUEVO
  components/
    Footer.astro                   # modificar: enlaces legales + email correcto
    Nav.astro                      # modificar: arreglo de anclas (sección 4)
```

### Layout `Legal.astro`

Envuelve `Base.astro`, no lo sustituye. Requisitos:

- Props: `titulo`, `descripcion`, `actualizado`.
- Ancho de lectura máximo **720px**, centrado, con el `--pad-lateral` de siempre.
- Fondo `--c-crema`. Nada de beige: estas páginas son texto largo y el crema descansa más.
- Padding superior que respete el nav sticky: `calc(var(--nav-altura) + var(--pad-seccion))`.
- Un solo `<h1>` (el título de la página) y `<h2>` para los apartados numerados. Sin saltos de nivel.
- Tipografía: titulares en `--f-display`, cuerpo en `--f-texto` a 16px con `line-height: 1.7`
  (más aire que en la home, es texto para leer seguido).
- Debajo del H1, una línea con la fecha: "Última actualización: 19 de octubre de 2026",
  en `--c-oliva`, 14px.
- Enlaces del cuerpo en `--c-acento-fuerte` con subrayado. Respeta la escala de tres
  violetas: en estas páginas el acento es siempre texto, nunca `--c-acento` a secas.
- Listas con viñetas discretas. Tablas de datos (la del aviso legal) con bordes
  `--c-linea`, sin fondos de color.
- Cero literales de color o fuente: todo por token, como en el resto del proyecto.

### Las tres páginas

Cada una usa `Legal.astro`, tira su contenido de `LEGAL` en `site.ts` para los datos
del titular, y lleva `title` y `description` propios.

| Ruta | H1 |
|---|---|
| `/aviso-legal` | Aviso legal |
| `/politica-de-privacidad` | Política de privacidad |
| `/politica-de-cookies` | Política de cookies |

Se indexan con normalidad (nada de `noindex`) y entran en el sitemap, que ya es automático.

---

## 3. Datos legales → `site.ts`

Van **una sola vez** en `site.ts` y las tres páginas los leen de ahí. Nada hardcodeado
por triplicado: el día que cambie el domicilio se toca un sitio.

```ts
export const LEGAL = {
  titular: 'Favian Sanchez Cano',
  nif: '52770498B',
  nombreComercial: 'Tiendoa',
  domicilio: 'Avd. Calp 6, 2, 7H, 03502 Benidorm (Alicante), España',
  telefono: '+34 631 72 96 03',
  email: 'hello@tiendoa.com',
  web: 'https://tiendoa.com',
  actualizado: '19 de octubre de 2026',
} as const;
```

**Corrección importante:** el footer tiene ahora `hola@tiendoa.com` y el correo bueno es
`hello@tiendoa.com`. Cámbialo en `site.ts` para que el footer y los tres documentos usen
el mismo valor. Comprueba que no quede ningún `hola@` suelto en el repo.

---

## 4. Bug de navegación — arreglar antes de publicar

Los enlaces del nav son anclas relativas (`#servicios`, `#proceso`, `#faq`). Mientras
solo existía la home funcionaban; desde `/aviso-legal` apuntan a anclas de esa misma
página, que no existen, y no llevan a ningún sitio.

Arreglo: pasarlos a **rutas absolutas con ancla** (`/#servicios`, `/#proceso`, `/#faq`),
tanto en el nav de escritorio como en el panel móvil, que salen del mismo array de `site.ts`.

Mismo problema en dos sitios más:

- El **logo/wordmark** del nav debe enlazar a `/`. Si ahora no es un enlace, hazlo enlace,
  con su `:focus-visible` y sin romper la alineación.
- El **logo del footer**, igual.

Después del cambio, verifica desde `/aviso-legal` que los tres enlaces del nav llevan a la
home y hacen scroll a su sección, y que el `scroll-margin-top` sigue respetando el nav.

---

## 5. Textos — definitivos, copiar tal cual

Los campos entre `{llaves}` se sustituyen por el valor correspondiente de `LEGAL`.

---

### 5.1 Aviso legal

**H1:** Aviso legal

**Información general**

En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002,
de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico
(LSSI-CE), se facilitan a continuación los datos identificativos del titular de este
sitio web:

| | |
|---|---|
| Titular | {titular} |
| NIF | {nif} |
| Nombre comercial | {nombreComercial} |
| Domicilio | {domicilio} |
| Teléfono | {telefono} |
| Correo electrónico | {email} |
| Sitio web | {web} |

**Objeto**

Este aviso legal regula el acceso y el uso del sitio web {web}, cuya titularidad
corresponde a {titular}. El sitio tiene por objeto presentar los servicios de marketing
digital para comercio electrónico que presta {nombreComercial} y facilitar el contacto
con personas interesadas en ellos.

**Condiciones de uso**

El acceso a este sitio web es gratuito y no requiere registro previo. La navegación por
el sitio atribuye la condición de usuario e implica la aceptación de las condiciones
recogidas en este aviso legal.

El usuario se compromete a hacer un uso adecuado de los contenidos del sitio y a no
emplearlos para incurrir en actividades ilícitas, lesivas de derechos de terceros, o que
puedan dañar, inutilizar o sobrecargar el sitio web o impedir su normal utilización.

**Propiedad intelectual e industrial**

Todos los contenidos del sitio web —textos, fotografías, gráficos, imágenes, iconos,
tecnología, software, diseño gráfico y códigos fuente— son titularidad de {titular} o de
terceros que han autorizado su uso, sin que puedan entenderse cedidos al usuario ninguno
de los derechos de explotación sobre los mismos.

Las marcas, nombres comerciales o signos distintivos son titularidad de {titular} o de
terceros, sin que el acceso al sitio web pueda atribuir derecho alguno sobre ellos.

Queda prohibida la reproducción, distribución, comunicación pública y transformación,
total o parcial, de los contenidos del sitio sin autorización expresa de su titular.

**Responsabilidad**

{titular} no se hace responsable de los daños y perjuicios que pudieran derivarse de la
falta de disponibilidad o de continuidad del funcionamiento del sitio web, ni de los
errores u omisiones que pudieran existir en sus contenidos, sin perjuicio de que se
adoptan las medidas razonables para evitarlos y corregirlos.

La información de carácter divulgativo publicada en este sitio no constituye asesoramiento
profesional ni garantiza resultados concretos.

**Enlaces a terceros**

Este sitio puede contener enlaces a sitios web o servicios de terceros. {titular} no
controla dichos sitios ni se responsabiliza de sus contenidos, políticas o prácticas.
El acceso a los mismos se realiza bajo la exclusiva responsabilidad del usuario.

**Protección de datos**

El tratamiento de los datos personales que los usuarios puedan facilitar se rige por lo
dispuesto en la Política de privacidad de este sitio.

**Modificaciones**

{titular} se reserva el derecho a modificar en cualquier momento la presentación, la
configuración y los contenidos del sitio web, así como las condiciones recogidas en el
presente aviso legal.

**Legislación aplicable y jurisdicción**

Las presentes condiciones se rigen por la legislación española. Para la resolución de
cualquier controversia derivada del acceso o uso de este sitio web, las partes se
someten a los juzgados y tribunales que resulten competentes conforme a la normativa
aplicable. Cuando el usuario tenga la condición de consumidor, serán competentes los
juzgados correspondientes a su domicilio.

---

### 5.2 Política de privacidad

**H1:** Política de privacidad

**Responsable del tratamiento**

| | |
|---|---|
| Responsable | {titular} |
| NIF | {nif} |
| Domicilio | {domicilio} |
| Teléfono | {telefono} |
| Correo electrónico | {email} |

**Qué datos tratamos**

Este sitio web no dispone de formularios de contacto, de suscripción ni de registro, y no
recoge datos de navegación con fines analíticos, publicitarios ni de elaboración de
perfiles.

Únicamente tratamos los datos personales que nos facilitas de forma voluntaria cuando te
pones en contacto con nosotros, a través de los canales que se ofrecen en este sitio:

- **Datos identificativos y de contacto:** nombre, dirección de correo electrónico y
  número de teléfono.
- **Contenido de la comunicación:** el mensaje que nos envías y la información sobre tu
  proyecto o tu negocio que decidas compartir con nosotros.

No tratamos categorías especiales de datos personales. Te pedimos que no nos facilites
este tipo de información a través de estos canales.

**Con qué finalidad**

- Atender las consultas, solicitudes de información y peticiones de cita que nos dirijas.
- Elaborar y remitir propuestas de servicios cuando así nos lo solicites.
- Gestionar y mantener la relación comercial, en caso de que llegue a formalizarse.

No utilizamos tus datos para enviarte comunicaciones comerciales no solicitadas ni para
tomar decisiones automatizadas.

**Base jurídica**

- La **aplicación de medidas precontractuales** adoptadas a tu solicitud, y en su caso la
  ejecución del contrato (artículo 6.1.b del RGPD), cuando contactas para informarte sobre
  nuestros servicios o para contratarlos.
- El **interés legítimo** en atender las consultas que nos diriges y en mantener la
  correspondencia y poder acreditarla (artículo 6.1.f del RGPD).

**Cuánto tiempo conservamos tus datos**

Conservamos los datos durante el tiempo necesario para atender tu solicitud y, si se
inicia una relación comercial, mientras esta se mantenga vigente.

Finalizada la relación, los datos se conservan bloqueados durante los plazos de
prescripción de las posibles responsabilidades legales, fiscales y contables, transcurridos
los cuales se suprimen.

**Destinatarios de los datos**

No cedemos tus datos a terceros, salvo obligación legal. Sí contamos con proveedores que,
como encargados del tratamiento, acceden a los datos para prestarnos sus servicios:

- **Cloudflare, Inc.** — alojamiento y distribución de este sitio web.
- **Zoho Corporation** — servicio de correo electrónico corporativo, con tratamiento en
  centros de datos de la Unión Europea.
- **WhatsApp Ireland Limited** (grupo Meta) — únicamente si eliges ese canal para
  contactar con nosotros. En ese caso, la conversación se desarrolla en una plataforma de
  terceros que aplica sus propias condiciones y su propia política de privacidad, que te
  recomendamos consultar.

**Transferencias internacionales**

Alguno de los proveedores indicados tiene su sede fuera del Espacio Económico Europeo.
Estas transferencias se amparan en los mecanismos previstos en el Capítulo V del RGPD, en
particular en decisiones de adecuación de la Comisión Europea o en cláusulas contractuales
tipo, junto con las garantías adicionales que resulten aplicables.

**Tus derechos**

Puedes ejercer en cualquier momento los siguientes derechos:

- **Acceso:** conocer qué datos tuyos tratamos.
- **Rectificación:** corregir los datos inexactos o incompletos.
- **Supresión:** solicitar que eliminemos tus datos cuando ya no sean necesarios.
- **Oposición:** oponerte a determinados tratamientos.
- **Limitación:** solicitar que suspendamos el tratamiento en los supuestos previstos.
- **Portabilidad:** recibir tus datos en un formato estructurado y de uso común.

Para ejercerlos, escríbenos a {email} o a {domicilio}, indicando el derecho que deseas
ejercer. Podemos solicitarte que acredites tu identidad.

Si consideras que no hemos atendido correctamente tu solicitud, puedes presentar una
reclamación ante la Agencia Española de Protección de Datos (www.aepd.es), autoridad de
control competente en materia de protección de datos en España.

**Menores de edad**

Este sitio web y los servicios que ofrece se dirigen a profesionales y empresas, y no
están destinados a menores de catorce años. No recogemos conscientemente datos de menores
de esa edad.

**Seguridad**

Aplicamos las medidas técnicas y organizativas apropiadas para garantizar un nivel de
seguridad adecuado al riesgo, incluida la transmisión cifrada de la información a través
de este sitio web mediante protocolo HTTPS.

**Cambios en esta política**

Esta política puede actualizarse para adaptarla a novedades legislativas o a cambios en la
forma en que prestamos nuestros servicios. La versión vigente es siempre la publicada en
esta página, con indicación de su fecha de última actualización.

---

### 5.3 Política de cookies

**H1:** Política de cookies

**Qué son las cookies**

Las cookies son pequeños archivos de texto que los sitios web almacenan en el navegador
de quien los visita. Permiten, entre otras cosas, recordar preferencias, mantener una
sesión iniciada o recopilar información sobre la navegación.

**Cookies que utiliza este sitio web**

Este sitio web **no utiliza cookies de análisis, de publicidad, de personalización ni de
redes sociales**, y no instala ninguna cookie que requiera tu consentimiento previo.

La única cookie propia que utilizamos es la siguiente:

| Cookie | Titular | Finalidad | Duración |
|---|---|---|---|
| `tiendoa_aviso` | Propia ({web}) | Recordar que has visto el aviso de cookies, para no volver a mostrártelo en cada visita | Hasta 6 meses |

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

**Servicios de terceros**

Los botones de contacto de este sitio abren una conversación en WhatsApp o una aplicación
de correo electrónico. Al hacer clic abandonas este sitio web y accedes a una plataforma
de terceros, que aplica sus propias políticas de cookies y de privacidad. Te recomendamos
consultarlas.

**Cómo gestionar las cookies**

Aunque este sitio no instale cookies que requieran tu consentimiento, puedes configurar
tu navegador para bloquear o eliminar las cookies de cualquier sitio web:

- Google Chrome: https://support.google.com/chrome/answer/95647
- Mozilla Firefox: https://support.mozilla.org/es/kb/Borrar%20cookies
- Safari: https://support.apple.com/es-es/guide/safari/sfri11471/mac
- Microsoft Edge: https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09

**Actualización de esta política**

Si en el futuro incorporamos herramientas de analítica, contenidos embebidos o cualquier
otro servicio que instale cookies no exentas, actualizaremos esta política e implantaremos
un sistema de consentimiento previo que te permitirá aceptarlas o rechazarlas antes de que
se instalen.

---

## 6. Footer

Añadir los tres enlaces legales, en este orden: **Aviso legal · Política de privacidad ·
Política de cookies**.

- En una línea propia bajo el bloque actual, separados por un punto medio o por espaciado.
- 14px, `--c-oliva`, con hover y `:focus-visible` (mismo tratamiento que el email).
- En móvil, apilados y centrados como el resto del footer.
- No tocar el copyright ni el año dinámico.
- No añadir estos enlaces al nav superior: van solo en el footer.

---

## 7. Requisitos que no se negocian

Los mismos del proyecto, que ya conoces:

- Mobile-first, sin scroll horizontal entre 320px y 1440px.
- Un solo `<h1>` por página, jerarquía sin saltos, landmarks reales.
- Contraste AA en todo. Las tablas de datos y los enlaces del cuerpo también.
- `:focus-visible` visible en todos los enlaces nuevos, con `--c-foco`.
- Ni un color ni una fuente fuera de `tokens.css`.
- Cero JS nuevo. Estas páginas son HTML y CSS.
- `npm run build` limpio y `astro check` en 0.

---

## 8. Definition of done

- [ ] Las tres páginas se ven correctamente a 375px, 768px y 1440px.
- [ ] Los enlaces del nav funcionan **desde una página legal**, no solo desde la home:
      verificado pinchando los tres desde `/aviso-legal`.
- [ ] El logo del nav y el del footer llevan a `/`.
- [ ] El footer enlaza las tres páginas desde cualquier página del sitio.
- [ ] No queda ningún `hola@tiendoa.com` en el repo: búsqueda hecha y salida pegada.
- [ ] Los datos del titular salen de `LEGAL` en `site.ts`, no están repetidos en las páginas.
- [ ] Los textos de la sección 5 están **literales**, sin reescribir.
- [ ] `sitemap-index.xml` incluye las tres rutas nuevas.
- [ ] Lighthouse móvil sobre una de las páginas legales: 100 en Accesibilidad y SEO,
      Rendimiento ≥ 98.
- [ ] README actualizado con la condición del banner (sección 1) y con las rutas nuevas.

Comprueba también, en DevTools → Application → Cookies, si Cloudflare está instalando
alguna cookie en el sitio en producción, y repórtame cuál. La política ya la cubre de
forma genérica, pero quiero saber si existe.
