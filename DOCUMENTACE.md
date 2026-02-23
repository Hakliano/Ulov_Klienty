# Dokumentace projektu ULOV KLIENTY

**Stav k:** 22. 2. 2026  
**Doména:** ulovklienty.cz (CNAME), kanonická URL: https://ulovklienty.cz (bez www)  
**Hosting:** GitHub Pages (workflow: `.github/workflows/deploy-pages.yml`)

---

## 1. Přehled projektu

Statický marketingový web pro službu **ULOV KLIENTY** — pomoc malým firmám, finančním poradcům, řemeslníkům a salonům s online prezentací (Google, web, katalogy, rezervační cesta). Bez buildu: čistý HTML, CSS a vanilla JavaScript.

---

## 2. Struktura souborů

```
Ulov_Klienty_web_js/
├── index.html              # Úvodní stránka
├── clanky.html             # Přehled článků + filtr
├── dekujeme.html           # Děkujeme (po odeslání formuláře)
├── obchodni-podminky.html  # Obchodní podmínky (docs styl)
├── smlouva.html            # Smlouva (docs styl)
├── sitemap.xml             # Sitemapa (kanonické URL https://ulovklienty.cz)
├── robots.txt              # Allow all, Sitemap: https://ulovklienty.cz/sitemap.xml
├── CNAME                   # Doména pro GitHub Pages: ulovklienty.cz
├── DOCUMENTACE.md          # Tento soubor
├── .github/
│   └── workflows/
│       └── deploy-pages.yml   # Deploy na push do main
├── assets/
│   ├── css/
│   │   ├── main.css        # Hlavní styly (layout, komponenty, články, carousel)
│   │   └── docs.css        # Styly pro obchodní podmínky a smlouvu
│   └── js/
│       ├── article-carousel.js  # Carousel článků (šipky + volitelně auto-advance)
│       ├── articles-filter.js  # Filtr článků na clanky.html (Všechny / Poradci / …)
│       ├── cookies.js      # Lišta souhlasu s cookies
│       ├── form.js         # (volitelně) odeslání formuláře
│       ├── opening-sale.js # (volitelně) akční nabídka
│       ├── roi.js          # ROI kalkulačka na index.html
│       └── year.js         # Aktuální rok do patičky
└── clanky/
    ├── jak-ziskat-nove-klienty-financni-poradce.html
    ├── proc-financni-poradce-potrebuje-vlastni-web.html
    ├── jak-ziskat-klienty-financni-sluzby-bez-studeny-ch-kontaktu.html
    └── proc-financni-poradce-registrovat-online-katalogy.html
```

---

## 3. Stránky a jejich účel

| Soubor | Účel |
|--------|------|
| **index.html** | Úvodní stránka: hero, „Poznáváte se?“, Co upravíme (služby), **carousel článků** (4 karty, auto-advance 3 s), důvěra, ceny, kontakt, formulář. |
| **clanky.html** | Seznam článků s **filtrem** (Všechny / Finanční poradci / Řemeslné služby / Salony). Karty s obrázkem, nadpisem, podnadpisem, excerptem a odkazem na článek. |
| **dekujeme.html** | Děkujeme za odeslání (cílový stav po formuláři). |
| **obchodni-podminky.html** | Obchodní podmínky (layout z docs.css). |
| **smlouva.html** | Smlouva (layout z docs.css). |
| **clanky/*.html** | Čtyři články pro finanční poradce. V každém je na konci **carousel** dalších tří článků (bez auto-advance). |

---

## 4. Články (clanky/)

Všechny články mají společnou strukturu: hero, obsah (nadpisy, odstavce, obrázky, seznamy), blok „V kostce“, CTA, carousel dalších článků.

| Článek | Téma |
|--------|------|
| jak-ziskat-nove-klienty-financni-poradce.html | Noví klienti bez doporučení a bez placené reklamy, důraz na online prezentaci. |
| proc-financni-poradce-potrebuje-vlastni-web.html | Vlastní web vs. sociální sítě, kontrola a důvěra. |
| jak-ziskat-klienty-financni-sluzby-bez-studeny-ch-kontaktu.html | Recenze, Google profil, offline marketing, vizitky. |
| proc-financni-poradce-registrovat-online-katalogy.html | Proč a kde se registrovat v online katalozích, MUST HAVE / NICE TO HAVE, dárek: seznam katalogů. |

---

## 5. Komponenty a chování

### Carousel článků (`article-carousel.js`)
- **Kde:** index.html (4 karty), uvnitř každého článku (3 karty).
- **Ovládání:** tlačítka Předchozí / Další.
- **Index:** atribut `data-auto-advance="3000"` — automatický posun o jednu kartu každé 3 s; na konci se pruh vrátí na začátek.
- **CSS:** `.article-carousel--show-3` na indexu zobrazuje 3 karty vedle sebe; v článcích může být jiná šířka.

### Filtr článků (`articles-filter.js`)
- **Kde:** pouze clanky.html.
- **Atributy:** tlačítka `data-filter="all"|"poradce"|"remeslo"|"salon"`, karty `data-category="…"`.
- **Chování:** bez reloadu stránky skrývá/zobrazuje `.article-card` podle zvolené kategorie.

### Ostatní skripty
- **cookies.js** — lišta s informací o cookies a tlačítko „Rozumím“.
- **year.js** — doplní aktuální rok do prvku s `id="y"` v patičce.
- **roi.js** — kalkulačka ROI na index.html (pokud je sekce přítomna).
- **form.js** — odeslání kontaktního formuláře (na indexu může být zakomentovaný).

---

## 6. Styly

- **main.css** — vše kromě právních stránek: layout, header, hero, karty, sekce, články, carousel (`.article-carousel`, `.article-carousel__card-subtitle`, `.article-carousel--show-3`), filtr článků, patička, cookies lišta.
- **docs.css** — obchodní podmínky a smlouva (čitelné dokumenty).

Obrázky a fonty jsou z externích URL (např. haklweb.b-cdn.net).

---

## 7. Sitemapa a robots.txt

**sitemap.xml** (kanonická doména https://ulovklienty.cz, bez www), aktualizováno 23. 2. 2026:
- `https://ulovklienty.cz/` (priority 1.0)
- `https://ulovklienty.cz/clanky.html` (0.9)
- čtyři články v `/clanky/` (0.8)
- `obchodni-podminky.html`, `smlouva.html` (0.3)
- stránka dekujeme v sitemap není (noindex).

**robots.txt** v rootu: `User-agent: *`, `Allow: /`, `Sitemap: https://ulovklienty.cz/sitemap.xml`.

Na všech stránkách je v `<head>` canonical na příslušnou URL (bez www). Na dekujeme.html je navíc `meta name="robots" content="noindex, nofollow"`.

---

## 8. Deployment

- **Trigger:** push do větve `main` nebo ruční spuštění workflow.
- **Workflow:** `.github/workflows/deploy-pages.yml` — checkout, upload celého adresáře jako Pages artifact, deploy na GitHub Pages.
- **Doména:** CNAME soubor nastavuje `ulovklienty.cz`; reálná URL je https://www.ulovklienty.cz (dle sitemap).

---

## 9. Poznámky pro údržbu

- Při přidání nového článku: vytvořit soubor v `clanky/`, přidat kartu na `clanky.html` (včetně `data-category`), přidat kartu do carouselů v existujících článcích a do carouselu na `index.html`, **doplnit záznam do sitemap.xml**.
- Odkazy na „Více informací“ o cookies vedou na `site/cookies.html` — tento soubor v repozitáři není; v případě potřeby doplnit stránku nebo odkaz změnit.
- Formulář na index.html může používat form.js nebo externí službu; při změně cíle odeslání upravit action a případně form.js.
