# AKAN — Llaves, accesos y decisiones que faltan activar

> Documento maestro para Lucas y su socio. Lista TODO lo que la plataforma
> necesita que ustedes consigan/activen para pasar de "funcional con datos de
> prueba" a "abierto a clientes reales". Cada llave dice: qué es, para qué
> sirve, dónde se obtiene, quién la consigue, costo aproximado, dónde se
> configura, y notas de seguridad. **Última actualización: jun 2026.**

---

## 0. Cómo leer esto (resumen ejecutivo)

- La plataforma **ya funciona** end-to-end con datos de prueba: tienda, quiz,
  perfil del cliente, bandeja del médico, farmacia, citas, timeline en vivo.
- Lo que falta son **llaves de terceros** (pagos, fiscal, correo, Google) y
  **decisiones de negocio** (médico real, farmacia aliada). Sin ellas el
  código está listo pero no puede "enviar/cobrar/timbrar" de verdad.
- **Regla de oro de seguridad:** ninguna de estas llaves va en el código ni en
  GitHub. Viven como **variables de entorno** en Railway (backend Odoo) o
  Vercel (web), o dentro de la configuración de Odoo. Ver §8 (Gobernanza).

---

## 1. TABLA MAESTRA (prioridad y estado)

| # | Llave / acceso | Desbloquea | Quién | Costo aprox | Prioridad | Estado |
|---|---|---|---|---|---|---|
| 1 | **Mercado Pago** (Access Token) | Pago real + reembolso automático | Lucas/socio | Comisión ~3.5% + IVA por venta | 🔴 Crítica | ⏳ Pendiente (hoy modo Demo) |
| 2 | **CSD del SAT** (.cer/.key/contraseña) | Factura CFDI 4.0 | Lucas/socio (RFC AKAN) | Gratis (trámite SAT) | 🟠 Alta | ⏳ Pendiente |
| 3 | **Contrato con un PAC** (Finkok/Sol. Factible) | Timbrado CFDI | Lucas/socio | ~$0.50–1.00 MXN por timbre | 🟠 Alta | ⏳ Pendiente |
| 4 | **RFC + régimen fiscal de AKAN** (persona moral) | Datos fiscales en factura | Contador/socio | — | 🟠 Alta | ⏳ Pendiente |
| 5 | **SMTP** (Gmail Workspace / SendGrid) | Correos: OTP, recibos, avisos | Lucas/socio | Workspace ~$6 USD/mes o SendGrid free | 🔴 Crítica | ⏳ Pendiente |
| 6 | **WhatsApp Business API** (Meta) | Avisos WhatsApp (receta, guía, OTP) | Lucas/socio | Por conversación (~$0.03–0.08 USD) | 🟠 Alta | ⏳ Pendiente |
| 7 | **GA4 Measurement ID** (G-XXXX) | Google Analytics (ya cableado) | Lucas | Gratis | 🟡 Media | ⏳ Pendiente |
| 8 | **Google Search Console** (verificación) | Indexación/SEO | Lucas | Gratis | 🟡 Media | ⏳ Pendiente |
| 9 | **Google Cloud OAuth** (Client ID/Secret) | Login con Google + Google Meet en citas | Lucas | Gratis | 🟡 Media | ⏳ Pendiente |
| 10 | **Dominio akan.mx** + DNS | Marca propia, canonical SEO | Lucas/socio | ~$10–30 USD/año | 🟠 Alta | ⏳ Pendiente |
| 11 | **RAILWAY_TOKEN** (GitHub Secret) | Auto-deploy de Odoo (CI) | Lucas | Gratis | 🟡 Media | ⚠️ Inválido (deploys a mano) |
| 12 | **Médico real con cédula** | Recetas reales + expediente NOM-024 + E-E-A-T SEO | Lucas/socio | Honorarios médico | 🔴 Crítica | ⏳ Pendiente |
| 13 | **Farmacia aliada** (contrato + costos mayoreo) | Despacho real de medicamentos | Lucas/socio | Margen mayoreo | 🔴 Crítica | ⏳ Pendiente (#1 del proyecto) |
| 14 | **Revisión legal** (LFPDPPP + NOM-024) | Aviso de privacidad firmado, cumplimiento salud | Abogado | Honorarios | 🟠 Alta | ⏳ Pendiente |

---

## 2. PAGOS — Mercado Pago (#1)

- **Qué es:** pasarela de pago mexicana. Hoy la plataforma usa el proveedor
  **"Demo"** de Odoo (no cobra de verdad; el reembolso es manual).
- **Para qué:** cobrar al confirmar la orden (modelo cobro-de-una) y, si el
  médico no aprueba, **reembolsar el 100% automático** (server-to-server).
- **Dónde se obtiene:** cuenta de Mercado Pago empresa → Credenciales →
  Access Token de producción.
- **Dónde se configura:** Odoo → Ajustes → Pagos → proveedor Mercado Pago
  (variable/credencial en Railway, no en el código). Apagar "Demo".
- **Seguridad:** AKAN **nunca** guarda números de tarjeta (los maneja Mercado
  Pago, PCI). El Access Token es secreto de producción: solo en Railway.
- **Decisión con el socio:** ¿cuenta de MP a nombre de la persona moral AKAN?
  ¿quién es el titular/firmante? ¿conciliación contable?

---

## 3. FISCAL / FACTURACIÓN CFDI (#2, #3, #4)

- **Qué es:** para emitir factura fiscal (CFDI 4.0) timbrada ante el SAT.
- **Piezas:**
  - **CSD** (Certificado de Sello Digital): `.cer` + `.key` + contraseña, se
    descargan del portal del SAT con el RFC de AKAN.
  - **PAC** (Proveedor Autorizado de Certificación): contrato + credenciales
    API (Finkok, Solución Factible, etc.). Odoo timbra a través de él.
  - **RFC + régimen** de AKAN como persona moral (régimen general, código 601)
    + domicilio fiscal con CP.
- **Dónde se configura:** módulo `l10n_mx_edi` de Odoo + las credenciales en
  Railway. (El puente orden→factura en borrador ya está construido; solo falta
  el timbrado real, que es server-to-server con el SAT vía el PAC.)
- **Seguridad:** el `.key` y la contraseña del CSD son **altamente sensibles**
  (firman fiscalmente a nombre de AKAN). Solo en variables de Railway, acceso
  restringido, nunca en repos ni chats.
- **Decisión con el socio:** ¿qué PAC? ¿modo sandbox para probar antes de
  producción? ¿quién es el contador responsable?

---

## 4. COMUNICACIONES — SMTP y WhatsApp (#5, #6)

### SMTP (correo) — crítico
- **Para qué:** mandar el **código OTP de validación de email** (login
  passwordless), recibos, avisos de receta aprobada/rechazada, recordatorios.
- **Opciones:** Google Workspace (correo @akan.mx), SendGrid, Postmark, Amazon SES.
- **Datos que se necesitan:** host, puerto, usuario, contraseña/API key.
- **Dónde se configura:** Odoo → Ajustes → Servidores de correo saliente
  (credenciales en Railway).

### WhatsApp Business API (Meta) — alta
- **Para qué:** avisos por WhatsApp (receta aprobada, número de guía al
  despachar, OTP, re-validación semestral). Es el canal de mayor confianza en MX.
- **Dónde se obtiene:** Meta Business + un BSP (proveedor: 360dialog, Twilio,
  Gupshup) o WhatsApp Cloud API directo. Requiere verificación de negocio Meta
  y plantillas aprobadas.
- **Seguridad/decisión:** número de WhatsApp del negocio, verificación de Meta,
  quién administra las plantillas.

---

## 5. GOOGLE — Analytics, Search Console, OAuth/Meet (#7, #8, #9)

- **GA4 Measurement ID (G-XXXX):** ya está cableado en las 7 páginas
  (`assets/analytics.js`). Solo hay que pegar el ID real en ese archivo (un
  solo lugar) y rastrea todo el funnel. Gratis, en analytics.google.com.
- **Google Search Console:** verificar la propiedad (akan.mx o el dominio
  Vercel) para indexación y métricas de búsqueda. Gratis.
- **Google Cloud OAuth (Client ID + Secret):** sirve para **dos** cosas:
  1. **Login con Google** del cliente (ya cableado en el perfil, aparece solo
     si está configurado).
  2. **Google Meet automático en las citas** vía el módulo `google_calendar`
     de Odoo (sincroniza el Google Calendar del médico → genera link de Meet).
- **Dónde se obtiene:** console.cloud.google.com → APIs y servicios →
  Credenciales → ID de cliente de OAuth.
- **Nota:** mientras no haya Google Cloud, las citas usan **Jitsi** (link de
  video gratis, ya automático).

---

## 6. INFRAESTRUCTURA — Dominio y CI (#10, #11)

- **Dominio akan.mx:** registrar y apuntar DNS — la web (Vercel) y, si se
  quiere, el backend (Railway) a subdominios. Al activarlo hay que cambiar el
  canonical/sitemap/robots/llms de `akan-five.vercel.app` a `akan.mx`.
- **RAILWAY_TOKEN (GitHub Secret):** hoy está **inválido**, por eso los `git
  push` no despliegan Odoo solos (se despliega a mano con `railway up`).
  Regenerar el token en Railway y pegarlo en GitHub → Settings → Secrets.
- **Ya cubierto:** HTTPS forzado (Vercel + Railway), una sola base de datos
  PostgreSQL (Railway), backups básicos de Railway.

---

## 7. OPERACIÓN CLÍNICA — Médico y Farmacia (#12, #13)

- **Médico real con cédula:** se necesita el/los médico(s) reales (nombre,
  cédula profesional, especialidad, firma) para: emitir recetas válidas,
  llenar el **expediente NOM-024**, y dar el **E-E-A-T médico** que el SEO de
  salud (YMYL) exige. Hoy el usuario `medico@akan.mx` es de prueba.
- **Farmacia aliada:** contrato + **costos de mayoreo** (es el pendiente #1 del
  proyecto). Define márgenes, inventario y el despacho real. Hoy `farmacia@akan.mx`
  es de prueba.
- **Decisión con el socio:** ¿médico empleado o por honorarios? ¿una o varias
  farmacias? ¿inventario propio o consignación?

---

## 8. GOBERNANZA DE SECRETOS (clave para revisar con el socio)

Esto es lo que protege a AKAN (datos de pago, salud y fiscales = altísima
sensibilidad). Recomendaciones:

1. **Dónde viven los secretos:** variables de entorno en **Railway** (backend)
   y **Vercel** (web). NUNCA en el código, en GitHub, ni en chats/correos.
2. **Quién tiene acceso:** definir 1–2 personas con acceso a Railway/Vercel/SAT.
   Llevar registro de quién tiene qué llave.
3. **Rotación:** rotar tokens (Mercado Pago, Railway, WhatsApp) periódicamente
   y al salir cualquier proveedor/empleado.
4. **Separación de ambientes:** idealmente un ambiente de **pruebas** (sandbox
   del PAC, Mercado Pago test) separado de **producción**.
5. **CSD del SAT:** el `.key` + contraseña firman fiscalmente a AKAN — tratarlos
   como la llave más sensible. Acceso mínimo.
6. **Datos de salud:** confirmar **cifrado en reposo** del PostgreSQL en Railway
   y registrar accesos a datos clínicos (requisito LFPDPPP/NOM-024).
7. **Cumplimiento (con abogado):** aviso de privacidad LFPDPPP firmado,
   consentimiento informado NOM-024, política de retención de datos clínicos.

---

## 9. ORDEN RECOMENDADO (checklist)

**Bloque 1 — para poder cobrar y operar (antes de abrir):**
- [ ] Mercado Pago (token producción)
- [ ] SMTP (para OTP, recibos, avisos)
- [ ] Médico real con cédula
- [ ] Farmacia aliada + costos mayoreo
- [ ] Revisión legal (aviso de privacidad + consentimiento)

**Bloque 2 — fiscal:**
- [ ] RFC + régimen de AKAN
- [ ] CSD del SAT (.cer/.key/contraseña)
- [ ] Contrato con un PAC

**Bloque 3 — crecimiento / experiencia:**
- [ ] Dominio akan.mx + DNS
- [ ] GA4 Measurement ID
- [ ] Google Search Console
- [ ] Google Cloud OAuth (login + Google Meet)
- [ ] WhatsApp Business API
- [ ] RAILWAY_TOKEN (arreglar CI)

---

## 10. LO QUE YA ESTÁ CUBIERTO (para tranquilidad)

- Tienda headless leyendo de Odoo (productos, precios, fotos) en vivo.
- Quiz/evaluación → orden → cobro-de-una (con fallback) → perfil del cliente
  con timeline en vivo (se actualiza solo, sin refrescar).
- Bandeja del médico (aprobar/rechazar, ver el cuestionario, expediente
  NOM-024 esqueleto), farmacia (despacho sin precios ni datos médicos),
  consolidación, tablero del dueño.
- Citas del médico (calendario + botón en el caso + link de video Jitsi auto).
- Login del cliente (email + nº de orden; passwordless por OTP listo para SMTP;
  Google login cableado).
- Seguridad base: HTTPS, tarjetas delegadas a la pasarela, aislamiento por rol,
  una sola fuente de verdad (Odoo).
- SEO/AEO: robots, sitemap, llms.txt, JSON-LD de productos y negocio médico,
  Analytics cableado (ver `docs/SEO_AEO_ANALYTICS_PLAN.md`).

---

*Mantener este documento actualizado: cada vez que se active una llave, marcar
su estado y mover el checklist. Las llaves se configuran como variables de
entorno; este archivo solo dice QUÉ falta y POR QUÉ, nunca el valor de la llave.*
