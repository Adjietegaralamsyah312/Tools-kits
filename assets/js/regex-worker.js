/* Tools Kits – Regex Worker (terminable, no eval). */
self.onmessage = function (e) {
  "use strict";
  var d = e.data || {};
  var pat = String(d.pat || "");
  var flags = String(d.flags || "");
  var text = String(d.text || "");
  var maxMatches = d.maxMatches || 500;
  try {
    var rx = new RegExp(pat, flags);
    var out = [];
    var n = 0;
    if (rx.global) {
      rx.lastIndex = 0;
      var m;
      while ((m = rx.exec(text)) !== null) {
        n++;
        if (n > maxMatches) break;
        out.push({ i: m.index, len: (m[0] || "").length, s: m[0] || "(empty)" });
        if (m[0] === "") rx.lastIndex++;
        if (rx.lastIndex > text.length + 1) break;
      }
      self.postMessage({ ok: true, matches: out, capped: n > maxMatches, count: n > maxMatches ? maxMatches : n, global: true });
    } else {
      var s = text.match(rx);
      if (s) self.postMessage({ ok: true, matches: [{ i: s.index, len: s[0].length, s: s[0] }], count: 1, global: false });
      else self.postMessage({ ok: true, matches: [], count: 0, global: false });
    }
  } catch (err) {
    self.postMessage({ ok: false, error: String((err && err.message) || err) });
  }
};
