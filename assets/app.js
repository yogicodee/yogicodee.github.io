/* =========================================================
   Yogi Ilham — Portfolio interactions
   Vanilla JS, defensive, respects reduced-motion & touch
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var root = document.documentElement;
  if (reduceMotion) root.classList.add("reduce-motion");

  /* ---------- THEME ---------- */
  (function theme() {
    var stored = null;
    try { stored = localStorage.getItem("theme"); } catch (e) {}
    var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    var initial = stored || (prefersLight ? "light" : "dark");
    root.setAttribute("data-theme", initial);

    function icon(t) { return t === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>'; }
    var btns = document.querySelectorAll("[data-theme-toggle]");
    btns.forEach(function (b) { b.innerHTML = icon(initial); b.setAttribute("aria-label", "Toggle color theme"); });
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) {}
        btns.forEach(function (x) { x.innerHTML = icon(next); });
      });
    });
  })();

  /* ---------- MOBILE MENU ---------- */
  (function mobileMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-menu]");
    var overlay = document.querySelector("[data-menu-overlay]");
    if (!toggle || !menu) return;
    function open() { menu.classList.add("open"); if (overlay) overlay.classList.add("open"); document.body.style.overflow = "hidden"; }
    function close() { menu.classList.remove("open"); if (overlay) overlay.classList.remove("open"); document.body.style.overflow = ""; }
    toggle.addEventListener("click", open);
    if (overlay) overlay.addEventListener("click", close);
    menu.querySelectorAll("a,[data-menu-close]").forEach(function (a) { a.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  })();

  /* ---------- NAV SCROLL + PROGRESS ---------- */
  (function navScroll() {
    var nav = document.querySelector("[data-nav]");
    var progress = document.querySelector("[data-progress]");
    var toTop = document.querySelector("[data-totop]");
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (nav) nav.classList.toggle("scrolled", y > 24);
      if (toTop) toTop.classList.toggle("show", y > 600);
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = "scaleX(" + (h > 0 ? Math.min(y / h, 1) : 0) + ")";
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });
  })();

  /* ---------- SMOOTH ANCHOR SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* ---------- REVEAL ON SCROLL ---------- */
  (function reveal() {
    var els = document.querySelectorAll("[data-reveal],[data-stagger]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- ACTIVE SECTION ---------- */
  (function activeSection() {
    var links = document.querySelectorAll("[data-nav] .nav-links a[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });
    var sections = [];
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) sections.push(s); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          if (map[en.target.id]) map[en.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { io.observe(s); });
  })();

  /* ---------- COUNTERS ---------- */
  (function counters() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var dur = 1400, start = null;
      if (reduceMotion) { el.textContent = target + suffix; return; }
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  })();

  /* ---------- TYPING / ROTATING ROLES ---------- */
  (function typing() {
    var el = document.querySelector("[data-typing]");
    if (!el) return;
    var roles;
    try { roles = JSON.parse(el.getAttribute("data-typing")); } catch (e) { return; }
    if (!roles || !roles.length) return;
    var textNode = el.querySelector(".type-text") || el;
    if (reduceMotion) { textNode.textContent = roles[0]; return; }
    var i = 0, j = 0, deleting = false;
    function tick() {
      var word = roles[i];
      textNode.textContent = word.substring(0, j);
      if (!deleting && j < word.length) { j++; setTimeout(tick, 70); }
      else if (!deleting && j === word.length) { deleting = true; setTimeout(tick, 1500); }
      else if (deleting && j > 0) { j--; setTimeout(tick, 35); }
      else { deleting = false; i = (i + 1) % roles.length; setTimeout(tick, 350); }
    }
    tick();
  })();

  /* ---------- PROJECT FILTER ---------- */
  (function filter() {
    var bar = document.querySelector("[data-filter-bar]");
    if (!bar) return;
    var cards = document.querySelectorAll("[data-cat]");
    bar.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        bar.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var f = btn.getAttribute("data-filter");
        cards.forEach(function (c) {
          var cats = c.getAttribute("data-cat").split(" ");
          var show = f === "all" || cats.indexOf(f) !== -1;
          c.classList.toggle("hide", !show);
        });
      });
    });
  })();

  /* ---------- 3D TILT ---------- */
  (function tilt() {
    if (!canHover || reduceMotion) return;
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(900px) rotateY(" + (px * 7).toFixed(2) + "deg) rotateX(" + (-py * 7).toFixed(2) + "deg) translateY(-6px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  })();

  /* ---------- MAGNETIC BUTTONS ---------- */
  (function magnetic() {
    if (!canHover || reduceMotion) return;
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.3;
        var y = (e.clientY - r.top - r.height / 2) * 0.4;
        btn.style.transform = "translate(" + x + "px," + y + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  })();

  /* ---------- HERO IMAGE PARALLAX TILT ---------- */
  (function heroTilt() {
    if (!canHover || reduceMotion) return;
    var img = document.querySelector("[data-hero-tilt]");
    if (!img) return;
    var wrap = img.closest(".hero-img-wrap") || img;
    wrap.addEventListener("mousemove", function (e) {
      var r = wrap.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      img.style.transform = "rotateY(" + (x * 12).toFixed(2) + "deg) rotateX(" + (-y * 12).toFixed(2) + "deg)";
    });
    wrap.addEventListener("mouseleave", function () { img.style.transform = ""; });
  })();

  /* ---------- MOUSE-FOLLOW GLOW ---------- */
  (function cursorGlow() {
    if (!canHover || reduceMotion) return;
    var glow = document.querySelector("[data-cursor-glow]");
    if (!glow) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    document.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY; glow.classList.add("on");
      if (!raf) raf = requestAnimationFrame(loop);
    });
    function loop() {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      glow.style.transform = "translate(" + cx + "px," + cy + "px)";
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) { raf = requestAnimationFrame(loop); }
      else { raf = null; }
    }
  })();

  /* ---------- TIMELINE PROGRESS ---------- */
  (function timelineProgress() {
    var fill = document.querySelector("[data-tl-fill]");
    var line = fill ? fill.closest(".timeline") : null;
    if (!fill || !line) return;
    function onScroll() {
      var r = line.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = r.height;
      var passed = Math.min(Math.max(vh * 0.6 - r.top, 0), total);
      fill.style.height = (total ? (passed / total) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- CONTACT FORM ---------- */
  (function contactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;
    var btn = form.querySelector(".form-btn");
    var note = form.querySelector(".form-note");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var msg = form.querySelector('[name="message"]');
      function invalid(f) { return !f || !f.value.trim(); }
      var emailOk = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (invalid(name) || invalid(msg) || !emailOk) {
        showNote("Please fill in all fields with a valid email.", "err");
        return;
      }
      if (btn) btn.classList.add("loading");
      setTimeout(function () {
        if (btn) btn.classList.remove("loading");
        showNote("Message ready — opening your email app…", "ok");
        var subject = encodeURIComponent("Portfolio contact from " + name.value.trim());
        var body = encodeURIComponent(msg.value.trim() + "\n\n— " + name.value.trim() + " (" + email.value.trim() + ")");
        window.location.href = "mailto:yogiilham003@gmail.com?subject=" + subject + "&body=" + body;
        form.reset();
      }, 1200);
    });
    function showNote(text, type) {
      if (!note) return;
      note.textContent = text;
      note.className = "form-note show " + type;
      clearTimeout(showNote._t);
      showNote._t = setTimeout(function () { note.classList.remove("show"); }, 5000);
    }
  })();

  /* ---------- LIGHTBOX (case studies) ---------- */
  (function lightbox() {
    var box = document.querySelector("[data-lightbox]");
    if (!box) return;
    var img = box.querySelector("img");
    document.querySelectorAll("[data-zoom]").forEach(function (el) {
      el.addEventListener("click", function () {
        img.src = el.getAttribute("src");
        box.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    function close() { box.classList.remove("open"); document.body.style.overflow = ""; }
    box.addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  })();

})();
