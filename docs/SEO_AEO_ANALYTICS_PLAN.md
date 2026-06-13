# AKAN — SEO + AEO + Analytics Master Plan

**Versión 1.0 · Junio 2026 · Mercado: México (es-MX)**
Plataforma DTC de telemedicina para salud masculina — "Hims de México".
Storefront estático headless (akan-five.vercel.app → **akan.mx**) sobre backend Odoo.

> **Naturaleza del contenido:** Todo AKAN es **YMYL (Your Money or Your Life)** — salud + dinero. Google y los motores de IA aplican el listón de calidad más alto que existe. Cada decisión de este plan está filtrada por **E-E-A-T** (Experience, Expertise, Authoritativeness, Trustworthiness) y por el cumplimiento regulatorio mexicano (COFEPRIS / NOM / LFPDPPP). No es opcional: es la condición para rankear y para ser citado por IA.

---

## 0. TL;DR — Qué hacer y en qué orden

| Prioridad | Acción | Bloqueo |
|---|---|---|
| P0 | `robots.txt`, `sitemap.xml`, canónicas, hreflang es-MX, OG/Twitter en todas las páginas | Ninguno — ejecutable hoy |
| P0 | JSON-LD: Organization + MedicalBusiness + WebSite/SearchAction (sitewide) | Ninguno |
| P0 | JSON-LD Product+Offer por tratamiento (precio MXN desde Odoo) | Precios mayoreo farmacia (pendiente #1) para márgenes, no para schema |
| P0 | GA4 + Search Console + Consent Mode v2 + banner LFPDPPP | **GA4 Measurement ID**, **verificación GSC**, **dominio akan.mx** |
| P1 | `llms.txt`, bloques Q&A extraíbles, FAQPage schema | Ninguno |
| P1 | Hub de contenido `/guias/` — primeros 10 artículos MedicalWebPage + revisor médico | Médico con cédula que firme bylines |
| P2 | Programmatic: páginas de condición + ingrediente + comparación | Contenido P1 publicado |
| P2 | Autoridad: PR, citas de fuentes confiables, perfiles de entidad (Wikidata, Google Business) | Dominio + contenido vivo |

---

## 1. Estrategia de Keywords e Intención (es-MX)

### 1.1 Principio rector
El hombre mexicano busca en español coloquial, mezcla marca genérica ("minoxidil") con síntoma ("se me cae el pelo"), y muchas búsquedas tienen carga de **pena/discreción** ("sin receta", "discreto", "en línea"). AKAN debe capturar las tres etapas del funnel sin canibalizarse.

### 1.2 Mapa de keywords por etapa de funnel

#### A) Caída de cabello

| Etapa | Query (es-MX) | Intención | Página destino |
|---|---|---|---|
| Informational | `por qué se me cae el cabello` | Entender causa | Guía: Caída de cabello |
| Informational | `alopecia androgenética hombres` | Diagnóstico | Guía: Caída de cabello |
| Informational | `finasterida para qué sirve` / `efectos secundarios finasterida` | Investigar fármaco | Ingrediente: Finasterida |
| Informational | `minoxidil sirve para la barba / entradas` | Uso | Ingrediente: Minoxidil |
| Commercial | `tratamiento caída cabello hombre` | Comparar opciones | Guía + Tienda |
| Commercial | `mejor tratamiento para la calvicie méxico` | Comparar | Comparativa |
| Commercial | `finasterida vs minoxidil` | Decidir | Comparativa |
| Transactional | `minoxidil méxico precio` | Comprar | Tienda / Producto |
| Transactional | `comprar finasterida en línea méxico` | Comprar | Tienda / Quiz |
| Transactional | `shampoo ketoconazol caída cabello` | Comprar | Producto |
| Transactional | `tratamiento caída cabello a domicilio` | Comprar+discreción | Quiz |

#### B) Desempeño sexual / Disfunción eréctil

| Etapa | Query (es-MX) | Intención | Página destino |
|---|---|---|---|
| Informational | `qué es la disfunción eréctil` | Entender | Guía: Disfunción eréctil |
| Informational | `causas de la disfunción eréctil joven` | Diagnóstico | Guía: DE |
| Informational | `sildenafil para qué sirve` / `cuánto dura el efecto del sildenafil` | Investigar | Ingrediente: Sildenafil |
| Informational | `tadalafil vs sildenafil diferencia` | Comparar | Comparativa |
| Commercial | `pastillas para la disfunción eréctil` | Comparar | Guía + Tienda |
| Commercial | `mejor pastilla para durar más méxico` | Comparar | Comparativa |
| Transactional | `sildenafil sin receta` ⚠️ | Comprar | **Quiz** (no prometer "sin receta" — reencuadrar a "evaluación médica en línea") |
| Transactional | `comprar sildenafil en línea méxico` | Comprar | Tienda / Quiz |
| Transactional | `tadalafil precio méxico` | Comprar | Producto |
| Transactional | `viagra genérico a domicilio confidencial` | Comprar+discreción | Quiz |

> ⚠️ **Manejo de `sin receta`:** Es la query más buscada y la más delicada. AKAN **sí requiere valoración médica**. No optimices para "te lo vendemos sin receta"; optimiza para *"sin filas, sin ir al consultorio — un médico con cédula evalúa tu caso en línea en 2 minutos"*. Captura el tráfico de intención, redirígelo al modelo legal. Esto también protege ante COFEPRIS.

### 1.3 Clusters semánticos (topic authority)
Construye dos **pillar pages** con sus satélites enlazados (silo interno):

- **Pillar "Caída de cabello"** → satélites: finasterida, minoxidil, ketoconazol, biotina, alopecia androgenética, finasterida vs minoxidil, cómo funciona el tratamiento AKAN.
- **Pillar "Disfunción eréctil"** → satélites: sildenafil, tadalafil, sildenafil vs tadalafil, causas de DE, DE en jóvenes, cómo funciona la consulta AKAN.

### 1.4 Implicaciones YMYL / E-E-A-T (obligatorio)
Para que el contenido médico rankee y sea citado:

1. **Experience + Expertise:** Cada página médica lleva **byline de revisor médico** — *"Revisado médicamente por la Dra. [Nombre], Médico Cirujano · Cédula Profesional [######]"* con enlace a su perfil verificable (página de credenciales en akan.mx, link a registro de cédula SEP). Nunca "Equipo Editorial" o "Admin": Google exige una persona real responsable.
2. **Authoritativeness:** Citar fuentes primarias — FDA, COFEPRIS, NOM-005-SSA2, estudios (PubMed/DOI). Enlazar a la ficha técnica del fármaco.
3. **Trustworthiness:** Fecha de publicación + **fecha de última revisión** visible. Política de re-revisión cada ≤12 meses (Google marca como obsoleto contenido médico >12 meses). Página "Quiénes somos" con médicos reales, dirección física, aviso de privacidad, consentimiento informado, política de devoluciones.
4. **Cumplimiento NOM/COFEPRIS:** Disclaimers ("Este contenido es informativo y no sustituye una consulta médica"), no hacer claims de cura, manejar fármacos de prescripción dentro del marco de telemedicina (NOM-004 expediente clínico, NOM-005 planificación; verificar con asesor regulatorio). Esto es a la vez legal **y** señal E-E-A-T.

---

## 2. Checklist de SEO Técnico

### 2.1 Titles + Meta descriptions por página
Estado actual auditado y propuesta optimizada (≤60 car. título, ≤155 desc., keyword al inicio, marca al final):

| Página | Title propuesto | Meta description propuesta |
|---|---|---|
| **index.html** | `Tratamiento para Caída de Cabello y Desempeño — AKAN México` | `Médicos con cédula evalúan tu caso en línea en 2 minutos. Finasterida, minoxidil y más a tu puerta en caja neutra. Confidencial. México.` |
| **tienda.html** | `Tienda — Tratamientos para Cabello y Desempeño \| AKAN` | `Planes médicos para caída de cabello (finasterida, minoxidil) y desempeño (sildenafil, tadalafil). Precios claros en MXN. Entrega discreta.` |
| **quiz.html** | `Evaluación Médica en Línea — 2 minutos, confidencial \| AKAN` | `Responde una breve evaluación. Un médico con cédula revisa tu caso y aprueba tu tratamiento. Te cobramos solo al aprobar; si no, reembolso.` |
| **perfil.html** | `Mi cuenta — Tu tratamiento \| AKAN` | *(noindex — ver 2.4)* |
| **carrito.html** | `Tu carrito \| AKAN` | *(noindex)* |
| **legal.html** | `Aviso de Privacidad, Términos y Consentimiento \| AKAN` | `Aviso de privacidad (LFPDPPP), términos, consentimiento informado de telemedicina y política de devoluciones de AKAN.` |
| **brand.html** | `Nuestra historia y médicos \| AKAN` | `Conoce a los médicos con cédula detrás de AKAN y por qué tratamos la salud masculina con discreción, evidencia y respeto.` |

> Las actuales no están mal — la mejora clave es **anteponer la keyword transaccional** ("Tratamiento para Caída de Cabello") en el home en vez de empezar por la marca, y poner `noindex` en cuenta/carrito.

### 2.2 Canónicas + hreflang
Una sola región (es-MX), una sola URL canónica por página. Añadir en `<head>` de cada página indexable:

```html
<link rel="canonical" href="https://akan.mx/tienda.html">
<link rel="alternate" hreflang="es-MX" href="https://akan.mx/tienda.html">
<link rel="alternate" hreflang="x-default" href="https://akan.mx/tienda.html">
```

- Decide **con o sin `.html`** y sé consistente (recomendado: configurar Vercel `cleanUrls: true` → `/tienda`, y canonizar a esa forma). Evita duplicados www/no-www y trailing slash.
- 301 de akan-five.vercel.app → akan.mx una vez migrado el dominio (vía `vercel.json` redirects).

### 2.3 robots.txt (crear en raíz)
Estrategia 2026: **permitir bots de búsqueda/RAG** (citan = tráfico), decisión consciente sobre bots de entrenamiento. Para una marca nueva que quiere visibilidad, **permitir todo** maximiza descubrimiento.

```
# https://akan.mx/robots.txt
User-agent: *
Allow: /
Disallow: /perfil.html
Disallow: /carrito.html
Disallow: /*?*            # evita indexar URLs con parámetros de carrito/UTM

# Bots de búsqueda IA (permitir para ser citado)
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://akan.mx/sitemap.xml
```

> Nota: bloquear `GPTBot`/`ClaudeBot` (entrenamiento) solo si no quieres que tu contenido entrene modelos. Para una marca emergente, recomiendo **permitirlos** — el upside de presencia en IA supera el riesgo.

### 2.4 XML Sitemap (crear en raíz)
Solo páginas indexables (excluir perfil/carrito):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://akan.mx/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://akan.mx/tienda.html</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://akan.mx/quiz.html</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://akan.mx/brand.html</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://akan.mx/legal.html</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <!-- añadir cada /guias/* al publicarse -->
</urlset>
```
Marca perfil/carrito con `<meta name="robots" content="noindex,follow">`.

### 2.5 Open Graph + Twitter Cards
El home ya tiene OG básico. Completar en **todas** las páginas y añadir Twitter:

```html
<meta property="og:site_name" content="AKAN">
<meta property="og:locale" content="es_MX">
<meta property="og:url" content="https://akan.mx/tienda.html">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Tienda AKAN — Tratamientos para cabello y desempeño">
<meta name="twitter:description" content="Planes médicos con precios claros en MXN. Entrega discreta a tu puerta.">
<meta name="twitter:image" content="https://akan.mx/assets/premium/og_akan_light.jpg">
```
- Imagen OG 1200×630, <300 KB, con texto legible (la marca + value prop). Usar URL **absoluta** (hoy `index.html` usa ruta relativa `assets/...` → corregir a absoluta para que LinkedIn/WhatsApp la rendericen).

### 2.6 Headings semánticos
- **Un solo `<h1>` por página** con la keyword principal (home: "Tratamiento médico para la caída de cabello y el desempeño"). Hoy hay riesgo de múltiples h1 por el diseño de hero — auditar.
- Jerarquía lógica h2→h3, sin saltos. Las preguntas de FAQ como `<h3>` (refuerzan FAQPage).
- HTML semántico: `<main>`, `<nav>`, `<article>` para guías, `<footer>`.

### 2.7 Core Web Vitals
El sitio es estático/rápido — ventaja real. Vigilar:

| Métrica | Riesgo en AKAN | Mitigación |
|---|---|---|
| **LCP** | Fuente Fraunces/Hanken bloquea render; hero image grande | `font-display: swap` (ya en el `<link>`), `preload` del hero, servir AVIF/WebP, `fetchpriority="high"` en LCP image |
| **CLS** | Productos cargados async desde Odoo → salto de layout | Reservar dimensiones (`min-height`, skeleton), `width/height` en imgs |
| **INP** | JS de quiz/carrito | Diferir JS no crítico, dividir tareas largas |
| **Datos async Odoo** | Contenido del catálogo no está en HTML inicial → SEO ve página vacía | **Crítico:** pre-renderizar/SSG los datos de producto en el HTML estático en build-time, o inyectar JSON-LD Product en server. No dejar precios solo en JS client-side. |

> El punto de CWV más importante de AKAN no es velocidad — es que **el contenido de tienda vive en JS que lee Odoo**. Googlebot renderiza JS pero con retraso y los bots de IA frecuentemente **no** ejecutan JS. Hornea el contenido clave (nombres de producto, precios, JSON-LD) en el HTML estático durante el build.

### 2.8 Otros
- HTTPS forzado (Vercel lo da) + HSTS.
- Mobile-first: el target es 100% móvil (hombres jóvenes). Tap targets ≥48px, sin intersticiales molestos.
- `lang="es-MX"` en `<html>` (ya presente en index ✅ — replicar en todas).
- 404 personalizada con búsqueda y CTA al quiz.
- Favicons/PWA ya presentes ✅.

---

## 3. Blueprint de Structured Data (JSON-LD)

Usar **un grafo `@graph` con `@id` estables** y cross-references (mejor práctica healthcare 2026). Inyectar en build-time, no solo client-side.

### 3.1 Sitewide (en `<head>` de todas las páginas)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization","MedicalBusiness"],
      "@id": "https://akan.mx/#org",
      "name": "AKAN",
      "url": "https://akan.mx",
      "logo": "https://akan.mx/assets/premium/akan-logo.png",
      "description": "Plataforma de telemedicina en México para salud masculina: caída de cabello y desempeño sexual. Médicos con cédula, evaluación en línea y entrega discreta.",
      "areaServed": { "@type": "Country", "name": "México" },
      "availableLanguage": "es-MX",
      "medicalSpecialty": ["Dermatology","Urology"],
      "priceRange": "$$",
      "sameAs": [
        "https://www.instagram.com/akan.mx",
        "https://www.facebook.com/akan.mx"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": "Spanish",
        "areaServed": "MX"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://akan.mx/#website",
      "url": "https://akan.mx",
      "name": "AKAN",
      "inLanguage": "es-MX",
      "publisher": { "@id": "https://akan.mx/#org" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": "https://akan.mx/tienda.html?q={search_term_string}" },
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
</script>
```

### 3.2 Por página

| Página | Schema(s) |
|---|---|
| index.html | Organization+MedicalBusiness, WebSite/SearchAction, FAQPage (FAQ del home) |
| tienda.html | BreadcrumbList, `ItemList` de los Product/Offer, FAQPage |
| Producto (cada tratamiento) | `Product` + `Offer` (precio MXN), `MedicalWebPage` si describe el fármaco, BreadcrumbList |
| quiz.html | `MedicalWebPage` + `MedicalProcedure`/`MedicalTest` (la evaluación), BreadcrumbList |
| brand.html | `MedicalClinic` + `Physician` (cada médico), BreadcrumbList |
| Guías `/guias/*` | `MedicalWebPage` + FAQPage + BreadcrumbList + reviewer (`reviewedBy`) |
| legal.html | `WebPage` |

### 3.3 Product + Offer (por tratamiento — precio desde Odoo)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://akan.mx/tienda.html#minoxidil",
  "name": "Minoxidil 5% — Tratamiento para caída de cabello",
  "brand": { "@id": "https://akan.mx/#org" },
  "category": "Tratamiento capilar",
  "description": "Minoxidil tópico al 5% para frenar la caída y estimular el crecimiento. Requiere valoración médica en línea con médico con cédula.",
  "image": "https://akan.mx/assets/products/minoxidil.jpg",
  "offers": {
    "@type": "Offer",
    "url": "https://akan.mx/tienda.html#minoxidil",
    "priceCurrency": "MXN",
    "price": "499.00",
    "availability": "https://schema.org/InStock",
    "availableDeliveryMethod": "https://schema.org/ParcelService",
    "seller": { "@id": "https://akan.mx/#org" },
    "eligibleRegion": { "@type": "Country", "name": "México" }
  },
  "isProprietaryFor": "Prescription",
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Requiere receta médica", "value": "Sí — valoración en línea incluida" },
    { "@type": "PropertyValue", "name": "Entrega", "value": "Discreta, caja neutra" }
  ]
}
</script>
```
> Repetir para **Finasterida**, **Ketoconazol shampoo**, **Biotina**, **Sildenafil**, **Tadalafil**. El `price` se inyecta desde Odoo en build. Para fármacos de prescripción, dejar explícito "requiere valoración médica" — alinea con la realidad legal y da claridad de entidad a la IA.

### 3.4 FAQPage (home + cada guía)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Necesito receta para el tratamiento de AKAN?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí. Un médico con cédula profesional revisa tu evaluación en línea y, si es apropiado para ti, aprueba el tratamiento. La valoración está incluida. Si el médico no aprueba, te reembolsamos."
      }
    },
    {
      "@type": "Question",
      "name": "¿La entrega es discreta?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí. Enviamos en caja neutra, sin marcas ni referencias al contenido, a cualquier dirección en México."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto tarda la evaluación médica?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Alrededor de 2 minutos. Respondes unas preguntas y un médico revisa tu caso de forma confidencial."
      }
    }
  ]
}
</script>
```

### 3.5 Physician (en brand.html — clave para E-E-A-T)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "@id": "https://akan.mx/brand.html#dra-ejemplo",
  "name": "Dra. [Nombre Apellido]",
  "medicalSpecialty": "Dermatology",
  "memberOf": { "@id": "https://akan.mx/#org" },
  "identifier": { "@type": "PropertyValue", "name": "Cédula Profesional", "value": "########" },
  "image": "https://akan.mx/assets/medicos/dra-ejemplo.jpg"
}
</script>
```

### 3.6 Validación
Probar todo en **Rich Results Test** (Google) + **Schema Markup Validator** (schema.org) antes de cada deploy. Monitorear "Mejoras" en Search Console.

---

## 4. Contenido / SEO Programático — Hub de Guías

### 4.1 Estructura del hub
Crear `/guias/` como hub editorial. Tres tipos de página, cada una `MedicalWebPage` + FAQ + revisor médico:

1. **Páginas de condición** (pillar): Caída de cabello, Disfunción eréctil.
2. **Páginas de ingrediente** (satélite): Finasterida, Minoxidil, Ketoconazol, Biotina, Sildenafil, Tadalafil.
3. **Comparativas / "cómo funciona"**: Finasterida vs Minoxidil, Sildenafil vs Tadalafil, Cómo funciona la consulta AKAN.

Cada página: respuesta directa en el primer párrafo (40–60 palabras), tabla de hechos comparables (dosis, requiere receta, tiempo de efecto), FAQ, CTA al quiz, byline de revisor, fecha de revisión, citas.

### 4.2 Los primeros 10 artículos (priorizados)

| # | Artículo (URL) | Query objetivo principal | Tipo | Por qué primero |
|---|---|---|---|---|
| 1 | `/guias/caida-de-cabello` | tratamiento caída cabello hombre | Condición/pillar | Pillar de mayor volumen; ancla todo el silo capilar |
| 2 | `/guias/disfuncion-erectil` | qué es la disfunción eréctil / pastillas para la disfunción eréctil | Condición/pillar | Pillar del segundo vertical |
| 3 | `/guias/finasterida` | finasterida para qué sirve / efectos secundarios finasterida | Ingrediente | Alto volumen + dudas de seguridad (gana confianza) |
| 4 | `/guias/minoxidil` | minoxidil méxico / minoxidil sirve para entradas | Ingrediente | Query transaccional fuerte |
| 5 | `/guias/sildenafil` | sildenafil para qué sirve / cuánto dura el efecto | Ingrediente | Captura la intención de "sin receta" de forma segura |
| 6 | `/guias/tadalafil` | tadalafil precio méxico / tadalafil para qué sirve | Ingrediente | Complementa DE, query comercial |
| 7 | `/guias/finasterida-vs-minoxidil` | finasterida vs minoxidil | Comparativa | Decision-stage; alta conversión |
| 8 | `/guias/sildenafil-vs-tadalafil` | tadalafil vs sildenafil diferencia | Comparativa | Decision-stage; muy citada por IA |
| 9 | `/guias/como-funciona-akan` | tratamiento caída cabello en línea / consulta médica en línea méxico | Cómo funciona | Explica el modelo (cobro-primero, reembolso, cédula) |
| 10 | `/guias/ketoconazol-shampoo` | shampoo ketoconazol caída cabello | Ingrediente | Long-tail de baja competencia, gana rápido |

### 4.3 Plantilla de artículo (estructura obligatoria)
```
H1: [Keyword principal en lenguaje natural]
[Párrafo de respuesta directa, 40–60 palabras — esto es lo que cita la IA]
Byline: Revisado médicamente por Dra. X · Cédula ###### · Actualizado: AAAA-MM-DD
H2: ¿Qué es / cómo funciona?
H2: Tabla de hechos (dosis · requiere receta · tiempo de efecto · efectos comunes)
H2: ¿Es para ti? → CTA al Quiz
H2: Preguntas frecuentes (cada Q como H3 + FAQPage schema)
H2: Referencias (FDA, COFEPRIS, NOM, PubMed con DOI)
Disclaimer: contenido informativo, no sustituye consulta médica.
```
Interlinking: cada ingrediente enlaza a su condición pillar y a la tienda/quiz; cada comparativa enlaza a ambos ingredientes. Breadcrumb `Inicio > Guías > [Artículo]`.

---

## 5. AEO / GEO — Optimización para Motores de Respuesta IA

### 5.1 En qué difiere de SEO clásico
| SEO clásico | AEO / GEO |
|---|---|
| Optimiza para **rankear** (posición en SERP) | Optimiza para **ser comprendido y citado** dentro de una respuesta generada |
| El usuario hace clic | La IA sintetiza; a veces no hay clic — la **mención de marca** es el premio |
| Keywords y backlinks | Claridad de entidad, hechos extraíbles, consenso entre fuentes |
| Googlebot renderiza JS | Muchos bots IA **no ejecutan JS** → el hecho debe estar en el HTML plano |
| Una página gana | La IA mezcla varias fuentes; quieres ser **una de las fuentes confiables** |

### 5.2 Tácticas concretas para AKAN

1. **Bloques Q&A extraíbles:** En cada página, preguntas como `<h3>` seguidas de una respuesta autosuficiente de 40–60 palabras. La IA "encuentra, copia, cita". Espejar siempre con FAQPage schema (sección 3.4).
2. **Definiciones autoritativas y concisas:** Abrir cada guía con una definición limpia ("El minoxidil es un vasodilatador tópico que prolonga la fase de crecimiento del cabello..."). Esa primera frase es la que se cita.
3. **Hechos comparables estructurados:** Tablas con **precio (MXN), dosis, ¿requiere receta? (Sí/No), tiempo de efecto, vía**. La IA ama tablas — y "¿se necesita receta?" es exactamente lo que un usuario le pregunta a ChatGPT sobre AKAN.
4. **Claridad de entidad:** Que la IA entienda inequívocamente "AKAN = plataforma de telemedicina mexicana de salud masculina". Reforzar con: JSON-LD Organization consistente, `sameAs` a redes/Wikidata, descripción idéntica repetida en home, brand, OG, y `llms.txt`.
5. **`llms.txt`** en raíz (ver 5.3).
6. **Ser referenciado por fuentes confiables:** La IA pondera consenso. Conseguir menciones en medios de salud MX, directorios de telemedicina, reseñas. (Ver Fase 3.)
7. **Frescura:** fecha de actualización visible — los motores IA priorizan contenido fechado y reciente para temas médicos.
8. **HTML plano:** repetir — precios, nombres de producto y respuestas FAQ deben existir en el HTML servido, no solo tras un fetch JS a Odoo.

### 5.3 `llms.txt` (crear en raíz — `https://akan.mx/llms.txt`)

```markdown
# AKAN

> AKAN es una plataforma mexicana de telemedicina para la salud masculina. Conectamos a hombres en México con médicos con cédula profesional que evalúan su caso en línea (~2 min) y, si es apropiado, aprueban tratamientos para la caída de cabello y el desempeño sexual, enviados de forma discreta en caja neutra. Cobramos al momento y reembolsamos si el médico no aprueba el tratamiento. Confidencial. Solo México (es-MX).

## Cómo funciona
- Evaluación médica en línea en ~2 minutos.
- Revisión por un médico con cédula profesional.
- Cobro al solicitar; reembolso completo si el médico no aprueba.
- Entrega discreta en caja neutra a todo México.

## Tratamientos
- [Caída de cabello](https://akan.mx/guias/caida-de-cabello): finasterida, minoxidil, ketoconazol shampoo, biotina.
- [Disfunción eréctil / desempeño](https://akan.mx/guias/disfuncion-erectil): sildenafil, tadalafil.

## Guías médicas (revisadas por médicos)
- [Finasterida](https://akan.mx/guias/finasterida)
- [Minoxidil](https://akan.mx/guias/minoxidil)
- [Sildenafil](https://akan.mx/guias/sildenafil)
- [Tadalafil](https://akan.mx/guias/tadalafil)
- [Finasterida vs Minoxidil](https://akan.mx/guias/finasterida-vs-minoxidil)
- [Sildenafil vs Tadalafil](https://akan.mx/guias/sildenafil-vs-tadalafil)
- [Cómo funciona AKAN](https://akan.mx/guias/como-funciona-akan)

## Páginas principales
- [Tienda](https://akan.mx/tienda.html)
- [Evaluación médica](https://akan.mx/quiz.html)
- [Nuestros médicos](https://akan.mx/brand.html)
- [Aviso de privacidad y legales](https://akan.mx/legal.html)

## Hechos clave
- País: México. Idioma: español (es-MX).
- ¿Requiere receta? Sí — valoración médica en línea incluida.
- Médicos con cédula profesional verificada.
- Privacidad: cumplimos la LFPDPPP.
```

---

## 6. Analítica y Medición

### 6.1 GA4 — configuración
- Crear propiedad GA4 → obtener **Measurement ID `G-XXXXXXXXXX`** *(bloqueado en usuario)*.
- Instalar vía **GTM** (recomendado, desacopla tags del código estático) o gtag directo. Con headless/Odoo, GTM da más flexibilidad.
- Activar **Google Signals** con cautela (datos sensibles de salud — evaluar implicación de privacidad; por defecto **no** enviar datos de salud a remarketing).
- **Consent Mode v2** obligatorio (ver 6.3): tags en modo `denied` hasta consentimiento.

### 6.2 Eventos a trackear (funnel completo)

| Evento | Tipo | Cuándo se dispara | Parámetros clave |
|---|---|---|---|
| `page_view` | auto | Carga de página | `page_location`, `page_title` |
| `view_item` | ecommerce | Ver producto en tienda | `currency:MXN`, `value`, `items[]` |
| `select_item` | ecommerce | Clic en producto desde lista | `items[]` |
| `quiz_start` | custom | Inicia la evaluación | `condition` (cabello/desempeño) |
| `quiz_step` | custom | Avanza paso del quiz | `step_number`, `step_name` |
| `quiz_complete` | custom | Termina evaluación | `condition`, `recommended_plan` |
| `add_to_cart` | ecommerce | Agrega tratamiento | `currency:MXN`, `value`, `items[]` |
| `begin_checkout` | ecommerce | Inicia checkout | `currency:MXN`, `value`, `items[]` |
| `add_shipping_info` | ecommerce | Captura dirección | `shipping_tier` |
| `add_payment_info` | ecommerce | Captura pago | `payment_type` |
| `purchase` | ecommerce | Compra confirmada | `transaction_id`, `value`, `currency:MXN`, `items[]` |
| `doctor_approved` | custom | Médico aprueba (Odoo→GA via Measurement Protocol) | `transaction_id` |
| `doctor_rejected_refund` | custom | Médico no aprueba → reembolso | `transaction_id` |
| `sign_up` / `login` | custom | Registro / `account_login` | `method` |
| `whatsapp_click` | custom | Clic a WhatsApp | `location` |

> **Privacidad de salud:** Nunca enviar a GA4 datos que revelen condición individual identificable. `condition` como dimensión agregada (cabello/desempeño) está bien; no enviar respuestas clínicas del quiz, ni email/teléfono sin hashear. Considerar excluir parámetros sensibles del quiz del payload.

**Ejemplo `add_to_cart` (dataLayer / gtag):**
```javascript
gtag('event', 'add_to_cart', {
  currency: 'MXN',
  value: 499.00,
  items: [{ item_id: 'minoxidil-5', item_name: 'Minoxidil 5%',
            item_category: 'cabello', price: 499.00, quantity: 1 }]
});
```

### 6.3 Search Console
- Verificar dominio **akan.mx** (DNS TXT, preferido — cubre todos los subdominios) *(bloqueado en usuario + dominio)*.
- Enviar `sitemap.xml`. Monitorear: Cobertura, Mejoras (FAQ/Product/Breadcrumb rich results), Core Web Vitals, queries reales (alimenta de vuelta la sección 1).
- Vincular GA4 ↔ Search Console.
- Dar de alta también en **Bing Webmaster Tools** (Bing alimenta a ChatGPT/Copilot — relevante para AEO).

### 6.4 Consentimiento y privacidad (LFPDPPP)
México: **Ley Federal de Protección de Datos Personales en Posesión de los Particulares**. Salud = dato **sensible** → requiere consentimiento **expreso**.
- **Banner de cookies** con opciones granulares (necesarias / analítica / marketing), bloqueando tags hasta aceptar (Consent Mode v2 `analytics_storage`, `ad_storage` en `denied` por defecto).
- **Aviso de Privacidad** completo en `legal.html` (ya existe la página) con: identidad del responsable, finalidades, datos sensibles de salud, transferencias, derechos **ARCO**, mecanismo para ejercerlos. Consentimiento informado de telemedicina separado.
- IP anonimizada, retención de datos limitada en GA4.

### 6.5 KPIs y dashboard
**KPIs primarios:**
- Tasa de conversión Visita → `quiz_start` → `quiz_complete` → `purchase` (funnel completo).
- CAC y ROAS por canal (cuando haya ads).
- Tasa de aprobación médica (`doctor_approved` / `quiz_complete`).
- AOV (valor medio de pedido, MXN) y recurrencia/suscripción.
- Top queries orgánicas y % de tráfico orgánico (GSC).
- **Citaciones IA** (menciones de AKAN en ChatGPT/Perplexity/AI Overviews) — medir manualmente al inicio o con herramienta tipo monitor de IA.

**Spec de dashboard (GA4 Exploración / Looker Studio):**
1. **Funnel de adquisición** (embudo): page_view → view_item → quiz_start → quiz_complete → begin_checkout → purchase, con % de caída por paso.
2. **Rendimiento por canal**: sesiones, conversiones, ingresos por `source/medium`.
3. **Productos**: view_item, add_to_cart, purchase por tratamiento; vertical cabello vs desempeño.
4. **SEO orgánico** (Looker + GSC): clics, impresiones, CTR, posición media, top queries/páginas.
5. **Salud del quiz**: completion rate, drop-off por `quiz_step`.

### 6.6 Complementos que respetan privacidad (opcional)
GA4 sigue siendo el primario (requerido por el usuario). Como complemento defensivo en un contexto de datos de salud:
- **GTM server-side** (tagging en servidor) → controla qué se envía a Google, reduce pérdida por ad-blockers, mejora privacidad.
- **Plausible / Fathom** (cookieless, sin datos personales) como fuente de verdad de tráfico agregado sin fricción de consentimiento — útil para validar GA4 y para métricas que no quieres atar a consentimiento.

---

## 7. Roadmap por Fases

### Fase 1 — Fundación (AHORA · ~1–2 semanas)
**Ejecutable de inmediato (sin bloqueos):**
- [ ] `robots.txt`, `sitemap.xml`, `llms.txt` en raíz.
- [ ] Canónicas + hreflang es-MX + `noindex` en perfil/carrito en todas las páginas.
- [ ] Titles/meta optimizados (sección 2.1); OG/Twitter completos con URLs **absolutas**.
- [ ] JSON-LD sitewide (Organization+MedicalBusiness, WebSite/SearchAction) + FAQPage en home + Product/Offer por tratamiento (precio inyectado desde Odoo en build).
- [ ] Hornear contenido de tienda (nombres, precios, JSON-LD) en HTML estático en build-time (fix crítico AEO/SEO).
- [ ] Auditar y corregir un solo `<h1>` por página + jerarquía de headings.
- [ ] CWV: preload de hero/fuente, dimensiones reservadas para catálogo async.

**Bloqueado en usuario (preparar para activar):**
- [ ] **Dominio akan.mx** → migrar + 301 desde vercel.app + `cleanUrls`.
- [ ] **GA4 Measurement ID** → instalar GTM + Consent Mode v2 + eventos del funnel.
- [ ] **Verificación Search Console** (TXT DNS) + enviar sitemap + Bing Webmaster.
- [ ] Banner de consentimiento LFPDPPP + Aviso de Privacidad/consentimiento en legal.html.

### Fase 2 — Contenido (semanas 2–8)
- [ ] Lanzar hub `/guias/` con plantilla MedicalWebPage + FAQ + revisor.
- [ ] Publicar los 10 artículos priorizados (sección 4.2), 2 pillars primero.
- [ ] **Reclutar/asignar médico(s) con cédula** que firmen bylines + página de credenciales verificables (bloqueo de contenido).
- [ ] Interlinking de silos cabello / desempeño.
- [ ] Página `brand.html` con Physician schema + médicos reales (E-E-A-T).
- [ ] Imágenes OG por guía; alt text descriptivo en todo.

### Fase 3 — Autoridad, Enlaces y AEO (mes 2+)
- [ ] Programmatic: completar páginas de ingrediente/comparación restantes y páginas de producto individuales.
- [ ] **Entidad:** crear Google Business Profile, perfil Wikidata, perfiles sociales consistentes (`sameAs`).
- [ ] **Link building / PR:** menciones en medios de salud MX, directorios de telemedicina, reseñas de pacientes (con cumplimiento), partnerships.
- [ ] Monitoreo de citaciones IA (ChatGPT/Perplexity/AI Overviews) y refinamiento de bloques Q&A según qué cita la IA.
- [ ] Re-revisión médica de contenido cada ≤12 meses (freshness + YMYL).
- [ ] Iterar keywords con datos reales de GSC.

---

## 8. Riesgos y Guardarraíles
- **YMYL es implacable:** sin revisor médico real y verificable, el contenido **no rankeará** y puede dañar la confianza de marca. El médico con cédula es el cuello de botella crítico de la Fase 2.
- **Regulatorio (COFEPRIS / NOM):** fármacos de prescripción en línea — validar el modelo con asesor regulatorio. Nunca prometer "sin receta"; siempre "valoración médica en línea incluida".
- **Privacidad de salud (LFPDPPP):** datos sensibles → consentimiento expreso, no filtrar datos clínicos a GA4/ads. Un error aquí es legal, no solo de SEO.
- **Contenido en JS:** si los precios/productos solo viven en el fetch a Odoo client-side, los bots de IA (que no ejecutan JS) verán una página vacía. **Hornear en build-time** es la decisión técnica de mayor apalancamiento de todo el plan.

---

*Fin del plan. Mantener este documento como fuente de verdad; versionar cambios.*
