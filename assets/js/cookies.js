(function () {
  const COOKIE_KEY = 'ulov_klienty_cookies_ok';
  const banner = document.getElementById('cc-mini');
  const btn = document.querySelector('[data-cc-ok]');

  if (!banner || !btn) return;

  // pokud už uživatel souhlasil → banner nezobrazíme
  if (localStorage.getItem(COOKIE_KEY) === '1') {
    banner.style.display = 'none';
    return;
  }

  // jinak banner zobrazíme
  banner.style.display = 'block';

  btn.addEventListener('click', function () {
    localStorage.setItem(COOKIE_KEY, '1');
    banner.style.display = 'none';
  });
})();
