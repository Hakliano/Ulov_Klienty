# Dokumentace projektu ULOV KLIENTY

**Stav k:** 25. 2. 2026  
**Doména:** ulovklienty.cz (CNAME), kanonická URL: https://ulovklienty.cz (bez www)  
**Hosting:** GitHub Pages (workflow: `.github/workflows/deploy-pages.yml`)  
**Build:** Eleventy — výstup do `_site/`, deployuje se obsah `_site/`.

---

## 1. Přehled projektu

Statický marketingový web pro službu **ULOV KLIENTY** — pomoc malým firmám, finančním poradcům, řemeslníkům a salonům s online prezentací (Google, web, katalogy, rezervační cesta).  
**Technologie:** Eleventy pro sestavení úvodní stránky, ostatní stránky statické HTML; vanilla CSS a JavaScript. Sdílená hlavička a patička pro index přes Nunjucks partialy.

---

## 2. Struktura souborů

```
Ulov_Klienty_web_js/
├── index.html              # Šablona úvodní stránky (Eleventy → _site/index.html)
├── pro-poradce.html        # Landing page pro placené kampaně (Eleventy → _site/pro-poradce/index.html)
├── clanky.html             # Přehled článků + filtr (passthrough)
├── dekujeme.html           # Děkujeme po odeslání formuláře (passthrough)
├── obchodni-podminky.html  # Obchodní podmínky (passthrough)
├── smlouva.html            # Smlouva (passthrough)
├── sitemap.xml             # Sitemapa (kanonické URL https://ulovklienty.cz)
├── robots.txt              # Allow all, Sitemap
├── CNAME                   # Doména: ulovklienty.cz
├── .nojekyll               # Pro GitHub Pages
├── DOCUMENTACE.md          # Tento soubor
├── _includes/              # Eleventy partialy
│   ├── layout-base.njk    # Layout: head (GA, consent), header, footer, cookie bar (index)
│   ├── layout-lp.njk      # Layout pro landing page (minimální header/footer)
│   ├── header.njk
│   ├── header-lp.njk      # Minimální header (pouze logo)
│   ├── footer.njk
│   ├── footer-lp.njk      # Minimální footer (kontakt, OP, GDPR)
│   └── cookie-bar.njk
├── data/
│   └── clanky.json         # Jediný zdroj dat pro carousel článků (slug, title, excerpt, image, alt…)
├── docs/                   # Dokumentace (nepublikuje se na web)
│   ├── ELEVENTY-BUILD.md
│   ├── ANALYZA-SDILENE-CASTI-A-GA.md
│   └── GOOGLE-ANALYTICS-NASTAVENI.md
├── eleventy.config.js      # Ignory, passthrough (assets, data, clanky, statické HTML)
├── package.json            # scripts: build (eleventy), serve (eleventy --serve)
├── .github/workflows/
│   └── deploy-pages.yml    # npm install → npm run build → upload _site → deploy Pages
├── assets/
│   ├── css/
│   │   ├── main.css        # Hlavní styly (layout, komponenty, články, carousel)
│   │   └── docs.css        # Obchodní podmínky a smlouva
│   └── js/
│       ├── article-carousel.js  # Načte data z data-src (JSON), vykreslí karty, šipky + volitelně auto-advance
│       ├── articles-filter.js  # Filtr článků na clanky.html
│       ├── cookies.js      # Cookie lišta: Přijmout vše / Pouze nezbytné, consent pro GA
│       ├── form.js, form-lp.js, opening-sale.js, roi.js, year.js
├── clanky/
│   ├── *.html              # 8 článků (passthrough); v každém carousel s data-src="/data/clanky.json"
│   └── …
└── _site/                  # Výstup Eleventy (gitignore) — zde se nasazuje
```

---

## 3. Stránky a jejich účel

| Soubor | Účel |
|--------|------|
| **index.html** | Úvodní stránka (Eleventy layout): hero, služby, **carousel článků** (data z `data/clanky.json`), důvěra, ceny, kontakt, formulář. |
| **pro-poradce.html** | **Landing page** pro placené kampaně (TikTok/FB/IG Ads). URL: `/pro-poradce/`. Minimální header (logo), hero s CTA → anchor sekce (#web, #recenze, #viditelnost, #komplet), formulář, carousel článků. Noindex, canonical na tuto URL. Měření: GA4, odeslání formuláře, scroll depth. |
| **clanky.html** | Seznam článků s **filtrem** (Všechny / Finanční poradci / …). Karty s `data-category`. |
| **dekujeme.html** | Děkujeme za odeslání formuláře. |
| **obchodni-podminky.html**, **smlouva.html** | Právní texty (docs.css). |
| **clanky/*.html** | Osm článků. V každém na konci **carousel** „Další články“ s daty z `/data/clanky.json` (placeholder: `data-src="/data/clanky.json"`, `data-base=""`). |

---

## 4. Články (clanky/)

Všechny články mají společnou strukturu: hero, obsah, „V kostce“, CTA, carousel dalších článků.  
**Seznam:** jak-ziskat-nove-klienty-financni-poradce, proc-financni-poradce-potrebuje-vlastni-web, jak-ziskat-klienty-financni-sluzby-bez-studeny-ch-kontaktu, proc-financni-poradce-registrovat-online-katalogy, osobni-znacka-vs-znacka-materske-firmy, jak-reagovat-na-negativni-recenze, jak-ziskat-doporuceni-kdyz-zakaznik-nechce-dat-kontakty, jak-si-pozadat-o-recenzi.

---

## 5. Komponenty a chování

### Carousel článků (`article-carousel.js`)
- **Zdroj dat:** jeden soubor **`data/clanky.json`** — úpravy carouselu na všech stránkách stačí dělat zde.
- **Kde:** index.html (sekce Články), **pro-poradce** (landing page), uvnitř každého článku (Další články).
- **HTML:** kontejner s `data-src="…"`, `data-base="…"`, prázdný `.article-carousel__track`. Volitelně: `data-limit="6"`, `data-excerpt-max="120"`, `data-btn-text="Číst"` (na LP).
- **Ovládání:** tlačítka Předchozí / Další; na indexu `data-auto-advance="3000"` (posun každé 3 s).

### Cookie lišta a souhlas (`cookies.js`)
- **Tlačítka:** „Přijmout vše“ / „Pouze nezbytné“.
- **Uložení:** `localStorage` klíč `ulov_klienty_cookies_consent` (`all` | `necessary`). Po „Přijmout vše“ se volá `gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted' })` — teprve pak se odesílají data do Google Analytics.
- Odkaz „Více informací“ vede na `site/cookies.html` (soubor v repozitáři může chybět).

### Filtr článků (`articles-filter.js`)
- **Kde:** clanky.html. Tlačítka `data-filter`, karty `data-category`. Skrývá/zobrazuje karty bez reloadu.

### Formulář LP (`form-lp.js`)
- **Kde:** stránka `/pro-poradce/`. Pole: Jméno, E-mail (povinné), Telefon a Zpráva (nepovinné).
- **Odeslání:** FormSubmit.co (AJAX), po úspěchu redirect na `https://ulovklienty.cz/dekujeme.html`.
- **Analytika:** GA4 událost `form_submit` při odeslání; `scroll_depth` (25 %, 50 %, 75 %, 100 %).

### Ostatní
- **year.js** — aktuální rok do patičky (`id="y"`).
- **roi.js** — kalkulačka ROI na indexu. **form.js** — odeslání formuláře na indexu (dle potřeby).

---

## 6. Google Analytics (GA4)

- **ID měření:** `G-44M171DCB9` (stream „UlovKlienty web“).
- **Umístění:** gtag v `<head>` na všech stránkách (layout-base.njk + každé statické HTML).
- **Consent mode:** výchozí `analytics_storage: 'denied'`; měření až po kliknutí „Přijmout vše“ v cookie liště.
- **Podrobnosti a sledování stránek/článků:** viz **`docs/GOOGLE-ANALYTICS-NASTAVENI.md`**.

---

## 7. Styly

- **main.css** — layout, header (včetně odkazu na Facebook), patička, hero, karty, články, carousel, cookie lišta, **styly pro landing page** (`.lp-header`, `.lp-footer`, `.lp-form-sec`, `.lp-hero__cta` atd.).
- **docs.css** — obchodní podmínky a smlouva.  
Obrázky a fonty z externích URL (haklweb.b-cdn.net).

---

## 8. Sitemapa a robots.txt

**sitemap.xml:** úvodní stránka, clanky.html, osm článků v `/clanky/`, obchodni-podminky, smlouva. Stránky **dekujeme** a **pro-poradce** (noindex) v sitemap nejsou.  
**robots.txt:** `User-agent: *`, `Allow: /`, `Sitemap: https://ulovklienty.cz/sitemap.xml`.  
Canonical a noindex na dekujeme dle potřeby v `<head>`.

---

## 9. Deployment

- **Trigger:** push do `main` nebo ruční spuštění workflow.
- **Kroky:** checkout → `npm install` → `npm run build` (Eleventy) → upload artifact **`_site`** → deploy na GitHub Pages.
- **Doména:** CNAME `ulovklienty.cz`; výsledná URL dle nastavení (https://ulovklienty.cz).

---

## 10. Lokální vývoj

- **Build:** `npm run build` (výstup do `_site/`).
- **Náhled s watch:** `npm run serve` (Eleventy dev server, typicky port 8080).

---

## 11. Poznámky pro údržbu

- **Nový článek:** (1) přidat soubor do `clanky/`, (2) přidat záznam do **`data/clanky.json`** (slug, title, subtitle, excerpt, image, alt), (3) přidat kartu na **clanky.html** včetně `data-category`, (4) doplnit URL do **sitemap.xml**. Carousel na indexu i v článcích se aktualizuje sám z `clanky.json`.
- Formulář: při změně cíle odeslání upravit action a případně form.js.
- Změna GA ID nebo consent logiky: úpravy v `_includes/layout-base.njk`, `_includes/layout-lp.njk` a ve všech statických HTML (clanky.html, dekujeme, smlouva, obchodni-podminky, clanky/*.html).
- **Landing page (pro-poradce):** Pokud chcete stránku indexovat, v `pro-poradce.html` nastavte `noindex: false` a přidejte URL do sitemap.xml. UTM parametry z reklam GA4 zachytí automaticky.
