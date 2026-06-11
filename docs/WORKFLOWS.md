# AKAN — El Mapa Maestro: actores, espacios y workflows
### El documento de orden. Si algo no está aquí, no existe. Jun 2026.

---

## 1. LOS 4 ACTORES Y DÓNDE VIVE CADA UNO

| Actor | Persona | Su espacio | URL | Entra con |
|---|---|---|---|---|
| **El cliente** | Carlos, 32, CDMX | **Mi AKAN** (web propia, bonita) | akan-five.vercel.app/perfil.html | Email+orden, código, (Google próx.) |
| **El médico** | Dra. Ana, dermatóloga | **Odoo → CRM y Ventas** | akan-five.vercel.app/plataforma.html | medico@akan.mx / Akan2026Med |
| **La farmacia** | Lupita, farmacia aliada | **Odoo → solo Inventario** | akan-five.vercel.app/plataforma.html | farmacia@akan.mx / Akan2026Farm |
| **El dueño** | Lucas | **Odoo completo** + dashboards | akan-five.vercel.app/plataforma.html | admin@akan.mx / Akan2026 |

**Regla de oro:** el CLIENTE jamás ve Odoo (su mundo es Mi AKAN). El STAFF
(Ana, Lupita, Lucas) trabaja en Odoo. Una sola fuente de verdad, dos caras.

### ¿Por qué Ana está en Odoo y no en una app propia?
- **Hoy (F1):** Odoo le da a Ana TODO sin construir nada: bandeja de casos
  (CRM), el quiz completo del paciente, chat con el cliente (chatter),
  botón de aprobar y cobrar, historial. Es la opción que ya funciona.
- **Mañana (F3, si Ana sufre con Odoo):** un "Portal Médico" propio — una
  página tan simple como Mi AKAN pero para Ana (lista de casos → aprobar /
  preguntar / rechazar). La API ya existe; es solo otra cara.
- **Decisión:** arrancar con Odoo, medir fricción real con el médico real,
  construir el portal solo si hace falta. No construir por miedo.

---

## 2. WORKFLOW 0 — DRA. ANA: SU PRIMER DÍA (paso a paso, pantalla por pantalla)

**Contexto:** Ana acaba de ser contratada. Tiene cédula. Lucas le manda 2 líneas:
> "Ana: entra en akan-five.vercel.app/plataforma.html con medico@akan.mx /
> Akan2026Med. Tu trabajo vive en dos lugares: CRM (casos nuevos) y el chat."

| # | Ana hace | Ana ve | Sistema hace |
|---|---|---|---|
| 0.1 | Abre plataforma.html | Login verde AKAN (no parece Odoo) | — |
| 0.2 | Entra con sus credenciales | Escritorio con 2 apps: **CRM** y **Ventas** (las demás están ocultas para ella) | — |
| 0.3 | Abre **CRM → Mi Pipeline** | Columna **"Quiz Completado"** con tarjetas: "Quiz Pelo — Carlos M." | Cada quiz del sitio crea una tarjeta aquí, sola |
| 0.4 | Abre la tarjeta de Carlos | **Todas las respuestas del quiz** ordenadas (etapa, tiempo, salud, medicamentos) + abajo el **chat** con Carlos | — |
| 0.5a | Caso claro → abre la orden ligada (botón arriba) y presiona **"Aprobar receta y cobrar"** | Confirmación; el link de pago queda en el historial | El perfil de Carlos cambia a **"RECETA APROBADA — PAGAR"** con botón de pago. Solo |
| 0.5b | Caso con dudas → escribe en el chat ("Enviar mensaje"): "Carlos, ¿tomas algo para la presión?" | Su mensaje en el hilo | Carlos lo ve EN SU PERFIL (Mi AKAN) y responde desde ahí |
| 0.5c | Caso contraindicado → mueve la tarjeta a "Perdido" + mensaje en chat explicando | — | Carlos ve el mensaje en su espacio; no se le cobra nunca |
| 0.6 | Carlos pagó (le llega por el chatter) | Orden confirmada | Nace la suscripción + la farmacia ve el paquete. Ana no hace nada más |
| 0.7 | Renovación semestral | Tarjeta nueva "Re-validación — Carlos M." | El sistema la crea cada 6 meses (F2.1) |

**Tiempo de Ana por caso claro: ~2 minutos.** Su día = revisar columna, aprobar
o preguntar. Nada más.

---

## 3. WORKFLOW 0 — CARLOS, EL CLIENTE (de Instagram a su puerta)

| # | Carlos hace | Dónde |
|---|---|---|
| 0.1 | Ve un ad → toca | Instagram |
| 0.2 | Quiz de 2 min (tap-tap, fotos de coronillas, datos de salud) | quiz.html |
| 0.3 | "Estás pre-aprobado" → elige plan y cadencia → dirección → confirmar | quiz.html |
| 0.4 | Pantalla de éxito: nº de orden + su acceso a Mi AKAN | quiz.html |
| 0.5 | Entra a **Mi AKAN**: timeline "Médico revisando" + chat con su médico | perfil.html |
| 0.6 | (Si Ana pregunta) responde en el chat, en su espacio | perfil.html |
| 0.7 | Ana aprueba → su perfil dice "RECETA APROBADA" → **paga ahí mismo** | perfil.html |
| 0.8 | "Preparando tu caja" → guía de envío → caja neutra en su puerta 24-72h | perfil.html |
| 0.9 | Cada mes: renovación automática de su suscripción | sistema |

**Carlos NUNCA sale de la web de AKAN** (salvo la pantalla de pago, que vuelve).

---

## 4. WORKFLOW 0 — LUPITA, LA FARMACIA

| # | Lupita hace | Ve |
|---|---|---|
| 0.1 | Entra por plataforma.html con su usuario | SOLO la app Inventario |
| 0.2 | Abre "Entregas" | Lista de paquetes por preparar (qué producto, a qué dirección) — **sin precios, sin datos médicos** |
| 0.3 | Prepara caja neutra, pega guía, captura el nº de guía, marca Hecho | El perfil de Carlos pasa a "En camino" solo |

---

## 5. WORKFLOW 0 — LUCAS, EL DUEÑO

| # | Lucas ve | Dónde |
|---|---|---|
| 0.1 | Leads del día, conversión del funnel | Odoo → CRM |
| 0.2 | Ventas, órdenes, suscripciones activas | Odoo → Ventas |
| 0.3 | Costos de infraestructura | railway.com/dashboard |
| 0.4 | La web y sus cambios | vercel.com/dashboard + GitHub |

---

## 6. EL FLUJO COMPLETO EN UNA LÍNEA

```
IG → quiz (web) → tarjeta en CRM (Ana) → [chat si hay dudas] → Ana aprueba
→ Carlos paga desde su perfil → suscripción nace sola → Lupita despacha
→ caja neutra en la puerta → renovación mensual → re-validación semestral
```

## 7. LO QUE FALTA, EN ORDEN (sin ruido)

1. **Mercado Pago** (Lucas: cuenta) → el pago demo se vuelve real. Cero código.
2. **Google login** (Lucas: Client ID) → botón ya cableado.
3. **Dominio akan.mx** (Lucas) → URLs de marca.
4. **Legales + SMTP** (yo) → aviso de privacidad/términos + correos transaccionales.
5. **Médico real** (Lucas) → Ana de verdad; este doc es su manual de día 1.
6. **WhatsApp Business API** (F2.1) → notificaciones automáticas.
7. **Portal Médico propio** (F3, SOLO si Ana sufre con Odoo).
