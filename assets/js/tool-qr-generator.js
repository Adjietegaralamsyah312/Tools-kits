/* Tools Kits – QR Generator (external, self-hosted lib, no CDN). */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var inp = document.getElementById("in"), size = document.getElementById("size"),
    ec = document.getElementById("ec"), go = document.getElementById("bGo"),
    dl = document.getElementById("bDl"), msg = document.getElementById("msg"),
    cv = document.getElementById("qr");
  var MAX_LEN = 2000;
  function say(t, ok) { msg.hidden = false; msg.textContent = t; msg.className = "alert " + (ok ? "success" : "error"); }
  function draw() {
    var v = inp.value.trim();
    if (!v) { say("Please enter text or URL first.", false); return; }
    if (v.length > MAX_LEN) { say("Text too long (max " + MAX_LEN + " chars) for a reliable QR.", false); return; }
    if (typeof qrcode === "undefined") { say("QR library failed to load. Reload the page (assets/js/qrcode-generator.min.js missing?).", false); return; }
    var s = Math.min(1024, Math.max(128, parseInt(size.value, 10) || 256));
    try {
      var qr = qrcode(0, ec.value); qr.addData(v); qr.make();
      var n = qr.getModuleCount(), ctx = cv.getContext("2d");
      cv.width = s; cv.height = s;
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, s, s); ctx.fillStyle = "#000";
      var cell = s / n;
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (qr.isDark(r, c)) ctx.fillRect(Math.floor(c * cell), Math.floor(r * cell), Math.ceil(cell), Math.ceil(cell));
      dl.disabled = false; say("QR generated (" + s + "×" + s + ").", true);
    } catch (e) { say("Could not generate QR (text too long for this error level?). Try shorter text or level L.", false); }
  }
  go.addEventListener("click", draw);
  dl.addEventListener("click", function () {
    var a = document.createElement("a");
    a.href = cv.toDataURL("image/png"); a.download = "qr.png";
    document.body.appendChild(a); a.click(); a.remove();
  });
  draw();
});
