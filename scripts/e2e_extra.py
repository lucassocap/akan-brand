"""E2E extra — caminos secundarios: desempeño, compra directa, login email, shop invitado completo."""
import re, xmlrpc.client
from playwright.sync_api import sync_playwright
WEB="https://akan-five.vercel.app"; ODOO="https://odoo-production-3a20.up.railway.app"
R=[]
def log(t,ok,d=""): R.append((t,ok,d)); print(f"{'OK   ' if ok else 'FALLA'} {t} {d}"[:150])

with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={"width":390,"height":844},is_mobile=True,has_touch=True)
    pg=ctx.new_page()

    # 1) RAMA DESEMPEÑO completa (con gate de nitratos NO activado)
    try:
        pg.goto(WEB+"/quiz.html?branch=desempeno"); pg.wait_for_timeout(1500)
        for txt in ["Me cuesta lograr la erección","1-2 veces por semana","Es reciente (menos de 3 meses)"]:
            pg.click(f"text={txt}"); pg.wait_for_timeout(450)
        pg.click("text=Ninguna de las anteriores"); pg.click("text=Continuar →"); pg.wait_for_timeout(500)
        pg.click("text=Siempre listo"); pg.wait_for_timeout(700)
        ok=pg.is_visible("text=Tu análisis está")
        log("DESEMPEÑO quiz → análisis",ok)
        pg.click("text=Continuar →"); pg.wait_for_timeout(500)
        pg.fill("input[name=name]","Diego Desempeño"); pg.fill("input[name=phone]","5512340002")
        pg.fill("input[name=email]","diego.dz@test.mx"); pg.select_option("select[name=state]","Nuevo León")
        pg.fill("input[name=birthdate]","1985-02-02")
        pg.click("text=Ver mi plan →"); pg.wait_for_timeout(5200)
        rec=pg.inner_text(".pcard.rec h3") if pg.locator(".pcard.rec h3").count() else "?"
        log("DESEMPEÑO recomienda Plan Diario","Diario" in rec,rec)
        pg.click(".pcard.rec >> text=Continuar al checkout"); pg.wait_for_timeout(700)
        pg.fill("input[name=street]","Calle MTY 5"); pg.fill("input[name=city]","Monterrey"); pg.fill("input[name=zip]","64000")
        pg.click("text=Confirmar mi orden"); pg.wait_for_timeout(6000)
        m=re.search(r"\bS\d{5}\b",pg.inner_text("body"))
        log("DESEMPEÑO checkout → orden real",bool(m),m.group(0) if m else "")
    except Exception as e: log("DESEMPEÑO rama",False,str(e)[:90])

    # 1b) GATE de nitratos: debe frenar y ofrecer consulta
    try:
        pg.goto(WEB+"/quiz.html?branch=desempeno"); pg.wait_for_timeout(1500)
        for txt in ["Funciono bien, quiero más seguridad","3 o más veces por semana","Unos meses ya"]:
            pg.click(f"text={txt}"); pg.wait_for_timeout(450)
        pg.click("text=Tomo nitratos"); pg.click("text=Continuar →"); pg.wait_for_timeout(700)
        log("GATE nitratos frena la venta",pg.is_visible("text=tu seguridad primero") or pg.is_visible("text=Alto"))
    except Exception as e: log("GATE nitratos",False,str(e)[:90])

    # 2) COMPRA DIRECTA desde tienda Rx (deep-link al checkout)
    try:
        pg.goto(WEB+"/tienda.html"); pg.wait_for_timeout(2000)
        pg.click("text=Elegir con evaluación → >> nth=0"); pg.wait_for_timeout(1500)
        ok="quiz.html" in pg.url and pg.is_visible("text=¿A dónde lo mandamos?")
        log("TIENDA Rx → checkout directo con plan",ok,pg.url[:70])
    except Exception as e: log("TIENDA Rx directo",False,str(e)[:90])

    # 3) LOGIN email + orden en el perfil
    try:
        pg.goto(WEB+"/perfil.html"); pg.wait_for_timeout(2500)
        pg.evaluate("localStorage.removeItem('akan_token')")
        pg.goto(WEB+"/perfil.html"); pg.wait_for_timeout(2500)
        pg.fill("#gEmail","prod.e2e@akan.mx"); pg.fill("#gOrder","S00019")
        pg.click("#goEmail"); pg.wait_for_timeout(4500)
        log("PERFIL login email+orden",pg.is_visible("text=Aquí va tu tratamiento") or pg.is_visible("text=tratamiento"))
    except Exception as e: log("PERFIL email login",False,str(e)[:90])

    # 4) SHOP invitado COMPLETO: PDP → carrito → dirección → pago demo → confirmación
    try:
        pg.goto(ODOO+"/shop/akan-shampoo-shampoo-ketoconazol-2-5"); pg.wait_for_timeout(3500)
        pg.click("#add_to_cart"); pg.wait_for_timeout(3500)
        pg.goto(ODOO+"/shop/cart"); pg.wait_for_timeout(2500)
        pg.click("a[href*='/shop/checkout']"); pg.wait_for_timeout(3500)
        # formulario de invitado
        def f(sel,val):
            if pg.locator(sel).count(): pg.fill(sel,val)
        f("input[name=name]","Invitado Shop"); f("input[name=email]","invitado.shop@test.mx")
        f("input[name=phone]","5512340003"); f("input[name=street]","Calle Shop 1")
        f("input[name=city]","CDMX"); f("input[name=zip]","06100")
        if pg.locator("select[name=country_id]").count():
            pg.select_option("select[name=country_id]",label="México")
        pg.wait_for_timeout(800)
        for sel in ["button:has-text('Continuar')","button:has-text('Confirmar')","a:has-text('Continuar')","button[type=submit]"]:
            try: pg.click(sel,timeout=3000); break
            except Exception: continue
        pg.wait_for_timeout(4000)
        # posible paso de envío
        for sel in ["a:has-text('Confirmar')","button:has-text('Confirmar')","a[href*='/shop/payment']"]:
            try: pg.click(sel,timeout=3000); break
            except Exception: continue
        pg.wait_for_timeout(4000)
        pg.screenshot(path="/tmp/akan_e2e/x_shop_payment.png")
        pg.wait_for_selector("input[name=o_payment_radio]",timeout=20000)
        pg.locator("input[name=o_payment_radio]").first.check(); pg.wait_for_timeout(900)
        pg.click("button[name=o_payment_submit_button]"); pg.wait_for_timeout(10000)
        pg.screenshot(path="/tmp/akan_e2e/x_shop_confirm.png")
        log("SHOP invitado pago COMPLETO","confirmation" in pg.url or "payment/status" in pg.url,pg.url[:80])
    except Exception as e:
        pg.screenshot(path="/tmp/akan_e2e/x_shop_FAIL.png")
        log("SHOP invitado pago",False,str(e)[:110])
    ctx.close(); b.close()

print("\n══ EXTRA ══")
fails=[r for r in R if not r[1]]
print(f"{len(R)-len(fails)}/{len(R)} OK · {len(fails)} fallas")
