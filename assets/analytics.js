/* ════════════════════════════════════════════════════════════════════
   AKAN — Capa de medición (Consent Mode v2 + GTM/GA4 + Meta + Ads +
   Clarity + Vercel). Spec: akan-odoo docs/ANALYTICS_SPEC.md · IDs en
   assets/analytics-config.js (cargar ANTES que este archivo).

   API pública (todas seguras de llamar aunque no haya ningún ID real):
     akanTrack(evento, params)   → push al dataLayer con brand:"akan"
     toAdsItems(items)           → items Rx genéricos para Meta/Ads (regla 2)
     getAttribution()            → objeto attribution{} del contrato v1.6
     AkanAnalytics.item(...)     → arma un item GA4 desde un producto AKAN
     AkanAnalytics.openConsent() → reabre el banner (footer «Preferencias…»)

   Privacidad médica (OBLIGATORIO, spec §3): ningún evento lleva respuestas
   del quiz, síntomas ni condición; nada de email/teléfono/nombre/token/ref
   en GA4; page_location limpio; Meta/Ads nunca ven el SKU de un Rx.
   ════════════════════════════════════════════════════════════════════ */
(function (w, d) {
  'use strict';
  var CFG = w.AKAN_ANALYTICS_CONFIG || {};
  var BRAND = CFG.BRAND || 'akan';
  var CONSENT_KEY = 'consent_v1';
  var CONSENT_VERSION = CFG.CONSENT_VERSION || 1;
  var ATTR_KEY = 'akan_attribution';

  function isSet(id) { return !!id && String(id).indexOf('XXXX') === -1; }
  var HAS_GTM = isSet(CFG.GTM_ID);
  var HAS_GA4 = isSet(CFG.GA4_ID);
  var HAS_PIXEL = isSet(CFG.META_PIXEL_ID);
  var HAS_CLARITY = isSet(CFG.CLARITY_ID);
  var HAS_ADS = isSet(CFG.GOOGLE_ADS_ID);
  /* sin GTM → respaldo directo (gtag/fbq/clarity desde este archivo) */
  var DIRECT = !HAS_GTM;

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function jsonParse(s, def) { try { var v = JSON.parse(s); return v == null ? def : v; } catch (e) { return def; } }
  function cookie(name) {
    var m = d.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  function cut(v) { return String(v == null ? '' : v).slice(0, 255); }

  /* ── page_location limpio (regla 3): solo utm_*, gclid, fbclid, gbraid,
     wbraid. Se van token, t, ref, email, plan, branch y cualquier otra. ── */
  var KEEP_PARAM = /^(utm_(source|medium|campaign|content|term|id)|gclid|fbclid|gbraid|wbraid)$/;
  function cleanUrl(href) {
    try {
      var u = new URL(href, location.href), out = [];
      u.searchParams.forEach(function (v, k) { if (KEEP_PARAM.test(k)) out.push(encodeURIComponent(k) + '=' + encodeURIComponent(v)); });
      return u.origin + u.pathname + (out.length ? '?' + out.join('&') : '');
    } catch (e) { return ''; }
  }
  function pageLocation() { return cleanUrl(location.href); }
  function pageReferrer() { return d.referrer ? cleanUrl(d.referrer) : ''; }

  /* ── 1. Consent Mode v2: default DENIED antes de cualquier tag ── */
  w.dataLayer = w.dataLayer || [];
  w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
  var gtag = w.gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'granted',
    personalization_storage: 'denied', security_storage: 'granted',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', false);

  function readConsent() {
    var c = jsonParse(lsGet(CONSENT_KEY), null);
    if (!c || c.v !== CONSENT_VERSION) return null;
    return { v: c.v, ts: c.ts, analytics: !!c.analytics, ads: !!c.ads };
  }
  var consent = readConsent();
  function consentSignals(c) {
    var a = c && c.analytics ? 'granted' : 'denied', ad = c && c.ads ? 'granted' : 'denied';
    return { analytics_storage: a, ad_storage: ad, ad_user_data: ad, ad_personalization: ad };
  }
  if (consent) gtag('consent', 'update', consentSignals(consent));

  /* contexto de página para GTM (variables DLV page_location / brand) */
  w.dataLayer.push({ brand: BRAND, page_location: pageLocation(), page_referrer: pageReferrer(),
    consent_analytics: !!(consent && consent.analytics), consent_ads: !!(consent && consent.ads) });

  function loadScript(src, attrs) {
    var s = d.createElement('script');
    s.async = true; s.src = src;
    if (attrs) for (var k in attrs) s.setAttribute(k, attrs[k]);
    (d.head || d.documentElement).appendChild(s);
    return s;
  }

  /* ── 2. GTM, o respaldo gtag directo a GA4 ── */
  var gtagJsLoaded = false;
  function ensureGtagJs(id) {
    if (gtagJsLoaded) return;
    gtagJsLoaded = true;
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id));
    gtag('js', new Date());
  }
  if (HAS_GTM) {
    w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    loadScript('https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(CFG.GTM_ID));
  } else if (HAS_GA4) {
    ensureGtagJs(CFG.GA4_ID);
    gtag('set', 'user_properties', { brand: BRAND });
    gtag('config', CFG.GA4_ID, {
      page_location: pageLocation(), page_referrer: pageReferrer(),
      allow_google_signals: false, allow_ad_personalization_signals: false, brand: BRAND
    });
  }

  /* ── 3. Vercel Web Analytics + Speed Insights (sin cookies, siempre) ──
     Solo existen en el deploy de Vercel: en localhost darían 404. */
  var ON_VERCEL = !/^(localhost|127\.0\.0\.1|\[?::1\]?|0\.0\.0\.0)$/.test(location.hostname) && location.protocol !== 'file:';
  if (ON_VERCEL) {
    w.va = w.va || function () { (w.vaq = w.vaq || []).push(arguments); };
    w.si = w.si || function () { (w.siq = w.siq || []).push(arguments); };
    var vBefore = function (ev) { if (ev && ev.url) ev.url = cleanUrl(ev.url); return ev; };
    w.va('beforeSend', vBefore);
    w.si('beforeSend', vBefore);
    loadScript('/_vercel/insights/script.js', { defer: '' });
    loadScript('/_vercel/speed-insights/script.js', { defer: '' });
  }

  /* ── 4. Proveedores con consentimiento (modo directo; con GTM viven
     en el contenedor con «consent checks»). Se cargan en DOMContentLoaded
     para que la página limpie antes su URL (perfil.html quita ?t=). ── */
  var loaded = { pixel: false, clarity: false, ads: false };
  function loadPixel() {
    if (loaded.pixel || !DIRECT || !HAS_PIXEL) return;
    loaded.pixel = true;
    /* snippet oficial de Meta (fbevents.js) */
    if (!w.fbq) {
      var n = w.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!w._fbq) w._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      loadScript('https://connect.facebook.net/en_US/fbevents.js');
    }
    /* autoConfig OFF: Meta NO lee botones/formularios por su cuenta */
    w.fbq('set', 'autoConfig', false, CFG.META_PIXEL_ID);
    w.fbq('init', CFG.META_PIXEL_ID);
    w.fbq('track', 'PageView');
  }
  function loadClarity() {
    if (loaded.clarity || !DIRECT || !HAS_CLARITY) return;
    loaded.clarity = true;
    w.clarity = w.clarity || function () { (w.clarity.q = w.clarity.q || []).push(arguments); };
    loadScript('https://www.clarity.ms/tag/' + encodeURIComponent(CFG.CLARITY_ID));
    w.clarity('consent');
    w.clarity('set', 'brand', BRAND);
  }
  function loadAds() {
    if (loaded.ads || !DIRECT || !HAS_ADS) return;
    loaded.ads = true;
    ensureGtagJs(CFG.GOOGLE_ADS_ID);
    gtag('config', CFG.GOOGLE_ADS_ID, { allow_enhanced_conversions: false });
  }
  function applyProviders() {
    if (!consent) return;
    if (consent.analytics) loadClarity();
    if (consent.ads) { loadPixel(); loadAds(); }
  }

  /* ── 5. Items (regla 2: Rx genérico hacia Meta/Ads) ── */
  var RX_CODES = ['AKAN-ESENCIAL', 'AKAN-COMPLETO', 'AKAN-KIT', 'AKAN-SILD', 'AKAN-TADA', 'AKAN-KITCONF', 'AKAN-CONSULTA'];
  var OTC_CODES = ['AKAN-SHAMPOO', 'AKAN-SUPL', 'AKAN-MINOX'];
  /* desconocido ⇒ se trata como Rx (privacidad por defecto) */
  function isRx(it) {
    if (!it) return true;
    if (it.is_rx === true) return true;
    if (it.is_rx === false) return false;
    var code = String(it.item_id || it.code || '').toUpperCase();
    if (RX_CODES.indexOf(code) !== -1) return true;
    return OTC_CODES.indexOf(code) === -1;
  }
  /* item GA4 desde un producto AKAN {code,name,price,qty,category,is_rx} */
  function item(p, extra) {
    p = p || {};
    var it = {
      item_id: String(p.code || p.item_id || ''),
      item_name: String(p.name || p.item_name || p.code || ''),
      item_brand: 'AKAN',
      item_category: String(p.category || p.item_category || (isRx(p) ? 'Tratamiento' : 'Cuidado Diario')),
      price: Math.round((Number(p.price) || 0) * 100) / 100,
      quantity: Number(p.qty || p.quantity) || 1,
      is_rx: isRx(p)
    };
    if (extra) for (var k in extra) it[k] = extra[k];
    return it;
  }
  function toAdsItems(items) {
    return (items || []).map(function (it) {
      var q = Number(it.quantity || it.qty) || 1, pr = Number(it.price) || 0;
      if (isRx(it)) return { item_id: 'akan_plan', item_name: 'Plan AKAN', item_category: 'tratamiento', price: pr, quantity: q };
      return { item_id: String(it.item_id || it.code || ''), item_name: String(it.item_name || it.name || ''),
        item_category: String(it.item_category || it.category || 'Cuidado Diario'), price: pr, quantity: q };
    });
  }
  function itemsValue(items) {
    return Math.round((items || []).reduce(function (s, it) { return s + (Number(it.price) || 0) * (Number(it.quantity) || 1); }, 0) * 100) / 100;
  }

  /* ── 6. akanTrack ── */
  var ECOM_KEYS = ['currency', 'value', 'items', 'transaction_id', 'tax', 'shipping', 'coupon',
    'item_list_id', 'item_list_name', 'shipping_tier', 'payment_type'];
  /* PII que JAMÁS debe salir en un evento (defensa en profundidad) */
  var BLOCKED = ['email', 'phone', 'tel', 'name', 'first_name', 'last_name', 'token', 'profile_token',
    'ref', 'answers', 'answer', 'profile', 'birthdate', 'address', 'street', 'zip'];
  var META_MAP = { view_item: 'ViewContent', add_to_cart: 'AddToCart', begin_checkout: 'InitiateCheckout',
    add_payment_info: 'AddPaymentInfo', purchase: 'Purchase', generate_lead: 'Lead', contact_whatsapp: 'Contact' };
  function rid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

  function akanTrack(name, params) {
    try {
      params = params || {};
      var p = {}, k;
      for (k in params) if (BLOCKED.indexOf(k) === -1 && params[k] !== undefined) p[k] = params[k];
      var ev = { event: name, brand: BRAND, page_location: pageLocation(),
        event_id: name === 'purchase' && p.transaction_id ? String(p.transaction_id) : name + '.' + rid() };
      var ga = { brand: BRAND };
      if (p.items) {
        var items = p.items.map(function (it) { var c = {}; for (var j in it) if (j !== 'is_rx') c[j] = it[j]; return c; });
        var ecom = {};
        ECOM_KEYS.forEach(function (key) { if (p[key] !== undefined) ecom[key] = p[key]; });
        ecom.items = items;
        if (ecom.currency === undefined) ecom.currency = 'MXN';
        if (ecom.value === undefined) ecom.value = itemsValue(items);
        for (k in p) if (ECOM_KEYS.indexOf(k) === -1) ev[k] = p[k];
        var ads = toAdsItems(p.items);
        ev.ecommerce = ecom;
        ev.value = ecom.value; ev.currency = ecom.currency;
        ev.ads_items = ads;
        ev.ads_content_ids = ads.map(function (a) { return a.item_id; });
        w.dataLayer.push({ ecommerce: null });  /* limpia el ecommerce anterior */
        for (k in ecom) ga[k] = ecom[k];
        for (k in p) if (ECOM_KEYS.indexOf(k) === -1) ga[k] = p[k];
      } else {
        for (k in p) { ev[k] = p[k]; ga[k] = p[k]; }
      }
      w.dataLayer.push(ev);

      if (DIRECT) {
        if (HAS_GA4) { ga.send_to = CFG.GA4_ID; gtag('event', name, ga); }
        if (consent && consent.ads) {
          if (loaded.pixel && w.fbq && META_MAP[name]) {
            var mp = {};
            if (ev.ads_items) {
              mp.content_ids = ev.ads_content_ids;
              mp.contents = ev.ads_items.map(function (a) { return { id: a.item_id, quantity: a.quantity }; });
              mp.content_type = 'product'; mp.value = ev.value; mp.currency = ev.currency;
            }
            w.fbq('track', META_MAP[name], mp, { eventID: ev.event_id });
          }
          var lbl = (CFG.GOOGLE_ADS_LABELS || {})[name];
          if (loaded.ads && isSet(lbl)) {
            var cv = { send_to: CFG.GOOGLE_ADS_ID + '/' + lbl };
            if (ev.value !== undefined) { cv.value = ev.value; cv.currency = ev.currency; }
            if (p.transaction_id) cv.transaction_id = String(p.transaction_id);
            gtag('event', 'conversion', cv);
          }
        }
      }
      return ev;
    } catch (e) { return null; }
  }

  /* ── 7. Atribución (spec §5 / contrato v1.6 attribution{}) ──
     En memoria siempre; persistida en sessionStorage SOLO con consentimiento.
     Identificadores (client_id, gclid, fbclid, _fbp, _fbc) solo con el
     consentimiento correspondiente. */
  var ATTR_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
  var attrMem = (function () {
    var a = {}, q;
    try { q = new URLSearchParams(location.search); } catch (e) { return a; }
    ATTR_FIELDS.forEach(function (k) { var v = q.get(k); if (v) a[k] = cut(v); });
    if (a.fbclid) a.fbc_ts = Date.now();
    var ref = d.referrer, external = ref && ref.indexOf(location.origin) !== 0;
    if (Object.keys(a).length || external || !ssGet(ATTR_KEY)) a.landing = cut(pageLocation());
    return a;
  })();
  function hasAnyConsent() { return !!(consent && (consent.analytics || consent.ads)); }
  function persistAttribution() {
    if (!hasAnyConsent()) return;
    var stored = jsonParse(ssGet(ATTR_KEY), {});
    var fresh = ATTR_FIELDS.some(function (k) { return attrMem[k]; });
    /* último clic con campaña gana; si no hay campaña nueva se conserva */
    var merged = fresh ? attrMem : stored;
    if (!merged.landing) merged.landing = stored.landing || attrMem.landing;
    ssSet(ATTR_KEY, JSON.stringify(merged));
  }
  function getAttribution() {
    var src = hasAnyConsent() ? (jsonParse(ssGet(ATTR_KEY), null) || attrMem) : attrMem;
    var out = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'landing'].forEach(function (k) {
      if (src[k]) out[k] = cut(src[k]);
    });
    if (consent && consent.analytics) {
      var ga = cookie('_ga').split('.');
      if (ga.length >= 4) out.ga_client_id = cut(ga.slice(-2).join('.'));
    }
    if (consent && consent.ads) {
      if (src.gclid) out.gclid = cut(src.gclid);
      if (src.fbclid) out.fbclid = cut(src.fbclid);
      var fbp = cookie('_fbp'), fbc = cookie('_fbc');
      if (fbp) out.fbp = cut(fbp);
      if (fbc) out.fbc = cut(fbc);
      else if (src.fbclid) out.fbc = cut('fb.1.' + (src.fbc_ts || Date.now()) + '.' + src.fbclid);
    }
    out.consent_ads = !!(consent && consent.ads);
    return out;
  }

  /* ── 8. Guardar / revocar consentimiento ── */
  function delCookies(prefixes) {
    var host = location.hostname, parts = host.split('.'), domains = ['', host];
    for (var i = 1; i < parts.length - 1; i++) domains.push('.' + parts.slice(i).join('.'));
    d.cookie.split('; ').forEach(function (c) {
      var name = c.split('=')[0];
      if (!prefixes.some(function (p) { return name.indexOf(p) === 0; })) return;
      domains.forEach(function (dm) {
        d.cookie = name + '=; Max-Age=0; path=/' + (dm ? '; domain=' + dm : '');
      });
    });
  }
  function saveConsent(analytics, ads) {
    var prev = consent;
    consent = { v: CONSENT_VERSION, ts: new Date().toISOString(), analytics: !!analytics, ads: !!ads };
    lsSet(CONSENT_KEY, JSON.stringify(consent));
    gtag('consent', 'update', consentSignals(consent));
    w.dataLayer.push({ event: 'akan_consent_update', consent_analytics: consent.analytics, consent_ads: consent.ads });
    persistAttribution();
    var revoked = prev && ((prev.analytics && !consent.analytics) || (prev.ads && !consent.ads));
    if (revoked) {
      if (!consent.analytics) delCookies(['_ga', '_clck', '_clsk', 'CLID']);
      if (!consent.ads) delCookies(['_fbp', '_fbc', '_gcl_']);
      if (!hasAnyConsent()) { try { sessionStorage.removeItem(ATTR_KEY); } catch (e) {} }
      /* los scripts ya cargados no se pueden «descargar»: recarga limpia */
      if (loaded.pixel || loaded.clarity || loaded.ads || HAS_GTM) { setTimeout(function () { location.reload(); }, 150); return; }
    }
    applyProviders();
  }

  /* ── 9. Banner de consentimiento (propio, accesible, móvil) ── */
  var BANNER_CSS = '' +
    '#akan-consent{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;padding:0 12px calc(12px + env(safe-area-inset-bottom));' +
    'font-family:"Hanken Grotesk",system-ui,-apple-system,sans-serif;color:#1B1812;pointer-events:none}' +
    '#akan-consent[hidden]{display:none}' +
    '#akan-consent .akc-card{pointer-events:auto;max-width:720px;margin:0 auto;background:#FFFEFA;border:1px solid rgba(27,24,18,.12);' +
    'border-radius:22px;box-shadow:0 18px 50px rgba(31,61,46,.22);padding:22px 22px 18px;max-height:calc(100svh - 24px);overflow:auto;' +
    'animation:akcIn .45s cubic-bezier(.16,1,.3,1)}' +
    '@keyframes akcIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}' +
    '@media(prefers-reduced-motion:reduce){#akan-consent .akc-card{animation:none}}' +
    '#akan-consent .akc-over{font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#2E6B4D;margin:0 0 6px}' +
    '#akan-consent h2{font-family:"Fraunces",Georgia,serif;font-weight:700;font-size:21px;line-height:1.2;letter-spacing:-.01em;margin:0 0 8px;color:#1F3D2E;outline:none}' +
    '#akan-consent p{font-size:14.5px;line-height:1.55;color:#57503F;margin:0}' +
    '#akan-consent a{color:#1F3D2E;text-decoration:underline;text-underline-offset:3px;font-weight:600}' +
    '#akan-consent .akc-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;align-items:center}' +
    '#akan-consent .akc-btn{font:inherit;font-weight:700;font-size:15px;border-radius:100px;padding:12px 22px;cursor:pointer;' +
    'min-height:46px;border:1.5px solid #1F3D2E;transition:background .2s}' +
    '#akan-consent .akc-btn:focus-visible,#akan-consent .akc-link:focus-visible,#akan-consent input:focus-visible+.akc-sw,#akan-consent a:focus-visible{outline:3px solid #C5623E;outline-offset:2px}' +
    '#akan-consent .akc-ghost{background:transparent;color:#1F3D2E}' +
    '#akan-consent .akc-ghost:hover{background:#E7F0E6}' +
    '#akan-consent .akc-solid{background:#1F3D2E;color:#FAF6EC}' +
    '#akan-consent .akc-solid:hover{background:#2E6B4D}' +
    '#akan-consent .akc-link{background:none;border:none;color:#1F3D2E;text-decoration:underline;text-underline-offset:3px;' +
    'font:inherit;font-weight:600;font-size:14.5px;padding:10px 4px;cursor:pointer;min-height:44px}' +
    '#akan-consent .akc-spacer{flex:1}' +
    '#akan-consent .akc-prefs{margin-top:14px;display:grid;gap:10px}' +
    '#akan-consent .akc-prefs[hidden]{display:none}' +
    '#akan-consent .akc-row{position:relative;display:flex;gap:14px;align-items:flex-start;justify-content:space-between;background:#FAF6EC;' +
    'border:1px solid rgba(27,24,18,.1);border-radius:16px;padding:13px 15px;cursor:pointer}' +
    '#akan-consent .akc-row b{display:block;font-size:15px;color:#1B1812;margin-bottom:2px}' +
    '#akan-consent .akc-row small{display:block;font-size:13px;line-height:1.45;color:#57503F}' +
    '#akan-consent .akc-row input{position:absolute;opacity:0;width:1px;height:1px}' +
    '#akan-consent .akc-sw{flex-shrink:0;width:46px;height:28px;border-radius:100px;background:#B9AC90;position:relative;transition:background .2s;margin-top:2px}' +
    '#akan-consent .akc-sw:after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#FFFEFA;' +
    'box-shadow:0 1px 3px rgba(0,0,0,.2);transition:transform .2s}' +
    '#akan-consent input:checked+.akc-sw{background:#2E6B4D}' +
    '#akan-consent input:checked+.akc-sw:after{transform:translateX(18px)}' +
    '#akan-consent input:disabled+.akc-sw{opacity:.55}' +
    '@media(max-width:560px){#akan-consent{padding:0 8px calc(8px + env(safe-area-inset-bottom))}' +
    '#akan-consent .akc-card{padding:18px 16px 12px;border-radius:20px}' +
    '#akan-consent h2{font-size:19px}#akan-consent p{font-size:14px}' +
    '#akan-consent .akc-actions .akc-btn{flex:1 1 calc(50% - 5px);padding:12px 10px}' +
    '#akan-consent .akc-spacer{display:none}#akan-consent .akc-link{order:3;width:100%;text-align:center;padding:6px}' +
    '#akan-consent .akc-actions .akc-btn[data-akc="save"]{order:3;flex-basis:100%}}';

  var banner = null;
  function sw(id, label, desc, checked, disabled) {
    return '<label class="akc-row" for="' + id + '"><span><b>' + label + '</b><small>' + desc + '</small></span>' +
      '<input type="checkbox" role="switch" id="' + id + '"' + (checked ? ' checked' : '') + (disabled ? ' disabled' : '') + '>' +
      '<span class="akc-sw" aria-hidden="true"></span></label>';
  }
  function setConfigMode(on) {
    var prefs = banner.querySelector('#akc-prefs'), b = banner.querySelector('[data-akc="config"],[data-akc="save"]');
    prefs.hidden = !on;
    b.setAttribute('aria-expanded', on ? 'true' : 'false');
    b.setAttribute('data-akc', on ? 'save' : 'config');
    b.textContent = on ? 'Guardar preferencias' : 'Configurar';
    b.className = on ? 'akc-btn akc-ghost' : 'akc-link';
  }
  function buildBanner() {
    if (banner) return banner;
    var st = d.createElement('style'); st.textContent = BANNER_CSS; d.head.appendChild(st);
    banner = d.createElement('div');
    banner.id = 'akan-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-labelledby', 'akc-title');
    banner.setAttribute('aria-describedby', 'akc-desc');
    banner.hidden = true;
    banner.innerHTML = '<div class="akc-card">' +
      '<p class="akc-over">Cookies y medición</p>' +
      '<h2 id="akc-title" tabindex="-1">Tu privacidad, primero.</h2>' +
      '<p id="akc-desc">Usamos cookies para medir cómo se usa AKAN y, si lo permites, para medir nuestras campañas. ' +
      '<b>Nunca compartimos tus respuestas médicas.</b> <a href="legal.html#cookies">Más información</a></p>' +
      '<div class="akc-prefs" id="akc-prefs" hidden>' +
      sw('akc-nec', 'Necesarias', 'Carrito, sesión de Mi AKAN y seguridad. Siempre activas.', true, true) +
      sw('akc-an', 'Analítica', 'Google Analytics y Microsoft Clarity: qué páginas funcionan y dónde hay fricción. Los formularios se enmascaran.', false, false) +
      sw('akc-ad', 'Publicidad', 'Meta y Google Ads: medir si nuestros anuncios funcionan. Los tratamientos se reportan solo como «Plan AKAN», sin detalle.', false, false) +
      '</div>' +
      '<div class="akc-actions">' +
      '<button type="button" class="akc-link" data-akc="config" aria-expanded="false" aria-controls="akc-prefs">Configurar</button>' +
      '<span class="akc-spacer"></span>' +
      '<button type="button" class="akc-btn akc-ghost" data-akc="reject">Rechazar</button>' +
      '<button type="button" class="akc-btn akc-solid" data-akc="accept">Aceptar todo</button>' +
      '</div></div>';
    d.body.insertBefore(banner, d.body.firstChild); /* 1º en el orden de tabulación */
    banner.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-akc]');
      if (!b) return;
      var act = b.getAttribute('data-akc');
      if (act === 'accept') { saveConsent(true, true); closeBanner(); }
      else if (act === 'reject') { saveConsent(false, false); closeBanner(); }
      else if (act === 'save') {
        saveConsent(banner.querySelector('#akc-an').checked, banner.querySelector('#akc-ad').checked); closeBanner();
      } else if (act === 'config') { setConfigMode(true); banner.querySelector('#akc-an').focus(); }
    });
    /* Esc cierra solo si ya hay una elección guardada (si no, el banner sigue) */
    banner.addEventListener('keydown', function (e) { if (e.key === 'Escape' && consent) closeBanner(); });
    return banner;
  }
  var lastFocus = null;
  function openBanner(showPrefs, focus) {
    buildBanner();
    var c = consent || { analytics: false, ads: false };
    banner.querySelector('#akc-an').checked = !!c.analytics;
    banner.querySelector('#akc-ad').checked = !!c.ads;
    setConfigMode(!!showPrefs);
    banner.hidden = false;
    if (focus) { lastFocus = d.activeElement; (showPrefs ? banner.querySelector('#akc-an') : banner.querySelector('#akc-title')).focus(); }
  }
  function closeBanner() {
    if (!banner) return;
    banner.hidden = true;
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    lastFocus = null;
  }

  /* ── 10. Delegados globales: WhatsApp + enlace «Preferencias de cookies» ── */
  d.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('a,button') : null;
    if (!t) return;
    if (t.hasAttribute('data-akan-consent-open')) { e.preventDefault(); openBanner(true, true); return; }
    var href = t.getAttribute('href') || '';
    if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) {
      var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
      var holder = t.closest('[data-wa-placement]');
      var sec = holder ? holder.getAttribute('data-wa-placement') : '';
      akanTrack('contact_whatsapp', { placement: page + (sec ? ':' + sec : '') });
    }
  }, true);

  function onReady() {
    applyProviders();
    if (!consent) openBanner(false, false);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', onReady);
  else onReady();
  persistAttribution();

  /* ── 11. purchase de respaldo (web): una sola vez por orden ── */
  var PX_PENDING = 'akan_px_pending', PX_SENT = 'akan_px_sent';
  function rememberCheckout(order, items, value) {
    if (!order) return;
    var pend = jsonParse(lsGet(PX_PENDING), {});
    pend[order] = { items: items || [], value: value, ts: Date.now() };
    lsSet(PX_PENDING, JSON.stringify(pend));
  }
  /* o = orden de /me {ref, amount, lines[], status}. Solo órdenes iniciadas
     en ESTE navegador (checkout → pago) y ya pagadas. Odoo manda el mismo
     transaction_id desde el servidor: GA4 y Meta deduplican. */
  var PAID = ['pagada_revision', 'aprobada_preparando', 'pagada', 'preparando', 'enviada', 'entregada'];
  function purchaseOnce(o) {
    if (!o || !o.ref || PAID.indexOf(o.status) === -1) return false;
    var sent = jsonParse(lsGet(PX_SENT), []);
    if (sent.indexOf(o.ref) !== -1) return false;
    var pend = jsonParse(lsGet(PX_PENDING), {});
    var p = pend[o.ref];
    if (!p) return false;
    var items = (o.lines && o.lines.length)
      ? o.lines.map(function (l) { return item({ code: l.code || l.plan_code, name: l.name, price: l.price, qty: l.qty }); })
      : (p.items || []);
    var value = o.amount != null ? Number(o.amount) : (p.value != null ? p.value : itemsValue(items));
    akanTrack('purchase', { transaction_id: String(o.ref), value: value, currency: 'MXN', shipping: 0, items: items });
    sent.push(o.ref);
    lsSet(PX_SENT, JSON.stringify(sent.slice(-50)));
    delete pend[o.ref];
    lsSet(PX_PENDING, JSON.stringify(pend));
    return true;
  }

  w.akanTrack = akanTrack;
  w.toAdsItems = toAdsItems;
  w.getAttribution = getAttribution;
  w.AkanAnalytics = {
    item: item, isRx: isRx, toAdsItems: toAdsItems, itemsValue: itemsValue,
    cleanUrl: cleanUrl, getAttribution: getAttribution, track: akanTrack,
    rememberCheckout: rememberCheckout, purchaseOnce: purchaseOnce,
    openConsent: function () { openBanner(true, true); },
    consent: function () { return consent ? { analytics: consent.analytics, ads: consent.ads, ts: consent.ts } : null; },
    mode: HAS_GTM ? 'gtm' : (HAS_GA4 ? 'gtag' : 'none')
  };
})(window, document);
