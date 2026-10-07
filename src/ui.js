/* ================= sheets, actions, start-up ================= */
const top_=()=>ui.modals[ui.modals.length-1];
function openModal(m){clearTimeout(toastT);$('#toast').innerHTML='';undoFn=null;ui.modals.push(m);renderModal(true)}
function closeModal(){ui.modals.pop();renderModal(true)}
function renderModal(fresh=false){
  const m=top_(),root=$('#modal'),old=root.querySelector('.sheet'),sc=old&&!fresh?old.scrollTop:0;
  if(!m){root.innerHTML='';return}
  root.innerHTML=`<div class="scrim" data-a="close"></div><div class="sheet" role="dialog" aria-modal="true">${SHEET[m.type](m)}</div>`;
  const sh=root.querySelector('.sheet');sh.scrollTop=sc;
  if(fresh){const c=sh.querySelector('[data-a="close"]');c&&c.focus({preventScroll:true})}
}
const shTop=(title,meta='')=>`<div class="sh-top"><div><h2>${title}</h2>${meta}</div><button class="ib" data-a="close" aria-label="Close">${ic('x')}</button></div>`;
const stepAmt=(e,n,dir)=>Math.max(1,e.u==='sec'?(dir>0?(n<10?n+1:n+5):(n<=10?n-1:n-5)):n+dir);
function preview(id,n,d,sets){
  const tmp=[...S.log],tot={base:0,fresh:0,peak:0,step:0,total:0,flags:''};
  for(let i=0;i<sets;i++){const sc=score(id,n,d,tmp);for(const k of['base','fresh','peak','step','total'])tot[k]+=sc[k];tot.flags+=sc.flags;tmp.push({ex:id,n,d,t:0})}
  return tot;
}
const preHTML=m=>{const e=X(m.id),one=basePts(e,m.n),b=one*m.sets,r=refOf(e);
  return `<div class="t">${b} points</div><div class="meta" style="margin:0">${m.sets>1?`${one} per set. `:''}${m.n<r?`Full value at ${unit(e,r)}.`:m.n===r?'That is the full value for a solid set.':'Past the mark, so each extra counts for more.'} Any bonuses are added after you log.</div>`};
const quickAmts=e=>{const r=refOf(e),out=[];[.5,.75,1,1.33,1.67,2].forEach(k=>{let n=Math.max(1,Math.round(r*k));if(e.u==='sec'&&n>=15)n=Math.round(n/5)*5;if(!out.includes(n))out.push(n)});return out};
function leadUp(id){
  const e=X(id);let best=null;
  for(const c of CHAINS){const i=c.indexOf(id);if(i>0&&(!best||i>best.length-1))best=c.slice(0,i+1)}
  if(!best){ // no ready-made ladder: pick easier moves that share the most muscles, one per difficulty level
    const cand=allEx().filter(x=>x.d<e.d&&x.id!==id).map(x=>({x,s:(x.g===e.g?2:0)+x.m.filter(k=>e.m.includes(k)).length*2+x.m.filter(k=>e.p.includes(k)).length+x.p.filter(k=>e.m.includes(k)).length})).filter(o=>o.s>=3);
    const lv={};cand.forEach(o=>{if(!lv[o.x.d]||o.s>lv[o.x.d].s)lv[o.x.d]=o});
    best=Object.keys(lv).map(Number).sort((a,b)=>a-b).slice(-5).map(k=>lv[k].x.id).concat(id);
  }
  best=best.slice(-8);
  return best.map((x,i)=>{const s=X(x),last=i===best.length-1;return{ex:x,target:last&&s.u==='reps'&&s.d>=3.5?1:refOf(s)}});
}

const SHEET={};
SHEET.ex=m=>{
  const e=X(m.id),s=stats().by[m.id],t=today(),y=addDays(t,-1);
  const projs=[];S.projects.forEach(pr=>pr.steps.forEach((st,i)=>{if(st.ex===m.id)projs.push({pr,i,st})}));
  const warm=warmupFor(e),gapG=areaGap(e.g);
  const names=a=>a.map(k=>MUSC[k]).join(', '),goalProj=S.projects.find(p=>p.steps.length&&p.steps[p.steps.length-1].ex===m.id);
  return shTop(esc(e.name),`<div class="meta" style="margin-top:8px">${stars(e.d)}<span>out of 6</span><span class="tag">${esc(e.use)}</span>${gtag(e)}${(e.g2||[]).map(g=>`<span class="tag">${GROUPS[g].name}</span>`).join('')}</div>`)+
  `${descOf(e)?`<p class="desc">${esc(descOf(e))}</p>`:''}
  <div class="xgrid">${thumb(e,'lg')}<div>${bodyMap(e.m,e.p,'lg')}</div></div>
  <div class="legend"><span><span class="sq" style="--c:var(--main)"></span>Main: ${names(e.m)||'none set'}</span>${e.p.length?`<span><span class="sq" style="--c:var(--part)"></span>Partial: ${names(e.p)}</span>`:''}</div>
  <div class="kv four"><div><small>Points for a solid set</small><b>${basePts(e,refOf(e))} at ${unit(e,refOf(e))}</b></div><div><small>Best set</small><b>${s?unit(e,s.best):'None yet'}</b></div><div><small>Last done</small><b>${s?ago(diffDays(t,s.last)):'Never'}</b></div><div><small>Logged</small><b>${s?s.count:0} ${s&&s.count===1?'set':'sets'}</b></div></div>
  ${projs.map(({pr,i,st})=>`<button class="meta" data-a="proj" data-id="${pr.id}" style="margin:0 0 6px"><span class="dot" style="--c:var(--${pr.color})"></span><span style="color:var(--ink)">${esc(pr.name)}</span> step ${i+1} of ${pr.steps.length}, target ${unit(e,st.target)}</button>`).join('')}
  ${warm.length?`<div class="warmbox"><h3><span class="dot" style="--c:var(--lime)"></span>Stretch first</h3><p class="meta" style="margin:2px 0 6px">${gapG===9999?`You have not logged any ${GROUPS[e.g].name.toLowerCase()} work yet.`:`${GROUPS[e.g].name} has not been trained for ${gapG} days.`} Loosen up with ${warm.length===1?'this':'these'} before you start.</p><div class="rows">${warm.map(w=>exRow(w)).join('')}</div></div>`:''}
  <div class="logbox"><div class="two"><span class="stp xl"><button class="ib" data-a="mstep" data-k="n" data-by="-1" aria-label="Less">${ic('minus')}</button><span style="text-align:center"><label class="vh" for="mn">${unitWord(e)}</label><input id="mn" type="number" inputmode="numeric" min="1" max="9999" data-i="mn" value="${m.n}"><small>${e.u==='sec'?'seconds you held':'reps you did'}, per set</small></span><button class="ib" data-a="mstep" data-k="n" data-by="1" aria-label="More">${ic('plus')}</button></span>
    <span class="stp"><button class="ib" data-a="mstep" data-k="sets" data-by="-1" aria-label="Fewer sets">${ic('minus')}</button><b>${m.sets} ${m.sets===1?'set':'sets'}</b><button class="ib" data-a="mstep" data-k="sets" data-by="1" aria-label="More sets">${ic('plus')}</button></span></div>
    <div><span class="lab">Or pick an amount. Points rise faster past the solid-set mark.</span><div class="chips">${quickAmts(e).map(n=>`<button class="chip amt" data-a="mset" data-n="${n}" aria-pressed="${m.n===n}"><b>${n}</b><span>${basePts(e,n)} pts</span></button>`).join('')}</div></div>
    <div class="chips"><button class="chip" data-a="mdate" data-d="${t}" aria-pressed="${m.d===t}">Today</button><button class="chip" data-a="mdate" data-d="${y}" aria-pressed="${m.d===y}">Yesterday</button><label class="vh" for="md">Another day</label><input id="md" class="field" type="date" data-i="mdate" max="${t}" value="${m.d}" style="width:auto;min-height:32px;font-size:13px"></div>
    <div class="pre" id="pre">${preHTML(m)}</div>
    <button class="btn pri big" data-a="dolog">Log ${m.sets} ${m.sets===1?'set':'sets'}</button></div>
  <div class="chips" style="margin-top:14px"><button class="btn" data-a="addplan">Add to plan for ${fmtDay(ui.planDay)}</button>${e.d>=3?(goalProj?`<button class="btn" data-a="proj" data-id="${goalProj.id}">${ic('projects')}Open its project</button>`:`<button class="btn" data-a="makeproj">${ic('projects')}Make this a project</button>`):''}${e.custom?`<button class="btn" data-a="editex">${ic('pen')}Edit exercise</button>`:''}</div>
  ${e.d>=3&&!goalProj?`<p class="meta" style="margin-top:8px">Builds a step-by-step ladder of easier moves leading up to this one. You can edit it afterward.</p>`:''}`;
};
const pickResults=m=>{const q=(m.q||'').trim().toLowerCase(),l=allEx().filter(e=>!q||e.name.toLowerCase().includes(q)).sort((a,b)=>a.g.localeCompare(b.g)||a.d-b.d);
  return l.length?`<div class="rows">${l.map(e=>`<button class="row" data-a="pickit" data-id="${esc(e.id)}">${thumb(e)}<span><span class="nm">${esc(e.name)}</span>${exMeta(e)}</span><span class="right">${GROUPS[e.g].name}</span></button>`).join('')}</div>`:empty('No exercise matches that search.')};
SHEET.pick=m=>shTop(m.for==='step'?'Add a step':'Add to plan')+`<label class="vh" for="pickq">Find an exercise</label><input id="pickq" class="field" type="search" data-i="pickq" placeholder="Find an exercise" value="${esc(m.q||'')}" style="margin-bottom:12px"><div id="pickres">${pickResults(m)}</div>`;
SHEET.exform=m=>{
  const d=m.draft,ch=(k,v,l)=>`<button class="chip" data-a="xset" data-k="${k}" data-id="${v}" aria-pressed="${d[k]===v}">${l}</button>`;
  return shTop(d.id?'Edit exercise':'New exercise')+`<div class="form">
  <div><label class="lab" for="xname">Name</label><input id="xname" class="field" data-i="xname" value="${esc(d.name)}" maxlength="50" placeholder="For example, Ring row"></div>
  <div><label class="lab" for="xdesc">Explanation, shown when you open the move</label><textarea id="xdesc" class="field" data-i="xdesc" rows="3" maxlength="300" placeholder="How to do it, or a cue to remember" style="padding:10px 12px;resize:vertical">${esc(d.desc||'')}</textarea></div>
  <div><span class="lab">Counted in</span><div class="chips">${ch('u','reps','Reps')}${ch('u','sec','Seconds held')}</div></div>
  <div><span class="lab">Difficulty</span><div class="starpick"><button class="ib sm" data-a="xdiff" data-by="-0.5" aria-label="Easier">${ic('minus')}</button><span class="meta" style="margin:0">${stars(d.d)}</span><button class="ib sm" data-a="xdiff" data-by="0.5" aria-label="Harder">${ic('plus')}</button></div></div>
  <div><span class="lab">Use</span><div class="chips">${USES.map(u=>ch('use',u,u)).join('')}</div></div>
  <div><span class="lab">Category, used by the planner</span><div class="chips">${Object.keys(GROUPS).map(g=>ch('g',g,GROUPS[g].name)).join('')}</div></div>
  <div><span class="lab">Also counts as, only if it truly fits</span><div class="chips">${Object.keys(GROUPS).filter(g=>g!==d.g).map(g=>`<button class="chip" data-a="xg2" data-id="${g}" aria-pressed="${(d.g2||[]).includes(g)}">${GROUPS[g].name}</button>`).join('')}</div></div>
  <div><span class="lab">Muscles. Tap a block once for main, twice for partial, again to clear.</span><div style="max-width:270px">${bodyMap(d.m,d.p,'lg',true)}</div><div class="legend" style="margin-top:8px"><span><span class="sq" style="--c:var(--main)"></span>Main: ${d.m.map(k=>MUSC[k]).join(', ')||'none'}</span><span><span class="sq" style="--c:var(--part)"></span>Partial: ${d.p.map(k=>MUSC[k]).join(', ')||'none'}</span></div></div>
  <div><span class="lab">Solid set. This amount earns the move its full points.</span><span class="stp"><button class="ib sm" data-a="xdef" data-by="-1" aria-label="Less">${ic('minus')}</button><b>${unit(d,d.def)}</b><button class="ib sm" data-a="xdef" data-by="1" aria-label="More">${ic('plus')}</button></span></div>
  <div><span class="lab">Drawing. Pick the closest shape.</span><div class="posegrid">${Object.keys(POSES).map(k=>`<button data-a="xset" data-k="pose" data-id="${k}" aria-pressed="${d.pose===k}" aria-label="${esc(B[k].name)}" title="${esc(B[k].name)}">${figure(k)}</button>`).join('')}</div></div>
  <div class="chips"><button class="btn pri" data-a="xsave">Save exercise</button>${d.id?`<button class="btn danger" data-a="xdel">${ui.confirm==='xdel'?'Tap again to delete':'Delete exercise'}</button>`:''}</div></div>`;
};
SHEET.settings=()=>{
  const m=modeOf();
  return shTop('Settings')+`<div class="form">
  ${m==='server'?`<div><span class="lab">Saving</span><p class="sync" style="font-size:14px;color:var(--ink)">${syncLabel()}</p>
    <p class="meta" style="margin:4px 0 0">There is one shared log and no sign-in. Any phone or computer that opens this address sees and updates the same log.${store.server.needKey?' This device has the key saved.':''}</p>
    ${store.locked?`<button class="btn pri" data-a="askkey" style="margin-top:10px">Enter the key</button>`:''}
    ${store.server.persistent?'':`<p class="meta" style="margin:8px 0 0;color:#ffb37a">The server has no permanent storage yet, so a redeploy would erase the log. In Railway, attach a volume to the service.</p>`}</div>`
  :`<div><span class="lab">Account</span><p class="sync" style="font-size:14px;color:var(--ink)">${syncLabel()}</p>
    <p class="meta" style="margin:4px 0 10px">${m==='account'?'Your log follows this account. Sign in with the same name and password on any phone or computer and it will be there. This device stays signed in.':m==='claude'?'A Chalkline account gives you one name and password that carries your log to any device.':'Open this page in Claude while signed in to create an account and sync between devices.'}</p>
    ${m==='account'?`<button class="btn" data-a="signout">Sign out</button>`:`<button class="btn pri" data-a="auth"${store.db?'':' disabled'}>Create account or sign in</button>`}</div>`}
  <div><span class="lab">Move your log</span><p class="meta" style="margin:0 0 10px">Carry everything from one copy of Chalkline to another: copy the text from the old copy and paste it into the new one.</p>
    <div class="chips"><button class="btn" data-a="exportshow">Show my log as text</button><button class="btn" data-a="importshow">Paste a log in</button></div>
    ${ui.xfer==='out'?`<label class="vh" for="xout">Your log as text</label><textarea id="xout" class="field" readonly rows="5" style="margin-top:10px;padding:10px;font-size:12px" data-a="selall">${esc(exportText())}</textarea><p class="meta">Select all of it and copy.</p>`:''}
    ${ui.xfer==='in'?`<label class="vh" for="xin">Paste a log here</label><textarea id="xin" class="field" rows="5" style="margin-top:10px;padding:10px;font-size:12px" data-i="imp" placeholder="Paste the text here"></textarea><div class="chips" style="margin-top:8px"><button class="btn pri" data-a="importgo">Add it to this log</button></div><p class="meta">Sets are added to what is already here. Projects, plans and custom exercises are replaced by the pasted ones.</p>`:''}</div>
  <div><span class="lab">Sample history</span><p class="meta" style="margin:0 0 10px">Fills the last seven weeks with made-up sets so you can see the charts, bests and suggestions working. Erase it before you start for real.</p><button class="btn" data-a="sample"${S.log.length?' disabled':''}>Fill with sample history</button>${S.log.length?'<p class="meta">Available only while the log is empty.</p>':''}</div>
  <div><span class="lab">Start over</span><p class="meta" style="margin:0 0 10px">Deletes every logged set, plan, custom exercise and layout${m==='account'?' in this account':''}, and restores the starting projects.</p><button class="btn danger" data-a="erase">${ui.confirm==='erase'?'Tap again to erase everything':'Erase everything'}</button></div></div>`;
};
SHEET.key=m=>shTop('Enter your key','<p class="meta" style="margin-top:8px;font-size:13.5px">This Chalkline is locked with a key. Enter it once and this device remembers it.</p>')+`<div class="form">
  <div><label class="lab" for="kkey">Key</label><input id="kkey" class="field" data-i="kkey" value="${esc(m.key)}" autocomplete="off" autocapitalize="none" spellcheck="false"></div>
  ${m.err?`<p role="alert" style="color:#ff8587;font-size:14px">${esc(m.err)}</p>`:''}
  <button class="btn pri big" data-a="keygo"${m.busy?' disabled':''}>${m.busy?'One moment':'Unlock'}</button></div>`;
SHEET.auth=m=>{
  const create=m.tab==='create';
  return shTop(create?'Create an account':'Sign in','<p class="meta" style="margin-top:8px;font-size:13.5px">One name and password. Your log then follows you to any phone or computer, and each device stays signed in.</p>')+`<div class="form">
  <div class="chips"><button class="chip" data-a="authtab" data-id="create" aria-pressed="${create}">New account</button><button class="chip" data-a="authtab" data-id="in" aria-pressed="${!create}">I have one</button></div>
  <div><label class="lab" for="aname">Account name</label><input id="aname" class="field" data-i="aname" value="${esc(m.name)}" maxlength="20" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="Your name or a nickname"></div>
  <div><label class="lab" for="apw">Password</label><input id="apw" class="field" type="password" data-i="apw" value="${esc(m.pw)}" maxlength="60" autocomplete="${create?'new-password':'current-password'}" placeholder="${create?'At least 4 characters':''}"></div>
  ${m.err?`<p role="alert" style="color:#ff8587;font-size:14px">${esc(m.err)}</p>`:''}
  ${create&&S.log.length?`<p class="meta" style="margin:0">The ${S.log.length} sets already logged here will move into the new account.</p>`:''}
  ${store.canWrite===false?`<p class="meta" style="margin:0">You have view-only access to this page, so it cannot save for you yet. Ask its owner to share it with you as a Contributor or Editor.</p>`:''}
  <button class="btn pri big" data-a="authgo"${m.busy?' disabled':''}>${m.busy?'One moment':create?'Create account':'Sign in'}</button>
  <button class="btn" data-a="close">Not now</button>
  <p class="meta" style="margin:0">This is a light lock meant for you and friends. Do not reuse a password you care about.</p></div>`;
};

/* ---- toast */
let toastT=null,undoFn=null;
function toast(html,undo=null,ms=5200){
  undoFn=undo;clearTimeout(toastT);
  $('#toast').innerHTML=`<div class="toast">${html}${undo?`<button class="btn sm" data-a="undo">Undo</button>`:'<span></span>'}</div>`;
  toastT=setTimeout(()=>{$('#toast').innerHTML='';undoFn=null},ms);
}
const note=t=>toast(`<span></span><span>${t}</span>`,null,3200);

/* ---- move a log between copies */
const exportText=()=>JSON.stringify({chalkline:1,custom:S.custom,projects:S.projects,plan:S.plan,layout:S.layout,log:S.log});
function importText(txt){
  let o;try{o=JSON.parse(txt)}catch(e){return'That text is not a Chalkline log. Copy all of it and try again.'}
  if(!o||o.chalkline!==1||!Array.isArray(o.log))return'That text is not a Chalkline log. Copy all of it and try again.';
  const have=new Set(S.log.map(e=>e.id)),now=Date.now();let k=0;
  for(const e of o.log){if(!e||!e.ex||!e.d||!(e.n>0)||have.has(e.id))continue;S.log.push({id:uid()+(k++),ex:String(e.ex),n:+e.n,d:String(e.d).slice(0,10),t:now+k,p:+e.p||0,b:Array.isArray(e.b)?e.b.slice(0,4).map(Number):[+e.p||0,0,0,0],f:String(e.f||'')})}
  if(o.custom&&typeof o.custom==='object')S.custom=o.custom;
  if(Array.isArray(o.projects)&&o.projects.length)S.projects=o.projects;
  if(o.plan&&typeof o.plan==='object')S.plan=o.plan;
  if(o.layout&&typeof o.layout==='object')S.layout=o.layout;
  bump();new Set(S.log.map(e=>'log-'+e.d.slice(0,7))).forEach(dirty);dirty('main');
  return'';
}

/* ---- sample + erase */
function genSample(){
  const t=today(),R=rng(42),T0=Date.now();let seq=0;
  const set={1:[['incpush',12,1],['pushup',9,1.4],['dip',3,.7],['pike',5,.8],['support',15,3],['plean',8,2.500]],2:[['hang',20,4],['row',7,.8],['pullup',3,.6],['chinup',3,.6],['tuckfl',3,.9],['hknee',6,.8]],4:[['squat',14,1.5],['lunge',8,.7],['stepup',9,.7],['wallsit',25,4],['bridge',10,1],['calf',14,1]],6:[['plank',30,5],['hollow',15,3],['lraise',8,1],['tucksit',6,1.5],['frog',10,3],['pushup',10,1.4]]};
  for(let back=48;back>=1;back--){
    const d=addDays(t,-back),day=pd(d),list=set[day.getDay()];if(!list||R()<.1)continue;
    const wk=(48-back)/7;
    for(const [id,base,gain] of list){ if(R()<.22)continue;
      const sets=2+(R()<.5?1:0);
      for(let i=0;i<sets;i++){const e=X(id);let n=Math.max(1,Math.round((base+gain*wk)*(.82+R()*.3)*(1-i*.08)));if(e.u==='sec'&&n>10)n=Math.round(n/5)*5;
        const sc=score(id,n,d);S.log.push({id:uid()+(seq),ex:id,n,d,t:T0+(seq++),p:sc.total,b:[sc.base,sc.fresh,sc.peak,sc.step],f:sc.flags});}
    }
  }
  bump();new Set(S.log.map(e=>'log-'+e.d.slice(0,7))).forEach(dirty);
}
function eraseAll(){
  const months=new Set(Object.keys(S.ts).filter(k=>k.startsWith('log-')));S.log.forEach(e=>months.add('log-'+e.d.slice(0,7)));
  S=blank();S.wiped=Date.now();bump();months.forEach(dirty);dirty('main');
}

/* ---- actions */
const curProj=()=>S.projects.find(p=>p.id===ui.project);
const planOf=d=>S.plan[d]||(S.plan[d]={focus:[],items:[]});
function openEx(id,n,d){
  const e=X(id);if(e===GONE)return;
  const last=[...stats().log].reverse().find(x=>x.ex===id);
  openModal({type:'ex',id,n:+n||(last?last.n:e.def),sets:1,d:d||today()});
}
function setLayout(tab,fn){const L=lay(tab);fn(L);S.layout[tab]=L;saveMain()}
const A={
  tab(d){ui.tab=d.id;ui.project=null;ui.editProj=false;ui.arrange=false;render();window.scrollTo(0,0)},
  arrange(){ui.arrange=!ui.arrange;render()},
  settings(){ui.xfer=null;openModal({type:'settings'})},
  askkey(){ui.modals=[];renderModal();askKey()},
  exportshow(){ui.xfer=ui.xfer==='out'?null:'out';renderModal()},
  importshow(){ui.xfer=ui.xfer==='in'?null:'in';ui.imp='';renderModal()},
  selall(d,el){el.focus();el.select()},
  importgo(){const err=importText(ui.imp||'');if(err)return note(err);ui.xfer=null;ui.modals=[];renderModal();render();note('Log added.')},
  async keygo(){
    const m=top_();if(!m||m.type!=='key'||m.busy)return;
    m.busy=true;m.err='';renderModal();setKey(m.key.trim());store.locked=false;
    const before=store.err;await pull();
    if(store.locked){m.busy=false;m.err='That key was not accepted.';if(top_()===m)renderModal();return}
    ui.modals=ui.modals.filter(x=>x!==m);renderModal();render();syncLabel();
  },
  auth(){ui.modals=[];openModal({type:'auth',tab:'create',name:'',pw:'',err:'',busy:false})},
  authtab(d){const m=top_();m.tab=d.id;m.err='';renderModal()},
  async authgo(){
    const m=top_();if(!m||m.type!=='auth'||m.busy)return;
    m.busy=true;m.err='';renderModal();
    const err=m.tab==='create'?await acctCreate(m.name,m.pw):await acctLogin(m.name,m.pw);
    if(err){m.busy=false;m.err=err;if(top_()===m)renderModal();return}
    ui.modals=[];ui.project=null;renderModal();render();note(`Signed in as ${esc(store.acct.name)}.`);
  },
  async signout(){await acctLogout();ui.modals=[];ui.project=null;renderModal();render();note('Signed out. This device is back to its own log.')},
  close(){closeModal()},
  ex(d){openEx(d.id,d.n,d.d)},
  mstep(d){const m=top_(),e=X(m.id);if(d.k==='n')m.n=stepAmt(e,m.n,+d.by);else m.sets=Math.max(1,Math.min(10,m.sets+ +d.by));renderModal()},
  mdate(d){top_().d=d.d;renderModal()},
  mset(d){top_().n=+d.n;renderModal()},
  makeproj(){const m=top_(),e=X(m.id),used=S.projects.map(p=>p.color),ks=Object.keys(PIG),c=ks.find(k=>!used.includes(k))||ks[S.projects.length%ks.length],p={id:'p-'+uid(),name:e.name,color:c,steps:leadUp(m.id)};
    S.projects.push(p);saveMain();ui.modals=[];renderModal();ui.tab='projects';ui.project=p.id;ui.editProj=false;ui.arrange=false;render();window.scrollTo(0,0);note(`${esc(e.name)} is now a project with ${p.steps.length} steps.`)},
  dolog(){
    const m=top_(),e=X(m.id);if(!(m.n>=1))return note('Enter how many you did.');
    const made=addLog(m.id,m.n,m.d,m.sets),tot=made.reduce((a,x)=>a+x.p,0),f=made.map(x=>x.f).join(''),base=made.reduce((a,x)=>a+x.b[0],0),bon=tot-base;
    const why=[f.includes('N')?'first time':made.some(x=>x.b[1])?'fresh':'',f.includes('P')?'new peak':'',f.includes('S')?'step cleared':''].filter(Boolean).join(', ');
    ui.modals=[];renderModal();render();
    toast(`<span class="splash w-${GROUPS[e.g].c}-b${hash(e.id)%3}"></span><span class="t">+${tot}</span><span><span class="nm">${esc(e.name)}</span><span class="d">${m.sets} × ${unit(e,m.n)}. ${bon?`${base} base + ${bon} bonus (${why})`:`${base} base, no bonus`}</span></span>`,()=>{removeLog(made.map(x=>x.id));render()});
  },
  dellog(d){const en=S.log.find(e=>e.id===d.id);if(!en)return;removeLog([en.id]);render();toast('<span></span><span>Set deleted.</span>',()=>{S.log.push({...en,id:uid()});bump();dirty('log-'+en.d.slice(0,7));render()})},
  undo(){const f=undoFn;clearTimeout(toastT);$('#toast').innerHTML='';undoFn=null;f&&f()},
  addplan(){const m=top_(),e=X(m.id),pl=planOf(ui.planDay);pl.items.push({id:uid(),ex:m.id,n:m.n,sets:3});if(!pl.focus.includes(e.g))pl.focus.push(e.g);saveMain();ui.modals=[];renderModal();render();note(`Added to the plan for ${fmtDay(ui.planDay)}.`)},
  // custom exercises
  newex(){openModal({type:'exform',draft:{name:'',g:'push',g2:[],u:'reps',d:2,use:'Strength',m:[],p:[],def:8,pose:'pushup'}})},
  editex(){const e=X(top_().id);ui.modals=[];openModal({type:'exform',draft:clone(e)})},
  xset(d){const x=top_().draft;x[d.k]=d.id;if(d.k==='g')x.g2=(x.g2||[]).filter(g=>g!==d.id);renderModal()},
  xg2(d){const x=top_().draft;x.g2=x.g2||[];const i=x.g2.indexOf(d.id);i<0?x.g2.push(d.id):x.g2.splice(i,1);renderModal()},
  xdiff(d){const x=top_().draft;x.d=Math.max(.5,Math.min(6,x.d+ +d.by));renderModal()},
  xdef(d){const x=top_().draft;x.def=stepAmt(x,x.def,+d.by);renderModal()},
  musc(d){const x=top_().draft,k=d.m;if(x.m.includes(k)){x.m=x.m.filter(v=>v!==k);x.p.push(k)}else if(x.p.includes(k))x.p=x.p.filter(v=>v!==k);else x.m.push(k);renderModal()},
  xsave(){const x=top_().draft;x.name=x.name.trim();if(!x.name)return note('Give the exercise a name first.');const id=x.id||'c-'+uid();S.custom[id]={...x,id,custom:true};delete figCache[id];saveMain();ui.modals=[];renderModal();render();note('Exercise saved.')},
  xdel(){if(ui.confirm!=='xdel'){ui.confirm='xdel';return renderModal()}const id=top_().draft.id;delete S.custom[id];S.projects.forEach(p=>p.steps=p.steps.filter(s=>s.ex!==id));for(const k in S.plan)S.plan[k].items=S.plan[k].items.filter(i=>i.ex!==id);bump();saveMain();ui.modals=[];renderModal();render();note('Exercise deleted.')},
  // pickers
  pick(d){openModal({type:'pick',for:d.for,q:''})},
  pickit(d){const m=top_(),e=X(d.id);
    if(m.for==='step'){const pr=curProj();pr&&pr.steps.push({ex:d.id,target:e.def})}
    else{const pl=planOf(ui.planDay);pl.items.push({id:uid(),ex:d.id,n:trainAt(d.id),sets:3});if(!pl.focus.includes(e.g))pl.focus.push(e.g)}
    saveMain();closeModal();render()},
  // projects
  proj(d){ui.modals=[];renderModal();ui.tab='projects';ui.project=d.id;ui.editProj=false;ui.arrange=false;render();window.scrollTo(0,0)},
  projback(){ui.project=null;ui.editProj=false;render()},
  newproj(){const used=S.projects.map(p=>p.color),c=Object.keys(PIG).find(k=>!used.includes(k))||'rose',p={id:'p-'+uid(),name:'New project',color:c,steps:[]};S.projects.push(p);saveMain();ui.project=p.id;ui.editProj=true;render();window.scrollTo(0,0)},
  editproj(){ui.editProj=!ui.editProj;bump();render()},
  delproj(){if(ui.confirm!=='delproj'){ui.confirm='delproj';return render()}S.projects=S.projects.filter(p=>p.id!==ui.project);ui.project=null;ui.editProj=false;saveMain();render()},
  pcolor(d){curProj().color=d.id;saveMain();render()},
  starget(d){const s=curProj().steps[+d.i];s.target=stepAmt(X(s.ex),s.target,+d.by);saveMain();render()},
  smove(d){const st=curProj().steps,i=+d.i,j=i+ +d.by;if(j<0||j>=st.length)return;[st[i],st[j]]=[st[j],st[i]];saveMain();render()},
  sdel(d){curProj().steps.splice(+d.i,1);saveMain();render()},
  // plan
  planday(d){ui.planDay=d.d;render()},
  goplan(d){ui.planDay=d.d;ui.tab='plan';ui.arrange=false;render();window.scrollTo(0,0)},
  focus(d){const pl=planOf(ui.planDay),i=pl.focus.indexOf(d.id);i<0?pl.focus.push(d.id):pl.focus.splice(i,1);saveMain();render()},
  autoday(d){
    const day=d.d;let focus=S.plan[day]?.focus||[];
    if(!focus.length){const st=stats();focus=Object.keys(GROUPS).filter(g=>g!=='stretch').sort((a,b)=>(st.grp[a]||'').localeCompare(st.grp[b]||'')).slice(0,2);if(ui.auto.stretch)focus.push('stretch')}
    autofillDay(day,focus);ui.planDay=day;saveMain();render();
  },
  clearday(){delete S.plan[ui.planDay];saveMain();render()},
  pdel(d){planOf(ui.planDay).items.splice(+d.i,1);saveMain();render()},
  pset(d){const it=planOf(ui.planDay).items[+d.i];if(d.k==='sets')it.sets=Math.max(1,Math.min(10,it.sets+ +d.by));else it.n=stepAmt(X(it.ex),it.n,+d.by);saveMain();render()},
  autoset(d){if(d.k==='replace'||d.k==='stretch')ui.auto[d.k]=!ui.auto[d.k];else ui.auto[d.k]=d.k==='days'?+d.id:d.id;render()},
  autoweek(){
    const t=today(),pat=DAYPAT[ui.auto.days],seq=SPLITS[ui.auto.split].seq,st=stats();
    const age=f=>Math.min(...f.map(g=>st.grp[g]?diffDays(t,st.grp[g]):999));
    let k=seq.reduce((bi,f,i)=>age(f)>age(seq[bi])?i:bi,0),made=0;
    for(let i=0;i<7;i++){const d=addDays(t,i),has=S.plan[d]?.items.length;
      if(has&&!ui.auto.replace)continue;
      if(!pat[i]){if(has)delete S.plan[d];continue}
      autofillDay(d,ui.auto.stretch?[...seq[k%seq.length],'stretch']:seq[k%seq.length]);k++;made++}
    saveMain();render();note(made?`Planned ${made} ${made===1?'day':'days'}.`:'Those days are already planned. Turn on replace to overwrite them.');
  },
  // filters
  chart(d){ui.chart=d.id;render()},bestg(d){ui.bestG=d.id;render()},libg(d){ui.libG=d.id;render()},libsort(d){ui.libSort=d.id;render()},morehist(){ui.histN+=14;render()},
  // layout
  secmove(d){setLayout(ui.tab,L=>{const vis=L.order.filter(i=>!L.hidden.includes(i)),a=vis.indexOf(d.id),b=a+ +d.by;if(b<0||b>=vis.length)return;const i=L.order.indexOf(vis[a]),j=L.order.indexOf(vis[b]);[L.order[i],L.order[j]]=[L.order[j],L.order[i]]});render()},
  secsize(d){setLayout(ui.tab,L=>{const def=tabOf(ui.tab).secs.find(s=>s[0]===d.id)[2],cur=L.size[d.id]||def;L.size[d.id]=cur==='half'?'full':'half'});render()},
  sechide(d){setLayout(ui.tab,L=>{L.hidden.push(d.id)});render()},
  secshow(d){setLayout(ui.tab,L=>{L.hidden=L.hidden.filter(i=>i!==d.id)});render()},
  // settings
  sample(){if(S.log.length)return;genSample();ui.modals=[];renderModal();render();note('Sample history added.')},
  erase(){if(ui.confirm!=='erase'){ui.confirm='erase';return renderModal()}eraseAll();ui.modals=[];ui.project=null;renderModal();render();note('Everything erased.')},
};
document.addEventListener('click',ev=>{
  const el=ev.target.closest('[data-a]');if(!el||el.disabled)return;
  const a=el.dataset.a;if(ui.confirm&&ui.confirm!==a)ui.confirm=null;
  if(A[a])A[a](el.dataset,el);
});
const I={
  logq(v){ui.logQ=v;$('#logres').innerHTML=logResults()},
  libq(v){ui.libQ=v;$('#libres').innerHTML=libResults()},
  pickq(v){const m=top_();m.q=v;$('#pickres').innerHTML=pickResults(m)},
  mn(v){const m=top_();m.n=Math.max(0,Math.min(9999,Math.round(+v||0)));$('#pre').innerHTML=m.n?preHTML(m):''},
  mdate(v){const m=top_();if(v&&v<=today()){m.d=v;renderModal()}},
  xname(v){top_().draft.name=v},
  aname(v){top_().name=v},
  kkey(v){top_().key=v},
  imp(v){ui.imp=v},
  apw(v){top_().pw=v},
  xdesc(v){top_().draft.desc=v},
  pname(v){const p=curProj();if(p)p.name=v},
};
document.addEventListener('input',ev=>{const k=ev.target.dataset&&ev.target.dataset.i;if(k&&k!=='mdate'&&I[k])I[k](ev.target.value)});
document.addEventListener('change',ev=>{const k=ev.target.dataset&&ev.target.dataset.i;
  if(k==='mdate')I.mdate(ev.target.value);
  if(k==='pname'){const p=curProj();if(p){p.name=p.name.trim()||'Untitled project';saveMain();render()}}
});
document.addEventListener('keydown',ev=>{
  if(ev.key==='Escape'&&ui.modals.length)closeModal();
  if(ev.key==='Enter'&&top_()&&(top_().type==='auth'||top_().type==='key')&&ev.target.closest&&ev.target.closest('.sheet')&&ev.target.tagName==='INPUT'){ev.preventDefault();top_().type==='key'?A.keygo():A.authgo()}
});

injectWashes();
try{const q=new URLSearchParams(location.search),k=q.get('key');if(k){setKey(k);q.delete('key');history.replaceState(null,'',location.pathname+(q.toString()?'?'+q:'')+location.hash)}}catch(e){}
{const s0=readSession();if(s0){store.acct=s0;setBase()}}
loadLocal();render();initCloud();
