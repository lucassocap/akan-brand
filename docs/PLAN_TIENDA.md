# AKAN — Plan de Tienda y Cobro (F2)
## Cómo compra la gente, de punta a punta, y quién construye qué
### Jun 2026 · Coordinación entre 2 IAs: WEB (repo akan-brand) y ODOO (repo akan-odoo)

---

## 1. EL PRINCIPIO: DOS TIPOS DE COMPRA, DOS CAMINOS

| | Rx (planes médicos — 90% del revenue) | OTC (shampoo, suplemento) |
|---|---|---|
| Productos | Esencial/Completo/Kit · Momento/Diario/Confianza | Shampoo $349, Suplemento $399 |
| Camino | **Funnel propio** (quiz.html) — gateado por médico | **Tienda Odoo /shop** o deep-link directo |
| Pago | **Después de aprobación médica** (link por WhatsApp) | Inmediato en el checkout |
| Recurrencia | Suscripción (subscription_oca, ya instalado) | Compra suelta / cross-sell |

La venta Rx NO puede cobrar al instante sin médico (NOM-024) — y eso lo convertimos
en ventaja de confianza: "hoy no pagas nada".

## 2. EL FLUJO Rx COMPLETO (cómo compra la gente)

```
1. CLIENTE   quiz.html → evaluación → checkout SIN pago
             └─▶ Odoo: lead (respuestas) + sale.order BORRADOR + suscripción implícita (cadencia elegida)

2. MÉDICO    Odoo CRM → revisa respuestas → botón "APROBAR RECETA Y COBRAR"  ← construir (IA ODOO)
             └─▶ Odoo genera LINK DE PAGO (pasarela) ligado a la orden
             └─▶ Se envía por WhatsApp al cliente (manual F2.0 → API F2.1)

3. CLIENTE   abre link → paga con tarjeta / OXXO / MSI  ← pasarela
             └─▶ WEBHOOK de la pasarela → Odoo  ← construir (IA ODOO)
                 ├─ confirma la sale.order (draft → confirmada)
                 ├─ crea la SUSCRIPCIÓN desde template AKAN Mensual/Trimestral (ya existen)
                 └─ dispara el picking a farmacia

4. FARMACIA  rol "sin precios" (ya existe) → prepara caja neutra → captura guía → valida picking

5. CLIENTE   recibe en 24-72h · WhatsApp con tracking

6. RENOVACIÓN subscription_oca genera la orden del siguiente ciclo
             └─▶ F2.0: link de renovación por WhatsApp (mismo flujo de pago)
             └─▶ F2.1: cobro automático con tarjeta guardada (tokenización)
             └─▶ médico re-valida receta cada 6 meses (lead recurrente)
```

## 3. EL FLUJO OTC (sin receta)

- **Hoy (ya funciona):** deep-link `quiz.html?plan=AKAN-SHAMPOO` → checkout sin pago →
  cierre por WhatsApp. Cero trabajo extra.
- **F2:** botón "Comprar ahora" → **Odoo /shop** (ya tiene productos con foto y tema AKAN)
  con la pasarela activada en website_sale → carrito → pago inmediato → picking.
  El cross-sell del carrito ("también te recomendamos") vive ahí.

## 4. DECISIÓN DE PASARELA (la toma Lucas)

| | **Mercado Pago (recomendada)** | Conekta | Stripe MX |
|---|---|---|---|
| OXXO | ✅ | ✅ | ✅ (OXXO via partner) |
| MSI (meses sin intereses) | ✅ nativo | ✅ | limitado |
| Links de pago por API | ✅ Checkout Pro (lo más fácil) | ✅ | ✅ Payment Links |
| Adopción/confianza en MX | La más alta | Media | Baja en consumidor |
| Módulo Odoo | ✅ oficial (payment_mercado_pago) | comunidad | ✅ oficial |
| Suscripción tokenizada | ✅ | ✅ | ✅ (la mejor) |

**Recomendación: Mercado Pago para F2.0** (links + OXXO + MSI + módulo oficial Odoo);
evaluar Stripe en F3 si la tokenización de MP da lata. Lucas: crear cuenta MP y
pasar las credenciales sandbox.

## 5. DIVISIÓN DE TRABAJO ENTRE LAS DOS IAs

**Regla de oro: cada IA es dueña de su repo. WEB no toca akan-odoo; ODOO no toca
akan-brand. El contrato entre ambas es la API, versionada en
`akan-odoo/docs/API_CONTRACT.md`** (la IA de Odoo lo crea y mantiene; cualquier
cambio de contrato se anuncia ahí ANTES de implementarlo).

### IA ODOO (repo akan-odoo) — backend de la tienda
1. `API_CONTRACT.md` con los endpoints actuales (/health, /lead, /checkout) — congelar contrato v1.
2. Módulo pasarela Mercado Pago (sandbox) + server action **"Aprobar receta y generar
   link de pago"** en sale.order (visible para médico/admin) → guarda el link en la orden
   y en el chatter, listo para copiar a WhatsApp.
3. Controller **webhook** `/akan/api/payment_webhook`: valida firma → confirma orden →
   crea suscripción desde template (Mensual/Trimestral según cadence) → log.
4. Activar pasarela en website_sale (/shop) para OTC.
5. Portal del cliente (mis órdenes/suscripciones) — afinar accesos.
6. **Railway**: deploy de Odoo público (requiere `railway login` de Lucas) →
   `erp.akan.mx`. Hasta entonces, túnel cloudflared para demos externas.

### IA WEB (repo akan-brand, yo) — frontend de la tienda
1. Success screen del quiz: estado "pago pendiente de aprobación médica" + qué sigue.
2. Página/sección **Tienda OTC** en el sitio (grid shampoo/suplemento/minoxidil con
   "Comprar ahora") → apunta a /shop de Odoo cuando esté público; mientras, deep-links.
3. Cuando exista la API pública: cambiar `AKAN_API` (1 línea) y probar E2E desde Vercel.
4. Plantillas de mensajes WhatsApp (aprobación, pago, tracking, renovación) para operación manual.
5. Página "Mi cuenta" → link al portal Odoo.

### LUCAS (decisiones/altas — sin esto F2 no arranca)
1. ✅/❌ Pasarela: ¿Mercado Pago? → crear cuenta + credenciales sandbox.
2. Comprar dominio **akan.mx** (web en Vercel, erp.akan.mx en Railway).
3. `railway login` en la terminal cuando la IA Odoo lo pida.
4. Alta de WhatsApp Business (para F2.1 automatizar mensajes).

## 6. ORDEN DE EJECUCIÓN (pasos)

| # | Paso | Dueño | Bloqueado por |
|---|---|---|---|
| 1 | API_CONTRACT.md v1 | IA Odoo | — |
| 2 | Cuenta Mercado Pago sandbox | Lucas | — |
| 3 | Server action "Aprobar y cobrar" + link MP | IA Odoo | 2 |
| 4 | Webhook pago → confirmar + suscripción | IA Odoo | 3 |
| 5 | E2E sandbox completo (quiz→aprobar→pagar→suscripción→picking) | ambas IAs | 4 |
| 6 | Pasarela en /shop (OTC) | IA Odoo | 2 |
| 7 | Sección Tienda OTC en el sitio + success screen v2 | IA Web | — (paralelo) |
| 8 | Railway + dominio | IA Odoo + Lucas | login/dominio |
| 9 | Switch AKAN_API a producción + E2E desde Vercel | IA Web | 8 |
| 10 | WhatsApp API (plantillas automatizadas) | IA Odoo | alta Meta |

**El E2E que define "tienda funcionando" (paso 5):** un cliente completa el quiz en
el cel → el médico aprueba en Odoo y manda el link → el cliente paga con OXXO/tarjeta
sandbox → la orden se confirma sola, nace la suscripción, la farmacia ve el picking
sin precios → renovación al mes genera nueva orden. Cuando eso corre, AKAN vende.
