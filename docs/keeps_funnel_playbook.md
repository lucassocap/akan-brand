# Keeps Funnel Playbook — Documentación del flujo real
## Basado en 30 capturas del funnel completo (jun 2026) — la biblia de conversión para AKAN
### Fuente: navegación + quiz + resultado + checkout de keeps.com

---

## 1. ARQUITECTURA GENERAL DEL SITIO

Keeps opera DOS caminos paralelos hacia la compra, siempre visibles:

```
            ┌─ NO SÉ QUÉ NECESITO ──▶ QUIZ (gateway) ──▶ plan recomendado ──▶ checkout
ANUNCIO ──▶│
            └─ YA SÉ QUÉ QUIERO ───▶ NAV dropdown / catálogo ──▶ PDP ──▶ carrito ──▶ checkout
```

- **Nav por categoría** (Hair Loss / Sexual Health "NEW" / Learn). Cada dropdown
  abre con una card destacada **"Take our quiz — get a recommendation tailored
  for your needs"** y debajo la lista COMPLETA de tratamientos (con badge Rx y
  "New"). El quiz es la opción por defecto; el catálogo, el bypass.
- "Already been to a doctor and know what you want? **Buy treatment** today" —
  el bypass explícito para el que ya sabe.
- Banner promo permanente arriba: "GET UP TO 1 MONTH FREE WITH A 3-MONTH PLAN".
- Botón global GET STARTED (negro en nav, rojo en hero) → quiz.
- Widget de Support (chat) presente en TODAS las pantallas, incluso en el quiz.
- Carrito slide-over con: producto + duración de suscripción, "First order
  discount" en rojo, subtotal, CHECKOUT y **"We also recommend"** (upsell con
  botón +).

## 2. HOMEPAGE — ORDEN DE SECCIONES

1. Hero: "KEEP YOUR HAIR. REGROW WHAT YOU LOST." + 3 bullets de confianza
   (FDA-approved · resultados en 3 meses · all-in-1 máxima potencia) + CTA rojo.
2. Novedades de producto ("Hair loss treatment got an upgrade" — 4 fórmulas new).
3. Catálogo teaser ("New formulas + fan favorites" → SEE ALL OUR PRODUCTS).
4. Sexual Health (categoría nueva) con sus productos estrella y diagramas de
   ingredientes anotados sobre el producto/persona.
5. Banner editorial de honestidad: "**There's no magic cure for baldness** —
   but you can prevent hair loss… the earlier you take action, the more hair
   you'll keep." (foto macro de pelo real, tono crudo).
6. How Keeps works — 3 pasos: Pick your plan (el médico confirma) → Get it
   delivered (cada 3/6/12 meses) → Keep your hair (track, pause, cancel).
7. **"Half the cost"** — tabla comparativa de precios vs farmacia (Finasteride
   $65 vs $25; consulta $100+ vs primera GRATIS). Transparencia brutal.
8. Testimonios "Meet the Men of Action" (fotos reales, no stock).
9. Footer simple + newsletter.

## 3. EL QUIZ — MECÁNICA EXACTA (lo más importante)

**Layout:** página dedicada sin nav del sitio. Logo centrado, flecha atrás
arriba-izquierda, barra de progreso delgada. UNA pregunta por pantalla,
tap = avanza solo. Escape "I'm not sure — help me choose" en casi todas.

**Secuencia observada (rama capilar):**
1. "What's your hair goal?" — Regrow / Preserve / Both (con iconitos)
2. "How would you describe your hair loss stage right now?" — Early signs /
   Visible / Receding o crown / Advanced (iconos de intensidad creciente)
3. **"Which best matches you?" — 4 FOTOS reales de coronillas** (Just Starting
   / Mild / Moderate / Advanced). Auto-identificación visual. ORO PURO.
4. "How long has this been happening?" — <6m / 6-12m / 1-3 años / 3+ años
5. "Has anyone noticed or commented on your hair loss?" — Yes/No
   (sub: "esto nos ayuda a entender la progresión" — es emocional: activa
   el dolor social)
6. "Have you treated hair loss before?" — Yes/No ("This helps us avoid what
   didn't work")
7. (si sí) "How did it go?" — Saw results / Didn't / Stopped early / Side effects
8. "How would you like to treat your hair loss?" — **Daily Chew (Oral Rx) vs
   Topical Drop (Rx Serum)** CON FOTOS de los productos. El cliente elige el
   formato — la recomendación parte de su preferencia.
9. "What's your top priority?" — Results ASAP / Balanced / Simple & affordable
   (esto decide el tier del producto = pricing por autoselección)

**El truco psicológico central — 3 pantallas de "teatro clínico":**
10. **"Your analysis is complete."** — tabla "Your Profile" (Goal, Stage,
    Duration, Treatment Type, Expected Results) + 3 checks: "You're a strong
    candidate", "86% of similar profiles see results", "Multi-pathway approach
    recommended". El usuario siente diagnóstico, no venta.
11. **Lead capture ANTES del resultado:** "Last step. Get your plan." — sexo,
    estado, fecha de nacimiento, nombre, email, teléfono. **Capturan el lead
    ANTES de revelar el plan** — si abandona después, ya tienen remarketing.
12. **Loader animado: "Matching your prescription treatment. 54%"** con
    checklist progresivo (Analyzing pattern ✓ / Selecting compounds ✓ /
    Adjusting strength ✓ / Finalizing clinician match…). Fabrica anticipación
    y percepción de personalización. ~3 segundos.

**Resultado:**
13. **"[Nombre], you're approved."** — encabezado con su nombre. Comparativa
    visual **Today vs After 3 months** (fotos con etiquetas Mild → Visible
    Regrowth), recap del perfil, "Recommendation: Chew+ is clinically
    recommended", stat "86.5% of members see results within 3 months",
    CTA "See my plan".
14. **Plan compare — SOLO 2 opciones:** la recomendada (borde rojo, "Most
    Effective") vs una alternativa más barata ("Most Affordable"). Tags de
    posicionamiento. Cada card: selector **3-month plan (precio/mes tachado +
    "$49 Off First Order" verde) vs Monthly plan** (más caro). CTA "Continue
    to checkout" + "Change or cancel anytime via the online portal".
15. "What happens next. 3 simple steps." (pick → delivered 48h discreto →
    watch it work + money-back guarantee).
16. Cards "Your meds + complete clinical care. All-in-one." (clinician-matched,
    targets the source, ongoing care, auto-refill/cancel anytime).

## 4. CHECKOUT

- **Express checkout primero** (Google Pay / Link) — una pantalla, header
  minimal con teléfono de soporte + candado "SECURE PAYMENT".
- Shipping form estándar (2 columnas nombre, dirección, estado, CP).
- **Order Summary lateral = máquina de re-aseguramiento:**
  - Badge rojo "FSA/HSA eligible"
  - Precio re-encuadrado por día: **"As low as $1.06/day"**
  - 3 checks (one chew daily / ships every 3 months / money-back)
  - Sello dorado "180 DAYS MONEY BACK GUARANTEE"
  - Desglose: Standard Price → Shipping → First order discount (verde,
    negativo) → Online Clinician Visit ~~$49.99~~ FREE → Hair Regrowth
    Warranty: Activated
  - Banner amarillo: "**You're saving $35.01 with this plan. Nice pick**"
  - Logo UPS + "Est. Delivery: Within 48 hours"

## 5. LOS 10 PRINCIPIOS EXTRAÍBLES

1. **Quiz como diagnóstico, no como formulario.** El usuario siente que lo
   están analizando. Resultado = "estás aprobado", no "te recomendamos".
2. **Una pregunta por pantalla, cero fricción,** escape "no estoy seguro".
3. **Auto-identificación visual** (fotos de coronillas) > texto.
4. **Preguntas emocionales** ("¿alguien lo ha notado?") que activan el dolor.
5. **Lead capture antes de la revelación** del plan.
6. **Teatro de personalización** (análisis + loader + % match) — 3 pantallas
   que convierten un if/else en una experiencia clínica.
7. **Recomendación con nombre propio + "aprobado"** + solo 1 alternativa
   (nunca 3 cards iguales: una recomendada, una barata).
8. **Cadencia con ancla:** 3 meses con descuento vs mensual caro. Descuento
   de primera orden SIEMPRE visible.
9. **Re-encuadre de precio** ($/día) + desglose con regalos tachados
   (consulta GRATIS) + garantía con sello.
10. **Doble camino permanente:** quiz para el indeciso, catálogo/carrito para
    el decidido — ambos en el nav, siempre.

## 6. QUÉ COPIAMOS / ADAPTAMOS / RECHAZAMOS PARA AKAN

| | Decisión |
|---|---|
| Una pregunta por pantalla, tap-avanza | ✅ Ya lo tenemos — se mantiene |
| Fotos de coronillas para auto-ID | ✅ COPIAR (generar 4 con Leonardo) |
| "¿Alguien te lo ha dicho?" emocional | ✅ COPIAR adaptado a México |
| Perfil + loader + "estás aprobado" | ✅ COPIAR — el teatro clínico es la pieza que nos falta |
| Lead capture antes del resultado | ✅ COPIAR — el lead cae a Odoo CRM aunque abandone |
| 2 planes (recomendado vs barato) | ✅ COPIAR — hoy mostramos demasiadas opciones iguales |
| Cadencia 1 mes vs 3 meses + descuento 1ª orden | ✅ COPIAR (pricelist en Odoo) |
| $/día + desglose con tachados + garantía | ✅ COPIAR ($28/día suena mejor que $849/mes) |
| Catálogo bypass en nav + carrito | ✅ ADAPTAR — tienda = Odoo website_sale con tema AKAN |
| Express pay (GPay/Link) | 🔁 F2 — requiere pasarela (Conekta/Stripe) |
| FSA/HSA badge | ❌ No aplica en México |
| "You're approved" antes de médico real | ⚠️ ADAPTAR: "Pre-aprobado — tu médico confirma hoy" (NOM-024: la receta la emite un médico real; no podemos decir "aprobado" sin médico) |
| Pago en el checkout | ⚠️ F1: mantener "no pagas hasta que el médico apruebe" como ventaja de confianza; F2: cobrar al checkout como Keeps |
