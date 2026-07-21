/* =========================================================
   Yogi Ilham — Animation Pack (runtime)
   Defensive: every module no-ops when its elements are absent.
   Disabled automatically for reduced-motion / touch where relevant.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var root = document.documentElement;

  /* ---------- PRELOADER ---------- */
  (function preloader() {
    var pl = document.querySelector("[data-preloader]");
    if (!pl) return;
    if (reduceMotion) { pl.remove(); return; }
    function done() { pl.classList.add("pl-done"); }
    if (document.readyState === "complete") done();
    else window.addEventListener("load", done);
    // hard safety net: never let the preloader block the page
    setTimeout(function () { if (pl.parentNode) pl.remove(); }, 3000);
  })();

  /* ---------- PAGE TRANSITION (internal links) ---------- */
  (function pageTransition() {
    if (reduceMotion) return;
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a");
      if (!a) return;
      var href = a.getAttribute("href") || "";
      if (!href || href.charAt(0) === "#") return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      if (/^(mailto:|tel:|javascript:)/i.test(href)) return;
      if (a.origin && a.origin !== location.origin) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      root.classList.add("page-leaving");
      setTimeout(function () { location.href = a.href; }, 280);
    });
    // restore if user comes back via bfcache
    window.addEventListener("pageshow", function () { root.classList.remove("page-leaving"); });
  })();

  /* ---------- CURSOR RING ---------- */
  (function cursorRing() {
    if (!canHover || reduceMotion) return;
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(ring);
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    document.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      ring.classList.add("on");
      if (!raf) raf = requestAnimationFrame(loop);
    });
    document.addEventListener("mouseleave", function () { ring.classList.remove("on"); });
    function loop() {
      cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
      ring.style.transform = "translate(" + cx + "px," + cy + "px)";
      if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) raf = requestAnimationFrame(loop);
      else raf = null;
    }
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest && e.target.closest("a,button,.pcard,.chip,input,textarea")) ring.classList.add("grow");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest && e.target.closest("a,button,.pcard,.chip,input,textarea")) ring.classList.remove("grow");
    });
  })();

  /* ---------- CARD SPOTLIGHT ---------- */
  (function spotlight() {
    if (!canHover || reduceMotion) return;
    var sel = ".pcard,.edu-card,.stat,.tl-card,.cs-metric,.achv";
    document.querySelectorAll(sel).forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  })();

  /* ---------- RIPPLE ---------- */
  (function ripple() {
    if (reduceMotion) return;
    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest(".btn,.filter-btn,.pcard-link,.theme-toggle,.to-top");
      if (!btn) return;
      var r = btn.getBoundingClientRect();
      var size = Math.max(r.width, r.height);
      var span = document.createElement("span");
      span.className = "ripple";
      span.style.width = span.style.height = size + "px";
      span.style.left = (e.clientX - r.left - size / 2) + "px";
      span.style.top = (e.clientY - r.top - size / 2) + "px";
      if (getComputedStyle(btn).position === "static") btn.style.position = "relative";
      btn.style.overflow = "hidden";
      btn.appendChild(span);
      setTimeout(function () { span.remove(); }, 700);
    });
  })();

  /* ---------- SCROLL PROGRESS VAR (back-to-top ring) ---------- */
  (function scrollVar() {
    function onScroll() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min((window.scrollY || window.pageYOffset) / h, 1) : 0;
      root.style.setProperty("--scrollp", p.toFixed(4));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- PARALLAX (about image + hero orb) ---------- */
  (function parallax() {
    if (reduceMotion) return;
    var items = [];
    // NOTE: only elements without a CSS animation on `transform` may be used here,
    // because CSS animations outrank inline styles in the cascade.
    var about = document.querySelector(".about-visual img");
    if (about) items.push({ el: about, speed: 0.06, max: 20, scale: 1.08 });
    if (!items.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      items.forEach(function (it) {
        var r = it.el.getBoundingClientRect();
        var centerOffset = (r.top + r.height / 2) - vh / 2;
        var y = Math.max(-it.max, Math.min(it.max, -centerOffset * it.speed));
        it.el.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)" +
          (it.scale !== 1 ? " scale(" + it.scale + ")" : "");
      });
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();

  /* ---------- TIMELINE ITEM ACTIVE ---------- */
  (function timelineActive() {
    var items = document.querySelectorAll(".tl-item");
    if (!items.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle("active", en.isIntersecting); });
    }, { rootMargin: "-35% 0px -35% 0px" });
    items.forEach(function (i) { io.observe(i); });
  })();

  /* ---------- FOOTER REVEAL ---------- */
  (function footerReveal() {
    var f = document.querySelector(".site-footer");
    if (!f) return;
    if (!("IntersectionObserver" in window)) { f.classList.add("in-view"); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { f.classList.add("in-view"); io.disconnect(); }
      });
    }, { threshold: 0.15 });
    io.observe(f);
  })();

  /* ---------- HERO PARTICLES ---------- */
  (function particles() {
    if (reduceMotion || !canHover) return;
    var hero = document.querySelector(".hero");
    if (!hero) return;
    for (var i = 0; i < 14; i++) {
      var p = document.createElement("span");
      p.className = "particle";
      var size = 3 + Math.random() * 5;
      p.style.width = p.style.height = size.toFixed(1) + "px";
      p.style.left = (Math.random() * 100).toFixed(2) + "%";
      p.style.top = (55 + Math.random() * 45).toFixed(2) + "%";
      p.style.animationDuration = (7 + Math.random() * 8).toFixed(1) + "s";
      p.style.animationDelay = (Math.random() * 8).toFixed(1) + "s";
      hero.appendChild(p);
    }
  })();

  /* ---------- THEME TOGGLE SPIN ---------- */
  (function themeSpin() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        b.classList.remove("spin");
        void b.offsetWidth;
        b.classList.add("spin");
      });
    });
  })();

  /* ---------- CONFETTI ON FORM SUCCESS ---------- */
  (function confetti() {
    var form = document.querySelector("[data-contact-form]");
    if (!form || reduceMotion) return;
    var btn = form.querySelector(".form-btn");
    if (!btn) return;
    var colors = ["#f5a623", "#ff7a18", "#ffd15c", "#3ddc84", "#7cc7ff"];
    // observe the button's loading class flipping off -> success moment
    var observer = new MutationObserver(function () {
      if (!btn.classList.contains("loading") && btn.dataset.wasLoading === "1") {
        btn.dataset.wasLoading = "0";
        burst();
        btn.classList.add("ok");
        setTimeout(function () { btn.classList.remove("ok"); }, 2500);
      }
      if (btn.classList.contains("loading")) btn.dataset.wasLoading = "1";
    });
    observer.observe(btn, { attributes: true, attributeFilter: ["class"] });

    function burst() {
      var r = btn.getBoundingClientRect();
      var ox = r.left + r.width / 2, oy = r.top + r.height / 2;
      for (var i = 0; i < 22; i++) {
        var c = document.createElement("span");
        c.className = "confetti";
        c.style.left = ox + "px";
        c.style.top = oy + "px";
        c.style.background = colors[i % colors.length];
        c.style.setProperty("--dx", ((Math.random() - 0.5) * 320).toFixed(0) + "px");
        c.style.setProperty("--dy", (-120 - Math.random() * 220).toFixed(0) + "px");
        c.style.setProperty("--rot", (Math.random() * 720 - 360).toFixed(0) + "deg");
        c.style.animationDelay = (Math.random() * 0.12).toFixed(2) + "s";
        document.body.appendChild(c);
        (function (el) { setTimeout(function () { el.remove(); }, 1800); })(c);
      }
    }
  })();

})();
