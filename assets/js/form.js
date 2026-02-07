
(() => {
  const form = document.getElementById("leadForm");
  const status = document.getElementById("formStatus");

  if (!form) return;

  const icoEl = document.getElementById("ico");
  const oborEl = document.getElementById("obor");
  const phoneEl = document.getElementById("phone");
  const spamEl = document.getElementById("spam");
  const msgEl = document.getElementById("msg");
  const emailOptEl = document.getElementById("emailOptional");

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

  function isValidSpam(v) {
    const t = String(v || "").trim();
    return t === "4" || t === "04";
  }

  function buildData() {
    const ico = (icoEl?.value || "").trim();
    const obor = (oborEl?.value || "").trim();
    const phone = normalizePhone(phoneEl?.value || "");
    const spam = (spamEl?.value || "").trim();
    const msg = (msgEl?.value || "").trim();
    const emailOpt = (emailOptEl?.value || "").trim();

    return { ico, obor, phone, spam, msg, emailOpt };
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

    if (!isValidSpam(data.spam)) {
      spamEl?.focus();
      setStatus("Anti-spam odpověď je špatně. Zkuste to znovu (2+2).");
      return false;
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
      _captcha: "false",   // FormSubmit captcha vypnuto (vy už máte 2+2)
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

    const data = buildData();
    if (!validate(data)) return;

    setStatus("Odesílám…", true);

    try {
      await sendViaFormSubmit(data);
      setStatus("Odesláno. Ozveme se co nejdříve.", true);

      form.reset();
      if (spamEl) spamEl.value = "";
    } catch (err) {
      // Nejčastější důvod: neaktivovaný e-mail ve FormSubmit (viz bod níže)
      setStatus(
        "Nepodařilo se odeslat. Pokud je to poprvé, zkontrolujte aktivaci FormSubmit na info@ulovklienty.cz a zkuste to znovu."
      );
    }
  });
})();


