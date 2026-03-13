# Nasazení webu (GitHub Pages)

Stránka se nasazuje **pouze přes GitHub Actions** — výstup buildu je složka `_site/` (ta je v `.gitignore`, do repozitáře se necommituje).

## Nutné nastavení v repozitáři

**Settings → Pages → Build and deployment → Source** musí být nastaveno na **„GitHub Actions“**.

Pokud je zde „Deploy from a branch“ a složka `/ (root)`, návštěvníci uvidí surové zdrojové soubory (bez layoutu a bez CSS — na stránce může být vidět YAML hlavička typu `layout: layout-base.njk`).  
**Řešení:** změňte Source na **GitHub Actions**, uložte; při dalším pushi nebo po ručním spuštění workflow (Actions → „pages build and deployment“ → Run workflow) se nasadí sestavený web a styly budou fungovat.

## Co se děje při pushi na `main`

1. Workflow zkopíruje repozitář, spustí `npm install` a `npm run build` (Eleventy).
2. Výstup je v `_site/` (HTML s layoutem, `assets/css/main.css`, skripty, …).
3. Obsah `_site/` se nahraje jako artifact a nasadí na GitHub Pages.

Otevřete **Actions** v repozitáři a zkontrolujte, že běh „pages build and deployment“ po pushi zeleně projde.
