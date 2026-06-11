# AKAN — Infraestructura, CI/CD y Ambientes
### Jun 2026 — pensando en grande desde el día 1

## Topología

| Pieza | Plataforma | Prod | Staging | CD |
|---|---|---|---|---|
| Web (vitrina/funnel/perfil) | **Vercel** | akan-five.vercel.app → futuro akan.mx | Preview automático por branch/PR (URL única por rama) | ✅ push a `main` = deploy (GitHub conectado) |
| Odoo + Postgres (operación) | **Railway** proyecto `akan-erp` | env `production`, servicio `odoo` + Postgres + volumen filestore | env `staging` en el mismo proyecto (duplicado de production, su propio Postgres) | GitHub Actions → `railway up` (requiere RAILWAY_TOKEN como secret) |
| Dev local | Docker en la Mac | — | — | docker compose (akan_odoo :8070) — sigue vivo como sandbox |

## Flujo de entrega (pensado para no rompernos)

```
rama feature → push → Vercel Preview + (Odoo: probar contra staging)
     ↓ merge a main
PRODUCCIÓN: Vercel deploya la web solo · GH Action deploya Odoo a Railway
```

- La web detecta su backend por `AKAN_API` (default = URL pública de Railway
  cuando exista; override por localStorage para apuntar a staging/local al probar).
- Regla: **nunca** probar cambios de Odoo directo en production — staging primero.
- Backups: Postgres de Railway con backups de plataforma + `pg_dump` diario a
  bucket externo (pendiente de configurar, ~$1/mes — barato e independiente).

## Pendientes de acceso (solo Lucas)
1. `RAILWAY_TOKEN` (dashboard Railway → Account/Project Tokens) como secret de
   GitHub en akan-odoo para que el push deploye solo.
2. Dominio akan.mx (web) + erp.akan.mx (Railway).
3. Google OAuth Client ID para "Continuar con Google" (después de URL pública).
4. Cuenta Mercado Pago (pagos reales — hoy corre provider de prueba).
