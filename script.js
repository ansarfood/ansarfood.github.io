/* ===== ANSARFOOD landing — interactions ===== */
(function () {
  "use strict";

  var WA_PHONE = "996703512044"; // ANSARFOOD WhatsApp

  /* Кээ бир браузерлер unicode-range боюнча кириллица сабсетин жалкоо
     жүктөйт. Ошондуктан керектүү начертанияларды мажбурлап жүктөйбүз. */
  if (document.fonts && document.fonts.load) {
    var sample = "Франшиза ӨҢҮ өңү 0123";
    var faces = [
      ["Geologica", [300, 400, 500, 600, 700, 800, 900]],
      ["Comfortaa", [500, 600, 700]]
    ];
    faces.forEach(function (f) {
      f[1].forEach(function (w) {
        try { document.fonts.load(w + " 16px " + f[0], sample); } catch (e) {}
      });
    });
  }

  /* Year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Sticky header + FAB */
  var header = document.getElementById("siteHeader");
  var fab = document.querySelector(".fab");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 40);
    if (fab) fab.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", function () { nav.classList.toggle("open"); });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("open");
    });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en, i) {
          if (en.isIntersecting) {
            var el = en.target;
            setTimeout(function () { el.classList.add("in"); }, (i % 4) * 70);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ===== Profit calculator ===== */
  var revenue = document.getElementById("revenue");
  var expenses = document.getElementById("expenses");
  var royaltyOut = document.getElementById("royaltyOut");
  var profitOut = document.getElementById("profitOut");
  var ROYALTY = 0.08;

  var fmt = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
  function money(n) { return fmt.format(Math.round(n)) + " сом"; }

  function calc() {
    if (!revenue || !expenses) return;
    var rev = parseFloat(revenue.value) || 0;
    var exp = parseFloat(expenses.value) || 0;
    var royalty = rev * ROYALTY;
    var profit = rev - exp - royalty;
    if (royaltyOut) royaltyOut.textContent = money(royalty);
    if (profitOut) {
      profitOut.textContent = money(profit);
      profitOut.style.color = profit < 0 ? "#d64545" : "";
    }
  }
  if (revenue) revenue.addEventListener("input", calc);
  if (expenses) expenses.addEventListener("input", calc);
  calc();

  /* Prefill focus when coming from calculator */
  document.querySelectorAll('[data-prefill="calc"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      var city = document.getElementById("city");
      if (city && !city.value) setTimeout(function () { city.focus(); }, 600);
    });
  });

  /* ===== Lead form -> WhatsApp ===== */
  var form = document.getElementById("leadForm");
  var success = document.getElementById("formSuccess");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name");
      var phone = form.querySelector("#phone");
      var ok = true;
      [name, phone].forEach(function (f) {
        if (!f.value.trim()) { f.classList.add("invalid"); ok = false; }
        else { f.classList.remove("invalid"); }
      });
      if (!ok) return;

      var city = (form.querySelector("#city") || {}).value || "—";
      var format = (form.querySelector("#format") || {}).value || "—";

      var msg =
        "🔥 ANSARFOOD франшизасы — жаңы заявка\n\n" +
        "👤 Аты: " + name.value.trim() + "\n" +
        "📞 Телефон: " + phone.value.trim() + "\n" +
        "🏙 Шаар: " + city + "\n" +
        "🍔 Формат: " + format;

      var url = "https://wa.me/" + WA_PHONE + "?text=" + encodeURIComponent(msg);
      window.open(url, "_blank");

      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    form.querySelectorAll("input").forEach(function (inp) {
      inp.addEventListener("input", function () { inp.classList.remove("invalid"); });
    });
  }

  /* Phone soft filter */
  var phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      phoneInput.value = phoneInput.value.replace(/[^\d+ ]/g, "");
    });
  }
})();
