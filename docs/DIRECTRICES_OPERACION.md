# AKAN — Directrices de Operación: Facturación, Farmacia, Odoo Total AKAN
### Briefing ejecutable (sirve para esta instancia con agentes O para otra)
### Jun 2026

---

## A. FACTURACIÓN CFDI (una vez ganado y recetado)

### El flujo objetivo
```
Orden pagada → médico aprueba receta → se despacha
   → se genera la FACTURA (CFDI 4.0) automáticamente
   → se timbra con el PAC (SAT)
   → el XML + PDF se manda al cliente (email / su perfil "recibos")
```

### Qué ya está
- `l10n_mx` (plan contable + impuestos MX) instalado.
- IVA 16% incluido en precio, coherente carrito↔confirmación.
- Cada orden ya genera un PDF de recibo (no fiscal todavía).

### Qué falta — y QUIÉN lo aporta
| Pieza | Quién | Nota |
|---|---|---|
| **Módulo `l10n_mx_edi`** (timbrado CFDI) | Agente | Instalar + configurar régimen fiscal de AKAN |
| **Certificado de Sello Digital (CSD)** | **Lucas** | Se descarga del portal del SAT con el RFC de AKAN (.cer + .key + contraseña) |
| **Contrato con un PAC** | **Lucas** | Proveedor Autorizado de Certificación. Odoo soporta Solución Factible, Finkok, etc. Da credenciales API |
| **RFC + régimen fiscal de AKAN** | **Lucas** | Persona moral, régimen general |
| **Datos fiscales del cliente** (RFC, uso CFDI, régimen) | Front | Campo opcional en checkout: "¿Necesitas factura?" → pide RFC/uso/CP fiscal |

### Cuando Lucas dé CSD + PAC, el agente:
1. Instala y configura `l10n_mx_edi` con el certificado y el PAC.
2. Conecta: pago confirmado + receta aprobada → factura → timbrado automático.
3. Expone el CFDI (XML+PDF) en `/akan/api/receipt` (ya existe el endpoint, se cambia el reporte por el fiscal).
4. Agrega "¿Necesitas factura?" al checkout (RFC, uso CFDI, CP fiscal).
**Sin las llaves de Lucas (CSD + PAC) esto NO se puede terminar** — el timbrado
es server-to-server con el SAT vía el PAC.

---

## B. SACAR LAS ÓRDENES A LA FARMACIA

### Qué ya funciona (verificado)
- La farmacia entra y aterriza en **Entregas** (pickings de salida).
- Ve qué producto y a qué dirección. NO ve precios ni datos médicos.
- Valida la entrega (marca "Hecho") → el cliente pasa a "En camino".
- Solo se despacha lo que el médico aprobó (Rx) o lo pagado (OTC).

### Mejoras para que sea "producción de despacho" (agente, sin llaves)
1. **Vista "Pedidos del día"**: lista filtrada de pickings por despachar hoy,
   ordenada por antigüedad, con botón de imprimir lote.
2. **Etiqueta de envío / packing slip** con marca AKAN (sin precios): nombre,
   dirección, contenido, código de orden, espacio para guía.
3. **Captura de guía en bloque**: pegar números de guía y validar varias entregas
   de golpe.
4. **Reporte exportable** (Excel/PDF) del día para la farmacia aliada.
5. (Con WhatsApp API) aviso automático al cliente con su guía al validar.

---

## C. ODOO TOTALMENTE AKAN

### Qué ya está
- Login claro Verde Vivo (Fraunces+Hanken, botón clay, sin "Powered by Odoo").
- Navbar verde, logo "A", "AKAN Plataforma", favicon.
- /shop apagado (redirige a la web).

### Para que sea AKAN al 100% (agente, sin llaves)
1. **Reportes y facturas con identidad AKAN**: logo, colores, tipografía, footer
   AKAN en el PDF de cada orden/factura/packing slip.
2. **Correos transaccionales con marca**: plantilla de email AKAN (encabezado,
   colores, firma) para todo lo que Odoo envíe — requiere SMTP (llave de Lucas:
   Gmail Workspace/SendGrid).
3. **Backend pulido por rol**: que el médico y la farmacia vean menús mínimos,
   etiquetas en español AKAN, cero jerga Odoo ("Cotización"→"Pedido", etc.).
4. **Quitar TODO rastro Odoo** de cara al staff: títulos de pestaña, "Odoo"
   en tooltips, página de ajustes, etc.
5. **Dashboard del dueño**: una vista de inicio para admin con los números de
   AKAN (leads del día, ventas, suscripciones activas, entregas pendientes).

---

## ¿OTRA INSTANCIA O AGENTES AQUÍ? — RECOMENDACIÓN

**Lo hago yo aquí con agentes.** Razones:
- Ya tengo el contexto completo, los accesos (Railway, repos, Odoo), y los
  patrones del código. Otra instancia tendría que reconstruir todo eso —
  semanas de "ponerse al día" vs. ejecutar ya.
- Este documento ES el briefing: si algún día quieres paralelizar con otra
  instancia, le pasas este archivo + la memoria del proyecto y arranca.

**Lo que SÍ o SÍ necesita tus llaves (ninguna instancia lo resuelve sin ti):**
1. **CSD del SAT + contrato con un PAC** → sin esto NO hay factura CFDI real.
2. **SMTP** (Gmail Workspace/SendGrid) → sin esto los correos no salen.
3. **Mercado Pago** → sin esto el cobro es demo, y el reembolso es manual.
4. **Google Client ID** → login social.
5. **Dominio akan.mx**.

### Orden sugerido (yo ejecuto, tú consigues llaves en paralelo)
1. **B (farmacia)** y **C (Odoo AKAN, sin emails)** → ya, sin llaves.
2. **A (facturación)** → cuando tengas CSD + PAC.
3. **Emails con marca** → cuando tengas SMTP.
4. **Capa de confianza** (Mercado Pago + Google + seguridad) → al final, pre-lanzamiento.
