/* ==========================================================================
   Tiendoa — contenido de la landing.

   TODO el texto visible de la página vive aquí. Los componentes solo iteran.
   Copy transcrito literal de tiendoa-referencia.html: no se reescribe nada
   sin pedirlo antes.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Contacto
   -------------------------------------------------------------------------- */

/* Teléfono único de contacto: alimenta el CTA de WhatsApp, el enlace tel:
   del footer y el JSON-LD. Se guarda en formato E.164 sin "+" (lo que pide
   wa.me) y se derivan el resto de formatos. */
export const TELEFONO = {
  prefijo: '34',
  nacional: '631729603',
} as const;

export const telefonoE164 = `+${TELEFONO.prefijo}${TELEFONO.nacional}`;

/* Agrupado 3-3-3, como se lee un móvil español. */
export const telefonoVisible = `+${TELEFONO.prefijo} ${TELEFONO.nacional.slice(0, 3)} ${TELEFONO.nacional.slice(3, 6)} ${TELEFONO.nacional.slice(6)}`;

export const WHATSAPP = {
  numero: `${TELEFONO.prefijo}${TELEFONO.nacional}`,
  mensaje: 'Hola, quiero agendar una llamada de 30 min para mi ecommerce.',
} as const;

export const whatsappUrl =
  `https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(WHATSAPP.mensaje)}`;

export const EMAIL = 'hola@tiendoa.com' as const;

/* --------------------------------------------------------------------------
   Metadatos
   -------------------------------------------------------------------------- */

export const SITE = {
  nombre: 'Tiendoa',
  titulo: 'Tiendoa — Agencia de marketing digital para ecommerce',
  descripcion:
    'Un solo equipo se hace cargo de tus anuncios, tu tienda y tu contenido. SEO, Meta Ads, email marketing y CRO para ecommerce, sin subcontratar cada pieza.',
  descripcionOrg:
    'Agencia de marketing digital para ecommerce: SEO, Meta Ads, email marketing, CRO, diseño y desarrollo de tienda y marketing de contenidos.',
  ogImagen: '/og.jpg',
  themeColor: '#FAF8F2',
} as const;

/* --------------------------------------------------------------------------
   Navegación
   -------------------------------------------------------------------------- */

export interface EnlaceNav {
  texto: string;
  href: string;
}

export const NAV: readonly EnlaceNav[] = [
  { texto: 'Servicios', href: '#servicios' },
  { texto: 'Proceso', href: '#proceso' },
  { texto: 'FAQ', href: '#faq' },
];

export const CTA_NAV = 'Agendar llamada' as const;

/* --------------------------------------------------------------------------
   Hero
   -------------------------------------------------------------------------- */

export const HERO = {
  kicker: 'Agencia de marketing digital para ecommerce',
  titular: 'Tu ecommerce no necesita más “me gusta”. Necesita más ventas.',
  subtitulo:
    'Un solo equipo se hace cargo de tus anuncios, tu tienda y tu contenido — sin subcontratar cada pieza a un freelance distinto ni esconderse detrás de un reporte bonito.',
  ctaPrimario: 'Agendar llamada de 30 min',
  ctaSecundario: 'Ver qué hacemos ↓',
  ctaSecundarioHref: '#servicios',
} as const;

/* --------------------------------------------------------------------------
   Franja de logos
   -------------------------------------------------------------------------- */

export const LOGOS = {
  titulo: 'Marcas que ya venden más con Tiendoa',
  etiqueta: 'logo cliente',
  cantidad: 5,
  nota: 'Placeholders — se reemplazan por logos y cifras reales de clientes',
} as const;

/* --------------------------------------------------------------------------
   Servicios

   INVARIANTE: el truco de bordes del grid (gap de 1px sobre fondo --c-linea)
   solo funciona si la última fila está completa. Con 6 servicios encaja en
   1, 2 y 3 columnas. Si algún día son 5 o 7, la última fila deja un hueco
   que se pinta como un bloque beige sólido — hay que cambiar de técnica,
   no añadir el séptimo y confiar.
   -------------------------------------------------------------------------- */

export type ClaveIcono =
  | 'seo'
  | 'ads'
  | 'email'
  | 'cro'
  | 'tienda'
  | 'contenidos';

export interface Servicio {
  icono: ClaveIcono;
  titulo: string;
  descripcion: string;
}

export const SERVICIOS_INTRO = {
  kicker: 'Servicios',
  titulo: 'Todo lo que mueve la aguja, bajo un mismo techo.',
  texto:
    'Nada de piezas sueltas entregadas por freelances distintos. Un equipo, una estrategia, un solo lugar donde reclamar resultados.',
} as const;

export const SERVICIOS: readonly Servicio[] = [
  {
    icono: 'seo',
    titulo: 'SEO',
    descripcion:
      'Que te encuentren antes de que te busquen: auditoría técnica, contenido y autoridad para tu catálogo.',
  },
  {
    icono: 'ads',
    titulo: 'Meta Ads / Social Ads',
    descripcion:
      'Campañas que no queman presupuesto: estructura, creatividad y optimización diaria.',
  },
  {
    icono: 'email',
    titulo: 'Email marketing',
    descripcion:
      'Tu lista es tu activo más rentable: flujos automatizados que venden mientras duermes.',
  },
  {
    icono: 'cro',
    titulo: 'CRO / conversión',
    descripcion:
      'Más ventas sin más tráfico: tests, UX y fricción eliminada en cada paso del checkout.',
  },
  {
    icono: 'tienda',
    titulo: 'Tienda: diseño y desarrollo',
    descripcion:
      'Shopify y WooCommerce a medida para catálogos grandes que cargan rápido y venden solas.',
  },
  {
    icono: 'contenidos',
    titulo: 'Marketing de contenidos',
    descripcion:
      'Contenido que vende, no que solo "engancha", conectado a tu funnel real.',
  },
];

/* --------------------------------------------------------------------------
   Proceso
   -------------------------------------------------------------------------- */

export interface Paso {
  numero: string;
  titulo: string;
  descripcion: string;
}

export const PROCESO_INTRO = {
  kicker: 'Cómo trabajamos',
  titulo: 'Cuatro pasos. Cero relevos a mitad de camino.',
} as const;

export const PROCESO: readonly Paso[] = [
  {
    numero: '01',
    titulo: 'Diagnóstico',
    descripcion:
      'Auditamos tu cuenta, tu tienda y tu competencia en la primera semana.',
  },
  {
    numero: '02',
    titulo: 'Estrategia',
    descripcion:
      'Plan concreto con objetivos y cifras. No un PDF de 40 páginas que nadie lee.',
  },
  {
    numero: '03',
    titulo: 'Ejecución',
    descripcion:
      'El mismo equipo que diseñó la estrategia la ejecuta. Sin relevos ni traducciones.',
  },
  {
    numero: '04',
    titulo: 'Reporte semanal',
    descripcion:
      'Números reales cada semana. Sin esperar al cierre de mes para saber cómo vas.',
  },
];

/* --------------------------------------------------------------------------
   Por qué Tiendoa
   -------------------------------------------------------------------------- */

export const PORQUE_INTRO = {
  kicker: 'Por qué Tiendoa',
  titulo: 'Sin intermediarios. Sin freelance de turno.',
} as const;

export const PORQUE: readonly string[] = [
  'Quien lleva tu cuenta es quien decide y ejecuta — no un account manager que traduce tu marca a otro equipo detrás de cámaras.',
  'Un solo equipo para ads, tienda y contenido: cero fricción entre piezas que deberían hablar entre sí desde el día uno.',
  'Resultados verificables, no cifras infladas en un caso de éxito bonito. Si algo no funciona, lo decimos primero nosotros.',
];

/* --------------------------------------------------------------------------
   FAQ

   NOTA PARA JAVIER: la pregunta 2 dice "las principales pasarelas de pago
   de Latam". Si el público objetivo es España, hay que cambiarlo. Decisión
   suya — no se toca por nuestra cuenta.
   -------------------------------------------------------------------------- */

export interface Pregunta {
  pregunta: string;
  respuesta: string;
}

export const FAQ_INTRO = {
  kicker: 'Preguntas frecuentes',
  titulo: 'Sin rodeos.',
} as const;

export const FAQ: readonly Pregunta[] = [
  {
    pregunta: '¿Cuánto tiempo toma ver resultados?',
    respuesta:
      'Depende del canal: SEO empieza a moverse en 60–90 días; ads y CRO, desde la primera o segunda semana de optimización. Te lo decimos así de directo en la primera llamada.',
  },
  {
    pregunta: '¿Trabajan con cualquier plataforma de ecommerce?',
    respuesta:
      'Shopify, WooCommerce y las principales pasarelas de pago de Latam. Si usas otra, lo hablamos en la auditoría inicial.',
  },
  {
    pregunta: '¿Tienen permanencia mínima?',
    respuesta:
      'No creemos en contratos que te atrapen. Trabajamos mes a mes porque confiamos en los resultados, no en la letra pequeña.',
  },
  {
    pregunta: '¿Quién va a llevar mi cuenta?',
    respuesta:
      'La misma persona que diseña tu estrategia la ejecuta. Nada de subcontratar tu cuenta a un freelance que nunca vas a conocer.',
  },
  {
    pregunta: '¿Cómo empezamos?',
    respuesta:
      'Agenda una llamada de 30 minutos. Auditamos tu situación actual y te decimos, sin rodeos, si podemos ayudarte.',
  },
];

/* --------------------------------------------------------------------------
   CTA final
   -------------------------------------------------------------------------- */

export const CTA_FINAL = {
  titulo: '¿Seguimos hablando de estrategia o empezamos a vender?',
  texto:
    'Agenda 30 minutos. Sin pitch de ventas — una auditoría honesta de tu ecommerce y una respuesta clara de si podemos ayudarte.',
  boton: 'Agendar llamada de 30 min →',
} as const;

/* --------------------------------------------------------------------------
   Footer
   -------------------------------------------------------------------------- */

export const FOOTER = {
  copyright: (anio: number) =>
    `© ${anio} Tiendoa. Agencia de marketing digital para ecommerce.`,
} as const;
