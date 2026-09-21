/* Tools Kits – shared data registry. Add new tool here, homepage + /tools index auto-update. */
window.TOOLS = [
  {slug:"json-formatter",name:"JSON Formatter",category:"developer",description:"Format dan percantik JSON langsung di browser.",icon:"{}"},
  {slug:"json-validator",name:"JSON Validator",category:"developer",description:"Validasi JSON dan dapatkan pesan kesalahan yang jelas dan ramah.",icon:"✓"},
  {slug:"json-minifier",name:"JSON Minifier",category:"developer",description:"Perkecil JSON untuk menghemat ukuran API dan penyimpanan.",icon:"»"},
  {slug:"base64",name:"Base64 Encoder / Decoder",category:"developer",description:"Enkode dan dekode teks Base64 dengan aman di sisi klien.",icon:"64"},
  {slug:"url-encoder",name:"URL Encoder / Decoder",category:"developer",description:"Enkode dan dekode URL serta query string.",icon:"%"},
  {slug:"hash-generator",name:"Hash Generator",category:"developer",description:"Buat hash MD5, SHA-1, SHA-256 dan SHA-512.",icon:"#"},
  {slug:"uuid-generator",name:"UUID Generator",category:"developer",description:"Buat satu atau banyak UUID v4 dengan salin & unduh.",icon:"◈"},
  {slug:"regex-tester",name:"Regex Tester",category:"developer",description:"Uji ekspresi reguler dengan sorotan kecocokan langsung.",icon:".*"},
  {slug:"jwt-decoder",name:"JWT Decoder",category:"developer",description:"Dekode header dan payload JWT langsung di browser tanpa unggah.",icon:"◉"},
  {slug:"diff-checker",name:"Diff Checker",category:"developer",description:"Bandingkan dua teks baris per baris: ditambah, dihapus, dan tidak berubah.",icon:"≠"},
  {slug:"word-counter",name:"Word Counter",category:"text",description:"Hitung kata, karakter, kalimat, dan waktu baca secara langsung.",icon:"W"},
  {slug:"case-converter",name:"Case Converter",category:"text",description:"Ubah huruf UPPER, lower, Title, camel, snake, dan kebab.",icon:"Aa"},
  {slug:"image-compressor",name:"Image Compressor",category:"image",description:"Kompres JPG, PNG, dan WebP langsung di browser tanpa unggah.",icon:"◐"},
  {slug:"image-resizer",name:"Image Resizer",category:"image",description:"Ubah ukuran gambar berdasarkan lebar/tinggi dengan kunci rasio aspek.",icon:"⤢"},
  {slug:"image-converter",name:"Image Converter",category:"image",description:"Konversi gambar antara JPG, PNG, dan WebP secara lokal.",icon:"⇄"},
  {slug:"qr-generator",name:"QR Generator",category:"utility",description:"Buat kode QR dari teks atau URL dan unduh PNG.",icon:"QR"},
  {slug:"timestamp-converter",name:"Timestamp Converter",category:"utility",description:"Konversi timestamp Unix ↔ tanggal, detik & milidetik.",icon:"⏱"},
  {slug:"color-picker",name:"Color Picker",category:"utility",description:"Pilih warna dan konversi HEX, RGB, dan HSL.",icon:"●"},
  {slug:"unit-converter",name:"Unit Converter",category:"utility",description:"Konversi panjang, berat, suhu, data, dan waktu.",icon:"⇌"},
  {slug:"cron-generator",name:"Cron Expression Generator",category:"utility",description:"Susun dan validasi ekspresi cron standar 5 kolom.",icon:"◷"}
];
window.TOOL_CATEGORIES = [
  {id:"all",name:"All",name_id:"Semua"},
  {id:"developer",name:"Developer",name_id:"Developer"},
  {id:"text",name:"Text",name_id:"Teks"},
  {id:"image",name:"Image",name_id:"Gambar"},
  {id:"utility",name:"Utility",name_id:"Utilitas"},
  {id:"security",name:"Security",name_id:"Keamanan"}
];
window.RELATED = {
  "json-formatter":["json-validator","json-minifier","base64","regex-tester"],
  "json-validator":["json-formatter","json-minifier","regex-tester","base64"],
  "json-minifier":["json-formatter","json-validator","base64","url-encoder"],
  "base64":["json-formatter","url-encoder","hash-generator","uuid-generator"],
  "url-encoder":["base64","json-formatter","regex-tester","hash-generator"],
  "hash-generator":["base64","uuid-generator","url-encoder","timestamp-converter"],
  "uuid-generator":["hash-generator","timestamp-converter","base64","json-formatter"],
  "regex-tester":["json-formatter","json-validator","url-encoder","word-counter"],
  "word-counter":["case-converter","diff-checker","regex-tester","unit-converter"],
  "case-converter":["word-counter","jwt-decoder","regex-tester","url-encoder"],
  "jwt-decoder":["base64","hash-generator","url-encoder","json-formatter"],
  "diff-checker":["word-counter","case-converter","json-validator","unit-converter"],
  "image-compressor":["image-resizer","image-converter","qr-generator","unit-converter"],
  "image-resizer":["image-compressor","image-converter","unit-converter","color-picker"],
  "image-converter":["image-compressor","image-resizer","qr-generator","color-picker"],
  "qr-generator":["image-compressor","url-encoder","color-picker","base64"],
  "timestamp-converter":["uuid-generator","hash-generator","unit-converter","json-formatter"],
  "color-picker":["image-converter","qr-generator","unit-converter","image-resizer"],
  "unit-converter":["timestamp-converter","color-picker","word-counter","image-resizer"],
  "cron-generator":["timestamp-converter","unit-converter","regex-tester","word-counter"]
};
