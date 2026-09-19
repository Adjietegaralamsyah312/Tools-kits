/* Tools Kits – Hash Generator (external, auditable MD5 + Web Crypto SHA).
 * MD5 test vectors (UTF-8):
 *  "" -> d41d8cd98f00b204e9800998ecf8427e
 *  "abc" -> 900150983cd24fb0d6963f7d28e17f72
 *  "hello world" -> 5eb63bbbe01eeed093cb22bb8f5acdc3
 *  "The quick brown fox jumps over the lazy dog" -> 9e107d9d372bb6826bd81d3542a419d6
 * MD5 is NOT cryptographically secure (collisions). Use only for checksums.
 * Unicode (UTF-8 2/3/4-byte: "café", "你好", "😀") is covered by
 * scripts/test_md5_vectors.js via a Node-crypto oracle cross-check.
  */
(function () {
  "use strict";
  function utf8Bytes(s) {
    if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(s);
    var b = unescape(encodeURIComponent(s)), out = new Uint8Array(b.length);
    for (var i = 0; i < b.length; i++) out[i] = b.charCodeAt(i) & 255;
    return out;
  }
  function md5Hex(str) {
    var msg = utf8Bytes(str);
    var origLen = msg.length;
    var withOne = origLen + 1;
    var padLen = (56 - (withOne % 64) + 64) % 64;
    var total = withOne + padLen + 8;
    var buf = new Uint8Array(total);
    buf.set(msg, 0); buf[origLen] = 128;
    var bitLenLow = (origLen * 8) % 4294967296;
    var bitLenHigh = Math.floor((origLen * 8) / 4294967296);
    // Full 64-bit little-endian message length. (The old code used
    // `bitLen >>> (i*8)` for i up to 7, but JS `>>>` masks the shift to
    // 0..31, so bytes 4..7 duplicated the low word and corrupted the length
    // for every non-empty input — empty string passed only because 0 == 0.)
    for (var i = 0; i < 8; i++) {
      var w = i < 4 ? bitLenLow : bitLenHigh;
      buf[total - 8 + i] = (w >>> ((i % 4) * 8)) & 255;
    }
    function add32(a, b) { return (a + b) | 0; }
    function rol(x, c) { return (x << c) | (x >>> (32 - c)); }
    var a0 = 1732584193, b0 = -271733879, c0 = -1732584194, d0 = 271733878;
    var S = [7,12,17,22, 7,12,17,22, 7,12,17,22, 7,12,17,22, 5,9,14,20, 5,9,14,20, 5,9,14,20, 5,9,14,20, 4,11,16,23, 4,11,16,23, 4,11,16,23, 4,11,16,23, 6,10,15,21, 6,10,15,21, 6,10,15,21, 6,10,15,21];
    var K = [];
    for (var k = 0; k < 64; k++) K[k] = Math.floor(Math.abs(Math.sin(k + 1)) * 4294967296) | 0;
    var M = new Array(16);
    for (var off = 0; off < total; off += 64) {
      for (var j = 0; j < 16; j++) {
        M[j] = (buf[off + j * 4] | (buf[off + j * 4 + 1] << 8) | (buf[off + j * 4 + 2] << 16) | (buf[off + j * 4 + 3] << 24)) | 0;
      }
      var A = a0, B = b0, C = c0, D = d0, F, g;
      for (var t = 0; t < 64; t++) {
        if (t < 16) { F = (B & C) | (~B & D); g = t; }
        else if (t < 32) { F = (D & B) | (~D & C); g = (5 * t + 1) % 16; }
        else if (t < 48) { F = B ^ C ^ D; g = (3 * t + 5) % 16; }
        else { F = C ^ (B | ~D); g = (7 * t) % 16; }
        F = add32(add32(add32(F, A), K[t]), M[g]);
        A = D; D = C; C = B;
        B = add32(B, rol(F, S[t]));
      }
      a0 = add32(a0, A); b0 = add32(b0, B); c0 = add32(c0, C); d0 = add32(d0, D);
    }
    function hex32(n) {
      var s = "";
      for (var i = 0; i < 4; i++) s += ("0" + ((n >>> (i * 8)) & 255).toString(16)).slice(-2);
      return s;
    }
    return hex32(a0) + hex32(b0) + hex32(c0) + hex32(d0);
  }
  /* Automated MD5 self-test vectors (same set as scripts/test_md5_vectors.js).
   * Runs silently on page load; only logs/shows on internal failure. */
  var MD5_VECTORS = [
    ["", "d41d8cd98f00b204e9800998ecf8427e"],
    ["abc", "900150983cd24fb0d6963f7d28e17f72"],
    ["hello world", "5eb63bbbe01eeed093cb22bb8f5acdc3"],
    ["The quick brown fox jumps over the lazy dog", "9e107d9d372bb6826bd81d3542a419d6"]
  ];
  function md5SelfTest() {
    try {
      for (var i = 0; i < MD5_VECTORS.length; i++) {
        if (md5Hex(MD5_VECTORS[i][0]) !== MD5_VECTORS[i][1]) return false;
      }
      return true;
    } catch (e) { return false; }
  }
  function sha1fb(s) {
    function R(n, c) { return (n << c) | (n >>> (32 - c)); }
    var ml = utf8Bytes(s).length * 8;
    var b = unescape(encodeURIComponent(s)), l = b.length, words = [];
    for (var i = 0; i < l; i++) words[i >> 2] |= b.charCodeAt(i) << ((3 - i % 4) * 8);
    words[l >> 2] |= 128 << ((3 - l % 4) * 8);
    words[(((l + 8) >> 6) << 4) + 15] = ml;
    var h0 = 1732584193, h1 = -271733879, h2 = -1732584194, h3 = 271733878, h4 = -1009589776;
    for (var j = 0; j < words.length; j += 16) {
      var a = h0, bb = h1, cc = h2, d = h3, e = h4, w = [];
      for (var t = 0; t < 80; t++) {
        w[t] = t < 16 ? words[j + t] : R(w[t-3] ^ w[t-8] ^ w[t-14] ^ w[t-16], 1);
        var f, kk;
        if (t < 20) { f = (bb & cc) | (~bb & d); kk = 1518500249; }
        else if (t < 40) { f = bb ^ cc ^ d; kk = 1859775393; }
        else if (t < 60) { f = (bb & cc) | (bb & d) | (cc & d); kk = 2400959708; }
        else { f = bb ^ cc ^ d; kk = 3395469782; }
        var tmp = (R(a, 5) + f + e + kk + w[t]) | 0;
        e = d; d = cc; cc = R(bb, 30); bb = a; a = tmp;
      }
      h0 = (h0 + a) | 0; h1 = (h1 + bb) | 0; h2 = (h2 + cc) | 0; h3 = (h3 + d) | 0; h4 = (h4 + e) | 0;
    }
    return [h0, h1, h2, h3, h4].map(function (n) { return ("00000000" + (n >>> 0).toString(16)).slice(-8); }).join("");
  }
  document.addEventListener("DOMContentLoaded", function () {
    var inp = document.getElementById("in"), m = document.getElementById("msg");
    function say(t, ok) { m.hidden = false; m.textContent = t; m.className = "alert " + (ok ? "success" : "error"); }
    if (!md5SelfTest()) {
      try { if (typeof console !== "undefined" && console.error) console.error("[Tools Kits] MD5 self-test FAILED"); } catch (e) {}
      say("Internal error: MD5 self-test failed. Results may be incorrect.", false);
      return;
    }
    function sha(algo, text) {
      var data = utf8Bytes(text);
      return crypto.subtle.digest(algo, data).then(function (d) {
        return Array.prototype.map.call(new Uint8Array(d), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
      });
    }
    document.getElementById("bGo").addEventListener("click", function () {
      var v = inp.value;
      if (!v) { say("Please enter some text first.", false); return; }
      if (v.length > 500000) { say("Input too long (max 500,000 chars).", false); return; }
      document.getElementById("hMd5").textContent = md5Hex(v);
      var hasCrypto = false;
      try { hasCrypto = !!(window.crypto && crypto.subtle && window.isSecureContext !== false); } catch (e) { hasCrypto = false; }
      if (hasCrypto) {
        Promise.all([sha("SHA-1", v), sha("SHA-256", v), sha("SHA-512", v)]).then(function (r) {
          document.getElementById("hSha1").textContent = r[0];
          document.getElementById("hSha256").textContent = r[1];
          document.getElementById("hSha512").textContent = r[2];
          say("Hashes generated (SHA via Web Crypto).", true);
        }).catch(function () {
          document.getElementById("hSha1").textContent = sha1fb(v);
          document.getElementById("hSha256").textContent = "Unavailable (needs HTTPS/secure context)";
          document.getElementById("hSha512").textContent = "Unavailable (needs HTTPS/secure context)";
          say("MD5 + SHA-1 generated locally. SHA-256/512 need HTTPS.", true);
        });
      } else {
        document.getElementById("hSha1").textContent = sha1fb(v);
        document.getElementById("hSha256").textContent = "Unavailable (needs HTTPS/secure context)";
        document.getElementById("hSha512").textContent = "Unavailable (needs HTTPS/secure context)";
        say("MD5 + SHA-1 generated locally. SHA-256/512 need HTTPS.", true);
      }
    });
    document.getElementById("bCopy").addEventListener("click", function () {
      var t = "MD5: " + document.getElementById("hMd5").textContent + "\nSHA-1: " + document.getElementById("hSha1").textContent + "\nSHA-256: " + document.getElementById("hSha256").textContent + "\nSHA-512: " + document.getElementById("hSha512").textContent;
      window.tkCopy(t, m);
    });
    document.getElementById("bClear").addEventListener("click", function () {
      inp.value = "";
      ["hMd5", "hSha1", "hSha256", "hSha512"].forEach(function (id) { document.getElementById(id).textContent = "—"; });
      m.hidden = true;
    });
  });
  window.tkMd5 = md5Hex;
})();
