"""Diagnóstico E2E AKAN — 3 personas con navegador real contra PRODUCCIÓN."""
import json, re, time, urllib.request, xmlrpc.client
from playwright.sync_api import sync_playwright

WEB = "https://akan-five.vercel.app"
ODOO = "https://odoo-production-3a20.up.railway.app"
SHOTS = "/tmp/akan_e2e"
R = []  # (persona, paso, estado, detalle)

def log(persona, paso, ok, detalle=""):
    R.append((persona, paso, "OK" if ok else "FALLA", detalle))
    print(f"[{persona}] {paso}: {'OK' if ok else 'FALLA'} {detalle}"[:160])

def shot(page, name):
    try: page.screenshot(path=f"{SHOTS}/{name}.png", full_page=False)
    except Exception: pass

with sync_playwright() as p:
    browser = p.chromium.launch()

    # ═══════════ A) AUDITORÍA DE LINKS (todas las páginas web) ═══════════
    ctx = browser.new_context()
    pg = ctx.new_page()
    seen, dead = {}, []
    for path in ["/", "/tienda.html", "/quiz.html", "/perfil.html", "/legal.html", "/brand.html"]:
        try:
            pg.goto(WEB+path, timeout=30000); pg.wait_for_timeout(1500)
            hrefs = pg.eval_on_selector_all("a[href]", "els=>els.map(e=>e.getAttribute('href'))")
            anchors = pg.eval_on_selector_all("[id]", "els=>els.map(e=>e.id)")
            for h in set(hrefs):
                if not h or h.startswith(("mailto:","https://wa.me","tel:")): continue
                if h == "#": dead.append((path, "#", "link muerto literal")); continue
                if h.startswith("#"):
                    if h[1:] not in anchors: dead.append((path, h, "ancla inexistente"))
                    continue
                url = h if h.startswith("http") else WEB+"/"+h.lstrip("/")
                base = url.split("#")[0]
                if base in seen: continue
                try:
                    code = urllib.request.urlopen(urllib.request.Request(base, method="GET"), timeout=20).status
                except Exception as e:
                    code = str(e)[:40]
                seen[base] = code
                if code != 200: dead.append((path, h, f"HTTP {code}"))
        except Exception as e:
            dead.append((path, "(página)", str(e)[:60]))
    log("AUDIT", "links rotos / sin sentido", len(dead)==0, f"{len(dead)} hallazgos")
    for d in dead: print("   ·", d)
    ctx.close()

    # ═══════════ B) CARLOS — usuario en móvil ═══════════
    ctx = browser.new_context(viewport={"width":390,"height":844}, is_mobile=True, has_touch=True)
    pg = ctx.new_page()
    order_ref = token = None
    try:
        pg.goto(WEB, timeout=30000); pg.wait_for_timeout(2000); shot(pg,"c01_home")
        pg.click("text=Comenzar evaluación", timeout=8000)
        pg.wait_for_url("**/quiz.html*", timeout=10000); pg.wait_for_timeout(800)
        log("CARLOS","home → quiz",True)
    except Exception as e: log("CARLOS","home → quiz",False,str(e)[:80]); shot(pg,"c01_FAIL")
    try:
        for txt in ["Mi pelo","Recuperar lo perdido"]:
            pg.click(f"text={txt}", timeout=8000); pg.wait_for_timeout(450)
        pg.click(".visual-card >> nth=1", timeout=8000); pg.wait_for_timeout(450)
        for txt in ["6 meses a 1 año","Sí, ya me lo han dicho","No, es mi primera vez"]:
            pg.click(f"text={txt}", timeout=8000); pg.wait_for_timeout(450)
        pg.click("text=Ninguna de las anteriores", timeout=8000)
        pg.click("text=Continuar →", timeout=8000); pg.wait_for_timeout(500)
        pg.click("text=Oral", timeout=8000); pg.wait_for_timeout(450)
        pg.click("text=Balance resultado y rutina", timeout=8000); pg.wait_for_timeout(600)
        ok = pg.is_visible("text=Tu análisis está")
        shot(pg,"c02_analisis"); log("CARLOS","quiz completo → análisis",ok)
        pg.click("text=Continuar →", timeout=8000); pg.wait_for_timeout(500)
        pg.fill("input[name=name]","Carlos Diagnóstico")
        pg.fill("input[name=phone]","5512340001")
        pg.fill("input[name=email]","carlos.diag@test.mx")
        pg.select_option("select[name=state]","Jalisco")
        pg.fill("input[name=birthdate]","1991-04-04")
        pg.click("text=Ver mi plan →"); pg.wait_for_timeout(5200)
        ok = pg.is_visible("text=pre-aprobado")
        shot(pg,"c03_preaprobado"); log("CARLOS","lead + matching → pre-aprobado",ok)
        pg.click(".pcard.rec >> text=Continuar al checkout", timeout=8000); pg.wait_for_timeout(700)
        pg.fill("input[name=street]","Av. Diagnóstico 1")
        pg.fill("input[name=city]","Guadalajara")
        pg.fill("input[name=zip]","44100")
        pg.click("text=Confirmar mi orden"); pg.wait_for_timeout(6000)
        body = pg.inner_text("body")
        m = re.search(r"\bS\d{5}\b", body)
        order_ref = m.group(0) if m else None
        token = pg.evaluate("localStorage.getItem('akan_token')")
        shot(pg,"c04_orden")
        log("CARLOS","checkout → orden REAL en Odoo",bool(order_ref),f"{order_ref} token={token}")
    except Exception as e: log("CARLOS","funnel",False,str(e)[:100]); shot(pg,"c04_FAIL")
    try:
        pg.click("text=Ver mi tratamiento", timeout=8000)
        pg.wait_for_url("**/perfil.html*", timeout=10000); pg.wait_for_timeout(3500)
        ok = pg.is_visible("text=MÉDICO REVISANDO") or pg.is_visible("text=Médico revisando")
        shot(pg,"c05_perfil"); log("CARLOS","perfil con estado",ok)
        pg.fill("#chatInput","Doctor, ¿lo puedo tomar en la noche?")
        pg.click(".chat-form button"); pg.wait_for_timeout(2500)
        ok = "noche" in pg.inner_text("#chatBody")
        shot(pg,"c06_chat"); log("CARLOS","chat envía mensaje",ok)
    except Exception as e: log("CARLOS","perfil/chat",False,str(e)[:100]); shot(pg,"c06_FAIL")
    # médico aprueba (vía API) y Carlos intenta PAGAR de verdad
    try:
        common = xmlrpc.client.ServerProxy(f"{ODOO}/xmlrpc/2/common")
        mu = common.authenticate("akan","medico@akan.mx","Akan2026Med",{})
        mo = xmlrpc.client.ServerProxy(f"{ODOO}/xmlrpc/2/object")
        oid = mo.execute_kw("akan",mu,"Akan2026Med","sale.order","search",[[("name","=",order_ref)]])
        mo.execute_kw("akan",mu,"Akan2026Med","sale.order","action_akan_aprobar_receta",[oid])
        pg.reload(); pg.wait_for_timeout(3500); shot(pg,"c07_aprobado")
        log("CARLOS","perfil muestra RECETA APROBADA",pg.is_visible("text=Pagar mi tratamiento"))
    except Exception as e: log("CARLOS","aprobación visible",False,str(e)[:100])
    try:
        pg.click("text=Pagar mi tratamiento", timeout=8000)
        pg.wait_for_timeout(5000); shot(pg,"c08_pago_page")
        log("CARLOS","abre página de pago",("/my/orders" in pg.url) or ("payment" in pg.url), pg.url[:80])
        radios = pg.locator("#o_payment_methods input[name=o_payment_radio]")
        paid = False
        if radios.count():
            radios.first.check(); pg.wait_for_timeout(900)
            pg.click("button[name=o_payment_submit_button]", timeout=6000); paid=True
        pg.wait_for_timeout(10000); shot(pg,"c09_pago_result")
        st = mo.execute_kw("akan",mu,"Akan2026Med","sale.order","read",[oid],{"fields":["state"]})[0]["state"]
        log("CARLOS","PAGO real con provider demo",st=="sale",f"click={paid} estado={st} url={pg.url[:60]}")
    except Exception as e: log("CARLOS","pago",False,str(e)[:110]); shot(pg,"c09_FAIL")
    # tienda OTC como invitado
    try:
        pg.goto(WEB+"/tienda.html"); pg.wait_for_timeout(2500)
        pg.click(".otc-buy >> nth=0", timeout=8000); pg.wait_for_timeout(4000)
        shot(pg,"c10_otc_destino")
        log("CARLOS","OTC 'Comprar ahora' → destino con sentido","/shop" in pg.url, pg.url[:90])
        pg.click("#add_to_cart", timeout=8000); pg.wait_for_timeout(4000); shot(pg,"c11_carrito")
        pg.goto(ODOO+"/shop/cart"); pg.wait_for_timeout(3000)
        vacio = "carrito está vacío" in pg.inner_text("body")
        log("CARLOS","agregar al carrito FUNCIONA",not vacio)
        for sel in ["a[href*='/shop/checkout']","a:has-text('Pagar')","a:has-text('Finalizar')","a:has-text('Proceder')","button:has-text('Pagar')"]:
            try: pg.click(sel, timeout=4000); break
            except Exception: continue
        pg.wait_for_timeout(4000); shot(pg,"c12_shop_checkout")
        log("CARLOS","carrito → checkout invitado",any(x in pg.url for x in ["address","checkout","payment"]), pg.url[:90])
    except Exception as e: log("CARLOS","tienda OTC",False,str(e)[:110]); shot(pg,"c12_FAIL")
    ctx.close()

    # ═══════════ C) ANA — médico en desktop ═══════════
    ctx = browser.new_context(viewport={"width":1380,"height":900})
    pg = ctx.new_page()
    try:
        pg.goto(ODOO+"/web/login", timeout=30000); pg.wait_for_timeout(2500); shot(pg,"a01_login")
        log("ANA","login visible",pg.is_visible("input[name=login]"))
        pg.fill("input[name=login]","medico@akan.mx"); pg.fill("input[name=password]","Akan2026Med")
        pg.click("button[type=submit]"); pg.wait_for_timeout(9000); shot(pg,"a02_backend")
        ok = "/odoo" in pg.url and pg.locator(".o_navbar, .o_main_navbar").count()>0
        log("ANA","backend Odoo SE ABRE",ok,pg.url[:70])
        pg.goto(ODOO+"/odoo/crm"); pg.wait_for_timeout(8000); shot(pg,"a03_crm")
        log("ANA","CRM renderiza",pg.locator(".o_kanban_renderer,.o_kanban_view").count()>0)
        pg.locator(".o_kanban_record").first.click(); pg.wait_for_timeout(6000); shot(pg,"a04_lead")
        body = pg.inner_text("body")
        log("ANA","lead con respuestas + chat",("Etapa" in body or "Meta" in body) and pg.locator(".o-mail-Chatter").count()>0)
        pg.goto(ODOO+"/odoo/sales"); pg.wait_for_timeout(7000)
        pg.locator("tr.o_data_row").first.click(); pg.wait_for_timeout(6000); shot(pg,"a05_orden")
        log("ANA","orden con botón Aprobar","Aprobar receta" in pg.inner_text("body"))
    except Exception as e: log("ANA","backend",False,str(e)[:110]); shot(pg,"a_FAIL")
    ctx.close()

    # ═══════════ D) LUCAS — admin ═══════════
    ctx = browser.new_context(viewport={"width":1380,"height":900})
    pg = ctx.new_page()
    try:
        pg.goto(ODOO+"/web/login"); pg.wait_for_timeout(2000)
        pg.fill("input[name=login]","admin@akan.mx"); pg.fill("input[name=password]","Akan2026")
        pg.click("button[type=submit]"); pg.wait_for_timeout(9000); shot(pg,"l01_admin")
        log("LUCAS","admin entra y ve apps","/odoo" in pg.url and pg.locator(".o_navbar,.o_main_navbar").count()>0)
    except Exception as e: log("LUCAS","admin",False,str(e)[:90]); shot(pg,"l_FAIL")
    ctx.close()
    browser.close()

print("\n══════ RESUMEN ══════")
fails=[r for r in R if r[2]=="FALLA"]
for r in R: print(f"{r[2]:5} [{r[0]}] {r[1]} {('— '+r[3]) if r[3] else ''}"[:150])
print(f"\nTOTAL: {len(R)-len(fails)}/{len(R)} OK · {len(fails)} fallas")
