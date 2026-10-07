// Checks the exercise library for broken references. Run with: npm test
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const code = fs.readFileSync(path.join(__dirname, '..', 'src', 'data.js'), 'utf8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(code + ';this.out={B,POSES,DESC,MUSC,GROUPS,CHAINS,REF,G2,WARM,USES,PIG,projects:defaultProjects()};', ctx);
const { B, POSES, DESC, MUSC, GROUPS, CHAINS, REF, G2, WARM, USES, PIG, projects } = ctx.out;
const ids = Object.keys(B), bad = (label, list) => assert.strictEqual(list.length, 0, label + ': ' + list.join(', '));

bad('exercise without an explanation', ids.filter(i => !DESC[i]));
bad('explanation for a missing exercise', Object.keys(DESC).filter(i => !B[i]));
bad('exercise whose drawing does not exist', ids.filter(i => !POSES[B[i].pose]));
bad('unknown muscle', ids.filter(i => B[i].m.concat(B[i].p).some(k => !MUSC[k])));
bad('no main muscle', ids.filter(i => !B[i].m.length));
bad('unknown category', ids.filter(i => !GROUPS[B[i].g] || (B[i].g2 || []).some(g => !GROUPS[g] || g === B[i].g)));
bad('unknown use', ids.filter(i => !USES.includes(B[i].use)));
bad('unit is not reps or sec', ids.filter(i => !['reps', 'sec'].includes(B[i].u)));
bad('difficulty outside 0.5 to 6 in half steps', ids.filter(i => B[i].d < 0.5 || B[i].d > 6 || (B[i].d * 2) % 1));
bad('solid-set mark below the usual set', ids.filter(i => !(B[i].ref >= B[i].def && B[i].def >= 1)));
bad('solid-set mark for a missing exercise', Object.keys(REF).filter(i => !B[i]));
bad('second category for a missing exercise', Object.keys(G2).filter(i => !B[i]));
bad('ladder step that does not exist', CHAINS.flat().filter(i => !B[i]));
bad('warm-up move that does not exist', [...WARM].filter(i => !B[i]));
bad('hard move (3 stars or more) with no ladder', ids.filter(i => B[i].d >= 3 && !CHAINS.some(c => c.includes(i))));
bad('starter project with a bad step or color', projects.filter(p => !PIG[p.color] || p.steps.some(s => !B[s.ex] || !(s.target >= 1))).map(p => p.id));
assert.ok(ids.length >= 179, 'library shrank: ' + ids.length);
console.log(`data ok: ${ids.length} exercises, ${ids.filter(i => B[i].g === 'stretch').length} stretches, ${Object.keys(POSES).length} drawings, ${CHAINS.length} ladders`);
