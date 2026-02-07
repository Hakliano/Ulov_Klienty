// assets/js/opening-sale.js
(() => {
  "use strict";

  const STORAGE_KEY = "ulov_opening_sale_dismissed_v1";
  const DEFAULT_TTL_DAYS = 7;

  function nowMs() {
    return Date.now();
  }

  function daysToMs(days) {
    return days * 24 * 60 * 60 * 1000;
  }

  function setDismissed(ttlDays = DEFAULT_TTL_DAYS) {
    const payload = {
      dismissedAt: nowMs(),
      expiresAt: nowMs() + daysToMs(ttlDays),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // když je storage blokované, nic se neděje (popup se pak zobrazí vždy)
    }
  }

  function isDismissed() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data || !data.expiresAt) return false;
      return nowMs() < Number(data.expiresAt);
    } catch (e) {
      return false;
    }
  }

  function qs(sel, root = document) {
    return root.querySelector(sel);
  }

  function openPopup(popupEl) {
    popupEl.classList.add("is-open");
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");

    // fokus na zavírací tlačítko (lepší UX)
    const closeBtn = qs("[data-sale-close]", popupEl);
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }

  function closePopup(popupEl, remember = true) {
    popupEl.classList.remove("is-open");
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");

    if (remember) setDismissed();
  }

  function init() {
    const popup = qs("#sale-popup");
    if (!popup) return;

    const closeBtn = qs("[data-sale-close]", popup);
    const backdrop = qs(".sale-popup__backdrop", popup);

    // pokud už bylo zavřeno v posledních X dnech, neotvírat
    if (!isDismissed()) {
      openPopup(popup);
    }

    // zavření: tlačítko
    if (closeBtn) {
      closeBtn.addEventListener("click", () => closePopup(popup, true));
    }

    // zavření: klik mimo (backdrop)
    if (backdrop) {
      backdrop.addEventListener("click", () => closePopup(popup, true));
    }

    // zavření: ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && popup.classList.contains("is-open")) {
        closePopup(popup, true);
      }
    });

    // CTA tlačítko "pokračovat" může taky zavřít popup (když budete chtít)
    const cta = qs("[data-sale-cta]", popup);
    if (cta) {
      cta.addEventListener("click", () => closePopup(popup, true));
    }
  }

  // Start
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
