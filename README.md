# Tools Kits — Free Online Tools

> Free Online Tools — Fast, Simple, Privacy-Friendly. No login, no paywall, no uploads.

Static site (HTML + CSS + vanilla JS). All tools run **client-side** in the browser.
Production URL: `https://adjietegaralamsyah312.github.io/Tools-kits/`

## Stack

- HTML (semantic, per-tool `index.html` for clean URLs `/tools/<slug>/`)
- CSS custom (`assets/css/style.css`, CSS variables, dark mode via `data-theme`)
- JavaScript vanilla, no build step (`assets/js/main.js`, `assets/js/tools-data.js`, page-specific `assets/js/tool-*.js`)
- 1 CDN lib, lazy on one page only: `qrcode-generator` on QR Generator (with `crossorigin="anonymous"`; SRI omitted because jsDelivr warns against SRI for dynamically generated files — run `python3 scripts/vendor_qr.py` to self-host `assets/js/qrcode-generator.min.js` fully offline; page logic in `assets/js/tool-qr-generator.js` with 2000-char cap + friendly errors)
- Deploy target: GitHub Pages (static). `_headers` is kept only for a possible future Cloudflare deployment — it is **ignored by GitHub Pages**, so documented security headers there are NOT active on the production URL.

## Struktur folder

```
index.html, about/contact/privacy/terms/faq.html, 404.html
tools/index.html
tools/<slug>/index.html   (18 tools, see list below)
blog/index.html
assets/css/style.css
assets/js/tools-data.js   (REGISTRY — tambah tool baru di sini)
assets/js/main.js         (theme, nav, search/filter with ?q=, copy/download helpers)
assets/js/tool-*.js       (page-specific logic for big tools: image-compressor/resizer/converter, regex-tester, hash-generator, qr-generator)
assets/js/regex-worker.js (Web Worker for Regex Tester, terminable on 1.5s timeout)
assets/og-image.png       (1200x630 social preview — generate via script, see Testing)
assets/icon-192.png, icon-512.png, apple-touch-icon.png (generate via python3 scripts/generate_icons.py; manifest currently uses favicon.svg + og-image.png to avoid broken refs)
scripts/vendor_qr.py, scripts/generate_icons.py (stdlib-only helpers, no build)
.nojekyll                 (GitHub Pages: disable Jekyll processing)
.github/workflows/validate.yml  (lightweight static CI, no build)
sitemap.xml, robots.txt, favicon.svg, manifest.webmanifest, _headers
README.md
```

## 18 tools

Developer: json-formatter, json-validator, json-minifier, base64, url-encoder,
hash-generator, uuid-generator, regex-tester.
Text: word-counter, case-converter, lorem-ipsum.
Image: image-compressor, image-resizer, image-converter.
Utility: qr-generator, timestamp-converter, color-picker, unit-converter.

## Cara menjalankan lokal

No build. Dari repo root:

```bash
python3 -m http.server 8000
# atau: npx serve .   |   php -S localhost:8000
```

Buka `http://localhost:8000/Tools-kits/` jika folder repo diserve dari parent,
atau serve langsung dari dalam folder `Tools-kits/` lalu buka `http://localhost:8000/`.

## Cara menambahkan tool

1. Tambah entry di `assets/js/tools-data.js` (`slug, name, category, description, icon`) + related di `RELATED`.
2. Duplikat folder tool terdekat, mis. `tools/json-formatter/` → `tools/my-tool/`, sesuaikan:
   title, meta description, canonical, OG/Twitter, H1, deskripsi, How-to, FAQ, `data-tool` untuk related.
3. Tambah URL ke `sitemap.xml`, tambah `<noscript>` link bila perlu, tambah ItemList entry di `tools/index.html`.
4. Pola UI wajib: breadcrumb → judul → deskripsi → interface → actions → result → How to use → Examples → FAQ → Related tools.

## Environment variables / Build / Deploy

- Tidak ada secret, tidak ada `.env`, tidak ada backend.
- Build: tidak ada (sengaja zero-build).
- Deploy GitHub Pages: push ke branch main → Settings → Pages → Deploy from branch → folder `/ (root)`.
  `.nojekyll` menonaktifkan pemrosesan Jekyll agar deploy static deterministik.
- `_headers` (CSP, nosniff, framing, referrer) hanya berlaku di Cloudflare Pages;
  GitHub Pages mengabaikannya. Jangan klaim header tersebut aktif di production.

## Security

- No `eval()`, no `new Function()`.
- Output user via `textContent`/DOM aman; `innerHTML` hanya untuk data registry internal
  yang di-escape dan highlight regex yang di-escape (diaudit).
- File image: validasi MIME, batas ukuran + megapiksel konsisten, pesan user-friendly,
  object URL di-revoke, tidak diupload.
- Regex Tester: validasi syntax, batas pattern 500/input 50k, eksekusi di Web Worker dengan
  timeout 1.5s (terminate saat budget habis), cap 500 match, tanpa `eval`.
- Hash: MD5 UTF-8-safe (TextEncoder, test vector di header file), SHA via Web Crypto + SHA-1 fallback;
  MD5/SHA-1 ditandai bukan untuk password.
- Unit: data 1024 memakai KiB/MiB/GiB/TiB; Word Counter memakai Intl.Segmenter + fallback;
  UUID memakai crypto.randomUUID/getRandomValues dengan error jelas bila secure random tidak ada.
- Contact form: validasi client-side; jujur bahwa ini demo tanpa pengiriman
  (sambungkan backend/mailto bila ingin kirim betulan); jangan taruh kredensial di frontend.

## SEO

- Title/description/canonical/OG/Twitter unik per halaman; semantic headings; breadcrumb.
  Wajib ada: og:site_name, og:locale, theme-color, apple-touch-icon, manifest (bila relevan).
- `sitemap.xml` (26 URL), `robots.txt`, `manifest.webmanifest`, `favicon.svg`, `og-image.png`.
- Schema.org: `WebSite` (home, tanpa SearchAction), `WebApplication` unik per tool,
  `FAQPage` (JSON Formatter, FAQ — parity dengan FAQ terlihat), `ItemList` (katalog /tools/),
  `BreadcrumbList` (tools + tool pages).
- Internal linking: Related Tools + breadcrumb + footer + `/tools/` index + `<noscript>` fallbacks.
- Canonical/OG base: `https://adjietegaralamsyah312.github.io/Tools-kits/`.

## Testing

```bash
python3 -m http.server 8000
# cek tiap /tools/<slug>/ tidak 404, tidak ada console error
```

CI ringan (`.github/workflows/validate.yml`, tanpa build): parse HTML, larangan
`toolskits.pages.dev`/`eval(`/`new Function(`, validasi sitemap XML + format URL,
cek metadata wajib + canonical, cek asset relatif, samakan jumlah tool dengan registry.

Riwayat environment: shell non-interaktif di environment dev ini mati (semua perintah
timeout), sehingga sebagian validasi hanya bisa lewat inspeksi file; jalankan
perintah CI/validasi di mesin lokal atau via GitHub Actions sebelum rilis.

## Perintah ringkas

- Run: `python3 -m http.server 8000`
- Deploy: push → GitHub Pages (branch main, folder `/` root)
- Icons PWA: `python3 scripts/generate_icons.py` (hasilkan icon-192/512 + apple-touch-icon)
- QR self-host: `python3 scripts/vendor_qr.py` (hasilkan assets/js/qrcode-generator.min.js)
- OG image sudah ada di `assets/og-image.png` (1200x630)
