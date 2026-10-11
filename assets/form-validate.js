/* ════════════════════════════════════════════════════════════════════
   AKAN — Validación inline de formularios (carrito y evaluación)
   - Asocia cada <label> con su campo (accesibilidad).
   - Valida al enviar y, después del primer intento o al salir del campo,
     muestra el error debajo del campo (aria-invalid + aria-describedby).
   - Teléfono MX: 10 dígitos (acepta espacios, guiones y +52).
   - C.P.: 5 dígitos.
   Uso: AkanForm.enhance(form)  ·  if (!AkanForm.validate(form, ['name','phone',...])) return;
   ════════════════════════════════════════════════════════════════════ */
(function (w, d) {
  'use strict';
  var css = '.field-msg{color:#A1401F;font-size:13.5px;font-weight:600;margin-top:6px;line-height:1.35}' +
    '.field select.err{border-color:#C5623E;background:#FDF1EA}' +
    '.field input:focus,.field select:focus{box-shadow:0 0 0 3px rgba(62,142,104,.28)}' +
    '.consent{display:flex;gap:12px;align-items:flex-start;font-size:14px;line-height:1.45;color:#3F3A2E;' +
    'background:#FFFEFA;border:1.5px solid rgba(27,24,18,.14);border-radius:14px;padding:14px 16px;cursor:pointer;min-height:44px}' +
    '.consent input{width:22px;height:22px;flex-shrink:0;margin-top:1px;accent-color:#2E6B4D;cursor:pointer}' +
    '.consent a{text-decoration:underline;font-weight:700;color:#1F3D2E}' +
    '.consent.err{border-color:#C5623E;background:#FDF1EA}';
  var st = d.createElement('style'); st.textContent = css; d.head.appendChild(st);

  function digits(v) { return String(v || '').replace(/\D/g, ''); }
  function phoneMx(v) {
    var x = digits(v);
    if (x.length === 12 && x.indexOf('52') === 0) x = x.slice(2);
    if (x.length === 13 && x.indexOf('521') === 0) x = x.slice(3);
    return x;
  }
  var RULES = {
    name: [function (v) { return /[A-Za-zÁÉÍÓÚÑáéíóúñü].*\s+.*[A-Za-zÁÉÍÓÚÑáéíóúñü]/.test(String(v).trim()); }, 'Escribe tu nombre y apellido.'],
    phone: [function (v) { return phoneMx(v).length === 10; }, 'Escribe tu WhatsApp de 10 dígitos (ej. 55 1234 5678).'],
    email: [function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()); }, 'Revisa tu correo (ej. tu@correo.com).'],
    street: [function (v) { return String(v).trim().length >= 4; }, 'Escribe tu calle y número.'],
    city: [function (v) { return String(v).trim().length >= 2; }, 'Escribe tu ciudad o municipio.'],
    zip: [function (v) { return /^\d{5}$/.test(String(v).trim()); }, 'El código postal debe tener 5 dígitos.'],
    state: [function (v) { return String(v).trim().length > 0; }, 'Elige tu estado.'],
    birthdate: [function (v) { return /^\d{4}-\d{2}-\d{2}$/.test(String(v)); }, 'Escribe tu fecha de nacimiento.'],
    consent_health: [function (v, el) { return !!(el && el.checked); }, 'Para enviar tus respuestas necesitamos tu consentimiento expreso.']
  };
  var uid = 0;

  function msgEl(el) {
    var host = el.type === 'checkbox' ? (el.closest('.consent') || el.parentNode) : (el.closest('.field') || el.parentNode);
    var id = el.getAttribute('data-msg-id');
    var m = id && d.getElementById(id);
    if (!m) {
      id = 'fmsg' + (++uid);
      m = d.createElement('div'); m.className = 'field-msg'; m.id = id; m.hidden = true;
      m.setAttribute('aria-live', 'polite');
      host.parentNode.insertBefore(m, host.nextSibling);
      if (el.type !== 'checkbox' && host.classList.contains('field')) { host.appendChild(m); }
      el.setAttribute('data-msg-id', id);
      var by = (el.getAttribute('aria-describedby') || '').trim();
      el.setAttribute('aria-describedby', (by ? by + ' ' : '') + id);
    }
    return m;
  }
  function check(el, show) {
    var r = RULES[el.name]; if (!r) return true;
    var ok = r[0](el.value, el);
    var box = el.type === 'checkbox' ? el.closest('.consent') : el;
    if (show || ok) {
      if (box) box.classList.toggle('err', !ok);
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      var m = msgEl(el); m.textContent = ok ? '' : r[1]; m.hidden = ok;
    }
    return ok;
  }
  function enhance(form) {
    if (!form || form._akanForm) return; form._akanForm = 1;
    form.querySelectorAll('.field').forEach(function (f) {
      var lab = f.querySelector('label'), inp = f.querySelector('input,select,textarea');
      if (!lab || !inp) return;
      if (!inp.id) inp.id = 'f_' + (inp.name || 'x') + '_' + (++uid);
      lab.htmlFor = inp.id;
      if (RULES[inp.name]) inp.setAttribute('aria-required', 'true');
    });
    var phone = form.querySelector('[name=phone]'); if (phone) { phone.setAttribute('inputmode', 'tel'); }
    var zip = form.querySelector('[name=zip]'); if (zip) { zip.setAttribute('maxlength', '5'); zip.setAttribute('autocomplete', 'postal-code'); }
    form.addEventListener('focusout', function (e) {
      var el = e.target; if (!el.name || !RULES[el.name]) return;
      if (el.value !== '' || form._tried) check(el, true);
    });
    form.addEventListener('input', function (e) { var el = e.target; if (el.getAttribute('aria-invalid') === 'true') check(el, true); });
    form.addEventListener('change', function (e) { var el = e.target; if (el.getAttribute('aria-invalid') === 'true' || el.type === 'checkbox') check(el, true); });
  }
  /* valida los campos `names` presentes en el form; enfoca el primero inválido */
  function validate(form, names) {
    enhance(form); form._tried = true;
    var first = null;
    names.forEach(function (n) {
      var el = form.querySelector('[name=' + n + ']'); if (!el) return;
      if (!check(el, true) && !first) first = el;
    });
    if (first) { try { first.focus({ preventScroll: false }); } catch (e) { first.focus(); } }
    return !first;
  }
  w.AkanForm = { enhance: enhance, validate: validate, phoneMx: phoneMx };
})(window, document);
