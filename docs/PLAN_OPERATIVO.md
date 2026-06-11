# AKAN — Plan Operativo v1
## De landing bonita a operación real: cliente → médico → farmacia → puerta
### Junio 2026

---

## 1. EL PRINCIPIO RECTOR

**"Es Instagram: tocan, compran."** Cada paso que no acerca al cliente a su
tratamiento, sobra. El benchmark de fricción es Keeps (quiz de 1 minuto como
gateway) y Hims (compra directa con consulta integrada). Nuestro flujo
completo debe poder ocurrir en el celular, con el pulgar, en menos de 4 minutos.

---

## 2. EL JOURNEY COMPLETO (OPERATIVA END-TO-END)

```
 ANUNCIO IG/TikTok
   │ (tap)
 LANDING (akan-five.vercel.app → futuro akan.mx)
   │ (tap "Comenzar evaluación")
 QUIZ — quiz.html (2-3 min, mobile-first)
   │  Rama PELO: patrón → tiempo → edad → antecedentes → salud (gates) → agresividad
   │  Rama DESEMPEÑO: situación → frecuencia → salud cardiaca (GATE NITRATOS) → preferencia
   │  → Recomendación de plan con precio
   │ (tap "Lo quiero")
 CHECKOUT (mismo quiz.html, 1 pantalla)
   │  nombre, whatsapp, email, dirección, CP
   │  [Fase 2: pago con tarjeta Conekta/Stripe aquí]
   │  POST /akan/api/checkout → ODOO
   │
 ODOO (la torre de control)
   ├── res.partner (cliente creado/encontrado por email)
   ├── crm.lead etapa "Quiz Completado" — con TODAS las respuestas del quiz
   └── sale.order BORRADOR con el plan elegido
   │
 MÉDICO (medico@akan.mx — rol restringido en Odoo)
   │  1. Ve leads en "Quiz Completado", revisa respuestas (su consulta async)
   │  2. Si necesita más info → WhatsApp/videollamada al cliente
   │  3. Aprueba → mueve lead a "Receta Emitida" + CONFIRMA la sale.order
   │     (la receta PDF se adjunta a la orden — NOM-024)
   │  4. Si contraindicado → lead "Perdido" + se notifica al cliente (no se cobra)
   │
 FARMACIA (farmacia@akan.mx — rol restringido en Odoo = SU PLATAFORMA)
   │  1. Ve SOLO órdenes confirmadas (sale.order → stock.picking de salida)
   │  2. Prepara el paquete (empaque neutro AKAN, sin marca exterior)
   │  3. Captura guía del courier y marca "Hecho" → picking validado
   │
 DESPACHO
   │  Courier (Estafeta/DHL/99minutos según zona) — guía registrada en el picking
   │  Cliente recibe WhatsApp con tracking [Fase 2: automatizado]
   │
 CLIENTE recibe en 24-72h
   │
 RENOVACIÓN MENSUAL
      Fase 1: sale.order recurrente manual (admin duplica orden, cobro por link)
      Fase 2: suscripción real — OCA subscription_oca o Stripe Billing/Conekta
      El médico re-valida la receta cada 6-12 meses (lead recurrente)
```

## 3. ROLES Y ACCESOS EN ODOO

| Rol | Usuario | Ve | NO ve |
|---|---|---|---|
| Admin AKAN | admin@akan.mx | Todo | — |
| Médico | medico@akan.mx | CRM (leads/quiz), órdenes (lectura), partners | Inventario, finanzas, config |
| Farmacia | farmacia@akan.mx | Órdenes confirmadas, pickings, inventario | CRM/datos médicos del quiz, precios de venta, config |
| Cliente | (no entra a Odoo) | Su tracking por WhatsApp/email | — |

**Clave de privacidad:** la farmacia ve QUÉ despachar y A DÓNDE, pero NUNCA las
respuestas médicas del quiz (eso vive en el lead de CRM, fuera de su alcance).

## 4. ARQUITECTURA TÉCNICA

### Hoy (MVP local-first)
```
[Vercel] akan-five.vercel.app          [Mac de Lucas / Docker]
  index.html  (vitrina + catálogo)        akan_odoo :8070
  quiz.html   (funnel + checkout) ──POST──▶ akan_api (módulo custom)
  brand.html  (manual)                       ├─ /akan/api/health   (GET, detección)
                                             ├─ /akan/api/checkout (POST, CORS, público)
                                             └─ crea partner + lead + sale.order
```
- El front detecta la API con `/akan/api/health`. Si no responde (ej. viendo
  el sitio en Vercel sin túnel), el checkout entra en **modo demo**: guarda la
  orden en localStorage y muestra CTA de WhatsApp para cerrar manual. Cero
  errores frente al cliente.
- `window.AKAN_API = '<base url>'` en un solo lugar de quiz.html — cambiar a
  Railway después es UNA línea.

### Mañana (producción en Railway)
```
[Vercel o Railway] akan.mx             [Railway]
  web estática / Next.js  ──HTTPS──▶   odoo (Dockerfile de akan-odoo)
                                       postgres 16 (servicio Railway)
                                       volumen filestore
```
- **Railway-ready desde ya:** akan-odoo es Docker Compose puro (odoo:19 +
  postgres:16). Para Railway: servicio 1 = imagen odoo:19 con
  `custom_addons/` montado en build (Dockerfile `FROM odoo:19` + `COPY`),
  servicio 2 = Postgres managed, variables HOST/USER/PASSWORD, dominio
  `erp.akan.mx`. Patrón ya probado en netora-upstream (GitHub Actions →
  Railway CLI).
- Pagos (Fase 2): Conekta (OXXO Pay + tarjetas, clave para México) o Stripe.
  Se integra como payment provider de Odoo website_sale O como charge en el
  checkout propio antes del POST.

## 5. REPOS (separación limpia)

| Repo | Contenido | Deploy |
|---|---|---|
| `akan-brand` | Web pública (index/quiz/brand + assets) | Vercel (ya) → futuro akan.mx |
| `akan-odoo` | docker-compose, config, custom_addons (akan_theme, akan_api), scripts setup | Local → Railway |
| `akan-business` | Business plan + modelo financiero | Vercel (ya) |
| `mex_md` | Project Bible + app futura | — |

`akan-odoo` necesita git init + GitHub (hoy es carpeta local). Los addons son
el activo: el deploy a Railway se construye desde ese repo.

## 6. CATÁLOGO COMPLETO (pelo + desempeño)

| Código | Producto | Precio MXN/mes | Rama |
|---|---|---|---|
| AKAN-ESENCIAL | Plan Esencial — Finasteride 1mg | $549 | Pelo |
| AKAN-COMPLETO | Plan Completo — Finasteride + Minoxidil 5% | $849 | Pelo |
| AKAN-KIT | Kit AKAN Total — Fin + Min + Shampoo + Suplemento | $1,199 | Pelo |
| AKAN-SHAMPOO | Shampoo Ketoconazol 2% | $349 | Pelo (add-on) |
| AKAN-SUPL | Suplemento Capilar Biotina+Zinc | $399 | Pelo (add-on) |
| AKAN-MINOX | Minoxidil Tópico 5% | $449 | Pelo (add-on) |
| AKAN-SILD | Plan Momento — Sildenafil 50mg (8 dosis) | $449 | Desempeño |
| AKAN-TADA | Plan Diario — Tadalafil 5mg (30 días) | $649 | Desempeño |
| AKAN-KITCONF | Kit Confianza — Tadalafil diario + suplemento | $899 | Desempeño |
| AKAN-CONSULTA | Consulta médica de valoración | $0 | Ambas |

**Gates médicos del quiz (hard stops → no se vende, se deriva a consulta):**
- Pelo/finasteride: enfermedad hepática, depresión severa actual, <18 años.
- Desempeño/sildenafil-tadalafil: **uso de nitratos (PELIGRO REAL)**, infarto o
  ACV reciente (<6 meses), hipotensión severa, <18 años.

## 7. ODOO COMO PLATAFORMA DE FARMACIAS (theming)

Odoo ES el producto que ven médico y farmacia → debe verse AKAN, no Odoo:
- Login claro v2.1: crema #FAF6EC, wordmark AKAN, botón clay, cero "Powered by Odoo".
- Backend: color primario verde bosque, acentos jade, favicon "A", nombre
  "AKAN Plataforma".
- Menú simplificado para farmacia: solo Inventario (pickings) — su pantalla
  diaria es la lista de "Órdenes por despachar".

## 8. FASES

| Fase | Qué | Estado |
|---|---|---|
| **F1 (esta noche)** | Quiz funcional 2 ramas + checkout → Odoo (lead+orden), portal farmacia/médico con roles, catálogo completo, theming AKAN claro, repos en orden | EN EJECUCIÓN |
| F2 | Pagos reales (Conekta/Stripe), WhatsApp Business API (notificaciones+tracking), Railway deploy, dominio akan.mx | Próxima |
| F3 | Suscripción automática (OCA/Stripe Billing), portal de cliente, recetas PDF firmadas digitalmente, l10n_mx + facturación | Después |
| F4 | App / PWA, programa de retención, expansión categorías (piel, peso) | Futuro |

## 9. LO QUE F1 NO RESUELVE (honestidad operativa)

1. **Cobro:** F1 crea la orden sin cobrar. El cierre de pago es manual
   (link de pago / transferencia) hasta F2. Riesgo: fricción — prioridad F2.
2. **API pública:** mientras Odoo viva en la Mac, el sitio en Vercel opera en
   modo demo. Para demo real con la farmacia: túnel (cloudflared) o Railway.
3. **Notificaciones:** WhatsApp manual hasta F2 (la cuenta Business y la API
   requieren alta de Meta).
4. **Recetas:** el médico real y el flujo NOM-024 requieren al médico con
   cédula contratado y formato de receta validado (legal, no técnico).
