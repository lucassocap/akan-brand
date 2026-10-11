/* AKAN — IDs de medición (UN solo lugar). Spec: akan-odoo docs/ANALYTICS_SPEC.md
   Lucas: reemplaza cada placeholder por el ID real. Mientras un valor siga
   siendo placeholder (contiene "XXXX"), ese proveedor NO se carga.

   Modo de carga (lo decide assets/analytics.js):
   · GTM_ID real   → todo (GA4, Meta Pixel, Google Ads, Clarity) vive en el
                     contenedor de GTM (docs/gtm-container-akan.json). La web
                     solo carga GTM y empuja eventos al dataLayer.
   · GTM_ID placeholder → respaldo directo: gtag.js con GA4 y, SOLO con
                     consentimiento, Meta Pixel, Google Ads y Clarity.
   Vercel Web Analytics + Speed Insights se cargan siempre (sin cookies). */
window.AKAN_ANALYTICS_CONFIG = {
  BRAND: 'akan',
  GTM_ID: 'GTM-XXXXXXX',          // Google Tag Manager (contenedor web de AKAN)
  GA4_ID: 'G-XXXXXXXXXX',         // GA4 Measurement ID (propiedad AKAN)
  META_PIXEL_ID: 'XXXXXXXXXXXXXXX', // Meta Pixel (dataset de AKAN)
  CLARITY_ID: 'XXXXXXXXXX',       // Microsoft Clarity project ID
  GOOGLE_ADS_ID: 'AW-XXXXXXXXXX', // Google Ads conversion ID
  /* etiquetas de conversión de Google Ads (Herramientas → Conversiones) */
  GOOGLE_ADS_LABELS: {
    purchase: 'XXXXXXXXXXXXXXXXXXXX',
    generate_lead: 'XXXXXXXXXXXXXXXXXXXX'
  },
  CONSENT_VERSION: 1
};
