# UX del recorrido — fricciones y arreglos (rama `feat/legal-ux`)

Recorrido probado: inicio → tienda → carrito → checkout → confirmación (y evaluación → lead → checkout),
con Playwright en escritorio (1366×900) y móvil (iPhone 13), **todas las llamadas a Odoo interceptadas
con mocks** (catálogo real congelado, `/lead` y `/checkout` simulados, link de pago simulado).
Capturas «antes» (`origin/feat/seo-ia`) y «después» (esta rama) con el mismo guion
(`<dispositivo>_<paso>.png`, se adjuntan al PR). Sin rediseños: solo fricciones concretas.

| # | Problema | Evidencia (antes) | Arreglo |
|---|---|---|---|
| 1 | El checkout del carrito aceptaba un WhatsApp de 5 dígitos y un C.P. de 3 (`length>1`) y creaba la orden igual. | `09_checkout_tel_cp_invalidos`: con `55123` y `061` el script llegó a la pantalla de pago (FALLA «no envía con teléfono/CP inválidos»). | `assets/form-validate.js`: tel. MX de 10 dígitos (acepta espacios y +52), C.P. de 5 dígitos, correo, nombre y apellido, estado. Mismo validador en carrito y evaluación. |
| 2 | Los errores solo pintaban el borde de rojo, sin decir qué estaba mal; el `select` de estado ni se marcaba. | `08_checkout_errores`: campos rojos sin texto. | Mensaje bajo cada campo (`aria-invalid` + `aria-describedby`), validación al salir del campo y al corregir, foco al primer error. |
| 3 | Labels sin asociar a sus campos (lectores de pantalla no los anuncian). | Inspección del DOM: `<label>` sin `for`. | `AkanForm.enhance` asigna `id`/`for` a cada par label-campo. |
| 4 | Promesa «Pago seguro» y «Total (contra entrega)» que no existen hoy; el usuario no sabía que paga por transferencia. | `06_carrito`, `07_checkout_vacio`. | Texto veraz: «Al confirmar recibes el link de pago de tu orden (pago por transferencia bancaria)». Fila «Forma de pago» en los resúmenes. |
| 5 | Resumen de costos incompleto: no decía plazo de envío ni IVA. | `06_carrito`. | Filas «Envío a todo México · caja neutra · 24-72h — GRATIS» e «Impuestos — IVA incluido»; total «(IVA incluido)». |
| 6 | CTA ambiguos: «Proceder al pago» llevaba a la dirección y «Pagar $798» solo creaba la orden. | `06_carrito`, `07_checkout_vacio`. | «Continuar con mis datos de envío →» y «Confirmar pedido · $798 →». |
| 7 | Estado de carga mudo: el botón solo cambiaba a «Procesando…» y la pantalla siguiente decía «pago seguro». | `11/12`. | Botón deshabilitado con spinner y `aria-busy`: «Creando tu orden…»; pantalla siguiente «Te llevamos al link de pago» explicando que el pedido sale al confirmarse el pago. El error (502) ya era honesto («No se hizo ningún cargo») y se mantiene (`despues_error/*_12`). |
| 8 | Sin ayuda en el checkout: el único WhatsApp aparecía después de fallar. | `07_checkout_vacio`. | Enlace «¿Dudas con tu pedido? Escríbenos por WhatsApp» en el checkout del carrito y de la evaluación (dispara `contact_whatsapp`). |
| 9 | Áreas táctiles chicas: botones −/+ de 34 px, «Quitar» de ~18 px, carrito 42 px (40 en perfil), menú 42 px, «Atrás» de la evaluación 38 px. | `06_carrito` (móvil). | Todos ≥ 44 px; en móvil la fila de cantidad pasa abajo para no apretar el nombre. |
| 10 | Sin foco visible en navegación por teclado (los campos quitaban el `outline`). | Navegación con Tab. | `:focus-visible` con contorno de 3 px y anillo en campos enfocados. |
| 11 | Imágenes sin `width`/`height` (saltos de layout) y varias sin `loading="lazy"`. | `index.html`/`tienda.html`. | `width`/`height` reales en todas las `<img>` estáticas y en las tarjetas de tienda/carrito; `lazy` debajo del pliegue; `img{height:auto}`. |
| 12 | El navegador abría la conexión al Odoo tarde (catálogo, lead y checkout). | Cascada de red. | `<link rel="preconnect">` al Odoo en tienda, carrito, evaluación y perfil. |
| 13 | El contador del carrito es persistente y visible (ya funcionaba). | `05_tienda_toast`: badge «1». | Sin cambio funcional; solo tamaño táctil. |
| 14 | Datos de salud enviados sin consentimiento expreso. | `14_quiz_lead_sin_consentimiento` (antes): `/lead` salía sin casilla. | Casilla obligatoria **no premarcada** con enlace al aviso; sin ella no sale nada (ver `legal.html#datos-sensibles`). |

## Contrato con Odoo (nota)

`POST /akan/api/lead` y `/akan/api/checkout` llevan ahora `consent_health: true` y
`consent_health_at` (ISO 8601) cuando el usuario dio el consentimiento. Es **aditivo**:
Odoo lo ignora hasta que el contrato v1.7 (`akan-odoo/docs/API_CONTRACT.md`) lo recoja y lo guarde
en el lead/orden. Hay que pedírselo al dueño de akan-odoo.

## Pendiente (fuera de este PR)

- `quiz.html` (privada, `Disallow` en robots) sigue mostrando el plan Rx recomendado con nombre de
  medicamento y precio en el resultado de la evaluación. Decisión de Lucas: mantenerlo (es la
  propuesta de pago previa a la receta) o cambiarlo a «tratamiento que indique tu médico».
- Cifras no verificadas que siguen en el inicio: «+10,000 hombres / evaluaciones».
- La sección legal sigue marcada «BORRADOR v1 — sujeto a revisión por abogado».
