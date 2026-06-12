# AKAN — Seguridad y Arquitectura de Datos
### Dónde viven los datos, cómo se accede, y el plan de endurecimiento
### Jun 2026

---

## 1. UNA SOLA BASE DE DATOS (aclaración clave)

**NO hay dos bases de datos. Hay UNA, y todo pasa por Odoo.**

```
PostgreSQL (en Railway, dentro de Odoo) = LA fuente única de verdad
   · clientes, órdenes, respuestas del quiz, inventario, pagos, suscripciones
   ▲
   │ todo se guarda y se lee aquí, vía la API /akan/api/*
   │
La web (Vercel) = vitrina sin base de datos propia. Pide y manda a Odoo.
El carrito = canasta temporal en el navegador del cliente (localStorage).
             Al pagar se convierte en orden → va a Odoo.
```

"Headless" = la vitrina (web) y la bodega (Odoo) están separadas y se hablan por
API. La verdad vive en un solo lugar: Odoo.

## 2. DÓNDE VIVE CADA DATO

| Dato | Ubicación | Notas |
|---|---|---|
| Cliente (nombre, email, tel, dirección, nacimiento) | Odoo · res.partner | Fuente única |
| Salud (respuestas del quiz) | Odoo · crm.lead | Dato sensible. Solo médico lo ve |
| Acceso del cliente (token AKAN-XXXX-XXXX) | Odoo · res.partner.x_akan_token + copia en localStorage del navegador | Llave de acceso |
| Credenciales del staff | Odoo · res.users (hash bcrypt) | Médico/farmacia/admin |
| **Tarjetas de pago** | **NUNCA en AKAN** — solo en la pasarela (Mercado Pago) | Correcto (PCI delegado) |
| Transacciones de pago | Odoo · payment.transaction | Sin números de tarjeta |

## 3. CÓMO ACCEDE CADA QUIEN

- **Cliente:** sin contraseña. Token mágico (en su navegador / cada WhatsApp) o
  email + número de orden. Próximamente: Google login (ya cableado).
- **Staff:** usuario + contraseña de Odoo, con roles que aíslan lo que ve cada
  uno (la farmacia NUNCA ve datos médicos ni precios).

## 4. LO QUE YA ESTÁ BIEN ✅
- HTTPS forzado en todo (http → 301 → https). Datos cifrados en tránsito.
- Tarjetas delegadas a la pasarela certificada — AKAN no las guarda.
- Aislamiento por rol verificado (farmacia sin datos médicos/precios).
- Sin contraseñas del cliente que se puedan reusar/filtrar de otros sitios.
- Una sola fuente de verdad (menos superficie de error).

## 5. LO QUE HAY QUE ENDURECER ANTES DE CLIENTES REALES ⚠️

| # | Riesgo | Fix |
|---|---|---|
| S1 | El token AKAN-XXXX-XXXX no expira ni rota: llave permanente | Token con expiración + rotación + revocar desde el perfil |
| S2 | Login email + nº de orden es débil (orden secuencial, adivinable) | Código de un solo uso (OTP) al email/WhatsApp **o** Google login |
| S3 | API del perfil sin rate-limiting → fuerza bruta de tokens posible | Rate-limit por IP/token en /me, /messages, /login |
| S4 | Cifrado en reposo del PostgreSQL no confirmado | Confirmar/activar cifrado en reposo en Railway; registrar accesos a datos de salud |
| S5 | Cumplimiento LFPDPPP + NOM-024 (datos sensibles de salud) | Documentar medidas, aviso de privacidad firmado (con abogado) |
| S6 | Provider de pago "Demo" visible en producción | Apagar al conectar Mercado Pago |
| S7 | Registro público de Odoo (signup) — revisar que esté cerrado | Verificar auth_signup en modo b2b |

## 6. PLAN: "LA CAPA DE CONFIANZA" (bloque propio, pre-lanzamiento)
Estos tres van juntos porque forman la confianza del cliente real:
1. **Mercado Pago** (pagos reales + apaga demo) — llave de Lucas.
2. **Google login / OTP** (cierra S1 y S2 de golpe) — Client ID de Lucas.
3. **Endurecimiento** (S3 rate-limit, S4 cifrado, S6, S7) — ejecutable.
+ **Revisión legal** (S5) — con abogado, sobre el borrador en legal.html.

No urgente mientras se prueba con datos falsos. **Obligatorio antes de abrir a
clientes reales con datos de salud reales.**
