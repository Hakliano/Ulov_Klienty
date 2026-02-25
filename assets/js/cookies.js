(function () {
  const COOKIE_CONSENT_KEY = 'ulov_klienty_cookies_consent';
  const OLD_COOKIE_KEY = 'ulov_klienty_cookies_ok';
  const CONSENT_ALL = 'all';
  const CONSENT_NECESSARY = 'necessary';

  const banner = document.getElementById('cc-mini');
  const btnAcceptAll = document.querySelector('[data-cc-accept-all]');
  const btnNecessaryOnly = document.querySelector('[data-cc-necessary-only]');

  if (!banner) return;

  // Migrace: starý souhlas „Rozumím“ = považujeme za „pouze nezbytné“
  if (!localStorage.getItem(COOKIE_CONSENT_KEY) && localStorage.getItem(OLD_COOKIE_KEY) === '1') {
    localStorage.setItem(COOKIE_CONSENT_KEY, CONSENT_NECESSARY);
  }

  // Uživatel už vybral → lištu nezobrazujeme
  const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (saved === CONSENT_ALL || saved === CONSENT_NECESSARY) {
    banner.style.display = 'none';
    if (saved === CONSENT_ALL && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted'
      });
    }
    return;
  }

  banner.style.display = 'block';

  if (btnAcceptAll) {
    btnAcceptAll.addEventListener('click', function () {
      localStorage.setItem(COOKIE_CONSENT_KEY, CONSENT_ALL);
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          ad_storage: 'granted',
          analytics_storage: 'granted'
        });
      }
      banner.style.display = 'none';
    });
  }

  if (btnNecessaryOnly) {
    btnNecessaryOnly.addEventListener('click', function () {
      localStorage.setItem(COOKIE_CONSENT_KEY, CONSENT_NECESSARY);
      // GA zůstane s výchozím consentem (denied) – nic nepovolujeme
      banner.style.display = 'none';
    });
  }
})();
