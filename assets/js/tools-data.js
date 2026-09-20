/* Tools Kits – shared data registry. Add new tool here, homepage + /tools index auto-update. */
window.TOOLS = [
  {slug:"json-formatter",name:"JSON Formatter",category:"developer",description:"Format and beautify JSON instantly in your browser.",icon:"{}"},
  {slug:"json-validator",name:"JSON Validator",category:"developer",description:"Validate JSON and get clear, friendly error messages.",icon:"✓"},
  {slug:"json-minifier",name:"JSON Minifier",category:"developer",description:"Minify JSON to reduce size for APIs and storage.",icon:"»"},
  {slug:"base64",name:"Base64 Encoder / Decoder",category:"developer",description:"Encode and decode Base64 text safely client-side.",icon:"64"},
  {slug:"url-encoder",name:"URL Encoder / Decoder",category:"developer",description:"Encode and decode URLs and query strings.",icon:"%"},
  {slug:"hash-generator",name:"Hash Generator",category:"developer",description:"Generate MD5, SHA-1, SHA-256 and SHA-512 hashes.",icon:"#"},
  {slug:"uuid-generator",name:"UUID Generator",category:"developer",description:"Generate single or bulk UUID v4 with copy & download.",icon:"◈"},
  {slug:"regex-tester",name:"Regex Tester",category:"developer",description:"Test regular expressions with live match highlighting.",icon:".*"},
  {slug:"jwt-decoder",name:"JWT Decoder",category:"developer",description:"Decode JWT header and payload instantly in your browser. No upload.",icon:"◉"},
  {slug:"diff-checker",name:"Diff Checker",category:"developer",description:"Compare two texts line by line: added, removed and unchanged.",icon:"≠"},
  {slug:"word-counter",name:"Word Counter",category:"text",description:"Count words, characters, sentences and reading time live.",icon:"W"},
  {slug:"case-converter",name:"Case Converter",category:"text",description:"Convert UPPER, lower, Title, camel, snake and kebab case.",icon:"Aa"},
  {slug:"image-compressor",name:"Image Compressor",category:"image",description:"Compress JPG, PNG and WebP in-browser. No upload.",icon:"◐"},
  {slug:"image-resizer",name:"Image Resizer",category:"image",description:"Resize images by width/height with aspect-ratio lock.",icon:"⤢"},
  {slug:"image-converter",name:"Image Converter",category:"image",description:"Convert images between JPG, PNG and WebP locally.",icon:"⇄"},
  {slug:"qr-generator",name:"QR Generator",category:"utility",description:"Create QR codes from text or URL and download PNG.",icon:"QR"},
  {slug:"timestamp-converter",name:"Timestamp Converter",category:"utility",description:"Convert Unix timestamp ↔ date, seconds & milliseconds.",icon:"⏱"},
  {slug:"color-picker",name:"Color Picker",category:"utility",description:"Pick colors and convert HEX, RGB and HSL.",icon:"●"},
  {slug:"unit-converter",name:"Unit Converter",category:"utility",description:"Convert length, weight, temperature, data and time.",icon:"⇌"},
  {slug:"cron-generator",name:"Cron Expression Generator",category:"utility",description:"Build and validate standard 5-field cron expressions.",icon:"◷"}
];
window.TOOL_CATEGORIES = [
  {id:"all",name:"All"},
  {id:"developer",name:"Developer"},
  {id:"text",name:"Text"},
  {id:"image",name:"Image"},
  {id:"utility",name:"Utility"}
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
