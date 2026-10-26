/* PADELUNKA – obecné chování webu: úvodní trojice, fotky, kontakty, pravidla, video. */
(function () {
  "use strict";
  var cfg = window.PADELUNKA || {};
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function picture(f, sizes) {
    var srcset = f.srcMale ? esc(f.srcMale) + " 900w, " + esc(f.src) + " 1600w" : "";
    return '<img src="' + esc(f.src) + '"' + (srcset ? ' srcset="' + srcset + '" sizes="' + sizes + '"' : "") +
      ' alt="' + esc(f.popis || "") + '" loading="lazy" decoding="async" style="object-position:' + esc(f.ohnisko || "50% 50%") + '">';
  }

  /* ---------- česká typografie: jednopísmenné předložky a spojky nezůstanou na konci řádku ---------- */
  (function nbsp(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, re = /(^|[\s(„])([kKsSvVzZoOuUiIaA])\s+/g;
    while ((n = w.nextNode())) {
      if (n.parentNode && /^(SCRIPT|STYLE|text)$/.test(n.parentNode.nodeName)) continue;
      if (re.test(n.nodeValue)) { re.lastIndex = 0; n.nodeValue = n.nodeValue.replace(re, "$1$2\u00a0"); }
      re.lastIndex = 0;
    }
  })(document.body);

  /* ---------- úvodní trojice (AB → BC → CA) ---------- */
  var PAIRS = ["AB", "BC", "CA"], pos = { A: [110, 290], B: [310, 290], C: [210, 115] };
  var k = 0, ball = $(".trio__ball"), t0 = null, trioTimer;
  function trioSet(i) {
    var p = PAIRS[i], rest = "ABC".replace(p[0], "").replace(p[1], "");
    document.querySelectorAll(".trio__edges line").forEach(function (l) { l.classList.toggle("on", l.dataset.e === p); });
    document.querySelectorAll(".trio__node").forEach(function (n) { n.classList.toggle("rest", n.dataset.p === rest); });
    var a = $("#trio-pair"), b = $("#trio-rest");
    if (a) a.textContent = p[0] + " + " + p[1];
    if (b) b.textContent = rest;
  }
  function ballLoop(ts) {
    if (!ball) return;
    if (t0 === null) t0 = ts;
    var p = PAIRS[k], a = pos[p[0]], b = pos[p[1]];
    var u = ((ts - t0) % 1400) / 1400, s = u < .5 ? u * 2 : 2 - u * 2; // tam a zpět
    var x = a[0] + (b[0] - a[0]) * s, y = a[1] + (b[1] - a[1]) * s - Math.sin(s * Math.PI) * 46;
    ball.setAttribute("cx", x.toFixed(1)); ball.setAttribute("cy", y.toFixed(1));
    requestAnimationFrame(ballLoop);
  }
  if ($(".trio")) {
    trioSet(0);
    if (!reduce) {
      requestAnimationFrame(ballLoop);
      trioTimer = setInterval(function () { k = (k + 1) % 3; trioSet(k); }, 2800);
    } else if (ball) { ball.setAttribute("cx", 210); ball.setAttribute("cy", 262); }
  }

  /* ---------- úvodní fotka ---------- */
  if (cfg.uvodniFoto && cfg.uvodniFoto.src) {
    var m = $("#hero-media");
    if (m) {
      clearInterval(trioTimer);
      m.innerHTML = '<div class="hero__photo">' + picture(cfg.uvodniFoto, "(max-width: 960px) 100vw, 46vw").replace(' loading="lazy"', ' fetchpriority="high"') +
        '<span class="hero__photo-tag mono">První pilot · Padel Klatovy · 24. 10. 2026</span></div>';
    }
  }

  /* ---------- fotky z pilotu ---------- */
  var g = $("#gallery");
  if (g && Array.isArray(cfg.fotkyPilot) && cfg.fotkyPilot.length) {
    g.innerHTML = cfg.fotkyPilot.map(function (f) {
      return "<figure>" + picture(f, "(max-width: 640px) 100vw, 58vw") + (f.popisek ? "<figcaption>" + esc(f.popisek) + "</figcaption>" : "") + "</figure>";
    }).join("");
    g.hidden = false;
  }

  /* ---------- kontakty ---------- */
  var mail = (cfg.kontaktEmail || "").trim(), tel = (cfg.kontaktTelefon || "").trim();
  var telHref = "tel:" + tel.replace(/[^\d+]/g, "");
  document.querySelectorAll(".contact").forEach(function (c) {
    if (!mail && !tel) {
      c.innerHTML = '<p class="contact__todo">Kontakt doplníme v nejbližších dnech</p>';
      return;
    }
    var onRed = !!c.closest(".band--red"), html = '<div class="contact__btns">';
    if (mail) {
      var href = "mailto:" + mail + "?subject=" + encodeURIComponent(c.dataset.predmet || "PADELUNKA") + "&body=" + encodeURIComponent((c.dataset.text || "").replace(/%0A/g, "\n"));
      html += '<a class="btn ' + (onRed ? "btn--ink" : "btn--red") + '" href="' + esc(href) + '">Napsat e-mail</a>';
    }
    if (tel) html += '<a class="btn btn--line" href="' + esc(telHref) + '">Zavolat</a>';
    html += "</div>";
    if (mail) html += '<div class="contact__row"><span class="contact__mail">' + esc(mail) + '</span><button type="button" class="contact__copy">Kopírovat e-mail</button></div>';
    if (tel) html += '<div class="contact__row"><a class="contact__tel" href="' + esc(telHref) + '">' + esc(tel) + "</a></div>";
    c.innerHTML = html;
    var b = c.querySelector(".contact__copy");
    if (b) b.addEventListener("click", function () {
      var done = function () { b.textContent = "Zkopírováno"; setTimeout(function () { b.textContent = "Kopírovat e-mail"; }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(mail).then(done, function () { selectText(c.querySelector(".contact__mail")); });
      } else selectText(c.querySelector(".contact__mail"));
    });
  });
  var fc = document.getElementById("foot-contact");
  if (fc && (mail || tel)) {
    fc.innerHTML = (mail ? '<a href="mailto:' + esc(mail) + '">' + esc(mail) + "</a>" : "") + (mail && tel ? " · " : "") + (tel ? '<a href="' + esc(telHref) + '">' + esc(tel) + "</a>" : "");
    fc.hidden = false;
  }
  function selectText(n) { var r = document.createRange(); r.selectNodeContents(n); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }

  /* ---------- pravidla ke stažení ---------- */
  var p = cfg.pravidla, d = $("#rules-download");
  if (d && p && p.soubor) {
    d.innerHTML = '<div class="dl"><a class="btn btn--red" href="' + esc(p.soubor) + '" download>Stáhnout pravidla (PDF)</a>' +
      '<span class="dl__meta">' + (p.verze ? "Verze " + esc(p.verze) : "") + (p.datum ? " · " + esc(p.datum) : "") + "</span></div>";
  }

  /* ---------- video (načte se až po spuštění) ---------- */
  var v = cfg.video, vs = $("#video-slot");
  if (vs && v && v.soubor) {
    vs.innerHTML = '<figure class="video"><video controls playsinline preload="none"' + (v.nahled ? ' poster="' + esc(v.nahled) + '"' : "") +
      ' aria-label="' + esc(v.popis || "Vysvětlující video PADELUNKA") + '"><source src="' + esc(v.soubor) + '" type="video/mp4"></video>' +
      "<p>" + esc(v.popis || "Jak se hraje PADELUNKA") + "</p></figure>";
  }
})();
