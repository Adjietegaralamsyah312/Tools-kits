#!/usr/bin/env node
/* Automated MD5 test vectors for assets/js/tool-hash-generator.js.
 * No npm dependencies — uses Node stdlib only (fs/path/vm).
 * Fails with non-zero exit code on any mismatch.
 *
 * Run from repo root:
 *   node scripts/test_md5_vectors.js
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SRC = path.join(__dirname, "..", "assets", "js", "tool-hash-generator.js");
const VECTORS = [
  ["", "d41d8cd98f00b204e9800998ecf8427e"],
  ["abc", "900150983cd24fb0d6963f7d28e17f72"],
  ["hello world", "5eb63bbbe01eeed093cb22bb8f5acdc3"],
  ["The quick brown fox jumps over the lazy dog", "9e107d9d372bb6826bd81d3542a419d6"]
];

const src = fs.readFileSync(SRC, "utf8");

// Guard: implementation must stay eval/new-Function free.
if (/eval\s*\(/.test(src)) { console.error("FAIL: eval( found in tool-hash-generator.js"); process.exit(2); }
if (/new Function\s*\(/.test(src)) { console.error("FAIL: new Function( found in tool-hash-generator.js"); process.exit(2); }

// Load the browser file in a sandbox with minimal DOM stubs.
// The file only touches `document` (addEventListener noop) and `window.tkMd5`
// at load time; crypto/DOM wiring is not executed.
const sandbox = {
  console: console,
  TextEncoder: TextEncoder,
  window: {},
  document: { addEventListener: function () {} }
};
vm.createContext(sandbox);
try {
  vm.runInContext(src, sandbox, { filename: "tool-hash-generator.js" });
} catch (e) {
  console.error("FAIL: could not load tool-hash-generator.js: " + (e && e.message));
  process.exit(2);
}
const md5 = sandbox.window.tkMd5;
if (typeof md5 !== "function") {
  console.error("FAIL: window.tkMd5 is not exported (expected function).");
  process.exit(2);
}

let bad = 0;
for (const pair of VECTORS) {
  const input = pair[0], expected = pair[1];
  let got;
  try {
    got = md5(input);
  } catch (e) {
    console.error("FAIL: " + JSON.stringify(input) + " threw: " + (e && e.message));
    bad++;
    continue;
  }
  if (got === expected) {
    console.log("PASS: " + JSON.stringify(input) + " -> " + got);
  } else {
    console.error("FAIL: " + JSON.stringify(input) + " -> " + got + " (expected " + expected + ")");
    bad++;
  }
}
if (bad) {
  console.error(bad + " vector(s) FAILED.");
  process.exit(1);
}
console.log("All 4 MD5 vectors passed.");

// Unicode cross-check (UTF-8 2-byte, 3-byte, 4-byte) against Node's OpenSSL
// reference. Expected values are computed at runtime by the trusted oracle
// (not hardcoded), so this verifies UTF-8 handling without a stale constant.
const UNICODE_ORACLES = ["café", "你好", "😀"];
const refCrypto = require("crypto");
for (const s of UNICODE_ORACLES) {
  const expected = refCrypto.createHash("md5").update(s, "utf8").digest("hex");
  let got;
  try {
    got = md5(s);
  } catch (e) {
    console.error("FAIL(unicode): " + JSON.stringify(s) + " threw: " + (e && e.message));
    process.exit(1);
  }
  if (got === expected) {
    console.log("PASS(unicode): " + JSON.stringify(s) + " -> " + got);
  } else {
    console.error("FAIL(unicode): " + JSON.stringify(s) + " -> " + got + " (openssl expected " + expected + ")");
    process.exit(1);
  }
}
console.log("All 3 Unicode cross-checks passed.");
