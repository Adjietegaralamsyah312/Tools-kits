TOOLS KITS — FULL WEBSITE DEVELOPMENT TASK
Kamu adalah senior full-stack web developer, UI/UX engineer, SEO engineer, dan security engineer.
Tugasmu adalah membangun dan menyempurnakan project Tools Kits, yaitu website kumpulan online tools gratis yang cepat, modern, responsive, SEO-friendly, aman, dan mudah dikembangkan.
TUJUAN PROJECT
Buat website dengan konsep:
> "Free Online Tools — Fast, Simple, Privacy-Friendly"
Semua tools utama harus dapat digunakan gratis tanpa login dan tanpa subscription.
Prioritas utama:
User Experience
Kecepatan website
Mobile responsive
SEO
Accessibility
Security
Kemudahan maintenance
Kemudahan penambahan tools baru
Jangan membuat fitur premium/paywall/subscription.
---
1. ATURAN PENTING
Sebelum melakukan perubahan:
Baca seluruh struktur project.
Periksa file konfigurasi yang sudah ada.
Jangan menghapus fitur yang masih digunakan.
Jangan mengganti stack secara total.
Pertahankan struktur project yang sudah baik.
Gunakan dependency sesedikit mungkin.
Jangan menambahkan library hanya untuk fungsi sederhana.
Jangan menggunakan API berbayar.
Jangan menggunakan AI API berbayar.
Jangan membuat backend yang sebenarnya tidak diperlukan.
Tools yang dapat diproses sepenuhnya di browser harus diproses di browser.
Jangan mengupload file user ke server apabila tidak diperlukan.
Semua perubahan harus benar-benar diterapkan ke file project, bukan hanya memberikan contoh kode.
---
2. STACK
Pertahankan stack project yang sudah ada.
Prioritaskan:
HTML
CSS / Tailwind CSS jika sudah tersedia
JavaScript
PHP Native apabila project memang menggunakan PHP
MySQL/D1 hanya jika memang diperlukan
Node.js hanya untuk build tooling jika sudah digunakan project
Jangan melakukan migrasi framework tanpa alasan teknis yang kuat.
---
3. STRUKTUR WEBSITE
Buat struktur website yang jelas:
/
/tools
/tools/json-formatter
/tools/json-validator
/tools/json-minifier
/tools/base64
/tools/url-encoder
/tools/hash-generator
/tools/uuid-generator
/tools/regex-tester
/tools/word-counter
/tools/case-converter
/tools/lorem-ipsum
/tools/image-compressor
/tools/image-resizer
/tools/image-converter
/tools/qr-generator
/tools/color-picker
/tools/timestamp-converter
/tools/unit-converter
/blog
/about
/contact
/privacy
/terms
/faq
Gunakan URL yang bersih dan SEO-friendly.
---
4. TOOL PRIORITAS
Implementasikan terlebih dahulu tools berikut.
Developer Tools
JSON Formatter
Fitur:
Format
Validate
Minify
Copy
Clear
Download
Error message yang jelas
Line/error indication apabila memungkinkan
Jangan mengirim JSON ke server jika tidak diperlukan.
Base64 Encoder / Decoder
Fitur:
Encode
Decode
Copy
Clear
Download
URL Encoder / Decoder
Fitur:
Encode
Decode
Copy
Clear
Hash Generator
Minimal:
MD5
SHA-1
SHA-256
SHA-512
Gunakan Web Crypto API apabila algoritmanya didukung browser.
Tambahkan peringatan bahwa hash bukan encryption.
UUID Generator
Fitur:
Generate UUID v4
Generate beberapa UUID sekaligus
Copy
Download
Regex Tester
Fitur:
Regex input
Test text
Flags
Match result
Match count
Error regex yang mudah dipahami
---
5. TEXT TOOLS
Word Counter
Tampilkan:
Words
Characters
Characters excluding spaces
Sentences
Paragraphs
Reading time
Update secara real-time.
Case Converter
Minimal:
UPPERCASE
lowercase
Title Case
Sentence case
camelCase
snake_case
kebab-case
Lorem Ipsum Generator
Fitur:
Paragraph count
Sentence count
Copy
Generate
Clear
---
6. IMAGE TOOLS
Image Compressor
Fitur:
Drag & drop
Upload image
JPG
PNG
WebP apabila browser mendukung
Quality slider
Before/after file size
Compression percentage
Preview
Download
Proses gambar langsung di browser menggunakan Canvas/Web APIs.
Jangan upload gambar user ke server.
Image Resizer
Fitur:
Width
Height
Lock aspect ratio
Preset size
Preview
Download
Image Converter
Minimal:
JPG
PNG
WebP jika didukung
Proses client-side.
---
7. UTILITY TOOLS
QR Generator
Fitur:
Text
URL
Generate
Preview
Download PNG
Gunakan library yang ringan apabila diperlukan.
Timestamp Converter
Fitur:
Unix timestamp → date
Date → Unix timestamp
Seconds
Milliseconds
Local timezone
UTC
Color Picker
Fitur:
HEX
RGB
HSL
Copy value
Visual preview
Unit Converter
Minimal:
Length
Weight
Temperature
Data size
Time
---
8. HOMEPAGE
Homepage harus terlihat seperti produk nyata, bukan sekadar kumpulan tombol.
Hero:
"Free Online Tools for Everyday Work"
Subheading:
"Fast, simple and privacy-friendly tools for developers, students and everyone."
Tambahkan search bar:
"Search tools..."
Kategori:
Developer
Text
Image
Utility
Tampilkan popular tools.
Tambahkan:
Search
Category filter
Popular tools
Recently added
Tool cards
Short explanation
Footer
---
9. DESIGN SYSTEM
Gunakan desain modern dan profesional.
Karakter desain:
clean
minimal
modern
fast
professional
developer-friendly
Gunakan:
responsive layout
rounded cards secukupnya
consistent spacing
clear typography
accessible buttons
obvious input/output areas
Dark mode harus tersedia apabila sesuai dengan struktur project.
Pastikan desain bekerja pada:
320px
375px
425px
768px
1024px
1440px
Jangan membuat horizontal overflow.
---
10. TOOL UI STANDARD
Semua halaman tool harus memiliki pola UI konsisten:
Breadcrumb
Judul
Deskripsi singkat
Tool interface
Actions
Result/output
How to use
Examples
FAQ
Related tools
Contoh:
JSON Formatter
"Format and validate JSON instantly in your browser."
[JSON input]
[Format] [Validate] [Minify] [Copy] [Clear]
Result:
formatted JSON
---
11. PRIVACY
Karena target website adalah tools gratis dan privacy-friendly:
Jangan menyimpan input user tanpa alasan.
Jangan mengirim data user ke server jika browser dapat memprosesnya.
Jangan menyimpan file user.
Jangan memasukkan data user ke database.
Jangan menggunakan tracking invasive.
Tambahkan informasi privacy yang jelas.
---
12. SEO
Setiap tool harus mempunyai SEO metadata unik.
Setiap halaman minimal memiliki:
title
meta description
canonical URL
Open Graph
Twitter/X metadata jika sesuai
semantic headings
Gunakan keyword secara natural.
Contoh:
Title:
"JSON Formatter Online - Free JSON Formatter | Tools Kits"
Description:
"Format, validate and minify JSON online for free. Fast browser-based JSON tools with no login required."
Jangan melakukan keyword stuffing.
Buat:
sitemap.xml
robots.txt
favicon
web manifest jika sesuai
structured data/schema jika relevan
Gunakan Schema.org secara valid.
---
13. SEO CONTENT
Jangan hanya membuat tool kosong.
Setiap tool perlu memiliki konten unik.
Contoh:
What is JSON Formatter?
Jelaskan secara singkat.
How to use
Paste JSON.
Click Format.
Review the result.
Copy or download.
FAQ
Gunakan pertanyaan yang benar-benar relevan.
Jangan menghasilkan artikel generik atau spam AI.
---
14. ACCESSIBILITY
Pastikan:
semantic HTML
label input yang benar
keyboard navigation
focus state
sufficient contrast
aria-label jika diperlukan
button bukan div clickable
alt text
error message accessible
screen reader friendly
Jangan menggunakan warna sebagai satu-satunya indikator status.
---
15. PERFORMANCE
Prioritaskan:
minimal JavaScript
lazy loading
optimized assets
no unnecessary animation
no huge dependencies
client-side processing jika memungkinkan
efficient DOM updates
Target:
Lighthouse Performance bagus
LCP rendah
CLS rendah
INP baik
tidak ada blocking resource yang tidak perlu
---
16. SECURITY
Perhatikan:
XSS
injection
unsafe HTML
malicious file handling
input validation
output escaping
CSP jika memungkinkan
secure headers
CSRF jika ada form backend
rate limiting hanya untuk endpoint yang benar-benar diperlukan
Jangan menggunakan eval() untuk memproses input user.
Jangan menjalankan user input sebagai JavaScript.
Untuk Regex Tester, cegah pola yang berpotensi membekukan browser sejauh memungkinkan.
---
17. CONTACT FORM
Contact form boleh digunakan apabila project membutuhkannya.
Field:
Name
Email
Subject
Message
Validasi:
client-side
server-side
Jangan memperlihatkan kredensial atau secret pada frontend.
Gunakan environment variables untuk secret.
---
18. ERROR HANDLING
Jangan menggunakan error message teknis yang membingungkan user.
Contoh buruk:
"TypeError: Cannot read properties of undefined"
Gunakan:
"Invalid JSON. Please check the syntax near line 4."
Untuk developer tools, berikan informasi teknis yang berguna tetapi tetap mudah dipahami.
---
19. RESPONSIVE MOBILE
Mobile adalah prioritas.
Pastikan:
textarea nyaman digunakan
button tidak terlalu kecil
tool output tidak overflow
cards tidak rusak
navbar nyaman
search mudah digunakan
drag/drop memiliki alternatif upload biasa
---
20. MONETIZATION-FRIENDLY
Website harus disiapkan untuk monetisasi tanpa membuat user experience buruk.
Sediakan area layout yang nantinya dapat digunakan untuk iklan:
top ad
content ad
sidebar ad desktop
bottom ad
Tetapi jangan memasukkan iklan palsu.
Buat komponen placeholder seperti:
AdSlot
yang dapat diaktifkan nanti.
Jangan memaksa pengguna melihat iklan pada tahap development.
---
21. ANALYTICS
Jangan memasang analytics berat.
Buat struktur agar analytics dapat ditambahkan kemudian.
Jangan mengumpulkan input tool user.
---
22. INTERNAL LINKING
Setiap tool harus mempunyai:
Related Tools
Contoh:
JSON Formatter:
JSON Validator
JSON Minifier
Base64 Decoder
Regex Tester
Buat internal linking yang konsisten agar crawler mudah menemukan semua tools.
---
23. SEARCH
Homepage mempunyai pencarian tool.
Search harus:
cepat
client-side
fuzzy/simple matching
berdasarkan nama dan deskripsi
mobile friendly
Contoh:
User mengetik:
"json"
Hasil:
JSON Formatter
JSON Validator
JSON Minifier
---
24. ARCHITECTURE
Buat struktur yang mudah dikembangkan.
Jangan membuat satu file dengan ribuan baris apabila dapat dipecah secara logis.
Pisahkan:
components
utilities
styles
tool logic
pages
data/config
Buat registry/data source untuk tools apabila memungkinkan.
Contoh konsep:
tools = [
{
slug,
name,
category,
description,
icon,
url
}
]
Dengan demikian penambahan tool baru tidak membutuhkan perubahan pada banyak file.
---
25. DOKUMENTASI
Buat/update README.md.
README harus menjelaskan:
Project
Stack
Struktur folder
Cara menjalankan
Cara menambahkan tool
Environment variables
Build
Deployment
Security
SEO
---
26. TESTING
Setelah implementasi jalankan pemeriksaan yang tersedia.
Minimal:
syntax check
build
lint
tests jika tersedia
broken link check jika tersedia
Untuk PHP:
php -l
Untuk Node project:
npm run build
dan command lain yang memang tersedia di package.json.
Jangan menjalankan command yang tidak ada.
---
27. GIT
Gunakan Git dengan commit granular.
Format:
feat: add json formatter
feat: add image compressor
fix: handle invalid json
perf: optimize image compression
seo: improve tool metadata
docs: update setup guide
Jangan membuat satu commit besar untuk semua perubahan apabila dapat dipisahkan.
Sebelum commit:
git status
Periksa perubahan.
Jangan commit:
.env
secret
API key
password
credentials
node_modules
build cache
---
28. DEPLOYMENT
Project harus mudah dideploy ke layanan gratis.
Prioritas deployment:
Cloudflare Pages / Workers apabila arsitektur project sesuai.
Jika project membutuhkan backend/server runtime, gunakan arsitektur Cloudflare yang sesuai.
Jangan memasukkan dependency berbayar.
---
29. IMPORTANT DEVELOPMENT RULE
Jangan hanya memberi saya penjelasan.
Kerjakan langsung project.
Workflow:
Inspect project.
Tentukan arsitektur berdasarkan kondisi project saat ini.
Implementasikan.
Test.
Fix error.
Review UX.
Review SEO.
Review security.
Review mobile.
Tampilkan ringkasan perubahan.
Jangan mengubah sesuatu tanpa alasan.
Jika menemukan fitur lama yang sudah benar, pertahankan.
---
30. DEFINITION OF DONE
Project dianggap selesai untuk milestone ini apabila:
Homepage modern
Search tools bekerja
Category bekerja
Minimal 10 tools benar-benar berfungsi
Mobile responsive
Dark mode apabila tersedia
SEO metadata lengkap
sitemap tersedia
robots tersedia
accessibility dasar terpenuhi
tidak ada console error
tidak ada build error
tidak ada obvious security vulnerability
client-side processing digunakan untuk tools yang memungkinkan
struktur kode mudah dikembangkan
README diperbarui
---
31. PRIORITAS IMPLEMENTASI
Jangan mencoba mengerjakan semuanya sekaligus.
Kerjakan dengan urutan:
PHASE 1
Inspect project
Cleanup
Architecture
Homepage
Navigation
Footer
Tool registry
Responsive system
PHASE 2
JSON Formatter
JSON Validator
JSON Minifier
Base64
URL Encoder/Decoder
PHASE 3
Word Counter
Case Converter
Lorem Ipsum
UUID Generator
Hash Generator
PHASE 4
Image Compressor
Image Resizer
Image Converter
PHASE 5
QR Generator
Timestamp Converter
Color Picker
Unit Converter
PHASE 6
SEO
Sitemap
Robots
Schema
FAQ
Related tools
Internal links
PHASE 7
Accessibility
Security
Performance
Final testing
Jalankan setiap phase secara bertahap.
---
32. FINAL REPORT
Setelah pekerjaan selesai, berikan laporan:
File yang dibuat
File yang diubah
Fitur yang berhasil
Test yang dijalankan
Error yang ditemukan dan diperbaiki
SEO yang diterapkan
Security yang diterapkan
Perintah untuk menjalankan project
Perintah build/deploy
Hal yang masih perlu dikerjakan
PENTING:
Jangan hanya memberikan kode di chat.
Perubahan harus benar-benar diterapkan pada project yang sedang dibuka.