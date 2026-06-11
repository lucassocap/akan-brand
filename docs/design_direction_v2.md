# AKAN — Dirección de Diseño v2 "Obsidiana" → v2.1 "Verde Vivo"
## Evolución de paleta + sistema visual estilo Apple
### Junio 2026 — supersede los tokens del AKAN_WEB_BRIEF.md §2

> **PIVOT v2.1 (feedback de Lucas, misma noche):** la dirección oscura
> "Obsidiana" NO va — "los elementos oscuros no pegan a una vaina de salud".
> La dirección final es **CLARA y VIVA**: base crema luminosa (#FAF6EC),
> verdes frescos (jade #3E8E68, sage #E7F0E6, mint #CFE7D6), CTA clay/copper,
> acentos peach (#F2C9A8), blobs de color animados y **elementos Leonardo
> recortados (assets/elements/*.png) animados como capas vivas** (burbujas
> ámbar, hojas, gota de oro — flotación + parallax al mouse + burbujas
> ascendentes). El verde bosque #1F3D2E se usa solo como acento de marca
> (stats band, resultados, footer, plan destacado), nunca negro-verdoso.
> Los tokens "obsidian" de abajo quedan SOLO como referencia histórica;
> los tokens vigentes son los de `index.html` v2.1.

---

## 1. DIAGNÓSTICO DE LA V1

La v1 (paper/green/clay plana) es correcta pero **plana**: todo vive en un solo
plano de luz crema, sin profundidad, sin momentos cinematográficos, sin jerarquía
dramática. Apple alterna **capítulos oscuros y claros**, usa tipografía gigante
con gradientes, y deja que el producto respire en negro profundo.

## 2. CONCEPTO: "VERDE OBSIDIANA"

La marca mantiene su alma (verde bosque + crema + clay) pero gana un **modo
oscuro cinematográfico**: un verde-negro profundo (obsidiana) donde el producto
ámbar brilla como joyería. El sitio alterna capítulos:

```
CREMA (calidez, confianza, lifestyle) ←→ OBSIDIANA (ciencia, producto, drama)
```

## 3. TOKENS v2

```css
:root {
  /* ── Oscuros (NUEVO — capítulos cinematográficos) */
  --obsidian:    #0B120E;   /* Fondo dark sections — verde-negro profundo */
  --obsidian-2:  #121D16;   /* Surfaces elevadas sobre obsidiana */
  --obsidian-3:  #1A2920;   /* Cards/borders sobre dark */

  /* ── Verdes (evolución) */
  --forest:      #1F3D2E;   /* Primario de marca — se mantiene */
  --emerald:     #2E6B4D;   /* Punto medio de gradientes */
  --jade:        #57A87D;   /* Acentos vivos sobre dark, íconos, hover */
  --mint:        #A8DCC0;   /* Texto highlight sobre obsidiana, glow */

  /* ── Cálidos */
  --paper:       #F6F1E6;   /* Crema refinada (más luz que F3EDE1) */
  --paper-deep:  #ECE3D1;   /* Secciones alternas claras */
  --sand:        #D9CCB2;   /* Bordes, neutrales */
  --ink:         #14110C;   /* Texto sobre claro */
  --ink-soft:    #4A443A;   /* Secundario sobre claro */

  /* ── Acentos */
  --clay:        #C5623E;   /* CTA — se mantiene */
  --copper:      #E07B4C;   /* Glow del clay, fin de gradientes CTA */
  --gold:        #C9A876;   /* Hairlines premium, detalles, overlines dark */

  /* ── Gradientes firma */
  --grad-cta:    linear-gradient(135deg, #C5623E 0%, #E07B4C 100%);
  --grad-hero:   radial-gradient(ellipse at 30% 20%, #1F3D2E 0%, #0B120E 60%);
  --grad-text:   linear-gradient(110deg, #A8DCC0 0%, #57A87D 45%, #C9A876 100%);
  --grad-warm:   linear-gradient(135deg, #F6F1E6 0%, #ECE3D1 100%);

  /* ── Utilidades dark */
  --line-dark:   rgba(168,220,192,0.12);
  --glass-dark:  rgba(18,29,22,0.55);
  --glass-light: rgba(246,241,230,0.62);
}
```

## 4. TIPOGRAFÍA — ESCALA APPLE

Se mantienen **Fraunces** (display) + **Hanken Grotesk** (UI). Cambia la escala:

| Nivel | Size | Peso | Tracking | Uso |
|---|---|---|---|---|
| Mega | clamp(56px, 9vw, 136px) | Fraunces 700 | -0.04em | Hero, statements de capítulo |
| Display | clamp(40px, 6vw, 88px) | Fraunces 700 | -0.03em | Títulos de sección |
| H2 | clamp(28px, 3.6vw, 48px) | Fraunces 600 | -0.02em | Sub-secciones |
| Lead | clamp(19px, 2vw, 24px) | Hanken 400 | 0 | Intros, 1.55 lh |
| Body | 17px | Hanken 400 | 0 | General |
| Overline | 13px | Hanken 700 | 0.14em UPPER | Labels — gold en dark, clay en light |

**Gradient text** (`--grad-text` con background-clip) reservado para 1-2 palabras
clave por capítulo, estilo Apple ("Tu mejor versión").

## 5. MOTION — LENGUAJE CINEMATOGRÁFICO

- **GSAP + ScrollTrigger** (CDN) como motor; IO como fallback.
- Word-by-word reveal con blur en headlines Mega.
- Secciones pinned con producto que escala/rota suave (hero producto).
- Parallax multicapa (foto 0.3x, glow 0.15x).
- Counters easeOutExpo, barras de progreso de timeline de resultados.
- Botones magnéticos (translate hacia cursor ±8px) + glow pulse en CTA.
- Nav glass: crema translúcida sobre claro, obsidiana translúcida sobre oscuro
  (cambia con data-theme de la sección visible).
- `prefers-reduced-motion` respetado siempre.

## 6. ESTRUCTURA — APRENDIZAJES KEEPS/HIMS APLICADOS

1. **Quiz como gateway** (Keeps) — selector de patrón de caída (corona /
   entradas / general) como card interactiva que segmenta el plan.
2. **Negative space brutal** (Hims) — 1 idea por viewport, aire generoso.
3. **Planes por patrón** (Keeps) — 3 cards de plan con precio visible en MXN
   (transparencia para México, contra el hide-pricing de Keeps).
4. **Trust mexicano**: cédula CONACEM, médicos reales, "Nadie se entera.
   Ni el de la farmacia."
5. **Capítulo ciencia en obsidiana** — DHT → folículo → tratamiento, con el
   diagrama como protagonista glowing.
6. **Testimonios** formato Keeps: "Carlos, 32, CDMX".

## 7. DÓNDE VIVE CADA COSA

- `index.html` — **El sitio web AKAN** (landing completa, capítulos crema/obsidiana).
- `brand.html` — **Manual de marca v2** (brand book cinematográfico completo).
- `assets/premium/` — Nuevos assets Leonardo (heroes oscuros, texturas, macro).
