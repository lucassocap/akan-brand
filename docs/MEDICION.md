# Medición AKAN (soyakan.com)

> Implementa `akan-odoo/docs/ANALYTICS_SPEC.md` (v1, 2026-10-11) y el `attribution{}` del
> contrato v1.6. Código: `assets/analytics-config.js` (IDs) + `assets/analytics.js` (capa).

## 1. Qué tiene que darme Lucas (IDs y cuentas)

| Qué | Dónde se crea | Dónde va |
|---|---|---|
| **GTM container ID** `GTM-XXXXXXX` | tagmanager.google.com → cuenta AKAN → contenedor **Web** «soyakan.com» | `GTM_ID` en `assets/analytics-config.js` |
| **GA4 Measurement ID** `G-XXXXXXXXXX` | analytics.google.com → propiedad **AKAN** (zona horaria CDMX, moneda MXN) → flujo web `https://soyakan.com` | `GA4_ID` en el config **y** `CONST - GA4 ID` en GTM |
| **Meta Pixel / dataset ID** (15-16 dígitos) | business.facebook.com → Events Manager → dataset AKAN | `META_PIXEL_ID` y `CONST - Meta Pixel ID` |
| **Token de Conversions API** | Events Manager → dataset → Configuración → «Generar token» | **Solo Odoo** (CAPI de servidor). Nunca en la web |
| **Clarity project ID** | clarity.microsoft.com → nuevo proyecto soyakan.com | `CLARITY_ID` y `CONST - Clarity ID` |
| **Google Ads conversion ID** `AW-…` + **2 etiquetas** (compra, lead) | Google Ads → Objetivos → Conversiones → «Sitio web» manual (×2) | `GOOGLE_ADS_ID`, `GOOGLE_ADS_LABELS` y las `CONST - Google Ads …` de GTM (en GTM va el ID **sin** `AW-`) |
| **GA4 Measurement Protocol API secret** | GA4 → flujo web → «Secretos de la API del Measurement Protocol» | **Solo Odoo** (purchase/refund de servidor) |
| **Vercel Web Analytics + Speed Insights** | Vercel → proyecto `akan` → pestañas *Analytics* y *Speed Insights* → **Enable** | Nada que pegar: la web ya carga `/_vercel/insights/script.js` y `/_vercel/speed-insights/script.js` |

Mientras un valor siga con `XXXX`, ese proveedor **no se carga** (verificado: con el config
actual la web no hace ninguna petición externa de medición).

**Modo de carga:**
- `GTM_ID` real → la web solo carga GTM y empuja eventos al `dataLayer`; GA4, Meta, Ads y
  Clarity viven en el contenedor (importar `docs/gtm-container-akan.json`).
- `GTM_ID` placeholder → respaldo directo desde `analytics.js`: `gtag.js` con GA4 y, solo con
  consentimiento, Meta Pixel, Google Ads y Clarity. Sirve para arrancar antes de tener GTM.
- Con GTM activo **no** dupliques: deja los demás IDs del config como estén (en modo GTM no se usan
  para cargar nada) y ponlos en las constantes de GTM.

## 2. Consentimiento (Consent Mode v2)

- Default **denied**: `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`,
  `personalization_storage`. `security_storage` y `functionality_storage` = granted.
  `ads_data_redaction=true`, `url_passthrough=false`.
- Banner propio (`#akan-consent`): **Aceptar todo / Rechazar / Configurar** (Analítica y Publicidad por
  separado). Guarda `localStorage.consent_v1 = {v, ts, analytics, ads}` y aplica
  `gtag('consent','update',…)` en cada página antes de que cargue GTM.
- Evento `akan_consent_update` (`consent_analytics`, `consent_ads`) para los triggers de GTM.
- «Preferencias de cookies» en el footer (`[data-akan-consent-open]`) reabre el panel. Retirar un
  permiso borra las cookies del proveedor (`_ga*`, `_clck`, `_clsk`, `_fbp`, `_fbc`, `_gcl_*`) y recarga.
- Subir `CONSENT_VERSION` en el config vuelve a pedir el consentimiento a todos.

## 3. dataLayer: contrato de eventos

Cada evento: `{event, brand:"akan", page_location (limpio), event_id, …}`. Los de ecommerce
llevan además `ecommerce{currency:"MXN", value, items[], transaction_id?, shipping_tier?, payment_type?}`
(antes se empuja `{ecommerce:null}`), `value`, `currency`, `ads_items[]` y `ads_content_ids[]`.

- `items[]` (GA4): SKU real (`AKAN-COMPLETO`…), nombre, `item_category`, precio, cantidad.
- `ads_items[]` (Meta/Ads): los Rx salen como `{item_id:"akan_plan", item_name:"Plan AKAN", item_category:"tratamiento"}`.
  Un código desconocido se trata como Rx (privacidad por defecto).
- `purchase`: `event_id` = `transaction_id` = `sale.order.name` (ej. `S00099`) para deduplicar con el
  `purchase` de servidor (Odoo, GA4 MP + Meta CAPI).

| Evento | Dónde se dispara |
|---|---|
| `view_item_list` | tienda (catálogo cargado: OTC por SKU + una consulta genérica `AKAN-CONSULTA` por área); inicio (tarjetas de consulta al ser visibles) |
| `select_item` | clic en «Empieza tu consulta» (tienda, inicio o menú): item `AKAN-CONSULTA`. Los Rx ya no se muestran por nombre ni precio en páginas públicas |
| `view_item` | quiz: resultado (plan recomendado) o entrada directa `?plan=` |
| `add_to_cart` / `remove_from_cart` | tienda (Agregar), carrito (+ / − / Quitar), perfil (Volver a pedir) |
| `view_cart` | carrito con productos |
| `begin_checkout` | carrito «Proceder al pago»; quiz al mostrar el checkout (no consulta gratis) |
| `add_shipping_info` | envío del formulario de dirección válido (`shipping_tier: gratis_caja_neutra`) |
| `add_payment_info` | justo antes de redirigir al link de pago (`payment_type: link_de_pago`) |
| `purchase` (respaldo) | perfil, cuando `/me` marca pagada una orden que **este navegador** llevó al pago; una sola vez por orden |
| `generate_lead` | `/akan/api/lead` respondió `ok` (`lead_source: quiz`) |
| `quiz_start` / `quiz_step` / `quiz_complete` | quiz; **solo** `step_index` (número) |
| `contact_whatsapp` | cualquier clic a `wa.me` (`placement` = página) |
| `login` | perfil: entrada por email+orden o por código (`method: token`) |

Reglas de privacidad aplicadas en el código: ningún evento lleva respuestas, rama, pantalla del
quiz, nombre, email, teléfono, token ni ref (`akanTrack` además descarta esas llaves);
`page_location` solo conserva `utm_*`, `gclid`, `fbclid`, `gbraid`, `wbraid`; perfil quita `?t=`
de la URL tras guardarlo; Pixel con `autoConfig=false`; `data-clarity-mask="true"` en quiz, carrito/checkout y perfil.

## 4. Atribución → Odoo (contrato v1.6)

`getAttribution()` se manda como `attribution` en `POST /akan/api/lead` y `/akan/api/checkout`:

| Campo | Cuándo se incluye |
|---|---|
| `utm_source/medium/campaign/content/term`, `landing` | siempre (de la URL de entrada; persistido en `sessionStorage.akan_attribution` solo con consentimiento) |
| `ga_client_id` (de la cookie `_ga`) | con consentimiento de analítica |
| `gclid`, `fbclid`, `fbp` (`_fbp`), `fbc` (`_fbc` o `fb.1.<ts>.<fbclid>`) | con consentimiento de publicidad |
| `consent_ads` | siempre (bool) |

Strings ≤255. Es aditivo: Odoo hoy lo ignora sin romper.

## 5. GTM: qué crear (o importar)

**Importar:** GTM → Administrar → *Importar contenedor* → `docs/gtm-container-akan.json` →
espacio de trabajo nuevo → **Combinar / Renombrar conflictos**. Luego rellenar las 6 constantes y
revisar en *Vista previa*. (El JSON se generó a mano siguiendo el formato de exportación v2; si
algún tag no importa, créalo a mano con esta tabla.)

**Configuración del contenedor:** Administrar → Configuración del contenedor → activar
*Descripción general del consentimiento*.

| Tipo | Nombre | Configuración | Trigger | Consentimiento adicional |
|---|---|---|---|---|
| Google tag | GA4 - Google tag (config) | ID `{{CONST - GA4 ID}}`; parámetros `page_location={{DLV - page_location}}`, `page_referrer`, `allow_google_signals=false`, `allow_ad_personalization_signals=false`, `brand` | Todas las páginas | (integrado) |
| Evento GA4 | GA4 - Eventos AKAN | Nombre `{{Event}}`, *Enviar datos de ecommerce* desde dataLayer; parámetros `brand`, `page_location`, `step_index`, `lead_source`, `placement`, `method` | CE regex de los 17 eventos | (integrado) |
| Vinculador de conversiones | Google Ads - Conversion Linker | — | Todas las páginas | `ad_storage` |
| Conversión de Google Ads | … purchase / … generate_lead | ID + etiqueta, valor `{{DLV - value}}`, moneda, ID de pedido `{{DLV - ecommerce.transaction_id}}` | CE `purchase` / `generate_lead` | `ad_storage`, `ad_user_data` |
| HTML personalizado | Meta Pixel - Base | fbq init + `autoConfig false` + PageView | DOM listo con `consent_ads=true` · `akan_consent_update` con `consent_ads=true` | `ad_storage`, `ad_user_data` |
| HTML personalizado | Meta Pixel - Eventos | `fbq('track', {{LT - Meta event}}, {content_ids: ads_content_ids, contents, value, currency}, {eventID})` — **solo `ads_items`** | CE de los 7 eventos Meta; tag de configuración: Meta Pixel - Base | `ad_storage`, `ad_user_data` |
| HTML personalizado | Microsoft Clarity | snippet + `clarity('consent')` | DOM listo con `consent_analytics=true` · `akan_consent_update` con `consent_analytics=true` | `analytics_storage` |

Variables: 6 constantes (`CONST - …`), DLV `brand`, `page_location`, `page_referrer`, `event_id`,
`value`, `currency`, `ads_items`, `ads_content_ids`, `ecommerce.transaction_id`, `step_index`,
`lead_source`, `placement`, `method`, `consent_ads`, `consent_analytics`; tabla de consulta
`LT - Meta event` (view_item→ViewContent, add_to_cart→AddToCart, begin_checkout→InitiateCheckout,
add_payment_info→AddPaymentInfo, purchase→Purchase, generate_lead→Lead, contact_whatsapp→Contact).

## 6. GA4: configuración

- **Eventos clave (conversiones):** `purchase`, `generate_lead`, `begin_checkout`, `contact_whatsapp`.
- **Dimensiones personalizadas** (ámbito evento): `brand`, `step_index`, `lead_source`, `placement`, `method`.
- **Google Signals: desactivado.** Personalización de anuncios: desactivada para todas las regiones.
- **Medición mejorada:** dejar *scroll*, *clics salientes* y *descargas*; **desactivar** «Cambios de
  página basados en el historial» (perfil usa `history.replaceState`) y «Interacciones con formularios».
- **Retención de datos:** 14 meses. Filtro de tráfico interno por IP de la oficina si aplica.
- **Vínculos:** Google Ads ↔ GA4 (importar conversiones desde GA4 o usar las de Ads, no ambas).
- **Medios de pago en la referencia:** añadir el dominio del link de pago a *Lista de referencias no deseadas*.

## 7. Clarity y Meta

- **Clarity:** Configuración → Enmascaramiento → **Estricto**. Proyecto solo para `soyakan.com`.
- **Meta:** dominio `soyakan.com` verificado en Business Manager; *Configuración automática de eventos*
  apagada en el dataset (además de `autoConfig=false`); categoría de salud: no usar audiencias por
  evento de tratamiento — los Rx ya llegan como «Plan AKAN».

## 8. QA

GTM *Vista previa* + GA4 *DebugView* + Meta *Test Events*. Check automático (Playwright):
sin aceptar, ninguna petición a `connect.facebook.net`, `clarity.ms` ni `googleadservices`;
tras aceptar, el `dataLayer` recibe el recorrido tienda → carrito → checkout → purchase.
