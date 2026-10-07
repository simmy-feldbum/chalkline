/* ================= drawing: figures, body map, washes, stars, icons ================= */
const rad=a=>a*Math.PI/180;
const PT=(o,a,l)=>[o[0]+l*Math.cos(rad(a)),o[1]+l*Math.sin(rad(a))];
const LEN={T:28,UA:15,FA:15,TH:22,SH:22,N:10.5,HR:5.8,FT:6};
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const r1=n=>Math.round(n*10)/10;

const figCache={};
function figure(key){
  if(figCache[key])return figCache[key];
  const p=POSES[key]||POSES.pushup, R=rng(hash(key));
  const hip=[0,0], sh=PT(hip,p.t,LEN.T), head=PT(sh,p.h??p.t,LEN.N);
  const limb=(o,a,l1,l2)=>{const m=PT(o,a[0],l1);return[o,m,PT(m,a[1],l2)]};
  const A=limb(sh,p.a,LEN.UA,LEN.FA), L=limb(hip,p.l,LEN.TH,LEN.SH);
  const A2=p.a2&&limb(sh,p.a2,LEN.UA,LEN.FA), L2=p.l2&&limb(hip,p.l2,LEN.TH,LEN.SH);
  const foot=(leg,shin,f)=>f===null?null:[leg[2],PT(leg[2],f===undefined?shin-90:f,LEN.FT)];
  const F1=foot(L,p.l[1],p.f), F2=L2&&foot(L2,p.l2[1],p.f2);
  const J={hip,sh,hd:A[2],el:A[1],kn:L[1],ft:L[2],hd2:A2&&A2[2],ft2:L2&&L2[2]};
  const body=[hip,sh,...A,...L,...(A2||[]),...(L2||[])];
  const bodyMaxY=Math.max(...body.map(q=>q[1]));
  const floorY=p.fl!==undefined?bodyMaxY+p.fl:null;
  const pts=[...body,[head[0]-LEN.HR,head[1]-LEN.HR],[head[0]+LEN.HR,head[1]+LEN.HR]];
  if(F1)pts.push(F1[1]); if(F2)pts.push(F2[1]);
  const props=[];
  for(const [t,j,off] of (p.pr||[])){
    const q=J[j]||J.hd;
    if(t==='bar'){props.push(['l',q[0]-14,q[1],q[0]+14,q[1],1.5])}
    if(t==='pbar'){props.push(['l',q[0]-9,q[1],q[0]+10,q[1],1.5]); if(floorY!==null)props.push(['l',q[0]+7,q[1],q[0]+7,floorY,1])}
    if(t==='box'){const top=j==='hip'?q[1]+3.5:q[1], x0=j==='hip'?q[0]-13:q[0]-10; props.push(['r',x0,top,20,floorY-top])}
    if(t==='wall'){const top=Math.min(...pts.map(v=>v[1]))-3; props.push(['l',q[0]+off,floorY,q[0]+off,top,1])}
    if(t==='pole'){const a=J.hd,b=J.hd2||J.hd;props.push(['l',a[0],Math.min(a[1],b[1])-8,a[0],Math.max(a[1],b[1])+12,1.5])}
    if(t==='post'){props.push(['l',q[0]+1.5,floorY,q[0]+1.5,q[1]-15,1])}
  }
  for(const s of props){ if(s[0]==='l'){pts.push([s[1],s[2]],[s[3],s[4]])} else {pts.push([s[1],s[2]],[s[1]+s[3],s[2]+s[4]])} }
  let x0=Math.min(...pts.map(v=>v[0])),x1=Math.max(...pts.map(v=>v[0])),y0=Math.min(...pts.map(v=>v[1])),y1=Math.max(...pts.map(v=>v[1]));
  if(floorY!==null){x0-=5;x1+=5;y1=Math.max(y1,floorY)}
  const w=x1-x0,h=y1-y0,s=Math.min(80/w,80/h,1.28),tx=50-(x0+w/2)*s,ty=50-(y0+h/2)*s;
  
  const wob=(a,b,k)=>{const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1,o=(R()-.5)*len*k;return `Q${r1(mx-dy/len*o)} ${r1(my+dx/len*o)} ${r1(b[0])} ${r1(b[1])}`};
  const path=(arr,k=.13)=>{let d=`M${r1(arr[0][0])} ${r1(arr[0][1])}`;for(let i=1;i<arr.length;i++)d+=wob(arr[i-1],arr[i],k);return d};
  const line=(arr,op=1)=>`<path class="a" d="${path(arr)}" opacity="${op}"/><path class="b" d="${path(arr,.3)}" opacity="${op*.6}"/>`;
  let o=`<svg class="fig" viewBox="0 0 100 100" aria-hidden="true"><g transform="translate(${r1(tx)} ${r1(ty)}) scale(${s.toFixed(3)})" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">`;
  // props (muted)
  o+=`<g opacity=".55">`;
  if(floorY!==null)o+=`<path class="c" d="${path([[x0,floorY],[x0+w/2,floorY],[x1,floorY]],.02)}"/>`;
  for(const q of props){
    if(q[0]==='l')o+=`<path class="${q[5]>1?'a':'c'}" d="M${r1(q[1])} ${r1(q[2])}L${r1(q[3])} ${r1(q[4])}"/>`;
    else o+=`<rect x="${r1(q[1])}" y="${r1(q[2])}" width="${r1(q[3])}" height="${r1(q[4])}" class="c"/>`;
  }
  o+=`</g>`;
  if(L2){o+=line(L2,.5); if(F2)o+=line(F2,.5)}
  if(A2)o+=line(A2,.5);
  o+=line([hip,sh]); o+=line(L); if(F1)o+=line(F1); o+=line(A);
  o+=`<ellipse cx="${r1(head[0])}" cy="${r1(head[1])}" rx="${LEN.HR}" ry="${r1(LEN.HR*(.94+R()*.12))}" class="a" transform="rotate(${Math.round(R()*40)} ${r1(head[0])} ${r1(head[1])})"/>`;
  o+=`</g></svg>`;
  return figCache[key]=o;
}

/* body map: front + back, blocky */
const BM_F=[['sho',12,18,9,7],['sho',39,18,9,7],['che',22,18,16,11],['bic',13,26,7,13],['bic',40,26,7,13],['fore',12,40,7,15],['fore',41,40,7,15],['abs',23,30,14,18],['quad',21.5,50,8,23],['quad',30.5,50,8,23],['calf',22.5,75,6.5,19],['calf',31,75,6.5,19]];
const BM_B=[['sho',72,18,9,7],['sho',99,18,9,7],['trap',82,18,16,8],['lat',82,27,16,11],['tri',73,26,7,13],['tri',100,26,7,13],['fore',72,40,7,15],['fore',101,40,7,15],['low',83,39,14,7],['glu',82,47,16,9.5],['ham',81.5,57.5,8,16.5],['ham',90.5,57.5,8,16.5],['calf',82.5,75,6.5,19],['calf',91,75,6.5,19]];
function bodyMap(m,p,cls='',pick=false){
  const c=k=>m.includes(k)?'m':p.includes(k)?'p':'';
  const rect=([k,x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx=".8" class="${c(k)}"${pick?` data-a="musc" data-m="${k}"`:''}><title>${MUSC[k]}</title></rect>`;
  const big=cls.includes('lg');
  return `<svg class="bm ${cls}${pick?' pick':''}" viewBox="8 0 104 ${big?108:96}" role="img" aria-label="Muscles worked, shown on the front of the body (left) and the back (right)"><circle cx="30" cy="9" r="6"/><circle cx="90" cy="9" r="6"/>${BM_F.map(rect).join('')}${BM_B.map(rect).join('')}${big?'<text x="30" y="105.500">Front</text><text x="90" y="105.500">Back</text>':''}</svg>`;
}

/* watercolor washes as cached background images */
function washSVG(kind,c1,c2,seed){
  const R=rng(seed*7919+17); let vb,sc,bf,sh='';
  const el=(cx,cy,rx,ry,c,op)=>`<ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(rx)}" ry="${r1(ry)}" fill="${c}" fill-opacity="${op}" stroke="${c}" stroke-opacity=".95" stroke-width="3"/>`;
  const rc=(x,y,w,h,c,op,rx=18)=>`<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${rx}" fill="${c}" fill-opacity="${op}" stroke="${c}" stroke-opacity=".95" stroke-width="3"/>`;
  if(kind==='blot'){vb='0 0 200 200';sc=44;bf='0.017';
    sh=el(88+R()*24,92+R()*20,62+R()*12,56+R()*12,c1,.62)+el(64+R()*70,64+R()*70,34+R()*18,30+R()*18,c2,.5)+el(56+R()*88,56+R()*88,18+R()*14,16+R()*12,c1,.7);}
  if(kind==='col'){vb='0 0 100 300';sc=16;bf='0.05 0.012';
    sh=rc(10,14,80,330,c1,.82,4)+rc(18,40+R()*120,56,70+R()*80,c2,.4,6);}
  if(kind==='band'){vb='0 0 600 200';sc=46;bf='0.006 0.022';
    sh=rc(24+R()*30,44+R()*16,330+R()*120,58+R()*26,c1,.66,30)+rc(150+R()*120,84+R()*20,250+R()*130,46+R()*24,c2,.5,24)+el(80+R()*90,120+R()*20,46,26,c1,.6)+el(430+R()*90,70+R()*30,30,20,c2,.5);}
  if(kind==='stroke'){vb='0 0 300 100';sc=20;bf='0.012 0.06';
    sh=rc(10,20,280,60,c1,.82,6)+rc(20+R()*120,30,90+R()*90,40,c2,.42,6);}
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="none"><defs><filter id="f" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${bf}" numOctaves="3" seed="${seed+2}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${sc}" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="1.6" result="b"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 2.2 0 0 -0.2" result="pool"/><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="${seed+9}" result="g"/><feColorMatrix in="g" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.7 0 0 0 0.62" result="grain"/><feComposite in="b" in2="pool" operator="in" result="p1"/><feComposite in="p1" in2="grain" operator="in"/></filter></defs><g filter="url(#f)">${sh}</g></svg>`;
}
function injectWashes(){
  let css='';
  for(const k in PIG){const c1=PIG[k],c2=PIG[PIG2[k]];
    for(let i=0;i<3;i++)css+=`.w-${k}-b${i}{background-image:url("data:image/svg+xml,${encodeURIComponent(washSVG('blot',c1,c2,hash(k)%97+i*11))}")}`;
    css+=`.w-${k}-band::before,.w-${k}-bandbg{background-image:url("data:image/svg+xml,${encodeURIComponent(washSVG('band',c1,c2,hash(k)%89+5))}")}`;
    for(let i=0;i<2;i++)css+=`.w-${k}-c${i}{background-image:url("data:image/svg+xml,${encodeURIComponent(washSVG('col',c1,c2,hash(k)%79+i*5))}")}.w-${k}-s${i}{background-image:url("data:image/svg+xml,${encodeURIComponent(washSVG('stroke',c1,c2,hash(k)%83+i*7))}")}`;
  }
  for(const k in PIG)css+=`.t-${k}{--tc:var(--${k});--wb:url("data:image/svg+xml,${encodeURIComponent(washSVG('blot',PIG[k],PIG[PIG2[k]],hash(k)%97+11))}");--ws:url("data:image/svg+xml,${encodeURIComponent(washSVG('stroke',PIG[k],PIG[PIG2[k]],hash(k)%83))}")}`;
  css+=`.w-ink-s0{background-image:url("data:image/svg+xml,${encodeURIComponent(washSVG('stroke','#BDB8AE','#8E8A82',4))}")}`;
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
}

const STAR=c=>`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 13"><path d="M7 .6l1.9 4 4.3.5-3.2 3 .9 4.3L7 10.200l-3.9 2.2.9-4.3-3.200-3 4.300-.5z" fill="${c}"/></svg>`)}")`;
const STAR_BG=STAR('#F3EFE8');
const STAR_STYLE=`background-image:${STAR('#F7B92E')},${STAR_BG};background-position:70px 0,0 0;background-repeat:no-repeat,repeat-x;background-size:14px 13px`;
function stars(d,label=true){return `<span class="stars" role="img" aria-label="Difficulty ${d} out of 6"><i class="s0" style='${STAR_STYLE}'></i><i style='${STAR_STYLE};width:${d/6*100}%'></i></span>${label?`<span>${d}</span>`:''}`}

const IC={
  suggest:'<path d="M12 3l2.400 6.600L21 12l-6.600 2.400L12 21l-2.400-6.600L3 12l6.600-2.400z"/>',
  projects:'<path d="M5 21V4h13l-3 4.500 3 4.500H5"/>',
  log:'<path d="M4 4h16v16H4zM12 8v8M8 12h8"/>',
  plan:'<path d="M4 6h16v14H4zM4 11h16M8 3v5M16 3v5"/>',
  points:'<path d="M5 20v-8M12 20V4M19 20v-11"/>',
  home:'<path d="M4 11l8-7 8 7v9h-5v-6h-6v6H4z"/>',
  bests:'<path d="M2.500 20l6.500-12 4 6.500 3-4.500 5.500 10z"/>',
  library:'<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
  gear:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  up:'<path d="M6 14l6-6 6 6"/>',down:'<path d="M6 10l6 6 6-6"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',back:'<path d="M14 6l-6 6 6 6"/>',
  eye:'<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.500"/>',
  wide:'<path d="M4 8v8M20 8v8M8 12h8M8 12l3-3M8 12l3 3M16 12l-3-3M16 12l-3 3"/>',
  arrange:'<path d="M4 5h16v5H4zM4 14h7v5H4zM13 14h7v5h-7z"/>',
  pen:'<path d="M4 20l1-4L16 5l3 3L8 19z"/>',
};
const ic=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${IC[n]}</svg>`;
