# PWA de AKAN (soyakan.com)

## Qué hace

- `manifest.webmanifest`: permite "Agregar a pantalla de inicio" (Android/Chrome e iOS).
  Abre en `/?source=pwa`, modo `standalone`, colores de marca (`#1F3D2E` / `#FAF6EC`), `lang es-MX`.
- `sw.js` (service worker, versión en `CACHE_VERSION`):
  - Precarga solo el *shell* estático: `assets/cart.js`, `footer.js`, `form-validate.js`, `pwa.js`, favicon e íconos y `offline.html`.
  - Navegación: **red primero** → copia en caché (por ruta, sin query) → `offline.html`.
  - Archivos estáticos del mismo dominio (CSS, JS, imágenes, fuentes): *stale-while-revalidate*.
  - Al activar una versión nueva borra las cachés viejas (`akan-*`).
- `assets/pwa.js` (con `defer` en cada página): registra `/sw.js` (solo https o localhost).
  No muestra banner de instalación; guarda el evento y expone `window.akanPWA.install()`
  para conectarlo a un botón más adelante.
- `vercel.json`: `/sw.js` con `Cache-Control: no-cache` y `Service-Worker-Allowed: /`;
  el manifest con `Content-Type: application/manifest+json`.

## Qué NO cachea (y por qué)

Privacidad de datos personales y de salud (LFPDPPP; COFEPRIS en publicidad de medicamentos):

- **Otros orígenes, nunca**: ni se interceptan. API de Odoo
  (`odoo-production-3a20.up.railway.app`), analítica (GTM, GA4, Meta, Clarity, Vercel Insights),
  `wa.me`, pagos y Google Fonts van directo a la red.
- **Páginas con datos de cliente**: `perfil.html`, `quiz.html`, `carrito.html`, `direcciones.html`
  (con o sin `.html`). Solo red; sin red se muestra `offline.html`.
- **URLs con token en la query** (`?t=`, `token`, `access_token`, `email`, `ref` o cualquier
  parámetro que contenga "token"): solo red.
- Respuestas con `Cache-Control: no-store`/`private`, respuestas con error y todo lo que no sea `GET`.

## Push (APAGADO por defecto)

Hoy no se pide permiso ni se suscribe a nadie. Para activarlo:

1. Generar llaves VAPID (p. ej. `npx web-push generate-vapid-keys`). La **privada** vive solo en
   Odoo (variable de entorno en Railway), nunca en este repo.
2. Implementar en Odoo el endpoint **`POST /akan/api/v2/push/register`** (API v2; anunciarlo y
   versionarlo antes en `docs/API_CONTRACT.md` de akan-odoo). Hoy **no existe**. Debe definir la
   autenticación del cliente y guardar la suscripción por marca (`brand: "akan"`).
3. Poner la llave **pública** en `VAPID_PUBLIC_KEY` de `assets/pwa.js` y conectar un botón
   (gesto explícito del usuario) a `window.akanPWA.subscribePush()`. Nunca llamarlo al cargar.
4. Las notificaciones son **genéricas** por diseño: el SW ignora el payload y siempre muestra
   "AKAN — Tienes una actualización de tu pedido"; al tocarla abre `perfil.html`. Nunca
   nombres de medicamento, diagnósticos ni montos (se ven en la pantalla bloqueada).

## Cómo probarlo

```bash
python3 -m http.server 8790          # en la raíz del repo (puerto >= 8790)
# Chrome → http://localhost:8790 → DevTools → Application:
#   Manifest (sin errores), Service Workers (activo), Cache Storage (akan-static-v1 / akan-pages-v1)
#   Network → "Offline" → recargar: home desde caché; otra página no visitada → offline.html
#   Visitar perfil.html / quiz.html y confirmar que NO aparecen en Cache Storage.
node --check sw.js && node --check assets/pwa.js && python3 -m json.tool manifest.webmanifest
```

Al cambiar archivos del shell o la lógica del SW, subir `CACHE_VERSION` en `sw.js`.
