// Builds index.html from the files in src/. No dependencies.
//   node build.js          write index.html
//   node build.js --check  exit 1 if index.html is out of date with src/
const fs = require('fs'), path = require('path');
const src = f => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
const ORDER = ['data.js', 'figure.js', 'core.js', 'views.js', 'ui.js']; // order matters: later files use earlier ones
const html = src('head.html') + '<script>\n"use strict";\n' + ORDER.map(src).join('') + '</script>\n</body></html>\n';
const out = path.join(__dirname, 'index.html');
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
  if (cur !== html) { console.error('index.html is out of date. Run: npm run build'); process.exit(1); }
  console.log('index.html is up to date');
} else {
  fs.writeFileSync(out, html);
  console.log('Wrote index.html (' + Buffer.byteLength(html) + ' bytes)');
}
