# Tools Kits — Free Online Tools

> Free Online Tools — Fast, Simple, Privacy-Friendly. No login, no paywall, no uploads.

Static site (HTML + CSS + vanilla JS). All tools run **client-side** in the browser.

## Stack

- HTML (semantic, per-tool `index.html` for clean URLs `/tools/<slug>/`)
- CSS custom (`assets/css/style.css`, CSS variables, dark mode via `data-theme`)
- JavaScript vanilla, no build step (`assets/js/main.js`, `assets/js/tools-data.js` + inline tool logic per page)
- 1 CDN lib, lazy on one page only: `qrcode-generator` on QR Generator
- Deploy target: Cloudflare Pages (static). Security headers in `_headers`.

## Struktur folder

```
index.html, about/contact/privacy/terms/faq.html
tools/index.html
tools/<slug>/index.html   (18 tools)
blog/index.html
assets/css/style.css
assets/js/tools-data.js   (REGISTRY — tambah tool baru di sini)
assets/js/main.js         (theme, nav, search/filter, copy/download helpers)
sitemap.xml, robots.txt, favicon.svg, manifest.webmanifest, _headers
TOOLS_KITS.md, README.md
```

## Cara menjalankan

No build. Pilih salah satu:

```bash
# Python
python3 -m http.server 8000
# Node
npx serve .
# PHP
php -S localhost:8000
```

Buka `http://localhost:8000/`.

## Cara menambahkan tool

1. Tambah entry di `assets/js/tools-data.js` (`slug, name, category, description, icon`) + related di `RELATED`.
2. Duplikat folder tool terdekat, mis. `tools/json-formatter/` → `tools/my-tool/`, sesuaikan:
   title, meta description, canonical, OG, H1, deskripsi, How-to, FAQ, `data-tool` untuk related.
3. Tambah URL ke `sitemap.xml`.
4. Pola UI wajib: breadcrumb → judul → deskripsi → interface → actions → result → How to use → Examples → FAQ → Related tools.

## Environment variables / Build / Deploy

- Tidak ada secret, tidak ada `.env`, tidak ada backend.
- Build: tidak ada (`npm run build` tidak tersedia — sengaja zero-build).
- Deploy GitHub Pages: push ke branch main → Settings → Pages → Deploy from branch → folder `/ (root)`. `_headers` hanya berlaku di Cloudflare (diabaikan GitHub, harmless).

## Security

- No `eval()`, no `innerHTML` untuk input user (kecuali regex highlight yang di-escape + Lorem yang generate sendiri).
- Output via `textContent`; copy via Clipboard API + `execCommand` fallback.
- File image divalidasi MIME + 20MB limit, diproses via Canvas/ObjectURL, tidak diupload.
- Regex Tester: cap 50k chars, 500 matches, try/catch, peringatan ReDoS `(a+)+`.
- CSP + `nosniff`, `DENY` framing, `Referrer-Policy` di `_headers`.
- Contact form: validasi client-side; jangan taruh kredensial di frontend.

## SEO

- Title/description/canonical/OG unik per halaman; semantic headings; breadcrumb.
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `favicon.svg`.
- Schema.org: `WebSite+SearchAction` (home), `WebApplication` (tools), `FAQPage` (JSON formatter, FAQ).
- Internal linking: Related Tools per halaman + footer + `/tools/` index.
- Canonical base saat ini: `https://adjietegaralamsyah312.github.io/Tools-kits/` (GitHub Pages project site).

## Testing

`bash` tidak tersedia di environment ini, jadi verifikasi dilakukan via inspeksi file:

- [x] Semua 18 tool dirs + homepage + 6 halaman statis ada
- [x] `tools-data.js` 18 entries, kategori valid
- [x] Tidak ada `eval(`, tidak ada API key/secret
- Manual yang perlu dijalankan user: buka tiap tool, cek console (harus bersih), cek 320px/1440px, Lighthouse.

```bash
# jika bash tersedia:
python3 -m http.server 8000
# cek tiap /tools/<slug>/ tidak 404, tidak ada console error
```

## Perintah ringkas

- Run: `python3 -m http.server 8000`
- Deploy: push → GitHub Pages (branch main, folder `/` root)
