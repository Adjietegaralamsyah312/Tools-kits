#!/usr/bin/env python3
"""Vendor qrcode-generator locally for full self-host + offline.
Run from repo root (needs network once):
  python3 scripts/vendor_qr.py
Downloads the pinned file from jsDelivr to assets/js/qrcode-generator.min.js
and prints sha384 (for optional SRI documentation).
Note: jsDelivr warns against SRI for dynamically minified files, which is why
the site prefers self-host; CDN is kept only as fallback with crossorigin.
"""
import hashlib, pathlib, sys, urllib.request
URL = "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"
DST = pathlib.Path("assets/js/qrcode-generator.min.js")
def main():
    print("downloading", URL)
    req = urllib.request.Request(URL, headers={"User-Agent": "ToolsKits-vendor/1.0"})
    data = urllib.request.urlopen(req, timeout=60).read()
    DST.parent.mkdir(parents=True, exist_ok=True)
    DST.write_bytes(data)
    print("wrote", DST, len(data), "bytes")
    print("sha384:", hashlib.sha384(data).hexdigest())
    print("Then update tools/qr-generator/index.html to <script src=../../assets/js/qrcode-generator.min.js defer></script>")
if __name__ == "__main__":
    sys.exit(main())
