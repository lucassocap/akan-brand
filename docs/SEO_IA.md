# SEO para IA (AKAN) — lo que falta hacer a mano

Ya está en el repo: `robots.txt` (IA permitida, lo privado bloqueado), `sitemap.xml`,
JSON-LD por página, `faq.html`, `llms.txt`, `llms-full.txt` y la clave de IndexNow.
Todo esto solo sirve **después del deploy a https://soyakan.com**.

## 1. Google Search Console (Google, Gemini, AI Overviews)

1. https://search.google.com/search-console → *Agregar propiedad* → **Dominio** → `soyakan.com`.
2. Copia el registro TXT (`google-site-verification=...`).
3. Vercel → proyecto → *Settings → Domains* (o *Domains* del equipo) → `soyakan.com` →
   *DNS Records* → **Add**: tipo `TXT`, nombre `@`, valor = el de Google. (Si el DNS
   no está en Vercel, agrégalo donde estén los nameservers.)
4. Espera unos minutos y pulsa **Verificar**.
5. *Sitemaps* → envía `https://soyakan.com/sitemap.xml`.

## 2. Bing Webmaster Tools (Copilot y ChatGPT search)

1. https://www.bing.com/webmasters → inicia sesión → **Importar desde Google Search Console**
   (importa sitio verificado y sitemap; no hace falta otro TXT).
2. Revisa que `https://soyakan.com/sitemap.xml` aparezca en *Sitemaps*.

## 3. IndexNow (Bing, Yandex, Seznam, Naver...)

- Clave: `9d1a4e47c1b23cdc95b80487376a8ce2` — archivo `/9d1a4e47c1b23cdc95b80487376a8ce2.txt` en la raíz del repo.
  Es **pública por diseño**: solo prueba que el sitio es nuestro.
- Comprueba tras el deploy: `curl https://soyakan.com/9d1a4e47c1b23cdc95b80487376a8ce2.txt` debe devolver la clave.

## 4. Cómo pedir la indexación

- **Google:** Search Console → *Inspección de URLs* → pega la URL (`/`, `/tienda.html`,
  `/faq.html`) → **Solicitar indexación**. Google no usa IndexNow.
- **Bing / Copilot / ChatGPT search:** en cada cambio de páginas, avisa por IndexNow:

```bash
curl -s -X POST https://api.indexnow.org/indexnow \
  -H 'Content-Type: application/json; charset=utf-8' \
  -d '{"host":"soyakan.com","key":"9d1a4e47c1b23cdc95b80487376a8ce2",
       "keyLocation":"https://soyakan.com/9d1a4e47c1b23cdc95b80487376a8ce2.txt",
       "urlList":["https://soyakan.com/","https://soyakan.com/tienda.html",
                  "https://soyakan.com/faq.html","https://soyakan.com/legal.html"]}'
```

  Respuesta 200 o 202 = recibido. También puedes usar *Envío de URL* en Bing Webmaster Tools.
- **Perplexity / Claude:** no tienen consola; leen `robots.txt`, `sitemap.xml` y
  `llms.txt`. Basta con que el sitio esté en línea e indexado en Bing/Google.

## 5. Reglas al editar (para no romper lo anterior)

- Página privada nueva → `Disallow` en **los dos** grupos de `robots.txt` y fuera del sitemap.
- Página pública nueva → al `sitemap.xml` con `lastmod` y con title, description, og y twitter.
- Tratamientos con receta: nunca `Product`/`Offer` con precio ni nombre de medicamento en
  JSON-LD, `llms*.txt` o la FAQ (COFEPRIS). Solo el `Service` de consulta médica.
- Si cambias una pregunta de `faq.html`, cambia también el `FAQPage` de su JSON-LD (mismo texto).
- Valida: https://search.google.com/test/rich-results y https://validator.schema.org.
