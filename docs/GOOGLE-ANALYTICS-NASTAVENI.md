# Nastavení Google Analytics (GA4) na webu ulovklienty.cz

## Jak je sledování nasazené

### 1. Měřicí kód (gtag) v hlavičce

- Na **všech** stránkách je v `<head>` vložen oficiální skript Google Tag (gtag.js) a konfigurace.
- **ID měření:** `G-44M171DCB9` (odpovídá datovému streamu „UlovKlienty web“ v GA4).
- **Kde je kód:**
  - Šablona Eleventy: `_includes/layout-base.njk` (používá ji např. index).
  - Statické HTML: `clanky.html`, `dekujeme.html`, `smlouva.html`, `obchodni-podminky.html` a všech 8 článků v `clanky/*.html`.

### 2. Consent mode (souhlas před měřením)

- Před načtením měření se nastaví **výchozí souhlas na „odepřeno“:**
  - `ad_storage: 'denied'`
  - `analytics_storage: 'denied'`
- Měření (odesílání dat do GA) se **zapne až po souhlasu uživatele**.

### 3. Cookie lišta a uložení souhlasu

- **Soubor:** `assets/js/cookies.js`.
- **Klíč v localStorage:** `ulov_klienty_cookies_consent`.
- **Možnosti:** `all` (Přijmout vše) nebo `necessary` (Pouze nezbytné).
- Po kliknutí na **„Přijmout vše“** se volá:
  - `gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted' });`
- Od té chvíle se na daném zařízení/prohlížeči odesílají do GA4 stránkové zobrazení (page_view) a další události.
- Při „Pouze nezbytné“ se consent nemění a GA data se neposílají.

### 4. Shrnutí toku

1. Uživatel otevře stránku → načte se gtag s výchozím consentem `denied`.
2. Zobrazí se cookie lišta (pokud ještě nebyl uložen výběr).
3. Po „Přijmout vše“ → uloží se `all`, zavolá se `consent update` → další návštěvy stránek se měří v GA4.
4. Při dalších návštěvách se lišta nezobrazuje a u uloženého `all` se hned volá `consent update`.

---

## Sledování konkrétních stránek a článků

**Ano – v GA4 lze jasně vidět, na které stránce / na jakém článku se lidé nejvíc zastavují.**

- GA4 automaticky měří **zobrazení stránky (page_view)** včetně **adresy stránky (URL)** a **názvu stránky (title)**.
- Každá URL (včetně článků jako `/clanky/jak-si-pozadat-o-recenzi.html`) je v reportech rozlišena.

**Kde to v GA4 najdete:**

1. **Realtime** → **Stránky v reálném čase**  
   Které stránky jsou právě zobrazené.

2. **Reporty** → **Zapojení** → **Stránky a obrazovky** (Pages and screens)  
   Seznam stránek podle:
   - počtu zobrazení,
   - počtu uživatelů,
   - průměrné doby na stránce,
   - odchodů ze stránky (výstupní stránka).

3. **Pro články:**  
   V reportu „Stránky a obrazovky“ filtrujte nebo řaďte podle cesty (např. `/clanky/...`) a uvidíte, který článek má nejvíc zobrazení a na kterém se lidé nejdéle zdrží.

**Poznámka:** Data se započítávají jen u návštěvníků, kteří klikli na „Přijmout vše“ (analytics_storage je pak `granted`). Návštěvníci s „Pouze nezbytné“ nebo bez výběru se v těchto reportech neobjeví.
