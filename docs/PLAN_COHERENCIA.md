# PLAN COHERENCIA — Una sola forma de comprar, cobro de una, diseño unificado
### Aprobado por Lucas (jun-12): "lo que necesite receta se cobra DE UNA; si no califica, se devuelve la plata"

---

## EL PROBLEMA (con evidencia)
1. **Colisión de tiendas:** los planes Rx se venden por DOS caminos — el quiz (con médico)
   y el carrito del /shop (¡SIN médico!). Captura de Lucas: finasteride al carrito directo. Ilegal e incoherente.
2. **Modelo de cobro tibio:** "no pagas hasta que el médico apruebe" mete fricción doble
   (volver a cobrar después) y deja órdenes huérfanas sin pagar.
3. **El /shop parece otro producto:** diseño Odoo default vs la web AKAN.

## LA SOLUCIÓN (3 movimientos)

### A. UNA SOLA CAJA POR TIPO DE PRODUCTO (fin de la colisión)
| Producto | Único lugar de compra | El otro camino queda… |
|---|---|---|
| **Rx** (planes con receta) | Quiz/checkout propio (gate médico) | /shop NO los vende: sus tarjetas → "Requiere evaluación médica → Hacer mi evaluación" (link al quiz) |
| **OTC** (shampoo, suplemento) | Carrito del /shop (pago inmediato) | tienda.html "Comprar ahora" → PDP del /shop (como hoy) |

- Rx fuera del carrito: despublicar del flujo de venta web de Odoo y dejar tarjeta
  informativa con CTA al quiz. El catálogo completo se EXHIBE en tienda.html (web).
- El perfil (Mi AKAN) sigue siendo el ÚNICO espacio post-compra del cliente.

### B. COBRO DE UNA + DEVOLUCIÓN SI NO CALIFICA (modelo Keeps/Hims)
Nuevo flujo Rx:
```
quiz → checkout (dirección) → PAGAR AHÍ MISMO (paso final del funnel)
→ orden PAGADA entra a revisión médica (estado: "Pagado · médico revisando")
→ APRUEBA: despacho directo (sin esperar nada del cliente)
→ NO CALIFICA: REEMBOLSO 100% automático + mensaje claro + consulta gratis ofrecida
```
Cambios:
1. Backend: /checkout genera el link de pago AL CREAR la orden y lo devuelve;
   acción nueva "Rechazar y reembolsar" para el médico (refund de la transacción
   + notificación + lead perdido). "Aprobar receta" ya no cobra: solo libera despacho.
2. Front quiz: tras confirmar dirección → pantalla de pago inmediata (mismo funnel).
3. Perfil: nuevos estados → pagada_revision / aprobada_preparando / reembolsada.
4. Copy/garantía invertida: "Pagas hoy. Si el médico no aprueba, te devolvemos
   el 100% — sin preguntas." (actualizar checkout, perfil, FAQ, legales §4).

### C. /SHOP CON EL ADN DE LA WEB
- akan_theme/shop.scss: Fraunces+Hanken, paleta Verde Vivo, cards radius 26px y
  sombras cálidas, botones pill clay, grid aireado.
- Header del website simplificado: logo → akan-five, "Mi cuenta" → perfil.html,
  fuera ruido ("Contáctanos" teléfono gringo, wishlist, comparador).
- PDP limpia: CTA pill, badge "Sin receta", entrega 24-72h.

## ORDEN DE EJECUCIÓN
0. Esperar cierre del enjambre actual (no chocar con sus fixes).
1. **B backend** (akan-odoo): pago-al-crear + rechazar-y-reembolsar + estados /me.
2. **B front** (akan-brand): paso de pago en quiz + estados perfil + copy/legales.
3. **A**: Rx fuera del carrito + tarjetas→quiz en /shop.
4. **C**: theming /shop completo.
5. **Enjambre de re-verificación** (las 9 personas otra vez) → reporte final a Lucas.

## REGLA DE SIMPLICIDAD (la que ordena todo)
> Comprar Rx = SIEMPRE quiz. Comprar OTC = SIEMPRE carrito. Ver mi tratamiento =
> SIEMPRE Mi AKAN. Trabajar = SIEMPRE plataforma. Cuatro frases, cero colisiones.

## LEY DE CONTINUIDAD (Lucas, jun-12): "No se puede sentir que sales y entras — debe ser smooth, como UNO"
El cliente debe poder cruzar web ↔ /shop ↔ pago ↔ perfil sin percibir el cambio de motor. Concretamente:
1. **Mismo header en ambos mundos**: el /shop lleva un clon del nav de la web
   (logo AKAN → home de la web, Tienda, Mi cuenta, "Hacer mi evaluación" en pill clay,
   mismo glass/blur) — no el header default de Odoo con teléfono y "Contáctanos".
2. **Misma piel**: tipografías (Fraunces/Hanken vía Google Fonts en website),
   paleta Verde Vivo, radius 26px, sombras cálidas, botones pill — pixel-parejo
   con tienda.html.
3. **Títulos y favicon idénticos** ("AKAN — …" + ícono A) en todas las páginas de ambos lados.
4. **Idas y vueltas invisibles**: cada página del /shop y del portal de pago tiene
   regreso natural a la web (logo y footer); el perfil enlaza al pago y el pago
   regresa al perfil (return_url → perfil.html).
5. **Cero vocabulario Odoo de cara al cliente**: nada de "Cotización", "portal",
   "Powered by" — lenguaje AKAN siempre.
6. Meta final (con dominio): akan.mx y tienda.akan.mx — ni la URL delata el cambio.
