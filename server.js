// Chalkline server: serves the app and keeps one shared log. No dependencies.
// Storage: JSON files in a folder. On Railway, attach a volume to the service and
// the log survives redeploys (the volume's mount path is picked up automatically).
// Optional lock: set the CHALKLINE_KEY variable and each device must enter it once.
const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib'), crypto = require('crypto');

const PORT = process.env.PORT || 8080;
const VOL = process.env.RAILWAY_VOLUME_MOUNT_PATH || '';
const DIR = process.env.DATA_DIR || (VOL ? path.join(VOL, 'chalkline') : path.join(__dirname, 'data'));
const PERSISTENT = !!(VOL || process.env.DATA_DIR);
const KEY = (process.env.CHALKLINE_KEY || '').trim();
const MAX_BODY = 4 * 1024 * 1024;

const html = fs.readFileSync(path.join(__dirname, 'index.html'));
const gz = zlib.gzipSync(html);

fs.mkdirSync(DIR, { recursive: true });
const docs = {};
for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.json')) continue;
  try { docs[f.slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch (e) { console.error('Skipping unreadable file', f); }
}

const okId = id => /^[A-Za-z0-9_-]{1,40}$/.test(id);
function save(id) {
  const file = path.join(DIR, id + '.json'), tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(docs[id]));
  fs.renameSync(tmp, file);
}
// Logged sets from different devices are combined, never overwritten.
function mergeLog(a, b) {
  const gone = [...new Set([...(a.gone || []), ...(b.gone || [])])], g = new Set(gone);
  const wiped = Math.max(a.wiped || 0, b.wiped || 0), m = new Map();
  for (const e of [...(a.entries || []), ...(b.entries || [])]) if (e && e.id && !g.has(e.id) && (e.t || 0) > wiped) m.set(e.id, e);
  return { entries: [...m.values()], gone, wiped, at: Math.max(a.at || 0, b.at || 0) };
}
function authed(req) {
  if (!KEY) return true;
  const got = Buffer.from(String(req.headers['x-chalkline-key'] || '')), want = Buffer.from(KEY);
  return got.length === want.length && crypto.timingSafeEqual(got, want);
}
function json(res, code, body) {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}

http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (url === '/health') { res.writeHead(200, { 'content-type': 'text/plain' }); return res.end('ok'); }
  if (url === '/api/info') return json(res, 200, { app: 'chalkline', needKey: !!KEY, persistent: PERSISTENT });

  if (url.startsWith('/api/')) {
    if (!authed(req)) return json(res, 401, { error: 'key required' });
    if (url === '/api/docs' && req.method === 'GET') return json(res, 200, { docs });
    const m = url.match(/^\/api\/docs\/([^/]+)$/);
    if (m && req.method === 'PUT') {
      const id = decodeURIComponent(m[1]);
      if (!okId(id)) return json(res, 400, { error: 'bad id' });
      let size = 0; const chunks = [];
      req.on('data', c => { size += c.length; if (size > MAX_BODY) { json(res, 413, { error: 'too large' }); req.destroy(); } else chunks.push(c); });
      req.on('end', () => {
        if (res.writableEnded) return;
        let body;
        try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch (e) { return json(res, 400, { error: 'bad json' }); }
        if (!body || typeof body !== 'object' || Array.isArray(body)) return json(res, 400, { error: 'bad body' });
        docs[id] = id.startsWith('log-') && docs[id] ? mergeLog(docs[id], body) : body;
        try { save(id); } catch (e) { console.error('Write failed', e.message); return json(res, 500, { error: 'write failed' }); }
        json(res, 200, { ok: true });
      });
      return;
    }
    return json(res, 404, { error: 'not found' });
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
  if (url === '/favicon.ico') { res.writeHead(204); return res.end(); }
  if (url !== '/' && url !== '/index.html') { res.writeHead(302, { location: '/' }); return res.end(); }
  const useGz = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  const headers = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache', vary: 'accept-encoding' };
  if (useGz) headers['content-encoding'] = 'gzip';
  res.writeHead(200, headers);
  res.end(req.method === 'HEAD' ? undefined : useGz ? gz : html);
}).listen(PORT, '0.0.0.0', () => console.log(`Chalkline on port ${PORT}. Data in ${DIR} (${PERSISTENT ? 'permanent' : 'temporary'}). Key ${KEY ? 'required' : 'not set'}.`));
