# Cambios de texto visibles al cliente — rama `feat/legal-ux`

Pendiente de aprobación de Lucas. Líneas según el estado final de la rama.

| archivo:línea | antes | después | motivo |
|---|---|---|---|
| carrito.html:295 | Pago seguro · Envío en caja neutra, sin marca · 24-72h a tu puerta | Al confirmar recibes el link de pago de tu orden (pago por transferencia bancaria) · Caja neutra, sin marca · 24-72h a tu puerta | Promesa de pago inexistente: hoy solo transferencia + link de pago de Odoo |
| carrito.html:354 | Pago seguro. Pagas hoy y recibes en 24-72h. Caja neutra, confidencial de inicio a fin. | ¿Cómo pago? Al confirmar te llevamos al link de pago de tu orden, con los datos para pagar por transferencia bancaria. Cuando se confirma el pago, tu pedido llega en 24-72h en caja neutra. | Idem |
| carrito.html:455 | Te llevamos al pago seguro. | Te llevamos al link de pago. | Idem |
| carrito.html:456 | Tu carrito quedó apartado. Al terminar regresas a Mi AKAN con tu pedido listo. | Tu orden quedó creada. En el link verás los datos para pagar por transferencia; tu pedido sale cuando se confirma el pago. | Estado veraz tras crear la orden |
| carrito.html:297 | Proceder al pago → | Continuar con mis datos de envío → | CTA claro: el siguiente paso es la dirección, no el pago |
| carrito.html:356 | Pagar $X → | Confirmar pedido · $X → | El botón crea la orden; el pago ocurre en el link |
| carrito.html:376 | Procesando… | Creando tu orden… (con spinner) | Estado de carga honesto |
| carrito.html:291 | Envío discreto (caja neutra) · GRATIS | Envío a todo México · caja neutra · 24-72h · GRATIS / Impuestos: IVA incluido | Resumen de costos claro |
| carrito.html:332 | Envío · Total a pagar hoy | Envío a todo México (24-72h) · Forma de pago: Transferencia (link de pago) · Total (IVA incluido) | Idem |
| carrito.html:358 | Al pagar aceptas el aviso de privacidad. | Al confirmar aceptas el aviso de privacidad. + «¿Dudas con tu pedido? Escríbenos por WhatsApp» | Ayuda en checkout |
| quiz.html:863 | Pago seguro hoy. Recibes en 24-72h en caja neutra, sin marca. | Al confirmar recibes el link de pago de tu orden (pago por transferencia bancaria). Llega en 24-72h en caja neutra, sin marca. | Promesa de pago inexistente |
| quiz.html:874 | Total (contra entrega) | Total | No existe pago contra entrega |
| quiz.html:960 | Te llevamos al pago seguro. | Te llevamos al link de pago. | Promesa de pago inexistente |
| quiz.html:917 | Procesando tu pago… | Creando tu orden… | Estado de carga honesto |
| quiz.html:707 | (nuevo) | Casilla: «Doy mi consentimiento expreso para que AKAN trate mis datos de salud (mis respuestas) para que un médico con cédula valore mi caso, conforme al aviso de privacidad. La farmacia solo recibe qué enviar y a dónde.» | LFPDPPP art. 9: consentimiento expreso para datos sensibles |
| quiz.html:873 | (nuevo) | Forma de pago: Transferencia (link de pago) · «¿Dudas antes de confirmar? Escríbenos por WhatsApp» | Resumen de costos y ayuda |
| quiz.html:718 | (nuevo) | Mensajes de error bajo cada campo (nombre y apellido, WhatsApp de 10 dígitos, correo, C.P. de 5 dígitos, estado, fecha, consentimiento) | Validación inline |
| legal.html:185 | De pago: los procesa la pasarela de pago certificada; AKAN no almacena números de tarjeta. | De pago: hoy el pago se realiza por transferencia bancaria, con los datos del link de pago de tu orden; AKAN no recaba ni almacena números de tarjeta. | Veracidad del medio de pago |
| legal.html:197 | …paqueterías (solo datos de entrega) y la pasarela de pagos. | …paqueterías (solo datos de entrega) y los proveedores que procesan tu pago. | Idem |
| legal.html:201 | (nuevo) | Sección «Datos personales sensibles (salud) y tu consentimiento expreso»: finalidades, consentimiento, transferencias (médico, farmacia, paquetería, autoridades), ARCO y revocación | Aviso integral para datos de salud |
| legal.html:179 | Última actualización: junio 2026 | Última actualización: octubre 2026 | Cambio del aviso |
| index.html:824 | Menú: Plan Esencial $549 · Plan Completo $849 · Kit AKAN Total $1,199 / Plan Momento — Sildenafil $449 · Plan Diario — Tadalafil $649 · Kit Confianza $899 | Consulta médica + tratamiento si el médico lo indica — Empieza tu consulta (OTC siguen con nombre y precio) | COFEPRIS: no publicitar Rx por nombre ni precio |
| index.html:1153 | Planes Esencial $549 / Completo $849 / Kit AKAN Total $1,199 (con Finasteride, Minoxidil) | Tarjeta «Consulta médica + tratamiento si el médico lo indica» (sin precio, «Evaluación sin costo…», CTA «Empieza tu consulta») + tarjeta «Cuidado diario sin receta desde $349» | Idem |
| index.html:1222 | Plan Momento $449 / Plan Diario $649 / Kit Confianza $899 + infografía «¿Cuándo actúa cada plan?» (Sildenafil/Tadalafil) | Tarjeta única «Consulta médica + tratamiento si el médico lo indica» (desempeño) | Idem |
| index.html:1130 | Tabla «La mitad que la farmacia»: Finasteride 1mg $1,100→$549; Finasteride + Minoxidil $1,700→$849 | «La consulta, por nuestra cuenta.» Solo consulta y envío | Idem |
| index.html:1009 | Finasteride bloquea hasta el 70% del DHT… / Minoxidil… 87% de los hombres | Entra tu médico: valora tu caso y, solo si procede, indica un tratamiento / Constancia y seguimiento: los resultados varían por persona | Sin promesas terapéuticas ni nombres Rx |
| index.html:1110 | Ciencia: «Finasteride — bloquea · -70%», chips «Bloquea el DHT hasta 70%», «Reactiva el folículo», «Pelo más grueso y fuerte» | «Tratamiento con receta — solo si tu médico lo indica», «Minoxidil tópico — cuidado diario», «Biotina + Zinc — complemento» | Idem |
| index.html:937 | Stats: 87% ven resultados al mes 6 · 8/10 responden 1ª dosis · 3 min | 72 h máximo de entrega · 100% caja neutra · 2 min | Sin promesas terapéuticas; coherencia 2 min |
| index.html:1220 | 8/10 hombres responden al tratamiento desde la primera dosis / «funciona desde la primera dosis» | 5 preguntas confidenciales y un médico con cédula revisa tu caso / «Un médico valora tu caso y, solo si procede, te indica un tratamiento» | Idem |
| index.html:1245 | Resultados: «Tu pelo, mes a mes» + curva «pelo nuevo · 87%» + comparador antes/después | «Tu seguimiento, mes a mes» con etapas (arranque, revisión médica, evaluación de avance), aviso «Ilustrativo… no una promesa de resultado»; comparador eliminado | Idem |
| index.html:1281 | Dra. Mariana Soto / Dr. Andrés Vela · Céd. Prof. verificada CONACEM | Valoración médica / Seguimiento a distancia · «Médico con cédula profesional vigente» · «Imagen ilustrativa» | No exponer nombres ni cédulas en la web pública |
| index.html:1273 | Médicos de verdad. Cédula a la vista. / …con nombre, apellido y cédula profesional verificada | Médicos de verdad. Con cédula vigente. / …un médico con cédula profesional vigente. Su nombre y su cédula aparecen en tu receta. | Idem |
| index.html:945 | Médicos con cédula CONACEM · Cédula CONACEM · Cédula verificada | Médicos con cédula profesional vigente · Cédula profesional vigente · Médico con cédula vigente | CONACEM certifica especialidades, no emite cédulas |
| index.html:1329 | Moléculas probadas por décadas. Finasterida, minoxidil, sildenafil y tadalafil… / Hasta 50% menos que la farmacia… | Tratamientos de uso médico establecido… / Consulta sin costo y envío gratis… | Sin nombres Rx ni comparativo de precio Rx |
| index.html:1351 | FAQ: «La mayoría no presenta ninguno…» / «87% ve pelo nuevo al mes 6… desde la primera dosis» | «Todo medicamento puede tener efectos secundarios…» / «Depende de cada persona y del tratamiento…» | Sin promesas terapéuticas |
| tienda.html:631 | Tarjetas Rx con nombre, descripción y precio (Plan Completo — Finasteride + Minoxidil… $849/mes) | Una tarjeta por área: «Consulta médica + tratamiento si el médico lo indica», sin precio, CTA «Empieza tu consulta →» | COFEPRIS |
| tienda.html:532 | Planes Rx: pagas hoy, reembolso total si no aprueba / — planes médicos | Con receta: solo si el médico lo indica · reembolso total si no aprueba / — con evaluación médica | Idem |
| tienda.html:11 | meta description / og / twitter: «planes médicos…» | «consulta médica…» | Coherencia SEO |
| brand.html:508 | “Finasteride bloquea el DHT” | “El DHT encoge el folículo” | Sin nombres Rx en página pública |
| llms.txt:17 | planes con evaluación médica / Tratamientos con receta: | consulta médica en línea (tratamiento con receta solo si el médico lo indica) / Consulta médica + tratamiento si el médico lo indica: | Coherencia SEO/IA |
