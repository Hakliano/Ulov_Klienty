/**
 * Formulář landing page (pro-poradce): validace, odeslání přes FormSubmit, redirect, GA4 + scroll depth.
 */
(function () {
  var form = document.getElementById('lpForm');
  var statusEl = document.getElementById('lpFormStatus');
  var REDIRECT_URL = 'https://ulovklienty.cz/dekujeme.html';

  if (!form) return;

  function setStatus(text, isOk) {
    if (!statusEl) return;
    statusEl.textContent = text || '';
    statusEl.style.color = isOk ? 'var(--gold)' : '#f87171';
  }

  function trim(s) {
    return (s || '').toString().trim();
  }

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trim(v));
  }

  function sendGAEvent(name, params) {
    if (typeof gtag !== 'function') return;
    gtag('event', name, params || {});
  }

  // Scroll depth: 25, 50, 75, 100 %
  (function initScrollDepth() {
    var milestones = [25, 50, 75, 100];
    var sent = {};
    function check() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (h <= 0) return;
      var pct = Math.round((window.scrollY / h) * 100);
      milestones.forEach(function (m) {
        if (pct >= m && !sent[m]) {
          sent[m] = true;
          sendGAEvent('scroll_depth', { value: m, percent: m });
        }
      });
    }
    window.addEventListener('scroll', function () {
      requestAnimationFrame(check);
    }, { passive: true });
    check();
  })();

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = trim(form.querySelector('[name="name"]').value);
    var email = trim(form.querySelector('[name="email"]').value);
    var phone = trim(form.querySelector('[name="phone"]').value);
    var message = trim(form.querySelector('[name="message"]').value);

    setStatus('');

    if (name.length < 2) {
      setStatus('Zadejte prosím jméno.');
      form.querySelector('[name="name"]').focus();
      return;
    }
    if (!validateEmail(email)) {
      setStatus('Zadejte platný e-mail.');
      form.querySelector('[name="email"]').focus();
      return;
    }

    setStatus('Odesílám…', true);

    var payload = {
      _subject: 'Konzultace – landing pro poradce (ULOV KLIENTY)',
      _template: 'table',
      _captcha: 'false',
      name: name,
      email: email,
      phone: phone || '',
      message: message || ''
    };

    fetch('https://formsubmit.co/ajax/info@ulovklienty.cz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Odeslání se nezdařilo.');
        return res.json();
      })
      .then(function () {
        sendGAEvent('form_submit', { form_id: 'lp_poradci', form_name: 'Konzultace zdarma' });
        window.location.href = REDIRECT_URL;
      })
      .catch(function () {
        setStatus('Nepodařilo se odeslat. Zkuste to prosím znovu nebo nám zavolejte na +420 719 756 746.');
      });
  });
})();
