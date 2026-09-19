/* Tools Kits – Regex Tester (Worker-only, no main-thread fallback, no eval). */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var re = document.getElementById("re"), txt = document.getElementById("txt"),
    out = document.getElementById("out"), msg = document.getElementById("msg"),
    count = document.getElementById("count");
  var MAX_PAT = 500, MAX_TXT = 50000, MAX_MATCH = 500, BUDGET_MS = 1500;
  var UNAVAILABLE = "Regex Worker is unavailable. This browser cannot safely run the test.";
  var worker = null, timer = null, seq = 0;
  function flags() {
    var f = "";
    if (document.getElementById("fG").checked) f += "g";
    if (document.getElementById("fI").checked) f += "i";
    if (document.getElementById("fM").checked) f += "m";
    if (document.getElementById("fS").checked) f += "s";
    if (document.getElementById("fU").checked) f += "u";
    return f;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function say(t, ok) { msg.hidden = false; msg.textContent = t; msg.className = "alert " + (ok ? "success" : "error"); }
  function clearMsg() { msg.hidden = true; }
  function killWorker(reason) {
    if (worker) { try { worker.terminate(); } catch (e) {} worker = null; }
    if (timer) { clearTimeout(timer); timer = null; }
    if (reason) say(reason, false);
  }
  function unavailable() {
    killWorker();
    say(UNAVAILABLE, false);
    out.textContent = "Worker unavailable — test not run.";
    count.textContent = "0";
  }
  function render(matches, total, capped, text, isGlobal) {
    var html = "", last = 0;
    if (!matches.length) { out.textContent = text || "(no text)"; count.textContent = "0"; return; }
    if (!isGlobal) {
      var s = matches[0];
      html = esc(text.slice(0, s.i)) + '<mark class="hl">' + esc(s.s) + "</mark>" + esc(text.slice(s.i + s.len));
    } else {
      matches.forEach(function (m) {
        html += esc(text.slice(last, m.i)) + '<mark class="hl">' + esc(m.s) + "</mark>";
        last = m.i + m.len;
      });
      html += esc(text.slice(last));
    }
    out.innerHTML = html || "(no text)";
    count.textContent = capped ? MAX_MATCH + "+ (capped)" : String(total);
  }
  function run() {
    var pat = re.value, t = txt.value;
    if (pat.length > MAX_PAT) { killWorker(); say("Pattern too long (max " + MAX_PAT + " chars) to keep the browser safe.", false); return; }
    if (t.length > MAX_TXT) { killWorker(); say("Test text too long (max 50,000 chars) to keep the browser responsive.", false); return; }
    try { new RegExp(pat, flags()); } catch (e) { killWorker(); say("Invalid regex: " + e.message, false); out.textContent = "Fix the pattern to see matches."; count.textContent = "0"; return; }
    clearMsg();
    var canWorker = false;
    try { canWorker = typeof Worker !== "undefined"; } catch (e) { canWorker = false; }
    if (!canWorker) { unavailable(); return; }
    killWorker();
    var id = ++seq;
    try {
      worker = new Worker("../../assets/js/regex-worker.js");
    } catch (e) { unavailable(); return; }
    timer = setTimeout(function () {
      if (seq !== id) return;
      killWorker("Pattern timed out after " + BUDGET_MS + "ms and was stopped to protect the UI. Simplify nested quantifiers like (a+)+.");
      count.textContent = "0";
    }, BUDGET_MS);
    worker.onmessage = function (ev) {
      if (seq !== id) return;
      if (timer) { clearTimeout(timer); timer = null; }
      var d = ev.data || {};
      var w = worker; worker = null;
      try { if (w) w.terminate(); } catch (e) {}
      if (!d.ok) { say("Invalid regex: " + (d.error || "unknown"), false); return; }
      render(d.matches || [], d.count || 0, !!d.capped, t, d.global !== false);
    };
    worker.onerror = function () {
      if (seq !== id) return;
      unavailable();
    };
    try { worker.postMessage({ pat: pat, flags: flags(), text: t, maxMatches: MAX_MATCH }); }
    catch (e) { unavailable(); }
  }
  ["re", "txt", "fG", "fI", "fM", "fS", "fU"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", run);
  });
  run();
});
