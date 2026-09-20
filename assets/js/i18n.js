/* Tools Kits – i18n engine (ID default, EN on demand). Vanilla JS, no deps,
 * no network beyond same-origin static dict files (loaded via main.js).
 * - HTML holds Indonesian statically (correct default, zero flash for ID).
 * - lang=en applies EN strings; lang=id restores originals from dataset.
 * - state: localStorage "tk-lang" (default "id", never browser-sniffed);
 *   "?lang=" overrides once and persists.
 * - Switcher is injected into .nav-links (shared desktop/mobile container).
 * - Dynamic #msg/#jsonMsg translated via text map (exact + {{var}} templates,
 *   multi-pass); result containers only exact-matched (user data is never
 *   rewritten structurally). #out on timestamp page + #expl (per <p>) +
 *   #dims use page-scoped templates. [data-i18n] on result containers and
 *   elements with live [id] descendants are skipped for safety (text-node
 *   fragments "Sekarang:"/"Kecocokan:" covered via text map).
 * - Meta (title/description/OG/Twitter), og:locale, hreflang, JSON-LD text
 *   fields and tool-card descriptions swap at runtime for EN.
 * - No eval / new Function anywhere. */
(function () {
  "use strict";
  var KEY = "tk-lang";
  var lang = "id";
  try { lang = localStorage.getItem(KEY) || "id"; } catch (e) { lang = "id"; }
  try {
    var q = new URLSearchParams(window.location.search).get("lang");
    if (q === "en" || q === "id") { lang = q; try { localStorage.setItem(KEY, q); } catch (e) {} }
  } catch (e) {}
  if (lang !== "en" && lang !== "id") lang = "id";

  var D = window.TK_I18N || {};
  var TXT = window.TK_I18N_TXT || [];
  var META = window.TK_I18N_META || {};
  var FILTER = window.TK_I18N_FILTER || {};
  var DATA = window.TK_I18N_DATA || {};

  /* ---- text-map: exact entries + {{var}} templates (listed order) ---- */
  var exact = {};
  var templates = [];
  function escRx(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  TXT.forEach(function (pair) {
    if (!pair || pair.length < 2) return;
    var a = pair[0], b = pair[1];
    if (a === b) return;
    if (a.indexOf("{{") > -1) {
      var names = [];
      var src = escRx(a).replace(/\{\{(\w+)\}\}/g, function (_, n) { names.push(n); return "([\\s\\S]+?)"; });
      try { templates.push({ re: new RegExp("^" + src + "$"), names: names, en: b }); } catch (e) {}
    } else if (!(a in exact)) {
      exact[a] = b;
    }
  });
  function translateText(s) {
    if (s == null) return s;
    var out = String(s), guard = 0, changed = true;
    while (changed && guard < 4) {
      changed = false; guard++;
      if (out in exact) { out = exact[out]; changed = true; continue; }
      for (var i = 0; i < templates.length; i++) {
        var m = out.match(templates[i].re);
        if (m) {
          var en = templates[i].en, names = templates[i].names;
          for (var k = 0; k < names.length; k++) en = en.split("{{" + names[k] + "}}").join(m[k + 1]);
          if (en !== out) { out = en; changed = true; }
          break;
        }
      }
    }
    return out;
  }
  function translateAttr(el, attr) {
    var v = el.getAttribute(attr);
    if (v == null || v === "") return;
    var cur = lang === "en" ? translateText(v) : v;
    if (lang === "en") {
      if (el.dataset.tkA0 === undefined) {
        if (attr === "placeholder") el.dataset.tkPh0 = v;
        else if (attr === "aria-label") el.dataset.tkAr0 = v;
        else if (attr === "alt") el.dataset.tkAl0 = v;
        el.dataset.tkA0 = "1";
      }
      if (cur !== v) el.setAttribute(attr, cur);
    } else {
      var back = attr === "placeholder" ? el.dataset.tkPh0 : attr === "aria-label" ? el.dataset.tkAr0 : attr === "alt" ? el.dataset.tkAl0 : undefined;
      if (back !== undefined) el.setAttribute(attr, back);
    }
  }

  var RESULT_IDS = { out: 1, outH: 1, outP: 1, jsonOutput: 1, sigInfo: 1, expl: 1 };
  function hasLiveId(el) { try { return !!el.querySelector("[id]"); } catch (e) { return false; } }

  function applyKeys(root) {
    var els = root.querySelectorAll("[data-i18n]");
    for (var i = 0; i < els.length; i++) {
      (function (el) {
        var key = el.getAttribute("data-i18n");
        if (!key || !(key in D)) return;
        if (el.id && RESULT_IDS[el.id]) return; // never destroy result containers
        if (el.tagName === "IMG") {
          if (el.dataset.tkAl0 === undefined) el.dataset.tkAl0 = el.getAttribute("alt") || "";
          el.setAttribute("alt", lang === "en" ? D[key] : el.dataset.tkAl0);
          return;
        }
        if (hasLiveId(el)) {
          // Only translate direct text nodes (live [id] children must survive).
          var nodes = el.childNodes;
          for (var k = 0; k < nodes.length; k++) {
            var n = nodes[k];
            if (n.nodeType === 3 && n.nodeValue.trim() !== "") {
              if (n.parentNode && n.parentNode.dataset && n.parentNode.dataset.tkTx0 === undefined && n === el.firstChild) el.dataset.tkTxSkip = "0";
              var t = translateText(n.nodeValue.trim());
              if (lang === "en" && t !== n.nodeValue.trim()) {
                if (!n._tk0) n._tk0 = n.nodeValue;
                n.nodeValue = n.nodeValue.replace(n.nodeValue.trim(), t);
              } else if (lang === "id" && n._tk0) {
                n.nodeValue = n._tk0; n._tk0 = null;
              }
            }
          }
          return;
        }
        if (el.dataset.tkId0 === undefined) el.dataset.tkId0 = el.innerHTML;
        el.innerHTML = lang === "en" ? D[key] : el.dataset.tkId0;
      })(els[i]);
    }
    // Attributes via text map (placeholders, aria-labels, alts without keys).
    var all = root.getElementsByTagName("*");
    for (var j = 0; j < all.length; j++) {
      translateAttr(all[j], "placeholder");
      translateAttr(all[j], "aria-label");
      if (all[j].tagName === "IMG" && !all[j].hasAttribute("data-i18n")) translateAttr(all[j], "alt");
    }
    // Category filter buttons (stable data-filter values).
    var fb = root.querySelectorAll("[data-filter]");
    for (var f = 0; f < fb.length; f++) {
      var fv = fb[f].getAttribute("data-filter");
      if (fv && FILTER[fv]) {
        if (fb[f].dataset.tkF0 === undefined) fb[f].dataset.tkF0 = fb[f].textContent;
        fb[f].textContent = lang === "en" ? FILTER[fv][1] : FILTER[fv][0];
        if (lang === "id" && fb[f].dataset.tkF0) fb[f].textContent = fb[f].dataset.tkF0;
      }
    }
  }

  /* ---- tool cards (descriptions from registry map, slug from link) ---- */
  function slugOf(card) {
    try {
      var a = card.querySelector("h3 a");
      if (!a) return null;
      var href = a.getAttribute("href") || "";
      var m = href.match(/([^\/]+)\/$/);
      return m ? m[1] : null;
    } catch (e) { return null; }
  }
  function applyCards() {
    var grid = document.getElementById("toolsGrid");
    if (!grid) return;
    var cards = grid.querySelectorAll(".card");
    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        var slug = slugOf(card);
        if (!slug || !DATA[slug]) return;
        var p = card.querySelector("p");
        if (!p) return;
        if (card.dataset.tkD0 === undefined) card.dataset.tkD0 = p.textContent;
        p.textContent = lang === "en" ? DATA[slug][1] : card.dataset.tkD0;
        var ds = card.getAttribute("data-search") || "";
        if (card.dataset.tkS0 === undefined) card.dataset.tkS0 = ds;
        card.setAttribute("data-search", lang === "en" ? (slug + " " + DATA[slug][1] + " " + slug).toLowerCase() : card.dataset.tkS0);
      })(cards[i]);
    }
    var tc = document.getElementById("toolCount");
    if (tc) {
      var n = (window.TOOLS && window.TOOLS.length) || 20;
      tc.textContent = n + (lang === "en" ? " free tools" : " alat gratis");
    }
  }

  /* ---- page detection for META map ---- */
  function pageKey() {
    try {
      var p = window.location.pathname;
      var m = p.match(/\/tools\/([^\/]+)\/?$/);
      if (m && m[1]) {
        var slug = m[1];
        var map = { "json-formatter": "json-formatter", "json-validator": "json-validator", "json-minifier": "json-minifier", "base64": "base64", "url-encoder": "url-encoder", "hash-generator": "hash-generator", "uuid-generator": "uuid-generator", "regex-tester": "regex-tester", "jwt-decoder": "jwt-decoder", "diff-checker": "diff-checker", "word-counter": "word-counter", "case-converter": "case-converter", "image-compressor": "image-compressor", "image-resizer": "image-resizer", "image-converter": "image-converter", "qr-generator": "qr-generator", "timestamp-converter": "timestamp-converter", "color-picker": "color-picker", "unit-converter": "unit-converter", "cron-generator": "cron-generator" };
        if (map[slug]) return map[slug];
      }
      if (/\/tools\/?$/.test(p)) return "tools";
      if (/\/blog\/?$/.test(p)) return "blog";
      if (/about\.html$/.test(p)) return "about";
      if (/contact\.html$/.test(p)) return "contact";
      if (/faq\.html$/.test(p)) return "faq";
      if (/privacy\.html$/.test(p)) return "privacy";
      if (/terms\.html$/.test(p)) return "terms";
      if (/404\.html$/.test(p)) return "e404";
      return "home";
    } catch (e) { return "home"; }
  }
  var origMeta = null;
  function saveMeta() {
    if (origMeta) return;
    function get(sel, attr) {
      var el = document.querySelector(sel);
      return el ? (attr ? el.getAttribute(attr) : el.textContent) : null;
    }
    origMeta = {
      title: document.title,
      desc: get('meta[name="description"]', "content"),
      ogTitle: get('meta[property="og:title"]', "content"),
      ogDesc: get('meta[property="og:description"]', "content"),
      twTitle: get('meta[name="twitter:title"]', "content"),
      twDesc: get('meta[name="twitter:description"]', "content"),
      locale: get('meta[property="og:locale"]', "content")
    };
  }
  function setMeta(sel, attr, val) {
    if (val == null) return;
    var el = document.querySelector(sel);
    if (el) el.setAttribute(attr, val);
  }
  function applyMeta() {
    saveMeta();
    var pk = pageKey(), en = META[pk];
    if (lang === "en" && en) {
      if (en.title) document.title = en.title;
      setMeta('meta[name="description"]', "content", en.desc);
      setMeta('meta[property="og:title"]', "content", en.ogTitle);
      setMeta('meta[property="og:description"]', "content", en.ogDesc);
      setMeta('meta[name="twitter:title"]', "content", en.twTitle);
      setMeta('meta[name="twitter:description"]', "content", en.twDesc);
      setMeta('meta[property="og:locale"]', "content", "en_US");
    } else {
      if (origMeta.title) document.title = origMeta.title;
      setMeta('meta[name="description"]', "content", origMeta.desc);
      setMeta('meta[property="og:title"]', "content", origMeta.ogTitle);
      setMeta('meta[property="og:description"]', "content", origMeta.ogDesc);
      setMeta('meta[name="twitter:title"]', "content", origMeta.twTitle);
      setMeta('meta[name="twitter:description"]', "content", origMeta.twDesc);
      setMeta('meta[property="og:locale"]', "content", "id_ID");
    }
    // og:locale:alternate + hreflang (static-safe SEO signals).
    try {
      var head = document.head;
      var loc = origMeta.locale && origMeta.locale.indexOf("id") === 0 ? origMeta.locale : "en_US";
      var alt = head.querySelector('meta[property="og:locale:alternate"]');
      if (!alt) { alt = document.createElement("meta"); alt.setAttribute("property", "og:locale:alternate"); head.appendChild(alt); }
      alt.setAttribute("content", lang === "en" ? "id_ID" : "en_US");
      var canon = document.querySelector('link[rel="canonical"]');
      var curl = canon ? canon.getAttribute("href") : null;
      if (curl) {
        [["id", curl], ["en", curl + (curl.indexOf("?") > -1 ? "&" : "?") + "lang=en"], ["x-default", curl]].forEach(function (pair) {
          var sel = 'link[rel="alternate"][hreflang="' + pair[0] + '"]';
          var l = head.querySelector(sel);
          if (!l) { l = document.createElement("link"); l.setAttribute("rel", "alternate"); l.setAttribute("hreflang", pair[0]); head.appendChild(l); }
          l.setAttribute("href", pair[1]);
        });
      }
    } catch (e) {}
  }

  /* ---- JSON-LD deep text swap (exact matches only — structure untouched) ---- */
  function walkJson(o) {
    if (typeof o === "string") {
      var t = translateText(o);
      return t;
    }
    if (Array.isArray(o)) { for (var i = 0; i < o.length; i++) o[i] = walkJson(o[i]); return o; }
    if (o && typeof o === "object") { for (var k in o) { if (Object.prototype.hasOwnProperty.call(o, k)) o[k] = walkJson(o[k]); } return o; }
    return o;
  }
  function applyLd() {
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < scripts.length; i++) {
      (function (el) {
        if (el.dataset.tkLd0 === undefined) el.dataset.tkLd0 = el.textContent;
        try {
          var src = lang === "en" ? el.dataset.tkLd0 : el.dataset.tkLd0;
          var o = JSON.parse(src);
          if (lang === "en") o = walkJson(o);
          el.textContent = JSON.stringify(o);
        } catch (e) {}
      })(scripts[i]);
    }
  }

  /* ---- dynamic message observer ---- */
  var OBSERVE_ALL = ["msg", "jsonMsg"];
  var OBSERVE_EXACT = ["out", "jsonOutput", "outH", "outP", "sigInfo", "dims"];
  var OBSERVE_TPL_PAGES = { "timestamp-converter": ["out"], "cron-generator": ["expl"], "image-resizer": ["dims"] };
  var guard = false;
  function translateNodeText(el, allowTpl) {
    var cur = el.textContent;
    if (!cur || cur.trim() === "") return;
    var out = cur;
    if (allowTpl) {
      out = translateText(cur);
    } else {
      out = (cur in exact) ? exact[cur] : cur;
    }
    if (out !== cur) {
      guard = true;
      try { el.textContent = out; } catch (e) {}
      guard = false;
    }
  }
  function tplAllowed(el) {
    var pk = pageKey();
    return (OBSERVE_TPL_PAGES[pk] || []).indexOf(el.id) > -1;
  }
  function startObserver() {
    if (!("MutationObserver" in window)) return;
    var ids = OBSERVE_ALL.concat(OBSERVE_EXACT);
    var pk = pageKey();
    (OBSERVE_TPL_PAGES[pk] || []).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); });
    var obs = new MutationObserver(function (muts) {
      if (guard || lang !== "en") return;
      for (var i = 0; i < muts.length; i++) {
        var t = muts[i].target;
        var el = t.nodeType === 3 ? t.parentNode : t;
        if (!el || !el.id || ids.indexOf(el.id) < 0) {
          if (el && el.closest) { var c = el.closest("#" + ids.join(",#")); if (c) el = c; else continue; }
          else continue;
        }
        if (el.id === "expl") { translateExpl(); continue; }
        translateNodeText(el, tplAllowed(el));
      }
    });
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) obs.observe(el, { childList: true, characterData: true, subtree: true });
    });
  }
  /* cron #expl per-paragraph head/tail translation (scoped, safe). */
  function translateExpl() {
    if (pageKey() !== "cron-generator" || lang !== "en") return;
    var expl = document.getElementById("expl");
    if (!expl) return;
    var heads = { "Menit": "Minute", "Jam": "Hour", "Tanggal": "Day of month", "Bulan": "Month", "Hari dalam seminggu": "Day of week" };
    var ps = expl.querySelectorAll("p");
    for (var i = 0; i < ps.length; i++) {
      (function (p) {
        var txt = p.textContent || "";
        var ci = txt.indexOf(":");
        if (ci < 0) return;
        var head = txt.slice(0, ci).trim(), tail = txt.slice(ci + 1).trim();
        if (!heads[head]) return;
        var suffix = "";
        var suf = " — tidak valid";
        if (tail.slice(-suf.length) === suf) { suffix = " — invalid"; tail = tail.slice(0, -suf.length); }
        var t2 = translateText(tail);
        var built = heads[head] + ": " + t2 + suffix;
        if (built !== txt) {
          guard = true;
          try {
            p.innerHTML = "";
            p.appendChild(document.createTextNode(heads[head] + ": "));
            var span = document.createElement("span");
            span.textContent = t2 + suffix;
            p.appendChild(span);
          } catch (e) {}
          guard = false;
        }
      })(ps[i]);
    }
  }

  /* ---- switcher UI (injected into .nav-links: shared desktop/mobile) ---- */
  function injectCss() {
    if (document.getElementById("tk-lang-css")) return;
    var st = document.createElement("style");
    st.id = "tk-lang-css";
    st.textContent = ".tk-lang{display:inline-flex;border:1px solid var(--border);border-radius:9px;overflow:hidden;background:var(--card)}.tk-lang button{border:0;background:transparent;color:var(--muted);font-weight:700;font-size:.82rem;min-height:44px;min-width:44px;padding:0 .7rem;cursor:pointer}.tk-lang button[aria-pressed=\"true\"]{background:var(--text);color:var(--bg)}";
    document.head.appendChild(st);
  }
  function buildSwitcher() {
    var nav = document.querySelector(".nav-links");
    if (!nav || document.querySelector(".tk-lang")) return;
    injectCss();
    var wrap = document.createElement("div");
    wrap.className = "tk-lang";
    wrap.setAttribute("role", "group");
    var bId = document.createElement("button");
    bId.type = "button"; bId.textContent = "ID"; bId.setAttribute("data-lang", "id");
    var bEn = document.createElement("button");
    bEn.type = "button"; bEn.textContent = "EN"; bEn.setAttribute("data-lang", "en");
    wrap.appendChild(bId); wrap.appendChild(bEn);
    nav.appendChild(wrap);
    wrap.addEventListener("click", function (e) {
      var b = e.target && e.target.closest ? e.target.closest("[data-lang]") : null;
      if (b) setLang(b.getAttribute("data-lang"));
    });
  }
  function paintSwitcher() {
    var btns = document.querySelectorAll(".tk-lang [data-lang]");
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute("data-lang") === lang;
      btns[i].setAttribute("aria-pressed", on ? "true" : "false");
      btns[i].setAttribute("aria-label", lang === "en" ? (btns[i].getAttribute("data-lang") === "id" ? "Switch to Indonesian" : "Switch to English") : (btns[i].getAttribute("data-lang") === "id" ? "Ganti ke Bahasa Indonesia" : "Ganti ke English"));
    }
    var wrap = document.querySelector(".tk-lang");
    if (wrap) wrap.setAttribute("aria-label", lang === "en" ? "Choose language" : "Pilih bahasa");
  }

  function setLang(l) {
    if (l !== "en" && l !== "id") return;
    lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    try {
      var url = new URL(window.location.href);
      if (l === "en") url.searchParams.set("lang", "en");
      else url.searchParams.delete("lang");
      window.history.replaceState(null, "", url.pathname + (url.search ? "?" + url.searchParams.toString() : "") + url.hash);
    } catch (e) {}
    applyAll();
  }
  function applyAll() {
    document.documentElement.lang = lang;
    applyKeys(document);
    applyCards();
    applyMeta();
    applyLd();
    if (lang === "en") translateExpl();
    paintSwitcher();
  }
  window.tkI18n = { get lang() { return lang; }, setLang: setLang, t: translateText };

  buildSwitcher();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { buildSwitcher(); applyAll(); startObserver(); });
  } else {
    buildSwitcher(); applyAll(); startObserver();
  }
})();
