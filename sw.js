/* AKAN — Service Worker (PWA)
 * Ver docs/PWA.md. Reglas de privacidad (obligatorias, COFEPRIS/LFPDPPP):
 *  - NUNCA se intercepta ni se cachea nada de otro origen (API de Odoo,
 *    analítica, wa.me, pagos, Google Fonts…): esas peticiones ni pasan por aquí.
 *  - NUNCA se cachean páginas con datos personales/médicos (perfil.html, quiz.html, carrito.html, direcciones.html)
 *    ni URLs con token en la query (?t=, token, email, ref): red sí o sí y,
 *    sin red, offline.html.
 *  - Solo GET. Lo demás (POST del quiz/carrito, etc.) no se toca.
 */
'use strict';

const CACHE_PREFIX = 'akan';
const CACHE_VERSION = 'v1'; // súbelo al cambiar PRECACHE o la lógica del SW
const STATIC_CACHE = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;
const PAGES_CACHE = `${CACHE_PREFIX}-pages-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Solo el "shell" estático: CSS, JS, íconos, logo y la página sin conexión.
// Nada de HTML con datos de cliente.
const PRECACHE = [
  '/offline.html',
  '/manifest.webmanifest',
  '/assets/pwa.js',
  '/assets/cart.js',
  '/assets/footer.js',
  '/assets/form-validate.js',
  '/favicon.svg',
  '/favicon-32.png',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png'
];

// Páginas con datos personales o médicos: jamás en Cache Storage.
const PRIVATE_PAGES = new Set(['perfil', 'quiz', 'carrito', 'direcciones']);
// Parámetros de query que delatan una URL personal (token de cliente, etc.).
const PRIVATE_PARAMS = ['t', 'token', 'access_token', 'email', 'ref'];

function isPrivate(url) {
  // /perfil, /perfil.html y /perfil/ cuentan igual
  const page = url.pathname.replace(/\/+$/, '').replace(/\.html$/, '').replace(/^\//, '');
  if (PRIVATE_PAGES.has(page)) return true;
  for (const key of url.searchParams.keys()) {
    const k = key.toLowerCase();
    if (PRIVATE_PARAMS.includes(k) || k.includes('token')) return true;
  }
  return false;
}

function isStaticAsset(request, url) {
  if (['style', 'script', 'font', 'image', 'manifest'].includes(request.destination)) return true;
  return /\.(?:css|js|mjs|woff2?|ttf|otf|png|jpe?g|gif|webp|avif|svg|ico|webmanifest)$/i.test(url.pathname);
}

// Solo guardamos respuestas propias, completas y que no pidan "no-store".
function cacheable(response) {
  if (!response || !response.ok || response.type !== 'basic') return false;
  const cc = response.headers.get('Cache-Control') || '';
  return !/no-store|private/i.test(cc);
}

// Las páginas se guardan por ruta, sin query (utm_*, ?source=pwa…).
function pageKey(url) {
  return url.origin + (url.pathname === '/index.html' ? '/' : url.pathname);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((k) => k.startsWith(CACHE_PREFIX + '-') && k !== STATIC_CACHE && k !== PAGES_CACHE)
        .map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return; // solo GET
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // otros orígenes: ni se tocan
  if (url.pathname === '/sw.js') return;

  const isNav = request.mode === 'navigate';

  // Datos personales/médicos: solo red; sin red → offline.html (si es navegación).
  if (isPrivate(url)) {
    // cache: 'no-store' → tampoco se sirve una copia vieja de la caché HTTP del navegador.
    if (isNav) event.respondWith(fetch(request, { cache: 'no-store' }).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  if (isNav) {
    event.respondWith(networkFirstPage(request, url));
    return;
  }

  if (isStaticAsset(request, url)) {
    event.respondWith(staleWhileRevalidate(event, request));
  }
  // Cualquier otra cosa (JSON, txt…) va directo a la red sin intervención.
});

async function networkFirstPage(request, url) {
  const key = pageKey(url);
  try {
    const response = await fetch(request);
    if (cacheable(response)) {
      const copy = response.clone();
      caches.open(PAGES_CACHE).then((c) => c.put(key, copy)).catch(() => {});
    }
    return response;
  } catch (err) {
    const cached = await caches.match(key, { ignoreSearch: true });
    return cached || caches.match(OFFLINE_URL);
  }
}

async function staleWhileRevalidate(event, request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request, { ignoreSearch: true });
  const network = fetch(request)
    .then((response) => {
      if (cacheable(response)) return cache.put(request, response.clone()).then(() => response);
      return response;
    });
  if (cached) {
    event.waitUntil(network.catch(() => {}));
    return cached;
  }
  return network;
}

/* ---------- Push (APAGADO por defecto: sin VAPID no hay suscripciones) ----------
 * El contenido de la notificación es SIEMPRE genérico. Se ignora el payload
 * a propósito: nunca mostrar nombre de medicamento, diagnóstico ni montos
 * (pantalla de bloqueo = dato visible para terceros; COFEPRIS/LFPDPPP).
 */
const PUSH_TITLE = 'AKAN';
const PUSH_BODY = 'Tienes una actualización de tu pedido';
const PUSH_OPEN_URL = '/perfil.html';

self.addEventListener('push', (event) => {
  event.waitUntil(self.registration.showNotification(PUSH_TITLE, {
    body: PUSH_BODY,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'akan-pedido',
    renotify: false,
    data: { url: PUSH_OPEN_URL }
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(PUSH_OPEN_URL, self.location.origin).href;
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of all) {
      if (client.url.split('?')[0] === target && 'focus' in client) return client.focus();
    }
    return self.clients.openWindow(target);
  })());
});
