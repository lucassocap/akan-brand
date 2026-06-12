# AKAN — Arquitectura "Nivel Amazon": Headless Commerce
### Análisis serio de la decisión: tienda propia que lee de Odoo vs /shop de Odoo
### Jun 2026 — la decisión que vuelve TODO una sola experiencia

---

## 1. EL DIAGNÓSTICO DE LA FRUSTRACIÓN

El sitio se siente desconectado por UNA razón técnica concreta: **estamos mezclando
dos paradigmas de frontend en el mismo viaje del cliente.**

- 9 de 10 pantallas son **headless**: HTML/JS propio (Vercel) que habla con Odoo
  por API. Bonitas, rápidas, con tu marca. → home, quiz, checkout, perfil, chat.
- 1 de 10 es **el frontend de Odoo** (/shop): el cliente "cae" en otra app, con
  otra piel, otro vocabulario ("Cotización", "Contáctanos"), otro header.

No es un problema de theming. Es un problema de **arquitectura**: el /shop nunca
va a sentirse igual porque ES otra aplicación. Tematizarlo es maquillar la costura,
no quitarla.

## 2. CÓMO LO HACEN LAS MARCAS DE NUEVO NIVEL

Amazon, Hims, Keeps, Warby Parker, Glossier — **todas son headless**:
- El **storefront** (lo que ve el cliente) es una capa de presentación propia,
  optimizada al límite, dueña de cada pixel y cada milisegundo.
- El **commerce engine** (catálogo, precios, inventario, órdenes, pagos,
  fulfillment, suscripciones) es un backend invisible. Amazon tiene decenas de
  servicios detrás; el cliente solo ve amazon.com.
- **El cliente JAMÁS percibe el backend.** Cruza de "ver producto" a "carrito" a
  "pagar" a "mi cuenta" sin un solo salto de marca, porque todo es el mismo
  storefront leyendo de APIs distintas por debajo.

**AKAN ya está a un paso de esto.** Solo falta mover el último 10%.

## 3. LA DECISIÓN: HEADLESS COMPLETO

> **El cliente vive 100% en la web de AKAN. Odoo es el cerebro invisible que
> nadie fuera del staff ve jamás.**

| Capa | Quién | Tecnología |
|---|---|---|
| **Storefront** (todo lo del cliente) | akan.mx (Vercel) | HTML/JS propio — quiz, tienda, carrito, checkout, perfil |
| **Commerce engine** (invisible) | Odoo en Railway | productos, precios, inventario, órdenes, suscripciones, fulfillment |
| **Pago** (único toque de infra externa) | Pasarela (Mercado Pago) vía link de Odoo | el cliente paga en una pantalla mínima y regresa a la web |
| **Back-office** (staff) | Odoo /web | médico (CRM), farmacia (inventario), admin |

**Odoo /shop se APAGA de cara al cliente.** Sigue existiendo internamente como
catálogo del staff, pero el cliente nunca lo toca.

## 4. EL FLUJO NIVEL AMAZON (carrito OTC headless)

```
tienda.html (web)
  · lee productos de  GET /akan/api/products  (precio, imagen, desc, stock)
  · "Agregar al carrito" → carrito vive en el navegador (localStorage)
  · ícono de carrito persistente con contador, como Amazon
     ↓
carrito.html (web) — diseño AKAN puro
  · editar cantidades, ver total, "también te puede interesar"
  · "Proceder al pago"
     ↓
checkout (web, mismo del quiz)
  · dirección → POST /akan/api/checkout  (crea la orden OTC en Odoo)
  · respuesta trae el link de pago de esa orden
     ↓
PAGO — única pantalla "externa", mínima, tematizada, vuelve solo
  · Mercado Pago (tarjeta/OXXO/MSI) → return_url = perfil.html
     ↓
perfil.html (Mi AKAN)
  · la compra aparece en "Mis pedidos" con su estado y recibo
```

**Para Rx (planes con receta) el flujo ya es este** — el quiz ES el checkout
headless. Así que headless no es un invento nuevo: es **aplicar al OTC el mismo
patrón que ya funciona para el 90% del revenue.**

## 5. QUÉ HAY QUE CONSTRUIR (honesto)

| Pieza | Esfuerzo | Nota |
|---|---|---|
| `GET /akan/api/products` enriquecido (imagen, desc, stock, slug) | Chico | ya existe, falta sumar campos |
| Carrito en navegador (localStorage) + ícono con contador | Medio | patrón estándar, JS propio |
| `carrito.html` con diseño AKAN | Medio | reusa los componentes de tienda.html |
| `POST /akan/api/checkout` acepta carrito multi-línea OTC | Chico | hoy toma 1 plan; ampliar a N líneas |
| Link de pago para órdenes OTC + return a perfil | Chico | el mecanismo ya existe (lo usa el Rx) |
| Apagar /shop público (Rx ya fuera, OTC ya no lo necesita) | Chico | redirect /shop → tienda.html |

**El catálogo de AKAN es pequeño (3 OTC + 6 planes).** Por eso headless aquí es
factible y de bajo riesgo — no estamos construyendo el carrito de Walmart, son
3 productos de compra directa. La maquinaria headless (API, checkout, perfil)
**ya está construida y probada.**

## 6. QUÉ SE MANTIENE DE ODOO (intacto)

Odoo sigue siendo indispensable — solo deja de ser frontend del cliente:
- Productos, precios, pricelists (3m -15%), inventario y stock
- Órdenes, suscripciones (subscription_oca), facturas, recibos PDF
- Pagos y conciliación (provider, transacciones, reembolsos)
- CRM del médico, roles, farmacia sin precios
- Fulfillment (pickings, guías)

**No tiramos nada. Solo dejamos de mostrarle Odoo al cliente.**

## 7. TRADE-OFFS (la verdad completa)

| | Headless (recomendado) | Seguir con /shop de Odoo |
|---|---|---|
| Experiencia | Una sola, smooth, nivel Amazon | Salto de marca permanente |
| Control de diseño | Total, pixel a pixel | Limitado al theming de Odoo |
| Colisión Rx en carrito | Imposible (no hay /shop público) | Hay que parchearla |
| Esfuerzo inicial | Medio (1 sesión enfocada) | Bajo, pero nunca queda bien |
| Mantenimiento | Un frontend | Dos frontends que divergen |
| Riesgo | Bajo (patrón ya probado en quiz) | "Siempre se ve raro" |

**Lo único que NO cambia:** el pago real necesita Mercado Pago (tu llave),
exista /shop o no. Headless no agrega esa dependencia, ya estaba.

## 8. RECOMENDACIÓN

**Ir headless completo.** No es la opción más rápida de teclear, pero es la única
que elimina la costura de raíz en vez de maquillarla — y es barata aquí porque
el catálogo es chico y el 90% del sistema ya es headless. Volver a tematizar el
/shop sería gastar esfuerzo en algo que nunca se va a sentir "como UNO".

Esto reemplaza el "Plan Coherencia C" (tematizar /shop) por algo mejor:
**eliminar /shop del viaje del cliente.**

## 9. ORDEN DE EJECUCIÓN (cuando cierre el enjambre)
1. Enriquecer `/akan/api/products` (imagen, desc, stock, slug).
2. Carrito headless + `carrito.html` + ícono persistente.
3. `/akan/api/checkout` multi-línea OTC + link de pago + return a perfil.
4. "Mis pedidos" en el perfil (histórico real con recibos).
5. Apagar /shop público (redirect a tienda.html).
6. Enjambre de 9 personas re-verifica TODO el viaje unificado.
