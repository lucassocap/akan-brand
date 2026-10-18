# AKAN + Itzá — Infraestructura, CI/CD y Ambientes
### Actualizado oct-17-2026 (versión original: jun-2026)

## Topología

| Pieza | Plataforma | Prod | Staging | CD |
|---|---|---|---|---|
| Web AKAN (vitrina/funnel/perfil) | **Vercel** proyecto `akan` (repo akan-brand) | **soyakan.com** · `www.soyakan.com`, `yosoyakan.com` y `www.yosoyakan.com` → 308 a soyakan.com | Preview automático por rama/PR | ✅ push a `main` = deploy (GitHub conectado) |
| Web Itzá | **Vercel** proyecto `itza-brand` (repo itza-brand) | **soyitza.com** · `www.soyitza.com`, `yosoyitza.com` y `www.yosoyitza.com` → 308 a soyitza.com | Preview por rama/PR (algunos previews salen «Blocked»; Vercel reporta «GitHub couldn’t verify an account for the commit»: el correo del autor no está ligado a GitHub) | ✅ push a `main` = deploy |
| Odoo + Postgres (ERP compartido AKAN + Itzá) | **Railway** proyecto `akan-erp`, servicio `odoo` + Postgres + volumen | `https://odoo-production-3a20.up.railway.app` (`PORT=8069` obligatorio). Dominio `erp.soyakan.com`: pendiente (custom domain en Railway + CNAME) | Sin verificar | GitHub Actions `deploy.yml` → `railway up` — **roto desde jun-13** (faltan secrets) |
| Dev local | Odoo 19 nativo / Docker | — | — | — |

## Estado de producción (oct-17)

- **Webs:** soyakan.com corre `main` de akan-brand (medición con IDs en placeholder → no
  carga ningún proveedor; SEO para IA y textos legales COFEPRIS ya en main por #15).
  soyitza.com corre el `main` de agosto (PRs #11/#12 de medición y SEO abiertos).
- **Odoo:** último deploy exitoso **13-jul-2026** (manual). `main` de akan-odoo tiene
  v1.6 (atribución, cola GA4/Meta), v1.7 (contra entrega Itzá, consentimientos,
  arreglos de seguridad de farmacia) y correos O6 + Mercado Pago, **nada desplegado**.
- **Pagos vigentes:** transferencia SPEI con confirmación manual (ver
  `akan-odoo/docs/PROCESO_OPERATIVO_INTERINO.md`). Mercado Pago listo en código, no
  instalado en prod.

## Flujo de entrega

```
rama feature → push → Vercel Preview (webs)
     ↓ PR a main (si hay PRs apilados: fusionar de arriba hacia abajo, la base al final)
PRODUCCIÓN: Vercel despliega las webs solo · GH Action despliega Odoo a Railway
```

- La web detecta su backend por `AKAN_API` (default = URL pública de Railway;
  override por localStorage para apuntar a local al probar).
- Primer deploy de Odoo tras meses: backup de la DB antes; esperar 502 de 10-15 min
  durante el rollover (no revertir); revisar que no se reseteen los passwords de
  médico/farmacia; purgar la cola `mail.mail` vieja antes de encender SMTP.
- Backups: Postgres de Railway con backups de plataforma + `pg_dump` diario a
  bucket externo (pendiente de configurar).

## Pendientes de acceso (solo Lucas)
1. Secrets de GitHub en akan-odoo: `GH_PAT` (lectura del submódulo privado
   akan-social-brain) y `RAILWAY_TOKEN`, o autorizar deploy con el CLI de Railway local.
2. `erp.soyakan.com` → custom domain en Railway + CNAME en Vercel DNS (después del deploy).
3. Correo: cuenta SMTP (Postmark recomendado) + DNS SPF/DKIM/DMARC de soyakan.com y
   soyitza.com; variables `AKAN_SMTP_*` y `AKAN_MAIL_*` en Railway
   (`akan-odoo/docs/CORREO_SMTP.md`).
4. Mercado Pago: token de prueba primero (`akan-odoo/docs/MERCADO_PAGO.md`).
5. Medición por marca: GTM, GA4 (+ secret de Measurement Protocol), Meta Pixel (+ token
   CAPI), Clarity, Google Ads (+ 2 etiquetas de conversión); Vercel Analytics y Speed
   Insights en los dos proyectos.
6. Google Search Console (TXT en DNS), Bing Webmaster, IndexNow.
7. Google OAuth Client ID para «Continuar con Google» (API v2).
