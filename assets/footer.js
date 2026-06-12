/* Footer AKAN unificado — un solo lugar, idéntico en todas las páginas.
   Uso: <div id="akan-footer"></div> + <script src="assets/footer.js"></script> */
(function () {
  var css = `
  #akan-footer{background:#070B08;color:rgba(250,246,236,.62);padding:84px 0 40px;font-size:15px;
    font-family:'Hanken Grotesk',system-ui,sans-serif}
  #akan-footer .afwrap{max-width:1280px;margin:0 auto;padding:0 24px}
  @media(min-width:768px){#akan-footer .afwrap{padding:0 48px}}
  #akan-footer .afgrid{display:grid;gap:40px;grid-template-columns:1fr 1fr}
  @media(min-width:900px){#akan-footer .afgrid{grid-template-columns:2fr 1fr 1fr 1fr}}
  #akan-footer .aflogo{font-family:'Fraunces',serif;font-weight:700;font-size:30px;color:#FAF6EC;letter-spacing:.04em}
  #akan-footer .afbrand p{margin-top:16px;max-width:300px;font-size:14.5px;line-height:1.65}
  #akan-footer .afbrand b{color:#FAF6EC}
  #akan-footer h5{color:#C9A876;font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;
    font-weight:700;margin-bottom:18px}
  #akan-footer ul{list-style:none;display:flex;flex-direction:column;gap:11px;margin:0;padding:0}
  #akan-footer a{color:rgba(250,246,236,.62);text-decoration:none;transition:color .2s}
  #akan-footer a:hover{color:#FAF6EC}
  #akan-footer .afbottom{margin-top:64px;padding-top:28px;border-top:1px solid rgba(168,220,192,.1);
    display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between;font-size:13px;color:rgba(250,246,236,.4)}
  `;
  var html = `
  <div class="afwrap">
    <div class="afgrid">
      <div class="afbrand">
        <div class="aflogo">AKAN</div>
        <p><b>La plataforma de salud del hombre mexicano.</b><br>Cabello y desempeño sexual: tratamiento médico real, médicos con cédula y entrega discreta a todo México.</p>
      </div>
      <div>
        <h5>Tratamientos</h5>
        <ul>
          <li><a href="tienda.html#cabello">Caída de cabello</a></li>
          <li><a href="tienda.html#desempeno">Desempeño sexual</a></li>
          <li><a href="tienda.html#cuidado">Cuidado diario</a></li>
          <li><a href="tienda.html"><b>Tienda completa →</b></a></li>
          <li><a href="perfil.html">Mi cuenta (Mi AKAN)</a></li>
        </ul>
      </div>
      <div>
        <h5>Nosotros</h5>
        <ul>
          <li><a href="index.html#como">Cómo funciona</a></li>
          <li><a href="index.html#medicos">Nuestros médicos</a></li>
          <li><a href="index.html#resultados">Resultados</a></li>
          <li><a href="brand.html">Manual de marca</a></li>
        </ul>
      </div>
      <div>
        <h5>Legal</h5>
        <ul>
          <li><a href="legal.html#privacidad">Aviso de privacidad</a></li>
          <li><a href="legal.html#terminos">Términos y condiciones</a></li>
          <li><a href="legal.html#consentimiento">Consentimiento informado</a></li>
          <li><a href="legal.html#devoluciones">Devoluciones</a></li>
        </ul>
      </div>
    </div>
    <div class="afbottom">
      <span>© 2026 AKAN Salud Masculina S.A. de C.V. · Confidencial. Sin filas. A tu puerta.</span>
      <span>Este sitio no sustituye la consulta médica presencial.</span>
    </div>
  </div>`;
  var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
  var mount = document.getElementById('akan-footer');
  if (mount) mount.innerHTML = html;
})();
