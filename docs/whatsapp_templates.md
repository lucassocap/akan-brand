# AKAN — Plantillas de WhatsApp (operación manual F2.0)
## Copiar/pegar hasta que llegue la WhatsApp Business API (F2.1)
### Tono: directo, cálido, confidencial. Nunca mencionar el medicamento en el primer mensaje.

---

## 1. Orden recibida (inmediato tras el quiz)
> Hola {nombre} 👋 Soy {agente} de AKAN. Recibimos tu evaluación (orden **{orden}**).
> Tu médico la está revisando hoy mismo — te escribo en cuanto tenga noticias.
> Recuerda: hoy no pagas nada. Cualquier duda, este es tu canal directo. 🔒

## 2. Receta aprobada + link de pago (el mensaje que vende)
> {nombre}, buenas noticias: tu médico **aprobó tu tratamiento** ✅
> Tu plan: **{plan}** — {precio} {cadencia}.
> Paga aquí de forma segura (tarjeta, OXXO o meses sin intereses):
> 👉 {link_pago}
> En cuanto se acredite, tu paquete sale en caja neutra. Llega en 24-72h.

## 3. Médico necesita más información
> {nombre}, tu médico revisó tu evaluación y quiere confirmar un par de cosas
> antes de recetarte (es por tu seguridad, toma 5 minutos).
> ¿Te marco yo o prefieres agendar aquí? 👉 {link_agenda}

## 4. Caso derivado a consulta (gate de seguridad)
> {nombre}, por lo que nos contaste en la evaluación, lo responsable es que un
> médico valore tu caso en una videollamada antes de recetar. Es **gratis,
> confidencial y de 15 minutos**. ¿Qué horario te acomoda?

## 5. Recordatorio de pago (24h sin pagar)
> {nombre}, tu receta sigue activa y tu plan apartado 👌
> Cuando quieras, tu link de pago: {link_pago}
> Si OXXO te queda mejor que tarjeta, el mismo link te da el código de barras.

## 6. Pago confirmado + tracking
> ¡Listo, {nombre}! Pago confirmado ✅
> Tu paquete va en camino en **caja neutra, sin marca** — ni el repartidor sabe qué lleva.
> Guía {paqueteria}: **{guia}** 👉 {link_tracking}

## 7. Seguimiento mes 1 (retención)
> {nombre}, ya llevas un mes con tu tratamiento 💪 ¿Cómo te has sentido?
> Recuerda: la constancia es TODO — los resultados visibles llegan entre el mes 3 y 6.
> Si notas cualquier cosa rara, tu médico está a un mensaje de distancia.

## 8. Renovación (5 días antes del corte)
> {nombre}, tu siguiente envío de **{plan}** se prepara el {fecha}.
> Tu link de renovación: {link_pago}
> ¿Cambios en tu plan? Dime y lo ajustamos antes del corte.

## 9. Re-validación médica (cada 6 meses)
> {nombre}, toca el chequeo semestral con tu médico (así funciona una receta
> responsable). Son 3 preguntas rápidas por aquí o una llamada de 5 min. ¿Cómo prefieres?

## 10. OTC — compra directa (shampoo/suplemento)
> Hola {nombre} 👋 Confirmo tu pedido: **{producto}** — {precio}.
> Paga aquí 👉 {link_pago} y sale hoy mismo en caja neutra. Llega en 24-72h.

## 11. Rescate de carrito (quiz abandonado tras lead capture)
> {nombre}, dejaste tu evaluación AKAN a medio camino — tu plan quedó guardado.
> La terminas en 1 minuto: 👉 {link_quiz}
> Y recuerda: no pagas nada hasta que el médico apruebe. 🔒

---

### Reglas de oro
1. **Nunca** nombrar el medicamento ni la condición en el PRIMER mensaje (la
   pantalla del teléfono se ve en público). "Tu tratamiento", "tu plan".
2. Siempre cerrar con certeza de privacidad o de no-pago.
3. Responder en <2h en horario hábil — la velocidad ES la conversión.
4. Estos textos serán las plantillas pre-aprobadas de Meta en F2.1 (la IA de
   Odoo las registrará tal cual — no cambiar sin avisar en API_CONTRACT.md).
