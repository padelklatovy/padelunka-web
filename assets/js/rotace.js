/* PADELUNKA – interaktivní ukázka střídání.
   Sekvence se NEzadává ručně. Počítá se přímo z pravidel:
   - střídání po každém lichém gamu, dvojice AB → BC → CA → AB,
   - příchozí přebírá místo odcházejícího na příjmu i v pořadí podání,
   - zůstávající nemění stranu příjmu,
   - týmy se na podání střídají po každém gamu, pořadí podání se nepřerušuje.
   Kontrola: po 12 gamech je tým ve výchozím postavení. */
(function () {
  "use strict";
  var svg = document.getElementById("court");
  if (!svg) return;

  var SPOT = { R: [300, 328], L: [100, 328] };
  var BENCH = [[493, 186], [493, 264]];
  var PAIRS = ["AB", "BC", "CA"];
  var STRANA = { R: "vpravo", L: "vlevo" };

  /* ---------- 1) čistá simulace pravidel ---------- */
  function simulate(teamServesFirst) {
    var s = { R: "A", L: "B", bench: "C", order: ["A", "B"], nxt: 0, k: 0 };
    var games = [];
    for (var g = 1; g <= 13; g++) {
      var serves = (g % 2 === 1) === teamServesFirst, srv = null;
      if (serves) { srv = s.order[s.nxt]; s.nxt ^= 1; }
      games.push({ g: g, pair: PAIRS[s.k], R: s.R, L: s.L, bench: s.bench, srv: srv });
      if (g % 2 === 1) rotate(s);
    }
    return games;
  }
  function rotate(s) {
    var cur = PAIRS[s.k], nw = PAIRS[(s.k + 1) % 3];
    var out = cur.replace(nw[0], "").replace(nw[1], "");
    var inn = s.bench;
    if (s.R === out) s.R = inn; else s.L = inn;
    s.order = s.order.map(function (p) { return p === out ? inn : p; });
    s.bench = out; s.k = (s.k + 1) % 3;
    return { out: out, inn: inn };
  }

  /* ---------- 2) kroky výkladu ---------- */
  function build(teamServesFirst) {
    var st = { R: "A", L: "B", bench: "C", order: ["A", "B"], nxt: 0, k: 0, served: false };
    var where = { A: SPOT.R, B: SPOT.L, C: BENCH[0] }, benchSlot = { C: 0 };
    var steps = [];
    function snap(o) {
      steps.push({
        title: o.title, text: o.text, block: o.block,
        pos: { A: where.A, B: where.B, C: where.C },
        cls: o.cls || {}, zone: o.zone || null, ball: o.ball || null,
        R: o.R !== undefined ? o.R : st.R, L: o.L !== undefined ? o.L : st.L, bench: o.bench || st.bench,
        srvLab: o.srvLab || "Podání týmu", srv: o.srv || "—"
      });
    }
    function play(g) { // odehraje game g (spotřebuje podání, pokud podává tým)
      if ((g % 2 === 1) === teamServesFirst) { st.nxt ^= 1; st.served = true; }
    }
    function nextTeamServe(from) {
      for (var h = from; ; h++) if ((h % 2 === 1) === teamServesFirst) return h;
    }

    // začátek
    if (teamServesFirst) {
      snap({ block: 0, title: "1. game: podává váš tým",
        text: "Úvodní dvojice A a B. <b>A</b> přijímá vpravo, <b>B</b> vlevo. Pořadí podání si určili A, potom B, takže první game podává <b>A</b>. C fandí na lavičce.",
        ball: "A", srvLab: "Podání týmu · 1. game", srv: "A" });
    } else {
      snap({ block: 0, title: "1. game: podává soupeř",
        text: "Váš tým začíná na příjmu. <b>A</b> přijímá vpravo, <b>B</b> vlevo. Pořadí podání týmu si určili A, potom B. C fandí na lavičce.",
        srvLab: "Podání týmu", srv: "—" });
    }
    play(1);

    for (var r = 0; r < 6; r++) {
      var g = 2 * r + 1, block = r + 1;
      var cur = PAIRS[st.k];
      var nw = PAIRS[(st.k + 1) % 3];
      var o = cur.replace(nw[0], "").replace(nw[1], "");      // kdo odchází
      var side = st.R === o ? "R" : "L";                       // jeho strana příjmu
      var stayer = side === "R" ? st.L : st.R, stSide = side === "R" ? "L" : "R";
      var inn = st.bench;
      var c1 = {}; c1[o] = "out"; c1[stayer] = "dim"; c1[inn] = "dim";
      snap({ block: block, title: "Konec " + g + ". gamu: střídání",
        text: "Při změně stran se tým vystřídá. Na kurtu byli " + cur[0] + " a " + cur[1] + ". Teď přichází na řadu dvojice " + PAIRS[(st.k + 1) % 3][0] + " + " + PAIRS[(st.k + 1) % 3][1] + ", takže odchází <b>" + o + "</b>.",
        cls: c1, srv: "—" });

      // odcházející jde na lavičku (do volného místa)
      var free = benchSlot[inn] === 0 ? 1 : 0;
      where[o] = BENCH[free]; benchSlot[o] = free;
      var c2 = {}; c2[o] = "out"; c2[stayer] = "dim"; c2[inn] = "dim";
      snap({ block: block, title: o + " jde na lavičku",
        text: "<b>" + o + "</b> odchází z místa pro příjem " + STRANA[side] + ". Teď si odpočine a fandí.",
        cls: c2, zone: side, R: side === "R" ? "—" : st.R, L: side === "L" ? "—" : st.L, bench: inn + " + " + o, srv: "—" });

      // příchozí přebírá místo
      rotate(st); // mění R/L, order, bench, k
      where[inn] = SPOT[side]; delete benchSlot[inn];
      var c3 = {}; c3[inn] = "in"; c3[stayer] = "dim";
      snap({ block: block, title: inn + " přichází",
        text: "<b>" + inn + "</b> bere místo, které měl " + o + ": příjem " + STRANA[side] + " i jeho místo v pořadí podání.",
        cls: c3, zone: side, srv: "—" });

      // zůstávající
      var c4 = {}; c4[stayer] = "stay";
      snap({ block: block, title: stayer + " zůstává " + STRANA[stSide],
        text: "<b>" + stayer + "</b> zůstává na kurtu a svou stranu příjmu nemění. Dál přijímá " + STRANA[stSide] + ".",
        cls: c4, zone: stSide, srv: "—" });

      // kdo podává při nejbližším podání týmu
      var h = nextTeamServe(g + 1), srv = st.order[st.nxt], last = st.order[st.nxt ^ 1];
      var why = st.served
        ? " Naposledy tým podával z místa v pořadí, které teď drží " + last + ". Na řadě je druhé místo, a to drží <b>" + srv + "</b>."
        : " Tým ještě nepodával, takže začíná první místo v pořadí podání. " + (srv === inn ? "To po " + o + " převzal <b>" + srv + "</b>." : "To drží <b>" + srv + "</b>.");
      var head = h === g + 1
        ? h + ". game podává váš tým: <b>" + srv + "</b>."
        : (g + 1) + ". game podává soupeř. Při nejbližším podání týmu (" + h + ". game) podává <b>" + srv + "</b>."
      var c5 = {}; c5[srv] = "stay";
      snap({ block: block, title: "Podání týmu v " + h + ". gamu: " + srv, text: head + why,
        cls: c5, ball: srv, srvLab: "Podání týmu · " + h + ". game", srv: srv });

      play(g + 1); play(g + 2);
    }

    var lastStep = steps[steps.length - 1];
    snap({ block: 6, title: "Po 12 gamech znovu od začátku",
      text: "Tým je ve stejném postavení jako na začátku: A vpravo, B vlevo, C na lavičce. Každý už přijímal vpravo i vlevo a celý cyklus se opakuje.",
      ball: lastStep.ball, srvLab: lastStep.srvLab, srv: lastStep.srv });
    return steps;
  }

  /* ---------- 3) vykreslení ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  var players = { A: $("pl-A"), B: $("pl-B"), C: $("pl-C") }, ball = $("ball");
  var bPlay = $("btn-play"), bNext = $("btn-next"), bReset = $("btn-reset");
  var tl = $("timeline");
  var startServe = true, steps = build(true), games = simulate(true), i = 0, timer = null, playing = false;

  function setT(node, xy) { node.style.transform = "translate(" + xy[0] + "px," + xy[1] + "px)"; }
  function colorDD(dd, v) { dd.textContent = v; if (/^[ABC]$/.test(v)) dd.setAttribute("data-p", v); else dd.removeAttribute("data-p"); }

  function render(n, instant) {
    var s = steps[n];
    if (instant) svg.classList.add("jump");
    ["A", "B", "C"].forEach(function (p) {
      setT(players[p], s.pos[p]);
      players[p].setAttribute("class", "pl " + (s.cls[p] || ""));
    });
    $("zone-R").classList.toggle("hl", s.zone === "R");
    $("zone-L").classList.toggle("hl", s.zone === "L");
    if (s.ball) {
      var p = s.pos[s.ball];
      ball.style.transform = "translate(" + (p[0] + 35) + "px," + (p[1] - 35) + "px)";
      ball.setAttribute("class", "ball");
      if (!instant && !reduce && s.cls[s.ball] === "stay") { void ball.getBBox(); ball.setAttribute("class", "ball pulse"); }
    } else ball.setAttribute("class", "ball off");
    $("narr-step").textContent = "Krok " + (n + 1) + " z " + steps.length;
    $("narr-title").textContent = s.title;
    $("narr-text").innerHTML = s.text;
    colorDD($("st-L"), s.L); colorDD($("st-R"), s.R); colorDD($("st-B"), s.bench);
    $("st-srv-lab").textContent = s.srvLab; colorDD($("st-srv"), s.srv);
    tl.querySelectorAll("button").forEach(function (b, k) {
      b.classList.toggle("now", k === s.block); b.classList.toggle("done", k < s.block);
      b.setAttribute("aria-current", k === s.block ? "step" : "false");
    });
    bNext.disabled = n >= steps.length - 1;
    if (instant) { void svg.getBoundingClientRect(); requestAnimationFrame(function () { svg.classList.remove("jump"); }); }
  }

  function delayFor(n) {
    var t = steps[n].title;
    if (/přichází/.test(t)) return 3600;
    if (/^Podání/.test(t)) return 4600;
    if (/^Konec/.test(t)) return 3400;
    return 3000;
  }
  function tick() {
    if (i >= steps.length - 1) { stop(); return; }
    i++; render(i);
    timer = setTimeout(tick, delayFor(i));
  }
  function start() {
    if (i >= steps.length - 1) { i = 0; render(0, true); }
    playing = true; bPlay.textContent = "Pauza"; bPlay.setAttribute("aria-pressed", "true");
    timer = setTimeout(tick, i === 0 ? 2200 : 900);
  }
  function stop() {
    playing = false; clearTimeout(timer);
    bPlay.textContent = i >= steps.length - 1 ? "Přehrát znovu" : "Přehrát"; bPlay.setAttribute("aria-pressed", "false");
  }

  function buildTimeline() {
    var blocks = [[1]], html = "";
    for (var b = 1; b <= 6; b++) blocks.push([2 * b, 2 * b + 1]);
    blocks.forEach(function (gs, b) {
      var first = games[gs[0] - 1];
      var srvG = gs.map(function (g) { return games[g - 1]; }).filter(function (x) { return x.srv; })[0];
      var label = gs.length === 1 ? gs[0] + ". game" : gs[0] + ".–" + gs[1] + ".";
      html += '<button type="button" data-b="' + b + '" aria-label="Gamy ' + label + ': na kurtu ' + first.pair[0] + ' a ' + first.pair[1] +
        ', vpravo ' + first.R + ', vlevo ' + first.L + (srvG ? ", podání týmu " + srvG.g + ". game " + srvG.srv : "") + '">' +
        '<span class="tl__g">' + label + '</span>' +
        '<span class="tl__pair"><span class="c' + first.pair[0] + '">' + first.pair[0] + '</span><span class="c' + first.pair[1] + '">' + first.pair[1] + "</span></span>" +
        '<span class="tl__rl">L ' + first.L + " · P " + first.R + "</span>" +
        '<span class="tl__srv">' + (srvG ? srvG.g + ". podává " + srvG.srv : "") + "</span></button>";
    });
    tl.innerHTML = html;
    tl.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        stop();
        var k = +b.dataset.b, target = 0;
        if (k > 0) for (var n = 0; n < steps.length; n++) if (steps[n].block === k && /^Podání/.test(steps[n].title)) target = n;
        i = target; render(i, true); stop();
      });
    });
  }

  function setStart(serveFirst) {
    stop(); startServe = serveFirst;
    steps = build(serveFirst); games = simulate(serveFirst); i = 0;
    $("start-podani").setAttribute("aria-checked", serveFirst ? "true" : "false");
    $("start-prijem").setAttribute("aria-checked", serveFirst ? "false" : "true");
    buildTimeline(); render(0, true); stop();
  }

  bPlay.addEventListener("click", function () { playing ? stop() : start(); });
  bNext.addEventListener("click", function () { stop(); if (i < steps.length - 1) { i++; render(i); } stop(); });
  bReset.addEventListener("click", function () { stop(); i = 0; render(0, true); stop(); });
  $("start-podani").addEventListener("click", function () { setStart(true); });
  $("start-prijem").addEventListener("click", function () { setStart(false); });
  document.querySelector(".seg").addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); setStart(!startServe); $(startServe ? "start-podani" : "start-prijem").focus(); }
  });

  // pro kontrolu z konzole / testů
  window.PADELUNKA_ROTACE = { simulate: simulate, build: build };
  setStart(true);
})();
