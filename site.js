(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || doc).querySelectorAll(s)); };

  // ---- language (German is in the page; English sits in data-en)
  var els = $$("[data-en]");
  els.forEach(function (e) { e.setAttribute("data-de", e.innerHTML); });
  var attrs = [["data-en-alt", "alt", "data-de-alt"], ["data-en-label", "aria-label", "data-de-label"]];
  attrs.forEach(function (a) { $$("[" + a[0] + "]").forEach(function (e) { e.setAttribute(a[2], e.getAttribute(a[1]) || ""); }); });
  var title = { de: doc.title, en: "Wheek & Seek – the guinea pig race for food, free in your browser" };
  var meta = $('meta[name="description"]');
  var desc = { de: meta.content, en: "Breakout! Find more food than the other guinea pigs in 90 seconds: sniff, sprint, dodge. Alone, against the computer or online with friends. Free in your browser." };
  var btn = $("#lang");
  function setLang(l, keep) {
    root.lang = l;
    els.forEach(function (e) { e.innerHTML = e.getAttribute(l === "en" ? "data-en" : "data-de"); });
    attrs.forEach(function (a) { $$("[" + a[0] + "]").forEach(function (e) { e.setAttribute(a[1], e.getAttribute(l === "en" ? a[0] : a[2])); }); });
    doc.title = title[l]; meta.content = desc[l];
    btn.textContent = l === "de" ? "EN" : "DE";
    if (!keep) try { localStorage.setItem("wheek.site.lang", l); } catch (e) { /* no storage: fine */ }
  }
  var saved = null;
  try { saved = localStorage.getItem("wheek.site.lang"); } catch (e) { /* ignore */ }
  var start = saved || (/^de/i.test(navigator.language || "") ? "de" : "en");
  if (start === "en") setLang("en", true);
  btn.addEventListener("click", function () { setLang(root.lang === "de" ? "en" : "de"); });

  // ---- header turns solid after the hero
  var top = $("#top");
  function onScroll() { top.classList.toggle("solid", window.scrollY > window.innerHeight * 0.55); }
  onScroll(); addEventListener("scroll", onScroll, { passive: true });

  // ---- reveal on scroll
  var rv = $$(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("on"); io.unobserve(x.target); } });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    rv.forEach(function (e) { io.observe(e); });
  } else rv.forEach(function (e) { e.classList.add("on"); });

  // ---- falling leaves in the hero
  var lv = $("#leaves");
  if (lv && !reduce) {
    for (var i = 0; i < 12; i++) {
      var l = doc.createElement("i");
      l.style.left = Math.round(Math.random() * 100) + "%";
      l.style.animationDuration = (14 + Math.random() * 16).toFixed(1) + "s";
      l.style.animationDelay = (-Math.random() * 24).toFixed(1) + "s";
      var s = 14 + Math.random() * 20; l.style.width = l.style.height = s + "px";
      l.style.opacity = (0.35 + Math.random() * 0.5).toFixed(2);
      lv.appendChild(l);
    }
  }

  // ---- the eight looks (one running band) and the accessories (one sprite): two pictures instead of 25
  var acc = $("#acc");
  if (acc) {
    var cols = 6, rows = 3, n = 17, h2 = "";
    for (var q = 0; q < n; q++) {
      var cx = q % cols, cy = Math.floor(q / cols);
      h2 += '<div><i style="background-position:' + (cx / (cols - 1) * 100).toFixed(3) + "% " + (cy / (rows - 1) * 100).toFixed(3) + '%"></i></div>';
    }
    acc.innerHTML = h2;
  }

  // ---- trailer: plays while in view, one button to pause
  var v = $("#vid"), vb = $("#vbtn"), ico = $("#vico");
  if (v && vb) {
    var paused = reduce;
    function sync() { ico.setAttribute("d", paused ? "M8 5v14l11-7z" : "M6 5h4v14H6zM14 5h4v14h-4z"); vb.setAttribute("aria-label", root.lang === "de" ? (paused ? "Abspielen" : "Pause") : (paused ? "Play" : "Pause")); }
    vb.addEventListener("click", function () { paused = !paused; if (paused) v.pause(); else v.play(); sync(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        en.forEach(function (x) { if (x.isIntersecting && !paused) v.play().catch(function () {}); else v.pause(); });
      }, { threshold: 0.35 }).observe(v);
    }
    sync();
  }
})();
