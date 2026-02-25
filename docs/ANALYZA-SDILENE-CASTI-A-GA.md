# Analýza: sdílená hlavička/patička, carousel z jednoho místa, Google Analytics

**Kontext:** Projekt je hostovaný na **GitHub Pages** – čistě statický hosting bez vlastního serveru. Žádné serverové skriptování (PHP, SSI, Node na serveru).

---

## 1. Sdílená hlavička a patička

### Možnosti vzhledem k GitHub Pages

| Přístup | Na GitHub Pages | Doporučení pro ULOV KLIENTY |
|--------|------------------|-----------------------------|
| **SSI (Server-Side Includes)** | ❌ **Nefunguje.** GitHub Pages nemá přístup k Apache/Nginx konfiguraci, SSI nepodporuje. | Škrtnout. |
| **JavaScript (fetch header.html / footer.html)** | ✔ Technicky možné. | ❌ **Nedoporučeno** pro obsahový/SEO web: hlavička se načte až po vykreslení stránky (bliknutí), SEO roboti mohou vidět stránku bez hlavičky, při vypnutém JS hlavička nebude vůbec. Pro informační microsite možná; pro seriózní obsahový web raději ne. |
| **Build nástroj (Eleventy, Hugo, …)** | ✔ **Správná cesta.** Jeden header.html, jeden footer.html; při buildu se vloží do všech stránek. Výstup = čisté statické HTML, které GitHub Pages jen servíruje. | ✅ **Doporučeno.** |

### Build na GitHub Pages – na co si dát pozor

- **Jekyll:** GitHub Pages má výchozí Jekyll build. Pokud použiješ **jiný** nástroj (Eleventy, Hugo), musíš Jekyll vypnout: v rootu repozitáře prázdný soubor **`.nojekyll`**.
- **Jak buildovat:**
  - **Lokální build** – spustíš build u sebe a do repa commitneš vygenerované HTML (např. složka `dist/` nebo root).
  - **GitHub Actions** (lepší) – při pushu se spustí workflow: checkout, instalace nástroje, build, nasazení výstupu na GitHub Pages. Zdroják zůstane v repo, vygenerované soubory můžeš mít v branchi `gh-pages` nebo v outputu action.

**DNS (např. Forpsi)** jen směruje doménu na GitHub Pages; na volbu buildu nemá vliv.

---

## 2. Carousel článků z jednoho místa

**Stav teď:** Na každém článku je velký blok HTML s ~7 kartami. Nový článek = úprava 8+ souborů.

**Cílový stav:** Jedna datová struktura (např. JSON) se seznamem všech článků. Carousel se vykreslí z ní – klidně včetně aktuálního článku.

| Přístup | Popis |
|--------|--------|
| **JSON + JS** (bez buildu) | `data/clanky.json` + script, který na každé stránce článku načte JSON a vygeneruje karty. Přidání článku = 1× nový HTML + 1× záznam do JSON. |
| **Build** | Zdroj dat (JSON / front matter) je jeden; build vygeneruje stránky i HTML carouselu. Přidání článku = jeden nový soubor + záznam v datech. |

**„V carouselu všechny články včetně toho otevřeného“** – v pořádku, stačí v datech mít všechny články a vykreslit je.

---

## 3. Google Analytics a „jeden header“

Při **build** řešení: layout má `<head>` včetně GA scriptu a do `<body>` vkládáš fragmenty header/footer. Každá vygenerovaná stránka je samostatný HTML dokument se svým `<head>` a GA v něm. **Měření funguje stejně jako dnes** – každá URL má GA v kontextu své stránky.

Při **fetch** řešení (nedoporučeno zde): GA by zůstal v `<head>` každé stránky; načítaný by byl jen viditelný obsah hlavičky. GA by také fungoval.

---

## 4. Shrnutí doporučení

- **SSI:** na GitHub Pages nepoužitelné, nepočítat s ním.
- **Header/footer přes JS:** možné, ale pro obsahový/SEO web (ULOV KLIENTY) nedoporučeno (bliknutí, SEO, závislost na JS).
- **Build (Eleventy nebo Hugo):** doporučené – jeden header/footer, čistý statický výstup, plná kontrola, SEO-friendly. Na GitHub Pages stačí `.nojekyll` a buď lokální build + commit výstupu, nebo GitHub Actions.

*Dokument vznikl jako analýza pro projekt Ulov_Klienty_web_js (GitHub Pages).*
