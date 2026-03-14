
(() => {
  const form = document.getElementById("leadForm");
  const status = document.getElementById("formStatus");

  if (!form) return;

  const icoEl = document.getElementById("ico");
  const oborEl = document.getElementById("obor");
  const phoneEl = document.getElementById("phone");
  const msgEl = document.getElementById("msg");
  const emailOptEl = document.getElementById("emailOptional");

  const STORAGE_PREFIX = "leadForm_";
  const lockHours = parseInt(form.getAttribute("data-captcha-lock-hours"), 10) || 4;
  const maxAttempts = 3;
  let currentCaptchaAnswer = null;
  let captchaOptions = [];

  function getStored(key) {
    try {
      const v = localStorage.getItem(STORAGE_PREFIX + key);
      return v === null ? null : JSON.parse(v);
    } catch (e) { return null; }
  }
  function setStored(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {}
  }

  function isLocked() {
    const until = getStored("lockedUntil");
    if (!until) return false;
    if (Date.now() < until) return true;
    setStored("lockedUntil", null);
    setStored("attempts", 0);
    return false;
  }

  function lockForm() {
    form.classList.add("is-locked");
    setStatus("Kvůli opakovanému špatnému zadání je formulář dočasně uzavřen. Zkuste to prosím za " + lockHours + " hodin, nebo napište na info@ulovklienty.cz.");
  }

  function pickNewCaptcha(avoidAnswer) {
    if (captchaOptions.length === 0) return;
    let pool = captchaOptions;
    if (avoidAnswer != null && captchaOptions.length > 1) {
      pool = captchaOptions.filter((o) => String(o.answer) !== String(avoidAnswer));
    }
    if (pool.length === 0) pool = captchaOptions;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    currentCaptchaAnswer = String(picked.answer);
    const img = form.querySelector("#leadCaptchaImg");
    if (img && picked.img) img.src = picked.img;
    const captchaInput = form.querySelector("#leadCaptcha");
    if (captchaInput) {
      captchaInput.value = "";
      captchaInput.focus();
    }
  }

  (function initCaptcha() {
    const optionsJson = form.getAttribute("data-captcha-options");
    if (optionsJson) {
      try {
        const options = JSON.parse(optionsJson);
        if (options && options.length > 0) {
          captchaOptions = options;
          pickNewCaptcha(null);
        }
      } catch (e) {}
    }
  })();
  const hasCaptcha = captchaOptions.length > 0;

  if (hasCaptcha && isLocked()) {
    form.classList.add("is-locked");
    setStatus("Formulář je dočasně uzavřen (ochrana proti robotům). Zkuste to za " + lockHours + " h, nebo napište na info@ulovklienty.cz.");
  }

  function setStatus(text, ok = false) {
    if (!status) return;
    status.textContent = text || "";
    status.style.color = ok ? "var(--gold)" : "tomato";
  }

  function normalizeDigits(s) {
    return (s || "").toString().replace(/\D/g, "");
  }

  function normalizePhone(v) {
    return (v || "").trim().replace(/\s+/g, " ");
  }

  function isValidICO(v) {
    return /^[0-9]{8}$/.test((v || "").trim());
  }

  function buildData() {
    const ico = (icoEl?.value || "").trim();
    const obor = (oborEl?.value || "").trim();
    const phone = normalizePhone(phoneEl?.value || "");
    const msg = (msgEl?.value || "").trim();
    const emailOpt = (emailOptEl?.value || "").trim();

    return { ico, obor, phone, msg, emailOpt };
  }

  function validate(data) {
    setStatus("");

    if (!data.obor) {
      oborEl?.focus();
      setStatus("Vyberte prosím obor.");
      return false;
    }

    // IČO je volitelné; pokud je vyplněné, musí mít 8 číslic
    if (data.ico && !isValidICO(data.ico)) {
      icoEl?.focus();
      setStatus("Zkontrolujte IČO – musí mít přesně 8 číslic.");
      return false;
    }

    const phoneDigits = normalizeDigits(data.phone);
    if (phoneDigits.length < 9) {
      phoneEl?.focus();
      setStatus("Zkontrolujte telefon – vypadá příliš krátce.");
      return false;
    }

    if (hasCaptcha) {
      const captchaInput = form.querySelector("#leadCaptcha");
      const userAnswer = (captchaInput?.value || "").trim();
      if (userAnswer !== currentCaptchaAnswer) {
        const attempts = (getStored("attempts") || 0) + 1;
        setStored("attempts", attempts);
        if (attempts >= maxAttempts) {
          setStored("lockedUntil", Date.now() + lockHours * 60 * 60 * 1000);
          lockForm();
          return false;
        }
        pickNewCaptcha(currentCaptchaAnswer);
        const left = maxAttempts - attempts;
        setStatus("Špatné číslo. Zbývají vám " + left + " " + (left === 1 ? "pokus" : left < 5 ? "pokusy" : "pokusů") + ".");
        return false;
      }
      setStored("attempts", 0);
    }

    if (data.msg.length < 5) {
      msgEl?.focus();
      setStatus("Napište prosím krátkou zprávu (alespoň pár slov).");
      return false;
    }

    return true;
  }

  // ===== FormSubmit: posílá rovnou na info@ulovklienty.cz =====
  async function sendViaFormSubmit(data) {
    // POZOR:
    // 1) FormSubmit vyžaduje jednorázové potvrzení e-mailu (aktivaci).
    // 2) Endpoint s /ajax umožní fetch a hezké hlášky bez přesměrování.
    const endpoint = "https://formsubmit.co/ajax/info@ulovklienty.cz";

    const payload = {
      _subject: "Nová poptávka – ULOV KLIENTY",
      _template: "table",
      _captcha: "false",   // FormSubmit captcha vypnuto (máme vlastní obrázkovou CAPTCHA)
      obor: data.obor || "",
      ico: data.ico || "",
      phone: data.phone,
      email: data.emailOpt || "",
      message: data.msg,
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt || "Odeslání se nezdařilo.");
    }

    return res.json().catch(() => ({}));
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (hasCaptcha && form.classList.contains("is-locked")) return;

    const data = buildData();
    if (!validate(data)) return;

    setStatus("Odesílám…", true);

    try {
      await sendViaFormSubmit(data);
      window.location.href = "dekujeme.html";
    } catch (err) {
      // Nejčastější důvod: neaktivovaný e-mail ve FormSubmit (viz bod níže)
      setStatus(
        "Nepodařilo se odeslat. Pokud je to poprvé, zkontrolujte aktivaci FormSubmit na info@ulovklienty.cz a zkuste to znovu."
      );
    }
  });
})();


