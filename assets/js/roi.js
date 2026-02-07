// assets/js/roi.js
(() => {
  "use strict";

  function qs(sel, root = document) {
    return root.querySelector(sel);
  }
  function qsa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function toNumber(val) {
    const n = Number(String(val).replace(",", ".").replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : null;
  }

  function ceilDiv(a, b) {
    if (b <= 0) return null;
    return Math.ceil(a / b);
  }

  function formatInt(n) {
    return new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 }).format(n);
  }

  function updateRoi(avgSpend) {
    const items = qsa("[data-roi-cost]");
    items.forEach((el) => {
      const cost = toNumber(el.getAttribute("data-roi-cost"));
      if (cost == null) return;

      const visits = ceilDiv(cost, avgSpend);
      if (visits == null) return;

      const localOut = el.querySelector("[data-roi-visits]");
      if (localOut) {
        localOut.textContent = formatInt(visits);
      }

      const outId = el.getAttribute("data-roi-out");
      if (outId) {
        const target = document.getElementById(outId);
        if (target) target.textContent = formatInt(visits);
      }
    });

    qsa("[data-roi-spend]").forEach((el) => {
      el.textContent = formatInt(avgSpend);
    });
  }

  function init() {
    const input = qs("#avgSpendPromo");
    if (!input) return;

    let avg = toNumber(input.value) ?? 7000;
    updateRoi(avg);

    const handler = () => {
      const v = toNumber(input.value);
      if (v == null || v <= 0) return;
      avg = v;
      updateRoi(avg);
    };

    input.addEventListener("input", handler);
    input.addEventListener("change", handler);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


