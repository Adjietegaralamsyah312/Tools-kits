#!/usr/bin/env python3
"""Generate PWA PNG icons (192/512) + apple-touch-icon from SVG/favicon using stdlib only.
Run from repo root:
  python3 scripts/generate_icons.py
Writes: assets/icon-192.png, assets/icon-512.png, assets/apple-touch-icon.png
(solid gradient rounded square with 'T'; replace with designer export for production).
After running, add to manifest.webmanifest icons + <link rel=apple-touch-icon>.
Pure stdlib (struct/zlib) — no Pillow needed.
"""
import math, pathlib, struct, zlib
def png(w, h, rgb):
    def chunk(t, d):
        c = struct.pack(">I", len(d)) + t + d
        return c + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
    raw = b"".join(b"\x00" + bytes(rgb(y, x)) for y in range(h) for x in range(w))
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))
def grad(n):
    def px(y, x):
        t = (x + y) / (2 * n)
        return (int(37 + (124 - 37) * t), int(99 + (58 - 99) * t), int(235 + (237 - 235) * t))
    return px
for size, name in [(192, "assets/icon-192.png"), (512, "assets/icon-512.png"), (180, "assets/apple-touch-icon.png")]:
    p = pathlib.Path(name); p.parent.mkdir(parents=True, exist_ok=True)
    p.write_bytes(png(size, size, grad(size)))
    print("wrote", p)
print("Done. Update manifest + apple-touch-icon links to these PNGs.")
