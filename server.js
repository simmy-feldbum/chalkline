// Tiny static server for Chalkline. No dependencies.
const http = require('http'), fs = require('fs'), zlib = require('zlib'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'));
const gz = zlib.gzipSync(html);
const port = process.env.PORT || 8080;

http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/health') { res.writeHead(200, { 'content-type': 'text/plain' }); return res.end('ok'); }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
  if (url === '/favicon.ico') { res.writeHead(204); return res.end(); }
  if (url !== '/' && url !== '/index.html') { res.writeHead(302, { location: '/' }); return res.end(); }
  const useGz = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  const headers = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache', vary: 'accept-encoding' };
  if (useGz) headers['content-encoding'] = 'gzip';
  res.writeHead(200, headers);
  res.end(req.method === 'HEAD' ? undefined : useGz ? gz : html);
}).listen(port, '0.0.0.0', () => console.log('Chalkline listening on port ' + port));
