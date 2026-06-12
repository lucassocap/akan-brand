/* ════════════════════════════════════════════════════════════════════
   AKAN — Carrito headless compartido (localStorage)
   Una sola fuente de verdad para tienda · carrito · perfil.
   El carrito vive 100% en el navegador del cliente. Odoo nunca ve un
   carrito a medias — solo recibe la orden ya confirmada en el checkout.
   ════════════════════════════════════════════════════════════════════ */
(function (w) {
  'use strict';
  var KEY = 'akan_cart';
  var API_BASE = (function () {
    try { return localStorage.getItem('AKAN_API') || 'https://odoo-production-3a20.up.railway.app'; }
    catch (e) { return 'https://odoo-production-3a20.up.railway.app'; }
  })();

  /* catálogo OTC base (fallback si la API aún no enriquece imagen/desc).
     code → ficha mínima que el carrito necesita para pintar la línea. */
  var OTC_FALLBACK = {
    'AKAN-SHAMPOO': { code: 'AKAN-SHAMPOO', name: 'Shampoo Ketoconazol 2%', price: 349,
      image_url: 'assets/photography/product/akan_bathroom_shelf.jpg',
      description: 'Limpia el exceso de DHT del cuero cabelludo y controla la caspa.', is_rx: false, category: 'Cuidado Diario' },
    'AKAN-SUPL': { code: 'AKAN-SUPL', name: 'Suplemento Capilar', price: 399,
      image_url: 'assets/photography/product/akan_product_family.jpg',
      description: 'Biotina + Zinc. El pelo nuevo nace más grueso y fuerte.', is_rx: false, category: 'Cuidado Diario' },
    'AKAN-MINOX': { code: 'AKAN-MINOX', name: 'Minoxidil Tópico 5%', price: 449,
      image_url: 'assets/premium/hero_light_products.jpg',
      description: 'Reactiva el folículo y la circulación. Aplicación diaria.', is_rx: false, category: 'Cuidado Diario' }
  };

  function read() {
    try { var v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }
  function write(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    emit();
  }
  function emit() {
    try { w.dispatchEvent(new CustomEvent('akan:cart', { detail: { count: count(), items: read() } })); } catch (e) {}
  }

  function count() { return read().reduce(function (n, l) { return n + (l.qty || 0); }, 0); }
  function total() { return read().reduce(function (s, l) { return s + (l.price || 0) * (l.qty || 0); }, 0); }

  /* agrega N de un producto. item = {code,name,price,image_url,description,...} */
  function add(item, qty) {
    qty = qty || 1;
    if (!item || !item.code) return;
    var items = read();
    var found = items.find(function (l) { return l.code === item.code; });
    if (found) { found.qty += qty; }
    else {
      items.push({
        code: item.code,
        name: item.name || item.code,
        price: Number(item.price) || 0,
        qty: qty,
        image_url: item.image_url || (OTC_FALLBACK[item.code] && OTC_FALLBACK[item.code].image_url) || '',
        description: item.description || '',
        category: item.category || ''
      });
    }
    write(items);
  }
  function setQty(code, qty) {
    var items = read();
    var l = items.find(function (x) { return x.code === code; });
    if (!l) return;
    l.qty = Math.max(0, qty | 0);
    if (l.qty === 0) items = items.filter(function (x) { return x.code !== code; });
    write(items);
  }
  function remove(code) { write(read().filter(function (l) { return l.code !== code; })); }
  function clear() { write([]); }

  /* construye items[] para POST /akan/api/checkout */
  function checkoutItems() {
    return read().map(function (l) { return { plan_code: l.code, qty: l.qty }; });
  }

  /* ── ícono de carrito en el nav (inyectable) ──
     uso: AkanCart.mountBadge(containerEl) → pinta <a> con contador vivo. */
  function badgeMarkup() {
    var n = count();
    return '<a href="carrito.html" class="akan-cart-btn" aria-label="Tu carrito">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>' +
      '<path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>' +
      '<span class="akan-cart-count" data-cart-count' + (n ? '' : ' hidden') + '>' + n + '</span></a>';
  }
  function mountBadge(container) {
    if (!container) return;
    container.innerHTML = badgeMarkup();
    var update = function () {
      var c = container.querySelector('[data-cart-count]');
      if (!c) return;
      var n = count();
      c.textContent = n;
      if (n) c.removeAttribute('hidden'); else c.setAttribute('hidden', '');
    };
    w.addEventListener('akan:cart', update);
  }

  w.AkanCart = {
    API_BASE: API_BASE,
    OTC_FALLBACK: OTC_FALLBACK,
    read: read, add: add, setQty: setQty, remove: remove, clear: clear,
    count: count, total: total, checkoutItems: checkoutItems,
    mountBadge: mountBadge, emit: emit
  };
})(window);
