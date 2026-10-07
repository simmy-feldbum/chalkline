// Starts the real server on a temporary folder and checks storage, merging, the key lock and restarts.
const { spawn } = require('child_process'), fs = require('fs'), os = require('os'), path = require('path'), assert = require('assert');
const ROOT = path.join(__dirname, '..');

function start(env) {
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, ['server.js'], { cwd: ROOT, env: { ...process.env, ...env } });
    let out = '';
    p.stdout.on('data', d => { out += d; if (out.includes('Chalkline on port')) resolve(p); });
    p.stderr.on('data', d => { out += d; });
    p.on('exit', c => reject(new Error('server exited ' + c + ': ' + out)));
    setTimeout(() => reject(new Error('server did not start: ' + out)), 5000);
  });
}
const stop = p => new Promise(r => { p.removeAllListeners('exit'); p.on('exit', r); p.kill(); });
const E = (id, t) => ({ id, ex: 'pushup', n: 10, d: '2026-10-06', t, p: 7, b: [7, 0, 0, 0], f: '' });

async function run(key) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'chalkline-')), port = 18000 + Math.floor(Math.random() * 2000);
  const U = 'http://127.0.0.1:' + port, env = { PORT: String(port), DATA_DIR: dir, CHALKLINE_KEY: key };
  const H = { 'content-type': 'application/json', 'x-chalkline-key': key };
  const put = (id, body, headers = H) => fetch(U + '/api/docs/' + id, { method: 'PUT', headers, body: JSON.stringify(body) });
  const docs = async () => (await (await fetch(U + '/api/docs', { headers: H })).json()).docs;
  let srv = await start(env);
  try {
    assert.strictEqual(await (await fetch(U + '/health')).text(), 'ok');
    assert.deepStrictEqual(await (await fetch(U + '/api/info')).json(), { app: 'chalkline', needKey: !!key, persistent: true });
    const page = await fetch(U + '/'); assert.strictEqual(page.status, 200); assert.ok((await page.text()).includes('<title>Chalkline'));
    if (key) {
      assert.strictEqual((await fetch(U + '/api/docs')).status, 401, 'no key must be refused');
      assert.strictEqual((await put('main', { at: 1 }, { 'content-type': 'application/json', 'x-chalkline-key': 'wrong' })).status, 401);
    }
    // two devices write the same month without seeing each other: both sets survive
    assert.strictEqual((await put('log-2026-10', { entries: [E('a', 10)], gone: [], wiped: 0, at: 1 })).status, 200);
    assert.strictEqual((await put('log-2026-10', { entries: [E('b', 11)], gone: [], wiped: 0, at: 2 })).status, 200);
    assert.deepStrictEqual((await docs())['log-2026-10'].entries.map(e => e.id).sort(), ['a', 'b']);
    // a deleted set stays deleted even when a stale device sends it again
    await put('log-2026-10', { entries: [E('b', 11)], gone: ['a'], wiped: 0, at: 3 });
    await put('log-2026-10', { entries: [E('a', 10), E('b', 11), E('c', 12)], gone: [], wiped: 0, at: 4 });
    assert.deepStrictEqual((await docs())['log-2026-10'].entries.map(e => e.id).sort(), ['b', 'c']);
    // "erase everything" drops sets logged before it and keeps sets logged after
    await put('log-2026-10', { entries: [E('d', 100)], gone: [], wiped: 50, at: 5 });
    assert.deepStrictEqual((await docs())['log-2026-10'].entries.map(e => e.id), ['d']);
    // settings document is replaced whole
    await put('main', { v: 1, projects: [{ id: 'p1' }], at: 9 });
    assert.strictEqual((await docs()).main.projects[0].id, 'p1');
    // bad requests
    assert.strictEqual((await put('bad id!', { at: 1 })).status, 400);
    assert.strictEqual((await fetch(U + '/api/docs/main', { method: 'PUT', headers: H, body: '{not json' })).status, 400);
    assert.strictEqual((await fetch(U + '/api/nope', { headers: H })).status, 404);
    // restart: everything is still there
    await stop(srv); srv = await start(env);
    const after = await docs();
    assert.deepStrictEqual(after['log-2026-10'].entries.map(e => e.id), ['d']);
    assert.strictEqual(after.main.at, 9);
  } finally { await stop(srv); fs.rmSync(dir, { recursive: true, force: true }); }
}

(async () => {
  await run(''); console.log('server ok: open (no key)');
  await run('gold-star-7'); console.log('server ok: locked with a key');
})().catch(e => { console.error(e); process.exit(1); });
