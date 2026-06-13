/* AKAN — Google Analytics 4 + eventos del funnel.
   Lucas: pon tu Measurement ID real abajo (formato G-XXXXXXXXXX). Mientras sea
   el placeholder, GA NO se carga (no rompe nada, no rastrea). Un solo lugar. */
(function () {
  var GA_ID = 'G-XXXXXXXXXX'; // <-- REEMPLAZAR por el Measurement ID de GA4

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };

  if (GA_ID && GA_ID.indexOf('XXXX') === -1) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  /* Helper para disparar eventos del funnel desde cualquier página:
     akanTrack('begin_checkout', {value: 449, currency: 'MXN'}) */
  window.akanTrack = function (name, params) {
    try { gtag('event', name, params || {}); } catch (e) {}
  };
})();
