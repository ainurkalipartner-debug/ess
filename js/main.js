/* =====================================================================
   ЭлектроСтройСервис (ЭСС) — interactions
   Language toggle (RU/KK) · animated counters · scroll reveal ·
   sticky header · mobile nav · project filters · form · back-to-top
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- WhatsApp links (context + language aware) ---------- */
  // Pre-filled greeting messages per context and language.
  var WA_MSG = {
    ru: {
      general: "Здравствуйте! Пишу по вопросу услуг компании ЭлектроСтройСервис.",
      emergency: "Здравствуйте! Обращаюсь по вопросу аварийного восстановления электроснабжения (24/7).",
      equipment: "Здравствуйте! Интересует аренда спецтехники (автовышка, экскаватор, автокран, трактор)."
    },
    kk: {
      general: "Сәлеметсіз бе! ЭлектроСтройСервис компаниясының қызметтері бойынша жазып отырмын.",
      emergency: "Сәлеметсіз бе! Электрмен жабдықтауды авариялық қалпына келтіру мәселесі бойынша жүгінемін (24/7).",
      equipment: "Сәлеметсіз бе! Арнайы техниканы жалға алу қызықтырады (автомұнара, экскаватор, автокран, трактор)."
    }
  };
  function buildWhatsApp(lang) {
    var msgs = WA_MSG[lang === "kk" ? "kk" : "ru"];
    document.querySelectorAll("a.wa").forEach(function (a) {
      var phone = a.getAttribute("data-phone");
      var ctx = a.getAttribute("data-ctx") || "general";
      if (!phone) return;
      var text = msgs[ctx] || msgs.general;
      a.setAttribute("href", "https://wa.me/" + phone + "?text=" + encodeURIComponent(text));
    });
  }

  /* ---------- Language toggle (RU / KK) ---------- */
  var STORE_KEY = "ess_lang";
  function applyLang(lang) {
    document.documentElement.lang = lang === "kk" ? "kk" : "ru";
    var attr = lang === "kk" ? "data-kk" : "data-ru";
    buildWhatsApp(lang);

    // text content
    document.querySelectorAll("[data-ru]").forEach(function (el) {
      var val = el.getAttribute(attr);
      if (val !== null) el.innerHTML = val;
    });
    // placeholders
    document.querySelectorAll("[data-ru-ph]").forEach(function (el) {
      var phAttr = lang === "kk" ? "data-kk-ph" : "data-ru-ph";
      var val = el.getAttribute(phAttr);
      if (val !== null) el.setAttribute("placeholder", val);
    });
    // toggle button state
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
  }

  document.querySelectorAll(".lang-switch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(btn.getAttribute("data-lang"));
    });
  });

  var saved = "ru";
  try { saved = localStorage.getItem(STORE_KEY) || "ru"; } catch (e) {}
  applyLang(saved);

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById("header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
    var tt = document.getElementById("toTop");
    if (tt) tt.classList.toggle("show", window.scrollY > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var burger = document.getElementById("burger");
  var panel = document.getElementById("mobilePanel");
  var mpClose = document.getElementById("mpClose");
  function openPanel() { panel.classList.add("open"); document.body.classList.add("body-lock"); }
  function closePanel() { panel.classList.remove("open"); document.body.classList.remove("body-lock"); }
  if (burger) burger.addEventListener("click", openPanel);
  if (mpClose) mpClose.addEventListener("click", closePanel);
  if (panel) panel.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closePanel); });

  /* ---------- Smooth scroll with header offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-target")) || 0;
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("ru-RU");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll(".count");
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Project filters ---------- */
  var filterWrap = document.getElementById("projFilters");
  if (filterWrap) {
    filterWrap.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      filterWrap.querySelectorAll("button").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      document.querySelectorAll(".proj-card").forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-cat") === f;
        card.style.display = show ? "" : "none";
      });
    });
  }

  /* ---------- Lead form (demo handler) ---------- */
  var form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var ok = document.getElementById("formSuccess");
      if (ok) ok.classList.add("show");
      form.reset();
      setTimeout(function () { if (ok) ok.classList.remove("show"); }, 6000);
      // In production: POST form data to your backend / CRM endpoint here.
    });
  }

  /* ---------- Footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
