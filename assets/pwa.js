/* AKAN — registro de la PWA (cargado con defer en cada página).
 * - Registra /sw.js solo en https o localhost.
 * - Sin banner de instalación: solo se guarda el evento para un botón futuro
 *   → window.akanPWA.install()
 * - Push APAGADO: subscribePush() no hace nada mientras VAPID_PUBLIC_KEY esté vacío.
 * Ver docs/PWA.md.
 */
(function () {
  'use strict';

  // Clave pública VAPID (base64url). Vacía = push desactivado.
  var VAPID_PUBLIC_KEY = '';
  // Endpoint FUTURO de Odoo. DEPENDE DE LA API v2: hoy NO existe
  // (docs/API_CONTRACT.md de akan-odoo). No se llama mientras no haya clave.
  var PUSH_REGISTER_URL = 'https://odoo-production-3a20.up.railway.app/akan/api/v2/push/register';
  var BRAND = 'akan';

  var secure = location.protocol === 'https:' ||
    location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  var deferredPrompt = null;

  if ('serviceWorker' in navigator && secure) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {});
    });
  }

  // Sin mini-infobar ni banner propio: guardamos el evento y ya.
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
  });
  window.addEventListener('appinstalled', function () { deferredPrompt = null; });

  function install() {
    if (!deferredPrompt) return Promise.resolve({ outcome: 'unavailable' });
    var p = deferredPrompt;
    deferredPrompt = null;
    p.prompt();
    return p.userChoice;
  }

  function urlBase64ToUint8Array(b64) {
    var pad = '='.repeat((4 - b64.length % 4) % 4);
    var raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  // Llamar SOLO desde un gesto explícito del usuario (click en un botón).
  // Nunca al cargar la página.
  function subscribePush() {
    if (!VAPID_PUBLIC_KEY) return Promise.resolve({ ok: false, reason: 'push_disabled' });
    if (!secure || !('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      return Promise.resolve({ ok: false, reason: 'unsupported' });
    }
    if (navigator.userActivation && !navigator.userActivation.isActive) {
      return Promise.resolve({ ok: false, reason: 'needs_user_gesture' });
    }
    return Notification.requestPermission().then(function (perm) {
      if (perm !== 'granted') return { ok: false, reason: 'denied' };
      return navigator.serviceWorker.ready.then(function (reg) {
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
      }).then(function (sub) {
        // La API v2 definirá la autenticación (p. ej. token del cliente).
        return fetch(PUSH_REGISTER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ brand: BRAND, subscription: sub.toJSON() })
        }).then(function (r) { return { ok: r.ok, reason: r.ok ? 'subscribed' : 'register_failed' }; });
      });
    }).catch(function () { return { ok: false, reason: 'error' }; });
  }

  window.akanPWA = {
    install: install,
    canInstall: function () { return !!deferredPrompt; },
    subscribePush: subscribePush
  };
})();
