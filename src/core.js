/* ================= state, storage, scoring ================= */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const ds=dt=>`${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}`;
const pd=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c,12)};
const today=()=>ds(new Date());
const addDays=(s,n)=>{const d=pd(s);d.setDate(d.getDate()+n);return ds(d)};
const diffDays=(a,b)=>Math.round((pd(a)-pd(b))/864e5);
const weekStart=s=>addDays(s,-((pd(s).getDay()+6)%7));
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const fmtDay=s=>{const d=pd(s);return `${DOW[d.getDay()]}, ${MON[d.getMonth()]} ${d.getDate()}`};
const fmtShort=s=>{const d=pd(s);return `${MON[d.getMonth()]} ${d.getDate()}`};
const ago=n=>n<=0?'today':n===1?'yesterday':`${n} days ago`;
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const clone=o=>JSON.parse(JSON.stringify(o));

const LS='chalkline.v1';
const blank=()=>({v:1,custom:{},projects:defaultProjects(),plan:{},layout:{},log:[],ts:{},gone:{},wiped:0});
let S=blank();
const GONE={id:'?',name:'Removed exercise',g:'core',u:'reps',d:1,use:'Strength',m:[],p:[],def:5,pose:'pushup'};
const X=id=>S.custom[id]||B[id]||GONE;
const allEx=()=>[...Object.values(B),...Object.values(S.custom)];
const unit=(e,n)=>e.u==='sec'?`${n} s`:`${n} ${n===1?'rep':'reps'}`;
const unitWord=e=>e.u==='sec'?'seconds':'reps';
const refOf=e=>e.ref||e.def||1;
const valOf=e=>10*Math.pow(2,e.d-1);              // value of a solid set: doubles with every star
const curve=x=>x<=1?x:Math.pow(x,2.2);             // linear up to the mark, then climbing fast
const basePts=(e,n)=>n>0?Math.max(1,Math.round(valOf(e)*curve(n/refOf(e)))):0;
const inG=(e,g)=>e.g===g||(e.g2||[]).includes(g);
const descOf=e=>e.custom?(e.desc||''):(DESC[e.id]||'');

/* ---- derived stats (memoized per change) */
let _st=null;
function bump(){_st=null}
function stats(){
  if(_st)return _st;
  const by={},days={},grp={};
  const log=[...S.log].sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:a.t-b.t);
  for(const e of log){
    const s=by[e.ex]||(by[e.ex]={best:0,bestD:null,last:null,count:0,pts:0});
    if(e.n>s.best){s.best=e.n;s.bestD=e.d}
    s.last=e.d;s.count++;s.pts+=e.p;days[e.d]=(days[e.d]||0)+e.p;
    const g=X(e.ex).g; if(!grp[g]||grp[g]<e.d)grp[g]=e.d;
  }
  return _st={by,days,grp,log};
}
function projStatus(pr){
  const st=stats();let peak=-1,cur=-1,cleared=0;
  const steps=pr.steps.map((s,i)=>{const b=st.by[s.ex]?.best||0,ok=b>=s.target;if(ok){peak=i;cleared++}else if(cur<0)cur=i;return{...s,i,best:b,ok}});
  return{steps,peak,cur,cleared,done:steps.length>0&&cleared===steps.length,n:steps.length};
}
const rangePts=(from,to)=>{const d=stats().days;let t=0;for(const k in d)if(k>=from&&k<=to)t+=d[k];return t};

/* ---- scoring */
function score(exId,n,d,log=S.log){
  const e=X(exId),base=basePts(e,n);
  const prior=log.filter(x=>x.ex===exId&&x.d<=d);
  let fresh=0,peak=0,step=0,flags='',gap=null;
  if(!prior.length){fresh=Math.max(3,Math.round(base*.5));flags+='N'}
  else{
    const last=prior.reduce((m,x)=>x.d>m?x.d:m,'');gap=diffDays(d,last);
    if(gap>3)fresh=Math.round(base*Math.min(.5,.05*(gap-3)));
    const best=Math.max(...prior.map(x=>x.n));
    if(n>best){peak=Math.round(base*.5)+10;flags+='P'}
  }
  const bestAll=Math.max(0,...log.filter(x=>x.ex===exId).map(x=>x.n));
  for(const pr of S.projects)pr.steps.forEach((s,i)=>{
    if(s.ex===exId&&n>=s.target&&bestAll<s.target){step+=Math.round(20*e.d)+(i===pr.steps.length-1?100:0);if(!flags.includes('S'))flags+='S'}
  });
  return{base,fresh,peak,step,total:base+fresh+peak+step,flags,gap};
}
function addLog(exId,n,d,sets=1){
  const made=[];
  for(let i=0;i<sets;i++){
    const sc=score(exId,n,d);
    const en={id:uid(),ex:exId,n,d,t:Date.now()+i,p:sc.total,b:[sc.base,sc.fresh,sc.peak,sc.step],f:sc.flags};
    S.log.push(en);made.push(en);bump();
  }
  dirty('log-'+d.slice(0,7));
  return made;
}
function removeLog(ids){
  const months=new Set();
  S.log=S.log.filter(e=>{if(ids.includes(e.id)){const mo=e.d.slice(0,7);months.add('log-'+mo);(S.gone[mo]||(S.gone[mo]=[])).push(e.id);return false}return true});
  bump();months.forEach(dirty);
}

/* ---- storage: this device (cache) + account (when available) */
const SESSION='chalkline.session';
const store={db:null,server:null,user:null,uid:null,acct:null,base:null,lsKey:LS,dirty:new Set(),busy:false,timer:null,err:false,canWrite:null};
const modeOf=()=>store.server?'server':store.acct?'account':store.base?'claude':'device';
// where data lives: a Chalkline account, else this person's own Claude login, else just this device
function setBase(){
  store.base=!store.db?null:store.server?'solo':store.acct?'accounts/'+store.acct.id+'/data':store.uid?'data/users/'+store.uid:null;
  store.lsKey=store.acct&&!store.server?LS+'.acct.'+store.acct.id:LS;
  store.dirty.clear();store.err=false;
}
function saveLocal(){try{localStorage.setItem(store.lsKey,JSON.stringify(S))}catch(e){}}
function loadLocal(){S=blank();try{const r=localStorage.getItem(store.lsKey);if(r){const o=JSON.parse(r);if(o&&o.v===1)S=Object.assign(blank(),o)}}catch(e){}bump()}
function dirty(doc){
  S.ts[doc]=Date.now();saveLocal();
  if(!store.db||!store.base)return;
  store.dirty.add(doc);clearTimeout(store.timer);store.timer=setTimeout(flush,900);
}
function docBody(id){
  if(id==='main'){
    const cut=addDays(today(),-21),plan={};
    for(const k in S.plan)if(k>=cut)plan[k]=S.plan[k];
    return{v:1,custom:S.custom,projects:S.projects,plan,layout:S.layout,wiped:S.wiped||0,at:S.ts.main||Date.now()};
  }
  const m=id.slice(4);
  return{entries:S.log.filter(e=>e.d.startsWith(m)),gone:S.gone[m]||[],wiped:S.wiped||0,at:S.ts[id]||Date.now()};
}
async function flush(){
  if(store.busy||!store.db||!store.base||!store.dirty.size)return;
  store.busy=true;
  const base=store.base,ids=[...store.dirty];store.dirty.clear();
  for(const id of ids){
    try{await store.db.collection(base).doc(id).set(clone(docBody(id)));store.err=false}
    catch(e){store.err=true;if(store.base===base)store.dirty.add(id)}
  }
  store.busy=false;syncLabel();
  if(store.dirty.size&&!store.err){clearTimeout(store.timer);store.timer=setTimeout(flush,900)}
}
async function flushNow(){clearTimeout(store.timer);for(let i=0;i<80&&store.busy;i++)await new Promise(r=>setTimeout(r,50));await flush()}
// Logged sets are merged, never overwritten: two devices that both logged while the other was
// stale each keep every set. Deleted sets are remembered by id; "erase everything" is a timestamp.
function mergeMonth(mo,r){
  const local=S.log.filter(e=>e.d.startsWith(mo)),lg=S.gone[mo]||[],re=(r&&r.entries)||[],rg=(r&&r.gone)||[];
  const gone=[...new Set([...lg,...rg])],g=new Set(gone),w=S.wiped||0,m=new Map();
  for(const e of[...re,...local])if(e&&e.id&&!g.has(e.id)&&(e.t||0)>w)m.set(e.id,e);
  const merged=[...m.values()],lid=new Set(local.map(e=>e.id)),rid=new Set(re.map(e=>e.id));
  const changed=merged.length!==local.length||merged.some(e=>!lid.has(e.id))||gone.length!==lg.length;
  const push=r?(merged.length!==rid.size||merged.some(e=>!rid.has(e.id))||gone.length!==rg.length||w>(r.wiped||0)):(merged.length>0||gone.length>0);
  if(changed){S.log=S.log.filter(e=>!e.d.startsWith(mo)).concat(merged);if(gone.length)S.gone[mo]=gone}
  return{changed,push};
}
function applyRemote(remote){
  let changed=false;
  const w=Math.max(S.wiped||0,...Object.values(remote).map(r=>(r&&r.wiped)||0));
  if(w>(S.wiped||0)){S.wiped=w;S.log=S.log.filter(e=>(e.t||0)>w);changed=true}
  const m=remote.main;
  if(m&&(m.at||0)>=(S.ts.main||0)){
    S.custom=m.custom||{};S.projects=m.projects||[];S.plan=m.plan||{};S.layout=m.layout||{};S.ts.main=m.at||0;changed=true;
  }else if(S.ts.main)store.dirty.add('main');
  if(m&&(m.wiped||0)<(S.wiped||0))store.dirty.add('main');
  const months=new Set([...Object.keys(remote).filter(k=>k.startsWith('log-')).map(k=>k.slice(4)),...S.log.map(e=>e.d.slice(0,7)),...Object.keys(S.gone)]);
  for(const mo of months){const x=mergeMonth(mo,remote['log-'+mo]);if(x.changed)changed=true;if(x.push)store.dirty.add('log-'+mo)}
  if(changed){bump();saveLocal()}
  return changed;
}
async function pull(){
  if(!store.db||!store.base)return false;
  try{
    const base=store.base,snap=await store.db.collection(base).get(),remote={};
    if(store.base!==base)return false;
    snap.docs.forEach(d=>{remote[d.id]=clone(d.data())});
    const ch=applyRemote(remote);
    if(store.dirty.size)flush();
    return ch;
  }catch(e){store.err=true;if(e&&e.status===401&&store.server){store.locked=true;askKey()}return false}
}

/* ---- Chalkline accounts: a name and a light password, kept in this page's shared store */
const normName=n=>String(n||'').trim().toLowerCase().replace(/[^a-z0-9_-]/g,'');
async function hashPw(salt,pw){
  const s=salt+':'+pw;
  try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
  catch(e){let h=hash(s),o='';for(let i=0;i<8;i++){h=hash(h+s+i);o+=h.toString(16).padStart(8,'0')}return'f'+o}
}
function readSession(){try{const o=JSON.parse(localStorage.getItem(SESSION)||'null');return o&&o.id&&o.hash?o:null}catch(e){return null}}
function saveSession(){try{store.acct?localStorage.setItem(SESSION,JSON.stringify(store.acct)):localStorage.removeItem(SESSION)}catch(e){}}
const NO_DB='Accounts work when this page is open in Claude and you are signed in to Claude.';
async function acctCreate(name,pw){
  if(!store.db)return NO_DB;
  const id=normName(name),shown=String(name).trim().slice(0,20);
  if(id.length<3||id.length>20)return'Pick a name of 3 to 20 letters or numbers.';
  if(String(pw).length<4)return'Use a password of at least 4 characters.';
  try{
    const ref=store.db.doc('accounts/'+id);
    if((await ref.get()).exists)return'That name is taken. Sign in instead, or pick another.';
    const salt=uid(),h=await hashPw(salt,pw);
    await ref.set({name:shown,salt,hash:h,at:Date.now()});
    await flushNow();
    store.acct={id,name:shown,hash:h};saveSession();setBase();
    // whatever is logged on this device so far comes along into the new account
    const now=Date.now();S.ts={main:now};S.log.forEach(e=>{S.ts['log-'+e.d.slice(0,7)]=now});
    saveLocal();Object.keys(S.ts).forEach(k=>store.dirty.add(k));flush();
    return'';
  }catch(e){return'Could not create the account. You may only have view access to this page. Ask its owner to share it with you as a Contributor or Editor.'}
}
async function acctLogin(name,pw){
  if(!store.db)return NO_DB;
  const id=normName(name);
  if(!id)return'Enter your account name.';
  try{
    const snap=await store.db.doc('accounts/'+id).get();
    if(!snap.exists)return'No account with that name.';
    const a=snap.data();
    if(await hashPw(a.salt,pw)!==a.hash)return'That password does not match.';
    await flushNow();
    store.acct={id,name:a.name||id,hash:a.hash};saveSession();setBase();loadLocal();await pull();
    return'';
  }catch(e){return'Could not sign in. Check your connection and try again.'}
}
async function acctLogout(){await flushNow();store.acct=null;saveSession();setBase();loadLocal();await pull()}

const KEYLS='chalkline.key';
const getKey=()=>{try{return localStorage.getItem(KEYLS)||''}catch(e){return''}};
const setKey=k=>{try{k?localStorage.setItem(KEYLS,k):localStorage.removeItem(KEYLS)}catch(e){}};
function restDb(){
  const call=async(url,opt={})=>{
    const r=await fetch(url,{...opt,cache:'no-store',headers:{'content-type':'application/json','x-chalkline-key':getKey()}});
    if(!r.ok)throw Object.assign(new Error('http '+r.status),{status:r.status});
    return r.json();
  };
  return{
    collection(){return{
      get:async()=>{const o=await call('api/docs');store.locked=false;return{docs:Object.keys(o.docs||{}).map(id=>({id,exists:true,data:()=>o.docs[id]}))}},
      doc(id){return{set:b=>call('api/docs/'+encodeURIComponent(id),{method:'PUT',body:JSON.stringify(b)})}},
    }},
  };
}
async function initServer(){
  if(!/^https?:$/.test(location.protocol))return false;
  try{
    const r=await fetch('api/info',{cache:'no-store'});if(!r.ok)return false;
    const info=await r.json();if(!info||info.app!=='chalkline')return false;
    store.server=info;store.db=restDb();store.acct=null;return true;
  }catch(e){return false}
}
function askKey(){if(!ui.modals.some(m=>m.type==='key'))openModal({type:'key',key:'',err:'',busy:false})}
setInterval(async()=>{
  if(store.server&&!store.locked&&document.visibilityState==='visible'&&!store.dirty.size&&!store.busy&&!ui.modals.length&&!(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))){if(await pull())render()}
},40000);

async function initCloud(){
  const had=!!store.acct;
  if(window.claude&&window.claude.use){
    try{
      const[db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')]);
      store.db=db;store.user=user;store.uid=user?await user.id():null;
      try{store.canWrite=user&&user.can?await user.can('data.write'):null}catch(e){}
    }catch(e){}
  }
  else if(await initServer()){setBase();await pull();render();syncLabel();return}
  if(store.db&&store.acct){ // check the saved login is still good
    try{const snap=await store.db.doc('accounts/'+store.acct.id).get();if(!snap.exists||snap.data().hash!==store.acct.hash){store.acct=null;saveSession()}}catch(e){}
  }
  setBase();
  if(had&&!store.acct)loadLocal();
  await pull();render();syncLabel();
  let asked=false;try{asked=!!localStorage.getItem('chalkline.authAsked')}catch(e){}
  if(store.db&&!store.acct&&!asked&&!ui.modals.length){try{localStorage.setItem('chalkline.authAsked','1')}catch(e){}openModal({type:'auth',tab:'create',name:'',pw:'',err:'',busy:false})}
}
function syncLabel(){
  const m=modeOf(),bad='Could not save online. Changes are kept on this device.';
  const t=m==='server'?(store.locked?'Locked. Enter the key to sync.':store.err?bad:'Synced to your Chalkline server'+(store.server.persistent?'':'. Storage is temporary until a volume is attached')):m==='account'?(!store.db?`Signed in as ${store.acct.name}. Offline, saved on this device.`:store.err?bad:`Signed in as ${store.acct.name}. Synced to your account.`):m==='claude'?(store.err?bad:'No Chalkline account. Synced to your Claude login.'):'Saved on this device only';
  document.querySelectorAll('.sync').forEach(n=>n.textContent=t);
  return t;
}
document.addEventListener('visibilitychange',async()=>{
  if(document.visibilityState==='visible'&&store.db&&store.base&&!store.dirty.size&&!store.busy&&!ui.modals.length){if(await pull())render()}
});
const saveMain=()=>dirty('main');
