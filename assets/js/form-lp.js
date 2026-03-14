/**
 * Formulář landing page (pro-poradce / web-poradce): validace, captcha, lockout, FormSubmit, GA4 + scroll depth.
 */
(function () {
  var form = document.getElementById('lpForm');
  var statusEl = document.getElementById('lpFormStatus');
  var REDIRECT_URL = 'https://ulovklienty.cz/dekujeme.html';
  var STORAGE_PREFIX = 'lpWeb_';

  if (!form) return;

  var lockHours = parseInt(form.getAttribute('data-captcha-lock-hours'), 10) || 4;
  var maxAttempts = 3;
  var currentCaptchaAnswer = null;
  var captchaOptions = [];

  function pickNewCaptcha(avoidAnswer) {
    if (captchaOptions.length === 0) return;
    var pool = captchaOptions;
    if (avoidAnswer != null && captchaOptions.length > 1) {
      pool = captchaOptions.filter(function (o) { return String(o.answer) !== String(avoidAnswer); });
    }
    if (pool.length === 0) pool = captchaOptions;
    var picked = pool[Math.floor(Math.random() * pool.length)];
    currentCaptchaAnswer = String(picked.answer);
    var img = form.querySelector('#lpCaptchaImg');
    if (img && picked.img) {
      img.src = picked.img;
    }
    var captchaInput = form.querySelector('#lp-captcha');
    if (captchaInput) {
      captchaInput.value = '';
      captchaInput.focus();
    }
  }

  (function initCaptcha() {
    var optionsJson = form.getAttribute('data-captcha-options');
    var singleAnswer = form.getAttribute('data-captcha-answer');
    if (optionsJson) {
      try {
        var options = JSON.parse(optionsJson);
        if (options && options.length > 0) {
          captchaOptions = options;
          pickNewCaptcha(null);
          return;
        }
      } catch (e) {}
    }
    if (singleAnswer) {
      currentCaptchaAnswer = String(singleAnswer);
    }
  })();
  var hasCaptcha = currentCaptchaAnswer !== null;

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

  function getStored(key) {
    try {
      var v = localStorage.getItem(STORAGE_PREFIX + key);
      return v === null ? null : JSON.parse(v);
    } catch (e) { return null; }
  }
  function setStored(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {}
  }

  function isLocked() {
    var until = getStored('lockedUntil');
    if (!until) return false;
    if (Date.now() < until) return true;
    setStored('lockedUntil', null);
    setStored('attempts', 0);
    return false;
  }

  function lockForm() {
    form.classList.add('is-locked');
    var msg = 'Kvůli opakovanému špatnému zadání je formulář dočasně uzavřen. Zkuste to prosím za ' + lockHours + ' hodin, nebo napište na info@ulovklienty.cz.';
    setStatus(msg);
    if (statusEl) statusEl.style.color = '#f87171';
  }

  if (hasCaptcha) {
    if (isLocked()) {
      form.classList.add('is-locked');
      setStatus('Formulář je dočasně uzavřen (ochrana proti robotům). Zkuste to za ' + lockHours + ' h, nebo napište na info@ulovklienty.cz.');
    }
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

    if (hasCaptcha && form.classList.contains('is-locked')) return;

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

    if (hasCaptcha) {
      var captchaInput = form.querySelector('#lp-captcha');
      var userAnswer = captchaInput ? trim(captchaInput.value) : '';
      if (userAnswer !== currentCaptchaAnswer) {
        var attempts = (getStored('attempts') || 0) + 1;
        setStored('attempts', attempts);
        if (attempts >= maxAttempts) {
          setStored('lockedUntil', Date.now() + lockHours * 60 * 60 * 1000);
          lockForm();
          return;
        }
        pickNewCaptcha(currentCaptchaAnswer);
        var left = maxAttempts - attempts;
        setStatus('Špatné číslo. Zbývají vám ' + left + ' ' + (left === 1 ? 'pokus' : left < 5 ? 'pokusy' : 'pokusů') + '.');
        return;
      }
      setStored('attempts', 0);
    }

    setStatus('Odesílám…', true);

    var subject = form.getAttribute('data-subject') || 'Konzultace – landing pro poradce (ULOV KLIENTY)';
    var payload = {
      _subject: subject,
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
