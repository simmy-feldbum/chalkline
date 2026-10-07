/* ================= views ================= */
const ui={tab:'home',arrange:false,modals:[],planDay:today(),libQ:'',libG:'all',libSort:'name',chart:'weeks',project:null,editProj:false,bestG:'all',histN:10,logQ:'',auto:{days:4,split:'ppl',replace:false,stretch:true},confirm:null};
const TABS=[
 {id:'home',name:'Home',c:'lime',sub:'Your week, what to do next, what is scheduled and where each project stands.',secs:[['week','This week','half'],['logset','Log a set','half'],['next','Suggested next','half'],['sched','Schedule','half'],['progress','Project progress','half'],['recent','Recent sets','half'],['balance','Body areas, last 7 days','half']]},
 {id:'suggest',name:'Suggestions',short:'Suggest',c:'gamboge',sub:'What to train next, drawn from your projects and your history.',secs:[['today','Planned for today','half'],['logset','Log a set','half'],['close','Close to hitting','half'],['stale','Not done in a while','half'],['areas','Body areas due','half']]},
 {id:'log',name:'Log',c:'cerulean',sub:'Record sets and look back over past days.',secs:[['quick','Log a set','half'],['todaylog','Today','half'],['history','Earlier days','full']]},
 {id:'projects',name:'Projects',c:'rose',sub:'Skills to work toward, one step at a time.',secs:[['active','In progress','full'],['done','Completed','full']]},
 {id:'plan',name:'Plan',c:'emerald',sub:'Line up the next two weeks. Auto-fill picks moves by the body area they work.',secs:[['cal','Next 14 days','full'],['day','Selected day','half'],['auto','Auto-fill a week','half']]},
 {id:'points',name:'Points',c:'orange',sub:'Harder moves, more reps, fresh moves and new peaks all score more.',secs:[['compare','This week against last','half'],['sources','Where this week\u2019s points came from','half'],['chart','Points over time','full'],['recent','Latest sets','full']]},
 {id:'bests',name:'Bests',c:'violet',sub:'Your top sets and the furthest step in each project.',secs:[['prog','Best progression','half'],['peaks','Recent peaks','half'],['reps','Best reps and holds','full']]},
 {id:'library',name:'Library',c:'ultra',sub:'Every exercise, with its difficulty, use and the muscles it works.',secs:[['all','All exercises','full'],['mine','Your own exercises','full']]},
];
const tabOf=id=>TABS.find(t=>t.id===id);
function lay(tab){
  const t=tabOf(tab),L=S.layout[tab]||{},ids=t.secs.map(s=>s[0]);
  const order=(L.order||[]).filter(i=>ids.includes(i));ids.forEach(i=>{if(!order.includes(i))order.push(i)});
  return{order,hidden:(L.hidden||[]).filter(i=>ids.includes(i)),size:L.size||{}};
}
const thumb=(e,cls='')=>`<span class="thumb ${cls} w-${GROUPS[e.g].c}-b${hash(e.id)%3}">${figure(e.pose)}</span>`;
const gtag=e=>`<span class="tag"><span class="dot" style="--c:var(--${GROUPS[e.g].c});margin-right:6px"></span>${GROUPS[e.g].name}</span>`;
const exMeta=e=>`<span class="meta">${stars(e.d)}<span class="tag">${esc(e.use)}</span><span>${basePts(e,refOf(e))} pts at ${unit(e,refOf(e))}</span></span>`;
function exRow(e,{right='',extra='',n='',d='',bm=false}={}){
  return `<button class="row" data-a="ex" data-id="${esc(e.id)}"${n?` data-n="${n}"`:''}${d?` data-d="${d}"`:''}>${thumb(e)}<span><span class="nm">${esc(e.name)}</span>${exMeta(e)}${extra}</span><span class="right">${bm?bodyMap(e.m,e.p):right}</span></button>`;
}
const empty=(t,b='')=>`<div class="empty">${t}${b?`<div>${b}</div>`:''}</div>`;
const fill=(pct,c,k=0)=>pct>0?`<i class="w-${c}-s${k}" style="width:${Math.max(3,Math.min(100,pct))}%"></i>`:'';
const bar=(pct,c,thin=true)=>`<span class="bar${thin?' thin':''}" style="display:block;margin-top:7px">${fill(pct,c,pct>50?0:1)}</span>`;
const bonusTags=en=>{let o='';if(en.f.includes('N'))o+=`<span class="tag">First time +${en.b[1]}</span>`;else if(en.b[1])o+=`<span class="tag">Fresh +${en.b[1]}</span>`;if(en.b[2])o+=`<span class="tag">New peak +${en.b[2]}</span>`;if(en.b[3])o+=`<span class="tag">Step cleared +${en.b[3]}</span>`;return o};
const entRow=(en,showDate=false)=>{const e=X(en.ex);return `<div class="ent"><button data-a="ex" data-id="${esc(en.ex)}" style="min-width:0"><span class="nm">${esc(e.name)}</span><span class="meta"><span>${unit(e,en.n)}${showDate?`, ${fmtShort(en.d)}`:''}</span><span class="bon">${bonusTags(en)}</span></span></button><span class="pts">+${en.p}</span><button class="ib sm" data-a="dellog" data-id="${en.id}" aria-label="Delete this set">${ic('x')}</button></div>`};

/* ---- picking moves for a body area (suggestions + auto-fill) */
function trainAt(id,target){
  const e=X(id),b=stats().by[id]?.best||0;
  let n=b?Math.max(1,Math.round(b*.75)):e.def;
  if(target)n=Math.min(target,b?Math.max(n,1):Math.max(1,Math.ceil(target/2)));
  if(e.u==='sec'&&n>=10)n=Math.round(n/5)*5;
  return n;
}
function pickFor(g,count,skip=new Set()){
  const st=stats(),t=today(),out=[];
  const add=(id,n)=>{if(out.length<count&&!skip.has(id)&&X(id).g===g&&X(id)!==GONE&&!out.find(o=>o.ex===id))out.push({id:uid(),ex:id,n,sets:3})};
  for(const pr of S.projects){const ps=projStatus(pr);if(ps.cur>=0){const s=ps.steps[ps.cur];add(s.ex,trainAt(s.ex,s.target))}}
  Object.keys(st.by).map(id=>({id,gap:diffDays(t,st.by[id].last)})).filter(o=>o.gap>=4).sort((a,b)=>b.gap-a.gap).forEach(o=>add(o.id,trainAt(o.id)));
  const done=Object.keys(st.by).filter(id=>X(id).g===g),lvl=done.length?done.reduce((a,id)=>a+X(id).d,0)/done.length:g==='stretch'?.5:1.5;
  allEx().filter(e=>e.g===g).sort((a,b)=>Math.abs(a.d-lvl)-Math.abs(b.d-lvl)).forEach(e=>add(e.id,trainAt(e.id)));
  return out;
}
function autofillDay(d,focus){
  const main=focus.filter(g=>g!=='stretch'),per=main.length<=1?5:main.length===2?3:2,items=[];
  const y=S.plan[addDays(d,-1)],skip=new Set((y?.items||[]).map(i=>i.ex));
  main.forEach(g=>items.push(...pickFor(g,per,skip)));
  if(focus.includes('stretch')){
    // stretches are chosen to match the muscles the rest of the day works
    const used=new Set();items.forEach(it=>X(it.ex).m.forEach(k=>used.add(k)));
    allEx().filter(e=>e.g==='stretch'&&e.d<=1.5).map(e=>({e,s:e.m.filter(k=>used.has(k)).length*2+e.p.filter(k=>used.has(k)).length,r:hash(e.id+d)}))
      .sort((a,b)=>b.s-a.s||a.r-b.r).slice(0,main.length?3:6).forEach(({e})=>items.push({id:uid(),ex:e.id,n:e.def,sets:1}));
  }
  S.plan[d]={focus:[...focus],items};
}
const planDone=(d,it)=>S.log.filter(e=>e.d===d&&e.ex===it.ex).length;

/* ---- stretches to do first when a body area has not been trained for a while */
const COLD=4;
const areaGap=g=>{const l=stats().grp[g];return l?diffDays(today(),l):9999};
function warmupFor(e,force=false){
  if(!e||e===GONE||e.g==='stretch')return[];
  if(!force&&areaGap(e.g)<COLD)return[];
  return allEx().filter(s=>inG(s,'stretch')&&s.d<=1.5&&s.id!==e.id).map(s=>{
    const hit=s.m.filter(k=>e.m.includes(k)).length;
    return{s,hit,v:hit*2+s.m.filter(k=>e.p.includes(k)).length*.5+s.p.filter(k=>e.m.includes(k)).length*.5+(WARM.has(s.id)?1.5:0)};
  }).filter(o=>o.hit||o.v>=2).sort((a,b)=>b.v-a.v||a.s.name.localeCompare(b.s.name)).slice(0,2).map(o=>o.s);
}
const warmLine=e=>{const w=warmupFor(e);return w.length?`<span class="meta warm"><span class="dot" style="--c:var(--lime)"></span>Stretch first: ${w.map(s=>esc(s.name)).join(', ')}</span>`:''};

/* ---- sections */
const SEC={home:{},suggest:{},projects:{},log:{},plan:{},points:{},bests:{},library:{}};

SEC.suggest.today=()=>{
  const d=today(),pl=S.plan[d];
  if(!pl||!pl.items.length)return empty('Nothing is planned for today.',`<button class="btn pri" data-a="autoday" data-d="${d}">Auto-fill today</button> <button class="btn" data-a="tab" data-id="plan">Open plan</button>`);
  return{aside:pl.focus.map(g=>GROUPS[g].name).join(', '),body:`<div class="rows">${pl.items.map(it=>{const e=X(it.ex),dn=planDone(d,it);return exRow(e,{n:it.n,d,right:`<b>${Math.min(dn,it.sets)} of ${it.sets}</b>sets done`,extra:`<span class="meta">${it.sets} × ${unit(e,it.n)}</span>`})}).join('')}</div>`};
};
const closeList=()=>S.projects.map(pr=>({pr,st:projStatus(pr)})).filter(o=>o.st.cur>=0).map(o=>{const s=o.st.steps[o.st.cur];return{...o,s,ratio:Math.min(1,s.best/s.target)}}).sort((a,b)=>b.ratio-a.ratio);
const staleList=()=>{const st=stats(),t=today();return Object.keys(st.by).filter(id=>X(id)!==GONE).map(id=>({id,gap:diffDays(t,st.by[id].last)})).filter(o=>o.gap>=4).sort((a,b)=>b.gap-a.gap)};
const areaList=()=>{const st=stats(),t=today();return Object.keys(GROUPS).map(g=>({g,gap:st.grp[g]?diffDays(t,st.grp[g]):9999})).sort((a,b)=>b.gap-a.gap)};
const areaText=gap=>gap===9999?'Nothing logged yet':gap===0?'Done today':`Last done ${ago(gap)}`;
SEC.suggest.close=()=>{
  const list=closeList();
  if(!list.length)return empty('Every project is finished. Start a new one to see what is within reach.',`<button class="btn" data-a="tab" data-id="projects">Open projects</button>`);
  const seen=new Set(),uniq=list.filter(o=>!seen.has(o.s.ex)&&seen.add(o.s.ex)),near=uniq.filter(o=>o.ratio>=.5),show=(near.length?near:uniq).slice(0,4);
  return{aside:near.length?`${near.length} within reach`:'Nearest next steps',body:`<div class="rows">${show.map(({pr,st,s,ratio})=>{const e=X(s.ex),left=s.target-s.best;
    return `<button class="row" data-a="ex" data-id="${esc(s.ex)}" data-n="${s.target}">${thumb(e)}<span><span class="nm">${esc(e.name)}</span><span class="meta"><span class="dot" style="--c:var(--${pr.color})"></span>${esc(pr.name)}, step ${s.i+1} of ${st.n}</span>${bar(ratio*100,pr.color)}<span class="meta">${s.best?`Best ${s.best} of ${unit(e,s.target)}. ${left} more ${e.u==='sec'?(left===1?'second':'seconds'):(left===1?'rep':'reps')} clears it.`:`Not tried yet. The target is ${unit(e,s.target)} in one set.`}</span>${warmLine(e)}</span><span class="right"><b>${Math.round(ratio*100)}%</b></span></button>`}).join('')}</div>`};
};
SEC.suggest.stale=()=>{
  const list=staleList().slice(0,6);
  if(!list.length)return empty(S.log.length?'Nothing is overdue. Moves you skip for four days or more show up here.':'Once you have logged a few sets, moves you have skipped for a while show up here.');
  return `<div class="rows">${list.map(o=>exRow(X(o.id),{right:`<b>${o.gap} days</b>since last`,extra:warmLine(X(o.id))})).join('')}</div>`;
};
SEC.suggest.areas=()=>`<div class="rows">${areaList().map(({g,gap})=>{const s=pickFor(g,1)[0],e=s&&X(s.ex);
    return `<div class="row" style="grid-template-columns:minmax(0,1fr) auto"><span><span class="nm"><span class="dot" style="--c:var(--${GROUPS[g].c});display:inline-block;margin-right:8px"></span>${GROUPS[g].name}</span><span class="meta">${areaText(gap)}</span>${e&&warmupFor(e).length?`<span class="chips" style="margin-top:7px"><span class="meta" style="margin:0">Stretch first</span>${warmupFor(e).map(w=>`<button class="chip" data-a="ex" data-id="${esc(w.id)}"><span class="dot" style="--c:var(--lime)"></span>${esc(w.name)}</button>`).join('')}</span>`:''}</span>${e?`<button class="btn sm" data-a="ex" data-id="${esc(e.id)}" data-n="${s.n}">${esc(e.name)}</button>`:''}</div>`}).join('')}</div>`;

/* ---- home */
SEC.home.week=()=>{
  const t=today(),ws=weekStart(t),st=stats(),cur=rangePts(ws,t),prev=rangePts(addDays(ws,-7),addDays(ws,-1));
  let streak=0,d=st.days[t]!==undefined?t:addDays(t,-1);while(st.days[d]!==undefined){streak++;d=addDays(d,-1)}
  const wl=st.log.filter(e=>e.d>=ws),tr=new Set(wl.map(e=>e.d)).size;
  const cols=Array.from({length:7},(_,i)=>{const k=addDays(ws,i);return{v:st.days[k]||0,x:DOW[pd(k).getDay()],now:k===t}}),mx=Math.max(...cols.map(c=>c.v),1);
  return{aside:prev?`Last week ${prev}`:'',body:`<div class="big">${cur}<small>points</small></div>
  <div class="kv"><div><small>Streak</small><b>${streak} ${streak===1?'day':'days'}</b></div><div><small>Days trained</small><b>${tr} of 7</b></div><div><small>Sets</small><b>${wl.length}</b></div></div>
  <div class="chart sm" role="img" aria-label="Points for each day this week">${cols.map((c,i)=>`<div class="col${c.now?' now':''}"><span class="bw">${c.v?`<span class="v" style="bottom:${c.v/mx*100}%">${c.v}</span><span class="b w-lime-c${i%2}" style="height:${c.v/mx*100}%"></span>`:''}</span><span class="x">${c.x}</span></div>`).join('')}</div>`};
};
SEC.home.next=()=>{
  const out=[],seen=new Set(),add=(e,n,why)=>{if(e&&e!==GONE&&!seen.has(e.id)&&out.length<4){seen.add(e.id);out.push(exRow(e,{n,extra:`<span class="meta" style="color:var(--ink)">${why}</span>${warmLine(e)}`}))}};
  const cl=closeList();cl.slice(0,2).forEach(o=>add(X(o.s.ex),o.s.target,`<span class="dot" style="--c:var(--${o.pr.color})"></span>${esc(o.pr.name)} step ${o.s.i+1}: ${o.s.best?`best ${o.s.best} of ${o.s.target}`:`target ${unit(X(o.s.ex),o.s.target)}`}`));
  const sl=staleList()[0];if(sl)add(X(sl.id),'',`Not done for ${sl.gap} days`);
  const ar=areaList()[0],pk=pickFor(ar.g,3).find(p=>!seen.has(p.ex));if(pk)add(X(pk.ex),pk.n,`${GROUPS[ar.g].name} is due. ${areaText(ar.gap)}.`);
  return{aside:`<button class="btn sm" data-a="tab" data-id="suggest">All suggestions</button>`,body:`<div class="rows">${out.join('')}</div>`};
};
SEC.home.sched=()=>{
  const t=today(),days=Array.from({length:5},(_,i)=>addDays(t,i)),any=days.some(d=>S.plan[d]?.items.length);
  if(!any)return{aside:`<button class="btn sm" data-a="tab" data-id="plan">Open plan</button>`,body:empty('Nothing is scheduled for the next five days.',`<button class="btn pri" data-a="autoday" data-d="${t}">Auto-fill today</button> <button class="btn" data-a="tab" data-id="plan">Plan a week</button>`)};
  return{aside:`<button class="btn sm" data-a="tab" data-id="plan">Open plan</button>`,body:`<div class="rows">${days.map((d,i)=>{const pl=S.plan[d],n=pl?.items.length||0,dt=pd(d);
    const done=i===0&&n?pl.items.filter(it=>planDone(d,it)>=it.sets).length:0;
    return `<button class="row" style="grid-template-columns:52px minmax(0,1fr) auto" data-a="goplan" data-d="${d}"><span class="num" style="width:auto;height:auto;border:0;display:block;text-align:left;color:${i===0?'var(--ink)':'var(--mute)'}">${i===0?'Today':DOW[dt.getDay()]}<b style="display:block;font-size:19px;font-stretch:118%;font-weight:800;color:var(--ink);line-height:1.1">${dt.getDate()}</b></span>
    <span>${n?`<span class="nm">${pl.focus.map(g=>GROUPS[g].name).join(', ')||'Workout'}</span><span class="meta">${pl.items.slice(0,3).map(it=>esc(X(it.ex).name)).join(', ')}${n>3?` and ${n-3} more`:''}</span>`:`<span class="meta" style="margin:0">Rest day, nothing planned</span>`}</span>
    <span class="right">${n?(i===0?`<b>${done} of ${n}</b>moves done`:`<b>${n}</b>moves`):''}</span></button>`}).join('')}</div>`};
};
SEC.home.progress=()=>S.projects.length?{aside:`<button class="btn sm" data-a="tab" data-id="projects">All projects</button>`,body:`<div class="rows">${S.projects.map(pr=>{const st=projStatus(pr),cur=st.cur>=0?st.steps[st.cur]:null;
  return `<button class="row" style="grid-template-columns:minmax(0,1fr) auto" data-a="proj" data-id="${pr.id}"><span><span class="nm">${esc(pr.name)}</span>${st.n?`<span class="segs" style="margin:7px 0 2px">${st.steps.map(s=>`<i class="${s.ok?`w-${pr.color}-s${s.i%2}`:''}${s.i===st.cur?' cur':''}"></i>`).join('')}</span>`:''}<span class="meta">${cur?`Now: ${esc(X(cur.ex).name)}, ${cur.best?`best ${cur.best} of ${unit(X(cur.ex),cur.target)}`:`target ${unit(X(cur.ex),cur.target)}`}`:st.done?'All steps cleared':'No steps yet'}</span></span><span class="right"><b>${st.cleared} of ${st.n}</b>steps</span></button>`}).join('')}</div>`}:empty('No projects yet.',`<button class="btn pri" data-a="tab" data-id="projects">Open projects</button>`);
SEC.home.recent=()=>{const l=[...stats().log].reverse().slice(0,6);return{aside:`<button class="btn sm" data-a="tab" data-id="log">Full log</button>`,body:l.length?l.map(e=>entRow(e,true)).join(''):empty('Nothing logged yet. Your latest sets and the points they earned will show here.',`<button class="btn pri" data-a="tab" data-id="log">Log your first set</button>`)}};
SEC.home.quick=()=>{const seen=new Set(),l=[];for(const en of [...stats().log].reverse()){if(!seen.has(en.ex)&&X(en.ex)!==GONE){seen.add(en.ex);l.push(X(en.ex))}if(l.length>=10)break}
  const list=l.length?l:['pushup','pullup','squat','plank','dip','row','lunge','hollow'].map(X);
  return{aside:l.length?'Your latest moves':'Common starting moves',body:`<div class="chips">${list.map(e=>`<button class="btn sm" data-a="ex" data-id="${esc(e.id)}"><span class="dot" style="--c:var(--${GROUPS[e.g].c})"></span>${esc(e.name)}</button>`).join('')}</div>`};
};
SEC.home.balance=()=>{
  const t=today(),from=addDays(t,-6),st=stats(),sum={};Object.keys(GROUPS).forEach(g=>sum[g]=0);
  st.log.filter(e=>e.d>=from).forEach(e=>{sum[X(e.ex).g]+=e.p});const mx=Math.max(...Object.values(sum),1);
  return Object.keys(GROUPS).map((g,i)=>`<div class="src"><span><span class="dot" style="--c:var(--${GROUPS[g].c});display:inline-block;margin-right:8px"></span>${GROUPS[g].name}</span><span class="bar" style="display:block">${fill(sum[g]/mx*100,GROUPS[g].c,i%2)}</span><b>${sum[g]}</b></div>`).join('')+`<p class="meta" style="margin-top:10px">Points earned per body area. ${(()=>{const a=areaList()[0];return a.gap>=3?`${GROUPS[a.g].name} is the most overdue.`:'All four areas were trained in the last few days.'})()}</p>`;
};

function pcard(pr){
  const st=projStatus(pr),goal=pr.steps.length?X(pr.steps[pr.steps.length-1].ex):null,cur=st.cur>=0?st.steps[st.cur]:null;
  return `<button class="pcard" data-a="proj" data-id="${pr.id}" style="--pc:var(--${pr.color})"><span class="wash w-${pr.color}-b${hash(pr.id)%3}"></span>${goal?`<span class="goal">${figure(goal.pose)}</span>`:''}
  <span><strong class="pn">${esc(pr.name)}</strong><span class="cnt" style="display:block">${st.n?`${st.cleared} of ${st.n} steps cleared`:'No steps yet'}</span></span>
  ${st.n?`<span class="segs">${st.steps.map(s=>`<i class="${s.ok?`w-${pr.color}-s${s.i%2}`:''}${s.i===st.cur?' cur':''}"></i>`).join('')}</span>`:''}
  <span class="now">${cur?`<span>Now:</span> ${esc(X(cur.ex).name)}, ${cur.best?`best ${cur.best} of ${unit(X(cur.ex),cur.target)}`:`target ${unit(X(cur.ex),cur.target)}`}`:st.done?'All steps cleared':'Add moves to build this progression'}</span></button>`;
}
SEC.projects.active=()=>{
  const l=S.projects.filter(p=>!projStatus(p).done);
  return{aside:`<button class="btn sm" data-a="newproj">${ic('plus')}New project</button>`,body:l.length?`<div class="pgrid">${l.map(pcard).join('')}</div>`:empty('No projects in progress.',`<button class="btn pri" data-a="newproj">New project</button>`)};
};
SEC.projects.done=()=>{const l=S.projects.filter(p=>projStatus(p).done);return l.length?`<div class="pgrid">${l.map(pcard).join('')}</div>`:empty('Clear the last step of a project and it moves here.')};

function projectDetail(){
  const pr=S.projects.find(p=>p.id===ui.project);if(!pr){ui.project=null;return page()}
  const st=projStatus(pr),goal=pr.steps.length?X(pr.steps[pr.steps.length-1].ex):null;
  let body;
  if(ui.editProj){
    body=`<div class="form"><div><label class="lab" for="pname">Project name</label><input id="pname" class="field" data-i="pname" value="${esc(pr.name)}" maxlength="40"></div>
    <div><span class="lab">Color</span><div class="swatches">${Object.keys(PIG).map(k=>`<button class="sw" style="--c:var(--${k})" data-a="pcolor" data-id="${k}" aria-pressed="${pr.color===k}" aria-label="${k}"></button>`).join('')}</div></div>
    <div><span class="lab">Steps, easiest first</span>${pr.steps.map((s,i)=>{const e=X(s.ex);return `<div class="edit-step"><span class="thumb xs w-${GROUPS[e.g].c}-b${hash(e.id)%3}">${figure(e.pose)}</span><span><span class="nm">${i+1}. ${esc(e.name)}</span><span class="meta">${stars(e.d)}</span></span>
      <div class="ctl"><span class="stp"><button class="ib sm" data-a="starget" data-i="${i}" data-by="-1" aria-label="Lower target">${ic('minus')}</button><b>${unit(e,s.target)}</b><button class="ib sm" data-a="starget" data-i="${i}" data-by="1" aria-label="Raise target">${ic('plus')}</button></span>
      <span class="stp"><button class="ib sm" data-a="smove" data-i="${i}" data-by="-1" aria-label="Move up"${i===0?' disabled':''}>${ic('up')}</button><button class="ib sm" data-a="smove" data-i="${i}" data-by="1" aria-label="Move down"${i===pr.steps.length-1?' disabled':''}>${ic('down')}</button><button class="ib sm" data-a="sdel" data-i="${i}" aria-label="Remove step">${ic('x')}</button></span></div></div>`}).join('')||empty('No steps yet. Add the moves that lead up to this skill.')}</div>
    <div class="chips"><button class="btn" data-a="pick" data-for="step">${ic('plus')}Add a move</button><button class="btn pri" data-a="editproj">Done editing</button><button class="btn danger" data-a="delproj">${ui.confirm==='delproj'?'Tap again to delete':'Delete project'}</button></div></div>`;
  }else{
    body=st.n?`<div class="ladder">${st.steps.map(s=>{const e=X(s.ex),cls=s.ok?'ok':s.i===st.cur?'cur':'next';
      return `<button class="step ${cls}" data-a="ex" data-id="${esc(s.ex)}" data-n="${s.target}" style="--pc:var(--${pr.color})"><span class="num">${s.i+1}</span>${thumb(e)}<span><span class="nm">${esc(e.name)}</span><span class="meta">${stars(e.d)}<span>Target ${unit(e,s.target)} in one set</span></span>${cls==='cur'?bar(Math.min(100,s.best/s.target*100),pr.color):''}</span><span class="right">${cls==='ok'?`<b>Cleared</b>best ${unit(e,s.best)}`:cls==='cur'?`<b>${s.best} of ${s.target}</b>current step`:s.best?`Best ${s.best} of ${s.target}`:'Up next'}</span></button>`}).join('')}</div>`
      :empty('This project has no steps yet.',`<button class="btn pri" data-a="editproj">Add steps</button>`);
  }
  return `<div style="margin-bottom:12px"><button class="btn sm" data-a="projback">${ic('back')}All projects</button></div>
  <div class="phero"><span class="wash w-${pr.color}-b${hash(pr.id)%3}"></span><div><h1>${esc(pr.name)}</h1><p class="meta" style="font-size:14px;margin:8px 0 14px">${st.n?`${st.cleared} of ${st.n} steps cleared`:'No steps yet'}${st.done?'. Project complete.':''}</p>${ui.editProj?'':`<button class="btn" data-a="editproj">${ic('pen')}Edit progression</button>`}</div>${goal?`<span class="goal">${figure(goal.pose)}</span>`:''}</div>
  <div class="secs"><section class="sec"><div class="sec-h"><h2>${ui.editProj?'Edit progression':'Progression'}</h2><span class="aside">Steps clear on their own as you log sets</span></div>${body}</section></div>`;
}

const logResults=()=>{
  const q=ui.logQ.trim().toLowerCase();let list;
  if(q)list=allEx().filter(e=>e.name.toLowerCase().includes(q)).slice(0,8);
  else{const seen=new Set();list=[];for(const en of [...stats().log].reverse()){if(!seen.has(en.ex)&&X(en.ex)!==GONE){seen.add(en.ex);list.push(X(en.ex))}if(list.length>=6)break}
    if(!list.length)list=['pushup','pullup','squat','plank','dip','hang'].map(X)}
  return list.length?`<div class="rows">${list.map(e=>{const s=stats().by[e.id];return exRow(e,{right:s?`<b>${unit(e,s.best)}</b>best`:''})}).join('')}</div>`:empty('No exercise matches that search.');
};
SEC.log.quick=()=>({aside:`<button class="btn sm" data-a="tab" data-id="library">Browse library</button>`,body:`<label class="vh" for="logq">Find an exercise</label><input id="logq" class="field" type="search" data-i="logq" placeholder="Find an exercise" value="${esc(ui.logQ)}" style="margin-bottom:12px"><div id="logres">${logResults()}</div>`});
SEC.home.logset=SEC.suggest.logset=()=>SEC.log.quick();
SEC.log.todaylog=()=>{
  const d=today(),l=stats().log.filter(e=>e.d===d).reverse(),pts=l.reduce((a,e)=>a+e.p,0);
  return{aside:fmtDay(d),body:`<div class="big">${pts}<small>points from ${l.length} ${l.length===1?'set':'sets'}</small></div><div style="margin-top:14px">${l.length?l.map(e=>entRow(e)).join(''):empty('No sets yet today. Pick an exercise to log your first.')}</div>`};
};
SEC.log.history=()=>{
  const st=stats(),t=today(),days=Object.keys(st.days).filter(d=>d<t).sort().reverse();
  if(!days.length)return empty('Past days appear here once you have logged on more than one day.');
  const show=days.slice(0,ui.histN);
  return show.map(d=>{const l=st.log.filter(e=>e.d===d);return `<div class="dayh"><b>${fmtDay(d)}</b><span>${l.length} ${l.length===1?'set':'sets'}, ${st.days[d]} points</span></div>${l.map(e=>entRow(e)).join('')}`}).join('')+(days.length>show.length?`<div style="margin-top:14px"><button class="btn" data-a="morehist">Show earlier days</button></div>`:'');
};

SEC.plan.cal=()=>{
  const t=today();
  return `<div class="cal">${Array.from({length:14},(_,i)=>{const d=addDays(t,i),pl=S.plan[d],dt=pd(d);
    return `<button class="day${i===0?' tod':''}" data-a="planday" data-d="${d}" aria-pressed="${ui.planDay===d}"><small>${i===0?'Today':DOW[dt.getDay()]}</small><b>${dt.getDate()}</b><span class="dots">${(pl?.focus||[]).map(g=>`<span class="dot" style="--c:var(--${GROUPS[g].c})"></span>`).join('')}</span><span class="n">${pl?.items.length?`${pl.items.length}<span class="w"> moves</span>`:'&nbsp;'}</span></button>`}).join('')}</div>
  <div class="legend" style="margin-top:12px">${Object.values(GROUPS).map(g=>`<span><span class="dot" style="--c:var(--${g.c})"></span>${g.name}</span>`).join('')}</div>`;
};
SEC.plan.day=()=>{
  const d=ui.planDay,pl=S.plan[d]||{focus:[],items:[]},isToday=d===today();
  return{aside:fmtDay(d),body:`<div class="opt"><span class="lab" style="margin:0">Body areas for this day</span><div class="chips">${Object.keys(GROUPS).map(g=>`<button class="chip" data-a="focus" data-id="${g}" aria-pressed="${pl.focus.includes(g)}"><span class="dot" style="--c:var(--${GROUPS[g].c})"></span>${GROUPS[g].name}</button>`).join('')}</div></div>
  <div class="chips" style="margin-bottom:6px"><button class="btn pri" data-a="autoday" data-d="${d}">${pl.items.length?'Auto-fill again':'Auto-fill this day'}</button><button class="btn" data-a="pick" data-for="plan">${ic('plus')}Add a move</button>${pl.items.length?`<button class="btn" data-a="clearday">Clear</button>`:''}</div>
  ${pl.items.length?pl.items.map((it,i)=>{const e=X(it.ex),dn=planDone(d,it);return `<div class="pitem"><span class="thumb xs w-${GROUPS[e.g].c}-b${hash(e.id)%3}">${figure(e.pose)}</span><button data-a="ex" data-id="${esc(e.id)}" data-n="${it.n}"${isToday?` data-d="${d}"`:''} style="min-width:0"><span class="nm">${esc(e.name)}</span><span class="meta">${stars(e.d)}${isToday?`<span>${Math.min(dn,it.sets)} of ${it.sets} sets done</span>`:''}</span></button><button class="ib sm" data-a="pdel" data-i="${i}" aria-label="Remove from plan">${ic('x')}</button>
    <div class="ctl"><span class="stp"><button class="ib sm" data-a="pset" data-i="${i}" data-k="sets" data-by="-1" aria-label="Fewer sets">${ic('minus')}</button><b>${it.sets} ${it.sets===1?'set':'sets'}</b><button class="ib sm" data-a="pset" data-i="${i}" data-k="sets" data-by="1" aria-label="More sets">${ic('plus')}</button></span><span class="stp"><button class="ib sm" data-a="pset" data-i="${i}" data-k="n" data-by="-1" aria-label="Lower amount">${ic('minus')}</button><b>${unit(e,it.n)}</b><button class="ib sm" data-a="pset" data-i="${i}" data-k="n" data-by="1" aria-label="Raise amount">${ic('plus')}</button></span></div></div>`}).join('')
   :empty(pl.focus.length?'Pick Auto-fill to choose moves for these body areas, or add your own.':'Choose body areas above, then auto-fill. With none chosen, auto-fill picks the areas you have trained least recently.')}`};
};
const SPLITS={ppl:{name:'Push, pull, legs, core',seq:[['push'],['pull'],['legs'],['core']]},ul:{name:'Upper and lower',seq:[['push','pull'],['legs','core']]},full:{name:'Full body',seq:[['push','pull','legs','core']]}};
const DAYPAT={3:[1,0,1,0,1,0,0],4:[1,1,0,1,1,0,0],5:[1,1,1,0,1,1,0],6:[1,1,1,1,1,1,0]};
SEC.plan.auto=()=>`<div class="opt"><span class="lab" style="margin:0">Training days</span><div class="chips">${[3,4,5,6].map(n=>`<button class="chip" data-a="autoset" data-k="days" data-id="${n}" aria-pressed="${ui.auto.days===n}">${n} days</button>`).join('')}</div></div>
  <div class="opt"><span class="lab" style="margin:0">Split</span><div class="chips">${Object.keys(SPLITS).map(k=>`<button class="chip" data-a="autoset" data-k="split" data-id="${k}" aria-pressed="${ui.auto.split===k}">${SPLITS[k].name}</button>`).join('')}</div></div>
  <div class="opt"><div class="chips"><button class="chip" data-a="autoset" data-k="stretch" aria-pressed="${ui.auto.stretch}">End each day with stretches</button><button class="chip" data-a="autoset" data-k="replace" aria-pressed="${ui.auto.replace}">Replace days already planned</button></div></div>
  <button class="btn pri" data-a="autoweek">Auto-fill the next 7 days</button>
  <p class="meta" style="margin-top:12px">Each day gets the current step of matching projects first, then moves you have not done in a while, then staples at your level. Stretches are matched to the muscles that day works.</p>`;

SEC.points.compare=()=>{
  const t=today(),ws=weekStart(t),cur=rangePts(ws,t),prev=rangePts(addDays(ws,-7),addDays(ws,-1)),left=6-diffDays(t,ws);
  const dt=pd(t),ms=`${t.slice(0,8)}01`,lm=new Date(dt.getFullYear(),dt.getMonth()-1,1,12),lme=addDays(ms,-1);
  const mc=rangePts(ms,t),mp=rangePts(ds(lm),lme),mx=Math.max(cur,prev,1),mmx=Math.max(mc,mp,1);
  const row=(l,v,m,c)=>`<div><div class="l"><span>${l}</span><b>${v}</b></div><span class="bar" style="display:block">${fill(v/m*100,c)}</span></div>`;
  return `<div class="big">${cur}<small>points this week</small></div>
  <p class="delta">${cur>=prev?(prev?`<b>${cur-prev}</b> ahead of last week\u2019s total.`:cur?'Your first scoring week.':'Log a set to start this week\u2019s total.'):`<b>${prev-cur}</b> short of last week\u2019s total, with ${left} ${left===1?'day':'days'} left.`}</p>
  <div class="duo">${row('This week',cur,mx,'orange')}${row('Last week',prev,mx,'ink')}${row(MON[dt.getMonth()],mc,mmx,'rose')}${row(MON[lm.getMonth()],mp,mmx,'ink')}</div>`;
};
SEC.points.sources=()=>{
  const ws=weekStart(today()),s=[0,0,0,0];S.log.filter(e=>e.d>=ws).forEach(e=>e.b.forEach((v,i)=>s[i]+=v));
  const mx=Math.max(...s,1),L=[['Base','cerulean'],['Freshness','emerald'],['New peaks','rose'],['Project steps','violet']];
  return L.map(([n,c],i)=>`<div class="src"><span>${n}</span><span class="bar" style="display:block">${fill(s[i]/mx*100,c,i%2)}</span><b>${s[i]}</b></div>`).join('')+
  `<div class="rules"><span>Base: every move has a value and a solid-set mark, both shown on the move. Hit the mark and you earn the full value. The value doubles with each star of difficulty.</span><span>Below the mark, points go up evenly with reps or seconds. Past it they climb fast: a third more than the mark is close to double. Marks differ by move, so 20 squats is an ordinary set and 20 pull-ups is worth a great deal.</span><span>Bonuses are not shown before you log. They are added afterward and listed on each set.</span><span>Freshness: up to +50% for a move you have skipped for four days or more, and +50% the first time.</span><span>New peak: +50% and 10 points when a set beats your best.</span><span>Project step: 20 points per star when a set clears a step, and 100 for the final step.</span></div>`;
};
SEC.points.chart=()=>{
  const t=today(),st=stats();let cols=[];
  if(ui.chart==='days')for(let i=13;i>=0;i--){const d=addDays(t,-i);cols.push({v:st.days[d]||0,x:i===0?'Today':String(pd(d).getDate()),now:i===0})}
  if(ui.chart==='weeks'){const ws=weekStart(t);for(let i=9;i>=0;i--){const a=addDays(ws,-7*i);cols.push({v:rangePts(a,addDays(a,6)),x:`${pd(a).getMonth()+1}/${pd(a).getDate()}`,now:i===0})}}
  if(ui.chart==='months'){const dt=pd(t);for(let i=11;i>=0;i--){const a=new Date(dt.getFullYear(),dt.getMonth()-i,1,12),b=new Date(dt.getFullYear(),dt.getMonth()-i+1,0,12);cols.push({v:rangePts(ds(a),ds(b)),x:MON[a.getMonth()],now:i===0})}}
  if(ui.chart==='years'){const y=pd(t).getFullYear(),first=Math.min(y-2,...Object.keys(st.days).map(d=>+d.slice(0,4)));for(let k=first;k<=y;k++)cols.push({v:rangePts(`${k}-01-01`,`${k}-12-31`),x:String(k),now:k===y})}
  const mx=Math.max(...cols.map(c=>c.v),1);
  return{aside:`<span class="chips">${['days','weeks','months','years'].map(k=>`<button class="chip" data-a="chart" data-id="${k}" aria-pressed="${ui.chart===k}">${k[0].toUpperCase()+k.slice(1)}</button>`).join('')}</span>`,
   body:`<div class="chart" role="img" aria-label="Points by ${ui.chart}">${cols.map((c,i)=>`<div class="col${c.now?' now':''}"><span class="bw">${c.v?`<span class="v" style="bottom:${c.v/mx*100}%">${c.v}</span><span class="b w-orange-c${i%2}" style="height:${c.v/mx*100}%"></span>`:''}</span><span class="x">${c.x}</span></div>`).join('')}</div>`};
};
SEC.points.recent=()=>{const l=[...stats().log].reverse().slice(0,12);return l.length?l.map(e=>entRow(e,true)).join(''):empty('Each set you log lands here with its point breakdown.',`<button class="btn pri" data-a="tab" data-id="log">Log a set</button>`)};

SEC.bests.prog=()=>S.projects.length?`<div class="rows">${S.projects.map(pr=>{const st=projStatus(pr);if(!st.n)return '';const s=st.steps[Math.max(0,st.peak)],e=X(s.ex);
  return `<button class="row" data-a="proj" data-id="${pr.id}"${st.peak<0?' style="opacity:.6"':''}>${thumb(e)}<span><span class="nm">${esc(pr.name)}</span><span class="meta"><span class="dot" style="--c:var(--${pr.color})"></span>${st.peak<0?'No step cleared yet':`Furthest: step ${st.peak+1}, ${esc(e.name)}, ${unit(e,s.best)}`}</span></span><span class="right"><b>${st.cleared} of ${st.n}</b>steps</span></button>`}).join('')}</div>`:empty('Projects you start show their furthest step here.');
SEC.bests.peaks=()=>{const l=[...stats().log].reverse().filter(e=>/[PS]/.test(e.f)).slice(0,7);
  return l.length?`<div class="rows">${l.map(en=>{const e=X(en.ex);return exRow(e,{right:`<b>${unit(e,en.n)}</b>${fmtShort(en.d)}`,extra:`<span class="meta bon">${en.b[2]?'<span class="tag">New peak</span>':''}${en.b[3]?'<span class="tag">Step cleared</span>':''}</span>`})}).join('')}</div>`:empty('Beat your best set of any move, or clear a project step, and it is recorded here.')};
SEC.bests.reps=()=>{
  const st=stats(),ids=Object.keys(st.by).filter(id=>X(id)!==GONE&&(ui.bestG==='all'||inG(X(id),ui.bestG))).sort((a,b)=>X(b).d-X(a).d||X(a).name.localeCompare(X(b).name));
  const chips=`<div class="chips" style="margin-bottom:10px">${[['all','All'],...Object.keys(GROUPS).map(g=>[g,GROUPS[g].name])].map(([k,n])=>`<button class="chip" data-a="bestg" data-id="${k}" aria-pressed="${ui.bestG===k}">${n}</button>`).join('')}</div>`;
  return chips+(ids.length?`<div class="cards">${ids.map(id=>{const e=X(id),s=st.by[id];return exRow(e,{right:`<b>${unit(e,s.best)}</b>${fmtShort(s.bestD)}`,extra:`<span class="meta">Logged ${s.count} ${s.count===1?'time':'times'}</span>`})}).join('')}</div>`:empty(S.log.length?'No logged moves in this body area yet.':'Your best set of every move you log is kept here.'));
};

const libResults=()=>{
  const q=ui.libQ.trim().toLowerCase();
  let l=allEx().filter(e=>(ui.libG==='all'||inG(e,ui.libG))&&(!q||e.name.toLowerCase().includes(q)||e.m.concat(e.p).some(k=>MUSC[k].toLowerCase().includes(q))));
  l.sort(ui.libSort==='name'?(a,b)=>a.name.localeCompare(b.name):ui.libSort==='hard'?(a,b)=>b.d-a.d||a.name.localeCompare(b.name):(a,b)=>a.d-b.d||a.name.localeCompare(b.name));
  return l.length?`<div class="cards">${l.map(e=>exRow(e,{bm:true})).join('')}</div>`:empty('No exercise matches. Try another name or muscle, or add your own.');
};
SEC.library.all=()=>({aside:`${allEx().length} exercises`,body:`<label class="vh" for="libq">Search by name or muscle</label><input id="libq" class="field" type="search" data-i="libq" placeholder="Search by name or muscle" value="${esc(ui.libQ)}">
  <div class="chips" style="margin:10px 0 4px">${[['all','All'],...Object.keys(GROUPS).map(g=>[g,GROUPS[g].name])].map(([k,n])=>`<button class="chip" data-a="libg" data-id="${k}" aria-pressed="${ui.libG===k}">${n}</button>`).join('')}
  <span style="width:1px;background:var(--line2);margin:4px 3px"></span>${[['name','A to Z'],['easy','Easiest first'],['hard','Hardest first']].map(([k,n])=>`<button class="chip" data-a="libsort" data-id="${k}" aria-pressed="${ui.libSort===k}">${n}</button>`).join('')}</div>
  <div class="legend" style="margin:10px 0 6px"><span><span class="sq" style="--c:var(--main)"></span>Main muscles</span><span><span class="sq" style="--c:var(--part)"></span>Partial</span><span>Each pair of figures shows the body from the front (left) and from the back (right).</span></div><div id="libres">${libResults()}</div>`});
SEC.library.mine=()=>{const l=Object.values(S.custom);return{aside:`<button class="btn sm" data-a="newex">${ic('plus')}New exercise</button>`,body:l.length?`<div class="cards">${l.map(e=>exRow(e,{bm:true})).join('')}</div>`:empty('Add moves that are not in the library. They work everywhere the built-in ones do: projects, plans, points and bests.')}};

/* ---- shell */
const CYC=Object.keys(PIG);
const secColor=(tab,k)=>CYC[(CYC.indexOf(tabOf(tab).c)+k*3)%CYC.length];
function secWrap(tab,id,title,size,r,idx,n){
  const body=typeof r==='string'?r:r.body,aside=typeof r==='string'?'':r.aside||'';
  const tools=ui.arrange?`<span class="sec-tools"><button class="ib sm" data-a="secmove" data-id="${id}" data-by="-1" aria-label="Move ${esc(title)} up"${idx===0?' disabled':''}>${ic('up')}</button><button class="ib sm" data-a="secmove" data-id="${id}" data-by="1" aria-label="Move ${esc(title)} down"${idx===n-1?' disabled':''}>${ic('down')}</button><button class="ib sm w-toggle" data-a="secsize" data-id="${id}" aria-label="Switch ${esc(title)} between full and half width">${ic('wide')}</button><button class="ib sm" data-a="sechide" data-id="${id}" aria-label="Hide ${esc(title)}">${ic('x')}</button></span>`:(aside?`<span class="aside">${aside}</span>`:'');
  return `<section class="sec ${size} t-${secColor(tab,idx)}"><div class="sec-h"><h2>${esc(title)}</h2>${tools}</div>${ui.arrange?'<p class="meta">Use the arrows to move this part.</p>':body}</section>`;
}
function page(){
  const t=tabOf(ui.tab);
  if(ui.tab==='projects'&&ui.project)return projectDetail();
  const L=lay(t.id),vis=L.order.filter(i=>!L.hidden.includes(i));
  const secs=vis.map((i,k)=>{const d=t.secs.find(s=>s[0]===i);return secWrap(t.id,i,d[1],L.size[i]||d[2],ui.arrange?'':SEC[t.id][i](),k,vis.length)}).join('');
  const hid=ui.arrange&&L.hidden.length?`<div class="hidden-list">Hidden: ${L.hidden.map(i=>`<button class="btn sm" data-a="secshow" data-id="${i}">${ic('eye')}${esc(t.secs.find(s=>s[0]===i)[1])}</button>`).join('')}</div>`:'';
  return `<header class="phead w-${t.c}-band"><h1>${t.name}</h1>
  <div class="phead-tools"><button class="btn sm${ui.arrange?' pri':''}" data-a="arrange">${ui.arrange?'Done':ic('arrange')+'Arrange'}</button><button class="ib only-m" data-a="settings" aria-label="Settings">${ic('gear')}</button></div><p class="sub">${ui.arrange?'Move, resize or hide the parts of this tab. Each tab keeps its own arrangement.':t.sub}</p></header>
  <div class="secs${ui.arrange?' arr':''}">${secs}${hid}</div>`;
}
function render(){
  const ws=weekStart(today()),wk=rangePts(ws,today());
  const nav=cls=>TABS.map(t=>`<button class="${cls}" data-a="tab" data-id="${t.id}" style="--tc:var(--${t.c})"${ui.tab===t.id?' aria-current="page"':''}${cls==='tab'&&t.short?` aria-label="${t.name}"`:''}>${ic(t.id)}<span>${cls==='tab'&&t.short?t.short:t.name}</span></button>`).join('');
  const tc=tabOf(ui.tab).c;
  $('#app').innerHTML=`<div class="bgwash a w-${tc}-b0"></div><div class="bgwash b w-${PIG2[tc]}-b2"></div><aside class="side"><div class="brand w-gamboge-band">Chalkline</div><nav style="display:grid;gap:2px" aria-label="Sections">${nav('snav')}</nav>
    <div class="side-foot"><div class="wk"><b>${wk}</b><span>points this week</span></div>${store.db&&!store.server&&!store.acct?`<button class="btn sm pri" data-a="auth">Create account or sign in</button>`:''}<button class="btn sm" data-a="settings">${ic('gear')}Settings</button><span class="sync">${syncLabel()}</span></div></aside>
  <main class="main t-${tc}">${page()}</main><nav class="tabbar" aria-label="Sections">${nav('tab')}</nav>`;
}
