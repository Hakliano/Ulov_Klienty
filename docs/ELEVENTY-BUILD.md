# Build (Eleventy) – sdílená hlavička a patička

## Co je nastaveno

- **Eleventy** sestavuje stránky z šablon a vkládá sdílenou hlavičku a patičku z `_includes/`.
- **Header, footer, cookie lišta** jsou v jednom místě: `_includes/header.njk`, `_includes/footer.njk`, `_includes/cookie-bar.njk`.
- **Responsivita** se nemění – v partialech jsou stejné třídy a struktura jako dříve (včetně `header--two-rows`, `nav-toggle`, `cc-mini__actions` atd.).

## Stránky se sdílenou hlavičkou/patičkou

Stránka musí mít na začátku **front matter** a jako obsah jen **obsah `<main>`** (bez `<head>`, headeru, footeru a skriptů). Layout to obalí.

**Příklad (index):**
```yaml
---
layout: layout-base.njk
title: ULOV KLIENTY — Získávejte poptávky z internetu
description: ...
canonical: https://ulovklienty.cz/
baseUrl: ""      # pro stránky v rootu; pro články v clanky/ použijte "../"
isHome: true     # jen pro úvodní stránku (jiný odkaz v menu)
carousel: true   # načíst article-carousel.js
roi: true       # načíst roi.js
---
```

- **baseUrl:** `""` pro `index.html`, `clanky.html`; `"../"` pro stránky ve složce `clanky/`.
- **isHome:** `true` jen u úvodní stránky (logo → #top, menu s kotvami).

## Lokální build

Potřebujete Node.js (např. v18+).

```bash
npm install
npm run build
```

Výstup je ve složce `_site/`. Náhled na lokálním serveru: `npm run serve`.

## GitHub Pages

Při pushi na `main` se spustí workflow: instalace závislostí, `npm run build`, nasazení složky `_site` na GitHub Pages. Soubor `.nojekyll` je v `_site`, takže Jekyll se nespouští.

## Převod další stránky na šablonu

1. Na začátek souboru přidejte front matter (layout, title, description, canonical, baseUrl, isHome pokud je to úvodní stránka, carousel/roi/articlesFilter podle potřeby).
2. V souboru smažte vše kromě obsahu mezi `<main id="top">` a `</main>` (včetně těchto tagů).
3. Uložte a zkontrolujte výstup po `npm run build`.

Statické stránky (`obchodni-podminky.html`, `smlouva.html`, `dekujeme.html`) se jen kopírují do `_site` (passthrough), nemají layout.
