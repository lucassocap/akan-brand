# AKAN — MCP de Odoo para Claude (capa de IA)

Permite que **Claude lea tu Odoo** (analítica, preguntas sobre órdenes/ingresos/
embudo) **en solo-lectura y sin datos personales** — solo números de referencia.

## Qué es (y qué NO es)
- **NO es un módulo de Odoo.** No se instala nada dentro de Odoo.
- Es un **puente** (`odoo-mcp`, de tuanle96) que corre en tu computadora y habla
  con Odoo por su API estándar (XML-RPC), con un usuario restringido + un filtro
  de privacidad. Claude Desktop lo arranca solo.

```
Claude Desktop → odoo-mcp (tu compu) → API de Odoo (Railway)
                 [solo-lectura + filtro PII]
```

## Lo que ya está montado
1. **Usuario Odoo restringido:** `mcp-readonly@akan.mx` / `AkanMCP2026`
   (lee Ventas + CRM; el MCP bloquea escrituras).
2. **uv/uvx** instalado en `~/.local/bin` (ejecuta el puente).
3. **Política de privacidad** (deny-list de campos PII/clínicos):
   `~/.akan/odoo_mcp_policy.json` — bloquea nombres, emails, teléfonos,
   direcciones, descripciones y el cuestionario (`x_akan_quiz`). Solo deja
   referencias (S0xxxx), montos, fechas, estados, códigos de producto.
4. **Config de Claude Desktop:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   (servidor `akan-odoo`, `ODOO_MCP_ENABLE_WRITES=0`).

## Cómo usarlo
1. **Cierra y reabre Claude Desktop** (para que cargue el servidor `akan-odoo`).
2. Pregúntale, p. ej.: *"¿cuántas órdenes pagadas hay este mes?"*, *"dame el
   embudo del quiz"*, *"¿cuántas suscripciones activas?"*.
3. Claude usará las herramientas del MCP (search_records, aggregate_records,
   etc.) y responderá con números/referencias, **sin exponer datos de pacientes**.

## Seguridad (plataforma de salud — LFPDPPP)
- **Solo-lectura** por defecto (`ODOO_MCP_ENABLE_WRITES=0`).
- **Sin PII:** el deny-list de campos quita datos personales/clínicos en todas
  las rutas de lectura (search, read, aggregate, knowledge, recursos).
- **Usuario dedicado** de bajo privilegio (no admin).
- Para escrituras automatizadas en el futuro: NO usar CRUD genérico — construir
  una capa MCP delgada sobre los endpoints `/akan/api/*` (reglas de negocio +
  redacción de PII en origen). Ver `docs/SEO_AEO_ANALYTICS_PLAN.md` no aplica;
  ver `LLAVES_Y_ACCESOS.md` para el contexto de datos sensibles.

## Subir a más seguro (opcional)
- Cambiar a **JSON-2 + API key** (en vez de usuario/contraseña): generar API key
  en Odoo (Preferencias → Seguridad → API Key) y poner `ODOO_TRANSPORT=json2`
  + `ODOO_API_KEY=...` en la config.
- Afinar los grupos del usuario para que lea exactamente lo que quieras.
