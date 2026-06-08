# AKAN — Brief Completo para Construccion de Web
## Documento de referencia para AI / Desarrollador
### Version 1.0 — Junio 2026

---

## 1. QUE ES AKAN

**AKAN** (dios maya de la salvacion) es una plataforma de telemedicina DTC (direct-to-consumer) para salud masculina en Mexico. Modelo tipo Hims/Keeps pero para el mercado mexicano.

**Tagline:** "Sin pena. Sin filas. A tu puerta."

**Categorias de producto:**
- Caida de cabello (finasteride, minoxidil, shampoo ketoconazol, suplementos)
- Desempeno sexual (proxima fase)

**Target:** Hombres mexicanos 25-45, clase media-alta, zona metropolitana (CDMX, Monterrey, Guadalajara). Perfil "fresa" — profesionales, conscientes de imagen, tech-savvy, que NO van al doctor por verguenza.

**Modelo de negocio:** Quiz → Consulta medica (telemedicina) → Suscripcion mensual → Entrega discreta a domicilio.

**Diferenciadores vs competencia USA:**
- Medicos mexicanos con cedula profesional verificada (CONACEM)
- Precios accesibles para Mexico (no pricing USA)
- Espanol nativo, no traduccion
- Entrega discreta a toda la republica
- La barrera de verguenza es MAYOR en la cultura mexicana — el tono debe romperla

---

## 2. DESIGN SYSTEM — TOKENS CSS

```css
:root {
  /* Colores principales */
  --paper: #F3EDE1;          /* Fondo body, cards, inputs */
  --paper-deep: #EAE1D0;    /* Fondo secciones alternas */
  --ink: #191712;            /* Texto principal, footer, headers oscuros */
  --ink-soft: #3B372E;       /* Texto secundario, subtitulos */
  --green: #1F3D2E;          /* Color primario — nav, botones, acento brand */
  --green-light: #2A5740;    /* Hover verde, variante */
  --clay: #C5623E;           /* CTAs, acentos, overlines, urgencia */
  --sand: #D9CCB2;           /* Bordes sutiles, backgrounds neutrales */

  /* Semanticos */
  --verde: #22C55E;          /* Exito, activo, progreso */
  --amarillo: #EAB308;       /* En proceso, advertencia */
  --rojo: #EF4444;           /* Error, alerta, punto de dolor */

  /* Utilidades */
  --line: rgba(25,23,18,0.14);       /* Bordes, separadores */
  --overlay: rgba(25,23,18,0.60);    /* Overlay imagenes */

  /* Border radius */
  --r-sm: 12px;              /* Inputs, cards pequenas */
  --r-md: 16px;              /* Cards, containers */
  --r-lg: 22px;              /* Imagenes hero, secciones */
  --r-pill: 100px;           /* Botones, badges, pills */

  /* Tipografia */
  --font-display: 'Fraunces', serif;       /* Headlines, CTAs, brand voice */
  --font-body: 'Hanken Grotesk', sans-serif; /* Body, UI, nav, labels */
}
```

### Google Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Escala Tipografica
| Nivel | Font | Weight | Size | Line-height | Letter-spacing | Uso |
|-------|------|--------|------|-------------|----------------|-----|
| Display | Fraunces | 700 | clamp(38px,5vw,64px) | 1.08 | -0.025em | Hero principal |
| H1 | Fraunces | 700 | clamp(30px,4vw,48px) | 1.12 | -0.02em | Titulos seccion |
| H2 | Fraunces | 600 | clamp(26px,3vw,36px) | 1.15 | — | Subtitulos seccion |
| H3 | Fraunces | 600 | 24px | 1.2 | — | Titulos cards |
| Body Large | Hanken | 400 | 21px | 1.6 | — | Intro parrafos |
| Body | Hanken | 400 | 16px | 1.6 | — | Texto general |
| Body Small | Hanken | 400 | 14px | 1.5 | — | Captions, meta |
| Overline | Hanken | 700 | 12px | 1.2 | 0.08em uppercase | Labels seccion |
| Button | Hanken | 600 | 16px | 1 | 0.02em | CTAs |

### Botones
| Tipo | Background | Color | Padding | Border-radius | Extra |
|------|-----------|-------|---------|---------------|-------|
| Primary | var(--green) | var(--paper) | 16px 36px | pill (100px) | — |
| CTA | var(--clay) | var(--paper) | 16px 36px | pill | animation: cta-pulse 3s infinite |
| Secondary | transparent | var(--ink) | 16px 36px | pill | border: 1.5px solid var(--ink) |
| White | white | var(--green) | 16px 36px | pill | — |
| Ghost | transparent | var(--ink-soft) | 16px 36px | pill | — |

**Transition global:** `all 0.25s cubic-bezier(0.16, 1, 0.3, 1)`
**Hover:** `transform: translateY(-2px)` + sombra mas intensa

### Badges / Pills
```css
/* Ejemplo: badge verde */
background: var(--green);
color: var(--paper);
padding: 6px 16px;
border-radius: var(--r-pill);
font-size: 13px;
font-weight: 600;
```

### Inputs
```css
padding: 14px 16px;
border-radius: var(--r-sm);  /* 12px */
border: 1.5px solid var(--line);
background: white;
font-family: var(--font-body);
font-size: 15px;
/* Focus: */
border-color: var(--clay);
```

### Cards
```css
/* Default */
background: white;
border: 1px solid var(--line);
border-radius: var(--r-md);  /* 16px */
padding: 24px;

/* Elevated */
box-shadow: 0 8px 32px rgba(0,0,0,0.08);

/* Accent */
background: var(--green);
color: var(--paper);
```

---

## 3. ANIMACIONES

Todas activadas por IntersectionObserver al entrar en viewport (threshold: 0.15).

| Nombre | CSS Class | Duracion | Easing | Efecto | Donde usarla |
|--------|-----------|----------|--------|--------|--------------|
| SlideUp | `.anim` | 0.7s | cubic-bezier(0.16,1,0.3,1) | translateY(40px→0) + opacity 0→1 | Contenido general |
| SlideLeft | `.anim-left` | 0.7s | cubic-bezier(0.16,1,0.3,1) | translateX(-60px→0) + opacity | Imagenes, col izq |
| SlideRight | `.anim-right` | 0.7s | cubic-bezier(0.16,1,0.3,1) | translateX(60px→0) + opacity | Texto, col derecha |
| ScaleIn | `.anim-scale` | 0.5s | cubic-bezier(0.34,1.56,0.64,1) | scale(0.85→1) + opacity | CTA final, hero |
| Stagger | `.stagger` | 0.6s | cubic-bezier(0.16,1,0.3,1) | Hijos aparecen con 0.1s delay entre ellos | Grids, listas, cards |
| TextReveal | `.word-reveal` | 0.5s/word | cubic-bezier(0.16,1,0.3,1) | Palabra por palabra con blur(8px→0) + translateY(20px→0) | Hero headline |
| BlobMorph | `@keyframes blob-morph` | 20s loop | ease-in-out | border-radius morphing organico | Fondo hero |
| BlobFloat | `@keyframes blob-float` | 25s loop | ease-in-out | translateY + rotate | Companion del blob |
| GradientShift | `@keyframes gradient-shift` | 8s loop | ease | background-position shift | Stats bar |
| CountUp | JS + `[data-target]` | 2s | easeOutCubic | Numeros suben de 0 al target | Metricas |
| ProgressFill | `.results-progress-fill` | 0.8s | cubic-bezier(0.16,1,0.3,1) | width 0→target% | Barras de resultados |
| CTAPulse | `@keyframes cta-pulse` | 3s loop | ease-in-out | scale(1→1.03→1) + box-shadow | Boton CTA principal |
| Parallax | JS scroll | Continuous | — | translateY at 0.3x scroll speed | Banner lifestyle |

### JS Observer Pattern
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.anim, .anim-left, .anim-right, .anim-scale, .stagger, .word-reveal')
  .forEach(el => observer.observe(el));
```

---

## 4. ESTRUCTURA DE PAGINAS — SITEMAP

### Homepage (landing principal)
```
01. Nav — Glassmorphism sticky (bg: paper/0.6 + backdrop-filter blur 20px)
02. Hero — Full viewport, 2 columnas (texto + foto hero_v2)
    - Headline con TextReveal: "Tu pelo merece un medico, no Google"
    - Sub: "Tratamiento medico real para caida de cabello. Evaluacion en 3 min."
    - CTA Clay: "Comenzar evaluacion →"
    - Floating pills con glassmorphism: "Discreto", "Con cedula", "A tu puerta"
    - Background: animated gradient blobs (green→sand→clay)
03. Stats Bar — Gradiente animado (green→clay→green)
    - CountUp: "10,000+" hombres | "87%" ven resultados | "3 min" evaluacion | "$X/mes"
04. Como Funciona — 3 cards (usar diagram_3_pasos.jpg como referencia)
    - Step 1: Evaluacion (quiz 3 min)
    - Step 2: Tu Medico (cedula verificada)
    - Step 3: En tu Puerta (empaque discreto)
05. Tratamientos — 2 columnas (imagen left + texto right, alternando)
    - Card: Caida de Cabello (finasteride + minoxidil)
    - Card: Kit Completo (shampoo + suplemento + topico)
    - Usar: akan_hero_products.jpg, akan_product_family.jpg
06. Ciencia / Como Funciona — Diagrama foliculo
    - Usar: diagram_como_funciona_foliculo.jpg
    - Explicar: DHT → foliculo debil → Finasteride bloquea → Minoxidil activa
07. Quiz Preview — Card interactiva
    - "¿Que tipo de caida tienes?" con iconos (corona, general, entradas)
    - Inspirado en Keeps: segmentar por patron de caida
08. Resultados Timeline — Fondo verde oscuro
    - Mes 1: "La caida se reduce" (30%)
    - Mes 3: "Se detiene la caida" (65%)
    - Mes 6: "Crecimiento nuevo" (87%)
    - Barras progresivas animadas con ProgressFill
09. Medicos — 2 cards (doctora_01 + doctor_02)
    - Nombre, especialidad, cedula
    - "Tu medico revisa tu caso personalmente"
10. Parallax Banner — Lifestyle photo (hero_rooftop_condesa.jpg)
    - Overlay con quote aspiracional
11. Testimonios — Grid/carousel
    - Avatars (avatar_01 a 06)
    - Nombre, edad, ciudad (ej: "Carlos, 32, CDMX")
    - Quotes sobre experiencia
12. Producto / Packaging — Bento grid
    - akan_bathroom_shelf.jpg (lifestyle)
    - packaging_01_closed.jpg, packaging_02_unboxing.jpg
    - Checklist: "Sin marca visible", "Caja neutra", "Factura digital"
13. Por Que AKAN — Stat section
    - Usar: diagram_por_que_akan.jpg como referencia
    - "2 de cada 3" hombres pierden cabello antes de los 35
    - 4 beneficios con checks
14. Footer CTA — Gradiente impactante (green→green-light)
    - Headline grande: "Tu pelo no va a esperar"
    - CTA con pulse: "Comenzar evaluacion →"
    - Trust pills: "Gratis", "3 minutos", "Sin compromiso"
15. Footer — Fondo ink, 4 columnas
    - Tratamientos | Nosotros | Legal | Contacto
    - Social icons
    - "AKAN" wordmark
    - Disclaimer medico
```

### Paginas adicionales (futuro)
- `/quiz` — Evaluacion de caida de cabello (3 min)
- `/tratamientos` — Catalogo de productos
- `/como-funciona` — Ciencia detallada
- `/medicos` — Equipo medico con credenciales
- `/resultados` — Before/after + testimoniales
- `/precios` — Planes y precios
- `/faq` — Preguntas frecuentes
- `/blog` — Contenido educativo SEO

---

## 5. INVENTARIO DE ASSETS — 69 archivos

Todos en `assets/` relativo al root del proyecto.

### Branding (6)
| Archivo | Descripcion | Uso |
|---------|-------------|-----|
| `branding/wordmark_01_green_on_cream.jpg` | AKAN serif verde sobre crema | Nav, hero, footer |
| `branding/wordmark_02_bold_on_cream.jpg` | AKAN bold sobre crema | Variante impacto |
| `branding/wordmark_03_cream_on_green.jpg` | AKAN crema sobre verde | Footer, dark sections |
| `branding/wordmark_04_lowercase.jpg` | akan lowercase | Variante casual |
| `branding/isotipo_A_green_on_cream.jpg` | Letra A estilizada verde | Favicon concept, icono |
| `branding/appicon_A_cream_on_green.jpg` | Letra A crema sobre verde | App icon, favicon |

### Fotografia Hero (10)
| Archivo | Descripcion | Recomendado |
|---------|-------------|-------------|
| `photography/hero_v2/hero_polanco_apartment.jpg` | Hombre fresa en depto Polanco | **HERO PRINCIPAL** |
| `photography/hero_v2/hero_rooftop_condesa.jpg` | Hombre en rooftop Condesa | Parallax banner |
| `photography/hero_v2/hero_coffee_roma.jpg` | Hombre en cafe Roma Norte | Seccion lifestyle |
| `photography/hero_v2/hero_polanco_portrait.jpg` | Portrait vertical Polanco | Mobile hero |
| `photography/hero/hero_landscape_01_apartment.jpg` | Hombre en departamento | Alt hero |
| `photography/hero/hero_landscape_02_street.jpg` | Hombre en calle | Alt lifestyle |
| `photography/hero/hero_landscape_03_sofa.jpg` | Hombre en sofa | Alt relax |
| `photography/hero/hero_portrait_01_apartment.jpg` | Portrait departamento | Mobile alt |
| `photography/hero/hero_portrait_02_street.jpg` | Portrait calle | Mobile alt |
| `photography/hero/hero_portrait_03_sofa.jpg` | Portrait sofa | Mobile alt |

**NOTA:** Las fotos `hero_v2/` son el target demografico correcto (mexicano fresa, upper-class). Usar estas de preferencia.

### Fotografia Lifestyle (10)
| Archivo | Uso |
|---------|-----|
| `photography/lifestyle_v2/grooming_mirror_fresa.jpg` | Seccion rutina / como funciona |
| `photography/lifestyle_v2/pareja_polanco.jpg` | Seccion relaciones / confianza |
| `photography/lifestyle_v2/gym_fresa.jpg` | Seccion bienestar / aspiracional |
| `photography/lifestyle/rutina_01_mirror.jpg` | Alt rutina |
| `photography/lifestyle/rutina_02_vanity.jpg` | Alt grooming |
| `photography/lifestyle/pareja_01_sofa.jpg` | Alt pareja |
| `photography/lifestyle/pareja_02_park.jpg` | Alt exterior |
| `photography/lifestyle/entrega_discreta.jpg` | Seccion envio/packaging |
| `photography/lifestyle/telefono_01_sofa.jpg` | Seccion app/telemedicina |
| `photography/lifestyle/telefono_02_kitchen.jpg` | Alt telemedicina |

### Fotografia Medicos (2)
| Archivo | Uso |
|---------|-----|
| `photography/medical/doctora_01.jpg` | Card doctora — seccion medicos |
| `photography/medical/doctor_02.jpg` | Card doctor — seccion medicos |

### Fotografia Testimoniales (6)
| Archivo | Uso |
|---------|-----|
| `photography/testimonials/avatar_01.jpg` a `avatar_06.jpg` | Cards de testimonios — carousel |

### Fotografia Producto (6)
| Archivo | Descripcion | Uso |
|---------|-------------|-----|
| `photography/product/akan_hero_products.jpg` | **Jar + dropper ambar, tapa verde, fondo crema** | Hero producto, above fold |
| `photography/product/akan_product_family.jpg` | **7 productos en pedestales piedra** | Seccion catalogo |
| `photography/product/akan_bathroom_shelf.jpg` | **Productos en estante bano, bandeja madera** | Lifestyle producto |
| `photography/product/packaging_01_closed.jpg` | Caja cerrada AKAN | Seccion packaging |
| `photography/product/packaging_02_unboxing.jpg` | Unboxing | Seccion packaging |
| `photography/product/packaging_03_detail.jpg` | Detalle empaque | Seccion packaging |

### Fotografia Brand Application (8)
| Archivo | Uso |
|---------|-----|
| `photography/brand_application/flatlay_identity.jpg` | Galeria identidad — hero |
| `photography/brand_application/business_card_detail.jpg` | Detalle tarjeta embossed |
| `photography/brand_application/product_bottles.jpg` | Botellas ambar con labels |
| `photography/brand_application/sticker_seal_detail.jpg` | Sello circular de calidad |
| `photography/brand_application/app_mockup_iphone.jpg` | Mockup app en iPhone |
| `photography/brand_application/packaging_full_kit.jpg` | Kit completo abierto |
| `photography/brand_application/tote_bags.jpg` | Tote bags crema con logo |
| `photography/brand_application/mailer_wax_seal.jpg` | Sobre con sello de cera |

### Ilustraciones (7)
| Archivo | Uso |
|---------|-----|
| `illustrations/icon_foliculo.jpg` | Icono foliculo — seccion ciencia |
| `illustrations/icon_paquete_discreto.jpg` | Icono empaque — seccion envio |
| `illustrations/icon_shield_trust.jpg` | Icono escudo — seccion confianza |
| `illustrations/icon_telemedicina.jpg` | Icono telefono — seccion consulta |
| `illustrations/three_step_process.jpg` | Ilustracion 3 pasos |
| `illustrations/editorial_no_waiting_room.jpg` | Editorial — sin sala de espera |
| `illustrations/pattern_decorativo.jpg` | Pattern para fondos/bordes |

### Marketing — Diagramas (3)
| Archivo | Descripcion | Uso |
|---------|-------------|-----|
| `marketing/diagrams/diagram_como_funciona_foliculo.jpg` | **Foliculo con callouts: Finasteride/Minoxidil/Biotina+Zinc** | Seccion ciencia |
| `marketing/diagrams/diagram_3_pasos.jpg` | **3 pasos: Evaluacion → Medico → Entrega** | Seccion como funciona |
| `marketing/diagrams/diagram_por_que_akan.jpg` | **"2 de cada 3" + 4 beneficios** | Seccion trust/stats |

### Marketing — Instagram Ads (6)
| Archivo | Formato | Concepto |
|---------|---------|----------|
| `marketing/instagram_ads/ad_01_el_numero.jpg` | Feed 1:1 | Stat shock "2 de cada 3" |
| `marketing/instagram_ads/ad_02_tu_timeline.jpg` | Feed 1:1 | Journey Hoy→Mes 3→Mes 6 |
| `marketing/instagram_ads/ad_03_sin_pena.jpg` | Feed 1:1 | Tagline "Sin pena" |
| `marketing/instagram_ads/story_01_el_numero.jpg` | Story 9:16 | Stat shock vertical |
| `marketing/instagram_ads/story_02_tu_timeline.jpg` | Story 9:16 | Journey vertical |
| `marketing/instagram_ads/story_03_sin_pena.jpg` | Story 9:16 | Tagline vertical |

### Marketing — Meta/Social (6)
| Archivo | Uso |
|---------|-----|
| `marketing/social/og_image_akan.jpg` | Open Graph / meta share |
| `marketing/meta/feed_01_portrait.jpg` | Facebook/IG feed |
| `marketing/meta/feed_02_hair.jpg` | Facebook/IG feed |
| `marketing/meta/story_01_bathroom.jpg` | IG story |
| `marketing/meta/story_02_couple_tiktok.jpg` | TikTok/IG story |
| `marketing/meta/story_03_unboxing.jpg` | IG story |

---

## 6. TONO DE VOZ Y COPY

### Principios
- **Directo:** Sin rodeos. "Tu pelo se cae. Hay solucion."
- **Sin verguenza:** Normalizar. "2 de cada 3 hombres — no estas solo."
- **Cientifico pero simple:** "Finasteride bloquea el DHT" no "inhibidor de 5-alfa-reductasa"
- **Aspiracional:** No vender miedo, vender confianza. "Tu mejor version."
- **Mexicano nativo:** NO traduccion del ingles. Modismos naturales.

### Headlines sugeridos
- Hero: "Tu pelo merece un medico, no Google"
- Alt hero: "La ciencia ya tiene la respuesta. Tu medico la tiene hoy."
- Stats: "2 de cada 3 hombres pierden cabello antes de los 35"
- CTA: "Comenzar evaluacion" / "Elegir mi plan" / "Hablar con un medico"
- Urgencia: "Tu pelo no va a esperar"
- Confianza: "Medicos mexicanos con cedula verificada"
- Privacidad: "Nadie se entera. Ni el de la farmacia."
- Empaque: "Sin marca. Sin etiqueta. Solo tu tratamiento."

### Copy para secciones
**Como Funciona:**
1. "Responde un quiz de 3 minutos sobre tu cabello y salud"
2. "Un medico con cedula revisa tu caso y receta tu tratamiento"
3. "Recibe tu tratamiento en empaque discreto cada mes"

**Resultados Timeline:**
- Mes 1: "La caida se reduce"
- Mes 3: "Se detiene la caida"
- Mes 6: "Crecimiento nuevo visible"
- "87% de los hombres ven resultados al mes 6"

**Trust Points:**
- "Medicos mexicanos con cedula verificada por CONACEM"
- "Mitad del precio de farmacia"
- "Formulas clinicamente probadas"
- "Entrega discreta a todo Mexico"

**Testimonios (formato):**
- "Nombre, Edad, Ciudad" — ej: "Carlos, 32, CDMX"
- Quote en primera persona, conversacional
- Sin mencionar la palabra "producto" — hablar de experiencia

---

## 7. NAVEGACION

### Nav Principal (sticky, glassmorphism)
```
Logo AKAN | Tratamientos | Como Funciona | Medicos | Precios | [CTA: Comenzar]
```

### Footer (4 columnas sobre fondo --ink)
```
Tratamientos          Nosotros           Legal              Siguenos
- Caida de cabello    - Como funciona    - Aviso privacidad - Instagram
- Kit completo        - Nuestros medicos - Terminos         - TikTok
- Shampoo             - Resultados       - Consentimiento   - Facebook
- Suplementos         - Blog             - Devoluciones

[AKAN wordmark]
© 2026 AKAN Salud Masculina S.A. de C.V.
"Este sitio no sustituye la consulta medica presencial."
```

---

## 8. RESPONSIVE BREAKPOINTS

| Breakpoint | Layout | Nav | Hero | Grid |
|-----------|--------|-----|------|------|
| < 640px | 1 col | Hamburger | Stack (foto arriba, texto abajo) | 1 col |
| 640-1024px | 2 col | Hamburger | 2 col con padding reducido | 2 col |
| > 1024px | Full | Inline | 2 col full width | 3-4 col |

**Container:** max-width 1200px, padding 0 24px (mobile) / 0 48px (desktop)

---

## 9. EFECTOS VISUALES CLAVE (inspirados en Hims)

### Hero Background — Blobs animados
Dos formas organicas con gradiente (green→sand→clay) que morphean lentamente detras del hero. Crean profundidad sin distraer. 20s loop, GPU-accelerated.

### Stats Bar — Gradiente animado
Barra full-width con gradiente que se mueve (green→clay→green). Numeros que suben al entrar en viewport (CountUp). Efecto tipo dashboard.

### Floating Pills — Glassmorphism
Badges que flotan cerca del hero: "100% Discreto", "Medico con Cedula", "A tu Puerta". Background blur + borde semi-transparente.

### Parallax Banner
Imagen lifestyle (rooftop Condesa) con scroll a velocidad 0.3x. Overlay oscuro + texto grande.

### Results Timeline — Progressive bars
Barras que llenan progresivamente al entrar en viewport. Color cambia de rojo (inicio) a amarillo (mes 3) a verde (mes 6).

---

## 10. SEO Y META

```html
<title>AKAN — Tratamiento Medico para Caida de Cabello | Mexico</title>
<meta name="description" content="Tratamiento medico real para caida de cabello. Evaluacion en 3 minutos. Medicos mexicanos con cedula. Entrega discreta a tu puerta. Sin pena. Sin filas.">
<meta property="og:image" content="assets/marketing/social/og_image_akan.jpg">
<meta property="og:title" content="AKAN — Sin pena. Sin filas. A tu puerta.">
<meta property="og:description" content="Tratamiento medico para caida de cabello y desempeno. Evaluacion gratuita en 3 minutos.">
```

### Lucide Icons (CDN)
```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```
Usar para iconos UI: `shield-check`, `lock`, `package`, `clock`, `user`, `truck`, `star`, etc.

---

## 11. REFERENCIA COMPETITIVA

Ver documentos detallados en `docs/`:
- `docs/competitive_design_audit.md` — Analisis completo Hims vs Keeps (colores, tipografia, estructura, UX, posicionamiento)
- `docs/keeps_reference/keeps_full_reference.md` — Textos completos, estructura seccion por seccion, design system de Keeps
- `docs/keeps_reference/images/` — 34 assets descargados de Keeps como referencia visual

### Resumen ejecutivo:
| | Hims | Keeps | AKAN |
|--|------|-------|------|
| Tono | Cheeky, lifestyle | Matter-of-fact, educativo | Directo, sin verguenza, mexicano |
| Colores | Pasteles (coral, azul) | Green + Red | Green + Clay + Paper |
| CTA | Coral/peach | Red #E22631 | Clay #C5623E |
| Hero font | Serif moderna | TiemposHeadline | Fraunces |
| Body font | Grotesk | Apercu | Hanken Grotesk |
| Fotos | Lifestyle aspiracional USA | Profesional, clean | Fresa mexicano, Polanco/Condesa |
| Pricing | Visible ($35/mo) | Hidden (post-quiz) | Visible pero contextualizado |
| Gateway | Browse products | Quiz obligatorio | Quiz recomendado, browse disponible |

---

## 12. STACK TECNICO SUGERIDO

- **Framework:** Next.js 14+ (App Router) o Astro (si solo landing)
- **Styling:** Tailwind CSS 4 con custom tokens del design system
- **Animaciones:** Framer Motion (React) o GSAP + IntersectionObserver
- **Fonts:** Google Fonts (Fraunces + Hanken Grotesk)
- **Icons:** Lucide React
- **Imagenes:** Next/Image con optimization, WebP fallback
- **Deploy:** Vercel
- **Analytics:** Vercel Analytics o Plausible (GDPR-friendly)

---

## 13. INSTRUCCIONES PARA LA AI QUE CONSTRUYE

1. **Lee este documento completo antes de escribir una linea de codigo.**
2. **Usa EXACTAMENTE los tokens CSS definidos.** No inventes colores ni fuentes.
3. **Usa las imagenes que existen en `assets/`.** No generes nuevas ni uses placeholders.
4. **El hero debe usar fotos `hero_v2/`** (mexicano fresa, upper-class). Las v1 son backup.
5. **Todas las animaciones deben activarse por scroll** (IntersectionObserver). Nada al cargar la pagina completa.
6. **Mobile first.** El 80% del trafico sera movil.
7. **El tono es mexicano nativo.** No traduzcas del ingles. No uses "usted".
8. **NO agregues features que no estan en este brief.** No e-commerce, no auth, no dashboard. Solo landing + info.
9. **Los diagramas ya estan generados como imagenes.** Usalos. No los recrees en HTML/CSS.
10. **El manual de marca visual esta live en https://akan-five.vercel.app** — usalo como referencia visual de como se ven los assets juntos.

---

*Generado con Claude Code + Leonardo AI — Junio 2026*
