/* ================= data: exercises, poses, default projects ================= */
const PIG={rose:'#EC4A72',orange:'#F58A3C',gamboge:'#F2C230',lime:'#A9CF45',emerald:'#2FC08E',cerulean:'#35ADE6',ultra:'#6470F0',violet:'#A565EA'};
const PIG2={rose:'orange',orange:'rose',gamboge:'orange',lime:'emerald',emerald:'cerulean',cerulean:'ultra',ultra:'violet',violet:'rose'};
const GROUPS={push:{name:'Push',c:'orange'},pull:{name:'Pull',c:'cerulean'},legs:{name:'Legs',c:'emerald'},core:{name:'Core',c:'violet'},stretch:{name:'Stretch',c:'lime'}};
const MUSC={sho:'Shoulders',che:'Chest',bic:'Biceps',tri:'Triceps',fore:'Forearms',abs:'Abs',lat:'Lats',trap:'Upper back',low:'Lower back',glu:'Glutes',quad:'Quads',ham:'Hamstrings',calf:'Calves'};
const USES=['Strength','Skill hold','Balance','Explosive power','Endurance','Control','Mobility'];

// pose: t torso angle, h head angle, a/a2 arm [upper,fore], l/l2 leg [thigh,shin], f/f2 foot angle (null = none),
// fl floor gap below the lowest joint, pr props [type, joint, offset]. Angles: 0 right, 90 down, -90 up.
const BAR=[['bar','hd']], PB=[['pbar','hd']];
const B={}; const POSES={};
function E(id,name,g,u,d,use,m,p,def,pose){const own=typeof pose!=='string';B[id]={id,name,g,u,d,use,m:m.split(' '),p:p?p.split(' '):[],def,pose:own?id:pose};if(own)POSES[id]=pose}

// ---- pull
E('hang','Dead hang','pull','sec',0.5,'Endurance','fore','lat sho',30,{t:-90,a:[-96,-87],l:[90,90],pr:BAR});
E('scap','Scapular pull-up','pull','reps',1,'Control','trap lat','fore',8,{t:-92,a:[-87,-91],l:[96,122],pr:BAR});
E('row','Australian row','pull','reps',1,'Strength','lat trap','bic fore abs',8,{t:-20,a:[-90,-90],l:[160,160],f:-100,fl:0,pr:PB});
E('negpull','Negative pull-up','pull','reps',1.5,'Control','lat bic','fore trap',5,{t:-90,a:[-10,-90],l:[85,100],pr:BAR});
E('pullup','Pull-up','pull','reps',2,'Strength','lat bic','trap fore abs',5,{t:-90,a:[60,-75],l:[85,95],pr:BAR});
E('chinup','Chin-up','pull','reps',2,'Strength','bic lat','fore trap',5,{t:-88,a:[65,-72],l:[70,130],pr:BAR});
E('c2b','Chest-to-bar pull-up','pull','reps',2.5,'Strength','lat trap','bic fore abs',4,{t:-100,a:[70,-50],l:[80,100],pr:BAR});
E('highpull','Explosive pull-up','pull','reps',3.5,'Explosive power','lat bic','trap abs fore',3,{t:-106,a:[80,-35],l:[62,108],pr:BAR});
E('negmu','Negative muscle-up','pull','reps',3.5,'Control','lat tri che','bic sho abs',3,{t:-60,a:[160,35],l:[100,95],pr:BAR});
E('muscleup','Muscle-up','pull','reps',4,'Explosive power','lat tri che','bic sho abs fore',1,{t:-78,a:[108,78],l:[96,102],pr:BAR});
// ---- front lever
E('tuckfl','Tuck front lever','pull','sec',3,'Skill hold','lat abs','trap fore sho',8,{t:180,a:[-70,-70],l:[-150,10],f:null,pr:BAR});
E('advfl','Advanced tuck front lever','pull','sec',3.5,'Skill hold','lat abs','trap fore sho',6,{t:180,a:[-68,-68],l:[-90,0],pr:BAR});
E('onefl','One-leg front lever','pull','sec',4,'Skill hold','lat abs','trap fore sho glu',5,{t:180,a:[-66,-66],l:[0,0],l2:[-140,15],f2:null,pr:BAR});
E('strfl','Straddle front lever','pull','sec',4.5,'Skill hold','lat abs','trap fore sho glu',4,{t:180,a:[-65,-65],l:[7,7],l2:[-11,-11],pr:BAR});
E('fl','Front lever','pull','sec',5,'Skill hold','lat abs','trap fore sho glu low',3,{t:180,a:[-64,-64],l:[0,0],pr:BAR});
// ---- push
E('incpush','Incline push-up','push','reps',0.5,'Strength','che tri','sho abs',10,{t:-40,a:[90,90],l:[140,140],f:-110,fl:0,pr:[['box','hd']]});
E('pushup','Push-up','push','reps',1,'Strength','che tri','sho abs',10,{t:-24,a:[90,90],l:[156,156],f:-110,fl:0});
E('diamond','Diamond push-up','push','reps',1.5,'Strength','tri che','sho abs',8,{t:-19,a:[140,75],l:[161,161],f:-110,fl:0});
E('archer','Archer push-up','push','reps',3,'Strength','che tri','sho abs',5,{t:-14,a:[160,60],a2:[37,37],l:[166,166],f:-110,fl:0});
E('incone','Incline one-arm push-up','push','reps',3.5,'Strength','che tri','sho abs',4,{t:-40,a:[90,90],a2:[140,150],l:[140,140],f:-110,fl:0,pr:[['box','hd']]});
E('onepush','One-arm push-up','push','reps',4,'Strength','che tri','sho abs',1,{t:-24,a:[90,90],a2:[156,165],l:[156,156],l2:[149,149],f:-110,f2:-110,fl:0});
E('dip','Dip','push','reps',2,'Strength','tri che','sho',6,{t:-78,a:[150,82],l:[100,165],f:null,fl:10,pr:PB});
E('sbdip','Straight bar dip','push','reps',2.5,'Strength','tri che','sho abs',5,{t:-62,a:[125,72],l:[98,96],pr:BAR});
E('pike','Pike push-up','push','reps',1.5,'Strength','sho tri','che trap abs',8,{t:40,h:45,a:[45,45],l:[117,117],f:0,fl:0});
E('epike','Elevated pike push-up','push','reps',2,'Strength','sho tri','che trap abs',6,{t:40,h:45,a:[45,45],l:[148,148],f:-110,fl:0,pr:[['box','ft']]});
E('wallhs','Wall handstand','push','sec',2,'Balance','sho','tri trap abs fore',20,{t:90,h:90,a:[90,90],l:[-90,-90],f:null,fl:0,pr:[['wall','ft',-9]]});
E('neghspu','Negative handstand push-up','push','reps',2.5,'Control','sho tri','trap che abs',3,{t:90,h:90,a:[20,100],l:[-90,-90],f:null,fl:0,pr:[['wall','ft',-9]]});
E('wallhspu','Wall handstand push-up','push','reps',3.5,'Strength','sho tri','trap che abs',3,{t:90,h:90,a:[5,92],l:[-90,-90],f:null,fl:0,pr:[['wall','ft',-9]]});
E('hs','Freestanding handstand','push','sec',3.5,'Balance','sho','fore tri trap abs',10,{t:90,h:90,a:[90,90],l:[-93,-87],f:null,fl:0});
E('hspu','Handstand push-up','push','reps',5,'Strength','sho tri','trap che abs fore',1,{t:84,h:90,a:[15,96],l:[-98,-94],f:null,fl:0});
E('support','Support hold','push','sec',1,'Endurance','tri sho','che abs',20,{t:-90,a:[78,96],l:[90,92],fl:6,pr:PB});
// ---- planche
E('plean','Planche lean','push','sec',2,'Skill hold','sho','che abs fore bic',15,{t:-23,a:[112,112],l:[157,157],f:-110,fl:0});
E('frog','Frog stand','push','sec',1.5,'Balance','sho fore','tri abs',15,{t:25,h:10,a:[120,80],l:[54,-160],f:null,fl:0});
E('tuckpl','Tuck planche','push','sec',3.5,'Skill hold','sho','che abs bic fore',8,{t:0,h:-10,a:[105,105],l:[30,170],f:null,fl:0});
E('advpl','Advanced tuck planche','push','sec',4,'Skill hold','sho','che abs bic fore low',6,{t:0,h:-10,a:[107,107],l:[75,180],f:null,fl:0});
E('strpl','Straddle planche','push','sec',5,'Skill hold','sho','che abs bic fore low glu',4,{t:-4,h:-12,a:[109,109],l:[178,178],l2:[169,169],f:null,f2:null,fl:0});
E('planche','Planche','push','sec',5.5,'Skill hold','sho','che abs bic fore low glu',2,{t:-3,h:-12,a:[111,111],l:[180,180],f:null,fl:0});
// ---- legs
E('squat','Squat','legs','reps',0.5,'Strength','quad glu','ham calf low',15,{t:-68,a:[-8,-8],l:[-8,108],f:0,fl:0});
E('lunge','Lunge','legs','reps',1,'Strength','quad glu','ham calf',10,{t:-88,a:[95,85],l:[10,95],l2:[110,167],f:0,f2:-100,fl:0});
E('stepup','Step-up','legs','reps',1,'Strength','quad glu','ham calf',10,{t:-85,a:[100,80],l:[20,90],l2:[92,90],f:0,f2:0,fl:0,pr:[['box','ft']]});
E('bulg','Bulgarian split squat','legs','reps',1.5,'Strength','quad glu','ham calf abs',8,{t:-82,a:[95,85],l:[5,95],l2:[115,200],f:0,f2:null,fl:0,pr:[['box','ft2']]});
E('apistol','Assisted pistol squat','legs','reps',2,'Control','quad glu','ham abs calf',4,{t:-65,a:[-25,-15],l:[-20,105],l2:[5,5],f:0,fl:0,pr:[['post','hd']]});
E('boxpistol','Box pistol squat','legs','reps',2.5,'Strength','quad glu','ham abs calf',4,{t:-75,a:[-5,-5],l:[0,90],l2:[12,12],f:0,fl:0,pr:[['box','hip']]});
E('pistol','Pistol squat','legs','reps',3.5,'Balance','quad glu','ham abs calf',2,{t:-58,a:[-5,-5],l:[-20,105],l2:[5,5],f:0,fl:0});
E('wallsit','Wall sit','legs','sec',1,'Endurance','quad','glu calf',30,{t:-90,a:[90,90],l:[0,90],f:0,fl:0,pr:[['wall','hip',-4]]});
E('bridge','Glute bridge','legs','reps',0.5,'Strength','glu ham','low abs',12,{t:150,h:175,a:[25,5],l:[-15,95],f:0,fl:0});
E('nordic','Nordic curl','legs','reps',4,'Strength','ham','glu calf low',3,{t:-45,a:[40,-30],l:[135,180],f:null,fl:0});
E('calf','Calf raise','legs','reps',0.5,'Endurance','calf','',15,{t:-90,a:[90,90],l:[90,90],f:58,fl:5});
// ---- core
E('plank','Plank','core','sec',1,'Endurance','abs','sho low glu',30,{t:-12,a:[90,0],l:[168,168],f:-110,fl:0});
E('hollow','Hollow hold','core','sec',1.5,'Skill hold','abs','quad low',20,{t:-165,h:-160,a:[-160,-160],l:[-12,-12],fl:0});
E('lraise','Lying leg raise','core','reps',1.5,'Strength','abs','quad',10,{t:180,a:[0,0],l:[-80,-80],f:null,fl:0});
E('hknee','Hanging knee raise','core','reps',1.5,'Strength','abs','fore lat',8,{t:-90,a:[-90,-90],l:[-5,95],pr:BAR});
E('hleg','Hanging leg raise','core','reps',2.5,'Strength','abs','fore lat quad',6,{t:-90,a:[-90,-90],l:[0,0],pr:BAR});
E('t2b','Toes to bar','core','reps',3.5,'Strength','abs','lat fore quad',4,{t:-120,a:[-65,-65],l:[-86,-86],f:null,pr:BAR});
E('tucksit','Tuck sit','core','sec',2,'Skill hold','abs','tri sho quad',10,{t:-90,a:[90,90],l:[-50,60],f:null,fl:10,pr:PB});
E('onel','One-leg L-sit','core','sec',2.5,'Skill hold','abs quad','tri sho',8,{t:-90,a:[90,90],l:[0,0],l2:[-50,60],f2:null,fl:10,pr:PB});
E('lsit','L-sit','core','sec',3.5,'Skill hold','abs quad','tri sho',8,{t:-90,a:[90,90],l:[0,0],fl:10,pr:PB});
E('vsit','V-sit','core','sec',4.5,'Skill hold','abs quad','tri sho low',3,{t:-108,a:[82,82],l:[-48,-48],fl:10,pr:PB});
E('tuckdf','Tuck dragon flag','core','reps',3.5,'Control','abs','lat low glu',4,{t:150,h:180,a:[180,-150],l:[-100,30],f:null,fl:0});
E('negdf','Negative dragon flag','core','reps',4,'Control','abs','lat low glu',3,{t:130,h:180,a:[180,-150],l:[-50,-50],f:null,fl:0});
E('df','Dragon flag','core','reps',4.5,'Strength','abs','lat low glu',2,{t:155,h:180,a:[180,-150],l:[-25,-25],f:null,fl:0});

// ---- more push
E('wallpush','Wall push-up','push','reps',0.5,'Strength','che tri','sho',12,{t:-76,a:[-6,-6],l:[104,104],f:0,fl:0,pr:[['wall','hd',1]]});
E('kneepush','Knee push-up','push','reps',0.5,'Strength','che tri','sho abs',10,{t:-37,a:[90,90],l:[143,-160],f:null,fl:0});
E('widepush','Wide push-up','push','reps',1,'Strength','che','tri sho abs',10,{t:-23,a:[110,75],l:[157,157],f:-110,fl:0});
E('shouldertap','Shoulder tap','push','reps',1.5,'Control','sho abs','che tri',12,{t:-24,a:[90,90],a2:[55,160],l:[156,156],f:-110,fl:0});
E('decline','Decline push-up','push','reps',1.5,'Strength','che sho','tri abs',8,{t:-11,a:[90,90],l:[169,169],f:-110,fl:0,pr:[['box','ft']]});
E('benchdip','Bench dip','push','reps',1,'Strength','tri','sho che',10,{t:-85,a:[170,95],l:[20,30],f:-60,fl:0,pr:[['box','hd']]});
E('hindu','Hindu push-up','push','reps',2,'Mobility','sho che','tri abs low',8,'pike');
E('sphinx','Sphinx push-up','push','reps',2,'Strength','tri','sho abs che',6,'plank');
E('clap','Clap push-up','push','reps',2.5,'Explosive power','che tri','sho abs',5,{t:-20,a:[20,140],l:[160,160],f:-110,fl:0});
E('pppu','Pseudo planche push-up','push','reps',3,'Strength','sho che','tri abs bic',6,{t:-17,a:[150,95],l:[163,163],f:-110,fl:0});
E('typewriter','Typewriter push-up','push','reps',3.5,'Strength','che tri','sho abs',4,'archer');
E('headstand','Headstand','push','sec',1.5,'Balance','sho','abs trap tri',20,{t:90,h:90,a:[30,150],l:[-90,-90],f:null,fl:0});
E('wallwalk','Wall walk','push','reps',2.5,'Control','sho','tri abs trap',3,'wallhs');
E('elbowlever','Elbow lever','push','sec',3,'Balance','low abs','sho fore glu',8,{t:0,h:-10,a:[160,90],l:[180,180],f:null,fl:0});
E('tuckplpu','Tuck planche push-up','push','reps',4.5,'Strength','sho tri','che abs bic fore',3,{t:0,h:-10,a:[150,95],l:[30,170],f:null,fl:0});
E('planchepu','Planche push-up','push','reps',6,'Strength','sho tri','che abs bic fore low glu',1,{t:-3,h:-12,a:[150,95],l:[180,180],f:null,fl:0});
E('ninety','90-degree push-up','push','reps',6,'Strength','sho tri','che abs trap low',1,'planchepu');
E('onehs','One-arm handstand','push','sec',6,'Balance','sho','fore tri trap abs',3,{t:90,h:90,a:[90,90],a2:[165,172],l:[-93,-87],f:null,fl:0});
// ---- more pull
E('flexhang','Flexed-arm hang','pull','sec',1.5,'Endurance','bic lat','fore trap',15,'pullup');
E('onehang','One-arm dead hang','pull','sec',2,'Endurance','fore','lat sho',10,{t:-90,a:[-96,-87],a2:[96,86],l:[90,90],pr:BAR});
E('erow','Feet-elevated row','pull','reps',1.5,'Strength','lat trap','bic fore abs glu',8,{t:-8,a:[-90,-90],l:[172,172],f:-100,fl:14,pr:[['pbar','hd'],['box','ft']]});
E('widepull','Wide pull-up','pull','reps',2.5,'Strength','lat','trap bic fore',4,'pullup');
E('lpull','L-sit pull-up','pull','reps',3.5,'Strength','lat bic abs','trap fore quad',3,{t:-90,a:[60,-75],l:[0,0],pr:BAR});
E('archerpull','Archer pull-up','pull','reps',4,'Strength','lat bic','trap fore abs',3,{t:-92,a:[60,-75],a2:[-48,-44],l:[85,95],pr:BAR});
E('typepull','Typewriter pull-up','pull','reps',4,'Control','lat bic','trap fore abs',2,'c2b');
E('onepull','One-arm pull-up','pull','reps',5.5,'Strength','lat bic','fore trap abs',1,{t:-90,a:[60,-75],a2:[102,80],l:[85,95],pr:BAR});
E('skincat','Skin the cat','pull','reps',2.5,'Mobility','sho lat','abs fore bic',3,{t:90,h:90,a:[-80,-80],l:[140,20],f:null,pr:BAR});
E('tuckbl','Tuck back lever','pull','sec',3,'Skill hold','sho low','bic lat glu fore',8,{t:0,h:-8,a:[-110,-110],l:[40,170],f:null,pr:BAR});
E('backlever','Back lever','pull','sec',4,'Skill hold','sho low','bic lat glu ham fore',5,{t:0,h:-8,a:[-110,-110],l:[180,180],pr:BAR});
E('flraise','Front lever raise','pull','reps',4.5,'Control','lat abs','trap fore sho',3,{t:150,h:155,a:[-78,-78],l:[-30,-30],pr:BAR});
E('flpull','Front lever pull-up','pull','reps',6,'Strength','lat trap abs','bic fore sho glu',1,{t:180,a:[-40,-100],l:[0,0],pr:BAR});
// ---- more legs
E('deepsquat','Deep squat hold','legs','sec',0.5,'Mobility','quad glu','calf low',30,{t:-75,a:[20,-20],l:[-40,100],f:0,fl:0});
E('revlunge','Reverse lunge','legs','reps',1,'Strength','quad glu','ham calf',10,'lunge');
E('jumpsquat','Jump squat','legs','reps',1,'Explosive power','quad glu','calf ham',10,{t:-88,a:[-70,-80],l:[95,85],f:40,fl:9});
E('sbridge','Single-leg glute bridge','legs','reps',1,'Strength','glu ham','low abs',8,{t:150,h:175,a:[25,5],l:[-15,95],l2:[-30,-30],f:0,fl:0});
E('scalf','Single-leg calf raise','legs','reps',1,'Strength','calf','',10,{t:-90,a:[90,90],l:[90,90],l2:[80,170],f:58,f2:null,fl:5});
E('cossack','Cossack squat','legs','reps',1.5,'Mobility','quad glu','ham calf',6,{t:-68,a:[-8,-8],l:[-8,108],l2:[25,25],f:0,f2:-60,fl:0});
E('rdl','Single-leg Romanian deadlift','legs','reps',1.5,'Balance','ham glu','low calf',8,{t:-10,h:-5,a:[90,90],l:[90,90],l2:[175,175],f:0,f2:null,fl:0});
E('boxjump','Box jump','legs','reps',1.5,'Explosive power','quad glu','calf ham',6,{t:-60,a:[120,100],l:[-10,100],f:0,fl:16,pr:[['box','ft']]});
E('tuckjump','Tuck jump','legs','reps',1.5,'Explosive power','quad glu','calf abs',8,{t:-85,a:[-60,-70],l:[-30,100],f:20,fl:12});
E('burpee','Burpee','legs','reps',1.5,'Endurance','quad che','sho tri abs glu',8,'pushup');
E('swallsit','Single-leg wall sit','legs','sec',2,'Endurance','quad','glu calf',15,{t:-90,a:[90,90],l:[0,90],l2:[0,0],f:0,fl:0,pr:[['wall','hip',-4]]});
E('sissy','Sissy squat','legs','reps',2.5,'Strength','quad','abs calf',5,{t:-135,a:[-20,-20],l:[40,150],f:20,fl:0});
E('negnordic','Negative Nordic curl','legs','reps',2.5,'Control','ham','glu calf low',4,'nordic');
E('shrimp','Shrimp squat','legs','reps',3.5,'Balance','quad glu','ham abs calf',3,{t:-55,a:[-5,-5],l:[-10,105],l2:[125,-160],f:0,f2:null,fl:0});
// ---- more core
E('deadbug','Dead bug','core','reps',0.5,'Control','abs','low',10,{t:180,a:[-90,-90],l:[-90,0],f:null,fl:0});
E('birddog','Bird dog','core','reps',0.5,'Control','low abs','glu sho',10,{t:-17,a:[90,90],a2:[-12,-12],l:[90,180],l2:[180,180],f:null,f2:null,fl:0});
E('superman','Superman hold','core','sec',0.5,'Endurance','low','glu trap ham',20,{t:-12,h:-25,a:[-15,-15],l:[188,188],f:null,fl:0});
E('crunch','Crunch','core','reps',0.5,'Strength','abs','',15,{t:-160,h:-150,a:[-150,-60],l:[-45,45],f:0,fl:0});
E('situp','Sit-up','core','reps',1,'Strength','abs','quad',12,{t:-120,a:[20,10],l:[-45,45],f:0,fl:0});
E('bicycle','Bicycle crunch','core','reps',1,'Endurance','abs','quad',16,{t:-160,h:-150,a:[-150,-60],l:[-70,20],l2:[-15,-15],f:null,fl:0});
E('flutter','Flutter kicks','core','sec',1,'Endurance','abs','quad',20,{t:180,a:[0,0],l:[-12,-12],l2:[-28,-28],fl:0});
E('revcrunch','Reverse crunch','core','reps',1,'Strength','abs','low',10,{t:180,a:[0,0],l:[-110,0],f:null,fl:0});
E('russian','Russian twist','core','reps',1,'Control','abs','low quad',16,{t:-125,a:[10,-10],l:[-30,20],f:null,fl:0});
E('sideplank','Side plank','core','sec',1,'Endurance','abs','sho glu low',20,{t:-12,a:[90,0],a2:[-90,-90],l:[168,168],f:-110,fl:0});
E('mountain','Mountain climber','core','reps',1,'Endurance','abs','sho quad che',20,{t:-24,a:[90,90],l:[156,156],l2:[40,150],f:-110,f2:null,fl:0});
E('bear','Bear crawl','core','sec',1,'Endurance','abs sho','quad tri',20,{t:-10,a:[90,90],l:[80,165],f:-110,fl:0});
E('vup','V-up','core','reps',2,'Strength','abs','quad',8,{t:-140,a:[-40,-40],l:[-40,-40],fl:0});
E('hollowrock','Hollow rock','core','reps',2,'Control','abs','quad low',12,'hollow');
E('longplank','Long-lever plank','core','sec',2,'Strength','abs','sho lat low',15,{t:-10,a:[25,25],l:[170,170],f:-110,fl:0});
E('lhang','Hanging L hold','core','sec',2.5,'Skill hold','abs quad','fore lat',8,'hleg');
E('straddlel','Straddle L-sit','core','sec',3.5,'Skill hold','abs quad','tri sho',6,{t:-90,a:[90,90],l:[4,4],l2:[-12,-12],fl:10,pr:PB});
E('wipers','Windshield wipers','core','reps',4,'Control','abs','lat fore sho',4,'t2b');
E('flag','Human flag','core','sec',5,'Skill hold','abs sho lat','fore tri glu low',3,{t:180,h:180,a:[-140,-140],a2:[140,140],l:[0,0],f:null,pr:[['pole','hd']]});

// ---- short explanations shown when you open a move
const DESC={
hang:'Hang from the bar with straight arms and let your body go long. Builds the grip and shoulder tolerance every bar move needs.',
scap:'From a dead hang, pull your shoulder blades down and back without bending your elbows, then lower. Small movement, done slowly.',
row:'Lie under a waist-high bar, body in a straight line, and pull your chest to the bar. Walk your feet forward to make it harder.',
negpull:'Jump or step to the top of a pull-up, then lower yourself as slowly as you can. Aim for three to five seconds on the way down.',
pullup:'Hang with palms facing away and pull until your chin clears the bar. Start each rep from straight arms and avoid swinging.',
chinup:'A pull-up with palms facing you. The biceps do more of the work, so most people find it slightly easier.',
c2b:'Pull high enough that your chest touches the bar. Lean back a little and drive your elbows down and behind you.',
highpull:'Pull as fast and as high as you can, aiming to get the bar to your lower chest or waist. This is the power the muscle-up needs.',
negmu:'Start on top of the bar in support and lower slowly through the dip and the turn-over into a hang. Teaches the transition.',
muscleup:'An explosive pull that carries your chest over the bar, followed by a dip to straight arms. Pull toward your hips, not your chin.',
tuckfl:'Hang, then raise your body until your back is level with the floor, knees pulled tight to your chest. Keep your arms straight.',
advfl:'A tuck front lever with a flat back and hips at a right angle, so your knees sit above your hips instead of against your chest.',
onefl:'A front lever with one leg straight and the other tucked. Swap legs between sets.',
strfl:'A front lever with both legs straight and spread wide. The wider the legs, the easier the hold.',
fl:'Hold your whole body straight and level under the bar, facing up, with straight arms. Squeeze glutes and push the bar toward your hips.',
incpush:'A push-up with your hands on a bench or box. The higher the hands, the easier it is.',
pushup:'Hands under shoulders, body in one straight line. Lower until your chest is just off the floor, then press back up.',
diamond:'A push-up with your hands together under your chest, thumbs and forefingers touching. Shifts the work to the triceps.',
archer:'A wide push-up where you bend one arm and keep the other nearly straight out to the side, shifting your weight over the bent arm.',
incone:'A one-arm push-up with your hand on a bench. Keep your hips square and feet wide.',
onepush:'A push-up on one arm with the other behind your back. Set your feet wide and keep your hips from twisting.',
dip:'Support yourself on parallel bars and lower until your shoulders are just below your elbows, then press up.',
sbdip:'A dip on top of a single straight bar, hands in front of your hips. Lean forward as you lower. This is the top half of a muscle-up.',
pike:'Hips high in an upside-down V, lower the top of your head toward the floor between your hands, then press up.',
epike:'A pike push-up with your feet on a box, which puts more of your weight over your shoulders.',
wallhs:'Kick up or walk your feet up a wall and hold with straight arms, ribs pulled in and toes pointed.',
neghspu:'From a wall handstand, lower your head to the floor as slowly as you can, then come down and reset.',
wallhspu:'From a wall handstand, lower until your head touches the floor and press back to straight arms.',
hs:'Balance on your hands without a wall. Stack hips over shoulders over wrists and make corrections with your fingers.',
hspu:'A full handstand push-up without a wall: lower your head to the floor and press back up while keeping balance.',
support:'Hold yourself on straight arms on parallel bars, shoulders pushed down away from your ears.',
plean:'From the top of a push-up, lean forward so your shoulders move well past your wrists, arms locked. Hold the lean.',
frog:'Squat, place your hands on the floor, rest your knees on your elbows and tip forward until your feet lift.',
tuckpl:'On straight arms, lean forward and lift your feet with knees tucked to your chest, hips level with your shoulders.',
advpl:'A tuck planche with a flat back and your knees moved back behind your hips.',
strpl:'A planche with both legs straight and spread wide to shorten the lever.',
planche:'Hold your whole body straight and level above the floor on straight arms, feet off the ground.',
squat:'Feet about shoulder width, sit down and back until your hips are below your knees, then stand.',
lunge:'Step forward and lower until both knees are bent to a right angle, then push back to standing. Count each side.',
stepup:'Place one foot on a box and stand up using that leg alone, then lower with control.',
bulg:'A split squat with your back foot resting on a bench behind you. Most of the work is in the front leg.',
apistol:'A one-leg squat while holding a post or door frame for balance. Use your arms as little as you can.',
boxpistol:'Sit back on one leg onto a box, pause, and stand up without the other foot touching down. Lower the box over time.',
pistol:'A full squat on one leg with the other held straight out in front. Reach your arms forward to balance.',
wallsit:'Back flat against a wall, thighs level with the floor, and hold.',
bridge:'Lie on your back with knees bent, then drive your hips up until your body is straight from knees to shoulders.',
nordic:'Kneel with your ankles held down, then lower your straight body toward the floor and pull yourself back up with your hamstrings.',
calf:'Rise onto the balls of your feet as high as you can, pause, and lower slowly. A step lets your heels drop lower.',
plank:'Rest on forearms and toes with your body in one straight line. Tuck your hips slightly and do not let them sag.',
hollow:'Lie on your back, press your lower back into the floor and lift your shoulders and legs a few inches. Arms overhead.',
lraise:'Lie on your back and raise straight legs until they point at the ceiling, then lower without letting your back arch.',
hknee:'Hang from the bar and raise your knees to your chest without swinging.',
hleg:'Hang from the bar and raise straight legs until they are level with the floor.',
t2b:'Hang from the bar and raise straight legs all the way until your toes touch it.',
tucksit:'Support yourself on parallel bars or the floor and lift your feet with knees tucked to your chest.',
onel:'An L-sit with one leg straight and the other tucked. Swap legs between sets.',
lsit:'Support yourself on your hands and hold both legs straight out in front, level with the floor.',
vsit:'From an L-sit, lean back slightly and lift your straight legs toward your face until your body makes a V.',
tuckdf:'Lie on a bench gripping it behind your head, lift your body onto your shoulders with knees tucked, and lower slowly.',
negdf:'Start a dragon flag from the top, body straight and vertical, and lower as slowly as you can.',
df:'Gripping a bench or post behind your head, raise and lower your rigid body with only your shoulders touching down.',
wallpush:'Stand at arm\'s length from a wall and do a push-up against it. A first step if floor push-ups are not there yet.',
kneepush:'A push-up from your knees. Keep a straight line from knees to shoulders.',
widepush:'A push-up with hands set wider than your shoulders, which puts more work on the chest.',
shouldertap:'Hold the top of a push-up and tap each shoulder with the opposite hand without letting your hips rock. Count each tap.',
decline:'A push-up with your feet on a box. More of your weight goes through your shoulders and upper chest.',
benchdip:'Hands on a bench behind you, heels on the floor, lower your hips by bending your elbows and press back up.',
hindu:'Start in a pike, swoop your chest down and through between your hands into an arch, then push back to the pike.',
sphinx:'From a forearm plank, press through your palms until your arms are straight, then lower your elbows back down.',
clap:'Push up hard enough that your hands leave the floor, clap, and land with soft elbows.',
pppu:'A push-up with your hands turned out by your waist and shoulders leaning well forward of them.',
typewriter:'Lower to one side in a wide push-up, slide your chest across to the other hand while staying low, then press up.',
headstand:'Balance on your head and hands or forearms with legs straight up. Most of the weight should be on your arms.',
wallwalk:'From a push-up with feet at a wall, walk your feet up and hands in until your chest reaches the wall, then walk back down.',
elbowlever:'Dig your elbows into your sides, lean forward and balance your straight body level on your hands.',
tuckplpu:'Hold a tuck planche and bend your arms to lower, then press back up without your feet touching.',
planchepu:'Hold a full planche and do a push-up in it, body level and feet never touching the floor.',
ninety:'From a handstand, lower into a bent-arm planche with your body level, then press back up to a handstand.',
onehs:'A freestanding handstand balanced on one arm, the other held out to the side.',
flexhang:'Hold the top of a pull-up with your chin over the bar for time.',
onehang:'A dead hang from one arm. Keep the shoulder active and swap sides between sets.',
erow:'An Australian row with your feet up on a box, so your body is level and you lift more of your weight.',
widepull:'A pull-up with hands set well outside your shoulders. Shorter range, more work for the lats.',
lpull:'A pull-up while holding your legs straight out in front in an L.',
archerpull:'A wide pull-up where you pull toward one hand while the other arm stays nearly straight along the bar.',
typepull:'Pull to the top, then travel side to side along the bar from one hand to the other before lowering.',
onepull:'A full pull-up from a dead hang using one arm.',
skincat:'From a hang, lift your legs through your arms and rotate backward until you are hanging behind the bar, then return.',
tuckbl:'Hanging face down behind the bar, hold your back level with the floor and knees tucked to your chest.',
backlever:'Hold your straight body level with the floor, face down, hanging from the bar behind you with straight arms.',
flraise:'From a dead hang with straight arms, raise your rigid body to a front lever and lower it back down.',
flpull:'Hold a front lever and pull your waist to the bar while keeping your body level.',
deepsquat:'Sit in the bottom of a squat with heels down and chest up. Good for ankle and hip mobility.',
revlunge:'Step backward into a lunge and return. Easier on the knees than stepping forward. Count each side.',
jumpsquat:'Squat down and jump as high as you can, landing softly straight into the next rep.',
sbridge:'A glute bridge with one leg held straight in the air. Count each side.',
scalf:'A calf raise on one foot. Hold something for balance and use a step for full range.',
cossack:'With feet wide, sink over one leg into a deep side squat while the other leg stays straight, then shift across.',
rdl:'Stand on one leg and hinge forward with a flat back while the free leg rises behind you, then stand tall.',
boxjump:'Jump from the floor onto a box, land softly with bent knees, and step back down.',
tuckjump:'Jump and pull your knees up to your chest at the top of each jump.',
burpee:'Drop to a push-up, do one rep, jump your feet in and jump up with arms overhead.',
swallsit:'A wall sit with one foot lifted off the floor. Swap legs between sets.',
sissy:'Rise onto your toes and lean your body back in a straight line from knees to shoulders as your knees travel forward.',
negnordic:'The lowering half of a Nordic curl: resist the fall as long as you can, catch yourself and push back up.',
shrimp:'A one-leg squat with the free leg bent behind you until that knee touches the floor.',
deadbug:'On your back with arms and knees up, lower the opposite arm and leg toward the floor while your lower back stays down.',
birddog:'On hands and knees, reach one arm forward and the opposite leg back, pause, and swap.',
superman:'Lie face down and lift your arms, chest and legs off the floor together.',
crunch:'On your back with knees bent, curl your shoulders off the floor toward your hips and lower.',
situp:'On your back with knees bent, sit all the way up to your thighs and lower with control.',
bicycle:'On your back, bring one elbow toward the opposite knee while the other leg extends, alternating sides.',
flutter:'On your back with legs straight and just off the floor, kick them up and down in small quick beats.',
revcrunch:'On your back, curl your knees toward your chest until your hips lift off the floor, then lower slowly.',
russian:'Sit leaning back with feet off the floor and rotate your torso to touch the floor on each side. Count each touch.',
sideplank:'Rest on one forearm and the side of one foot, body in a straight line. Swap sides between sets.',
mountain:'From the top of a push-up, drive your knees toward your chest one after the other at a run. Count each knee.',
bear:'Crawl on hands and feet with knees an inch off the floor and your back flat.',
vup:'Lie flat, then lift straight legs and torso together and touch your toes at the top.',
hollowrock:'Hold the hollow position and rock back and forth from shoulders to hips without losing the shape.',
longplank:'A plank with your hands or elbows walked out well ahead of your shoulders.',
lhang:'Hang from the bar holding your straight legs level with the floor.',
straddlel:'An L-sit with legs spread wide and hands placed between them.',
wipers:'Hang with your legs raised to the bar and sweep them from side to side like a wiper blade.',
flag:'Grip a vertical pole with one hand high and one low and hold your body straight out sideways, level with the floor.',
};

// ---- stretches
E('fwdfold','Standing forward fold','stretch','sec',0.5,'Mobility','ham','calf low',30,{t:60,h:70,a:[150,120],l:[90,90],f:0,fl:0});
E('seatedfold','Seated forward fold','stretch','sec',1,'Mobility','ham','low calf',30,{t:-35,h:-20,a:[20,20],l:[0,0],fl:0});
E('hamstretch','Lying hamstring stretch','stretch','sec',0.5,'Mobility','ham','calf',30,{t:180,a:[-20,-50],l:[-80,-80],l2:[0,0],f:null,fl:0});
E('butterfly','Butterfly stretch','stretch','sec',0.5,'Mobility','glu','low ham',30,{t:-85,a:[70,30],l:[-25,150],f:null,fl:0});
E('hipflexor','Hip flexor stretch','stretch','sec',0.5,'Mobility','quad','glu abs',30,{t:-90,a:[95,85],l:[5,95],l2:[115,175],f:0,f2:null,fl:0});
E('pigeon','Pigeon pose','stretch','sec',1,'Mobility','glu','low ham',30,{t:-80,a:[100,80],l:[10,170],l2:[178,178],f:null,f2:null,fl:0});
E('quadstretch','Standing quad stretch','stretch','sec',0.5,'Mobility','quad','',30,{t:-90,a:[110,70],l:[90,90],l2:[100,-80],f:0,f2:null,fl:0});
E('calfstretch','Wall calf stretch','stretch','sec',0.5,'Mobility','calf','',30,'wallpush');
E('ankle','Knee-to-wall ankle stretch','stretch','sec',0.5,'Mobility','calf','',30,'hipflexor');
E('downdog','Downward dog','stretch','sec',1,'Mobility','ham calf','sho lat low',30,'pike');
E('cobra','Cobra stretch','stretch','sec',0.5,'Mobility','abs','quad che',30,{t:-50,h:-70,a:[40,130],l:[180,180],f:null,fl:0});
E('childs',"Child's pose",'stretch','sec',0.5,'Mobility','low lat','sho glu',30,{t:10,h:20,a:[8,8],l:[30,180],f:null,fl:0});
E('latstretch','Kneeling lat stretch','stretch','sec',0.5,'Mobility','lat','tri sho',30,'childs');
E('catcow','Cat-cow','stretch','reps',0.5,'Mobility','low abs','trap',10,{t:-17,a:[90,90],l:[90,180],f:null,fl:0});
E('wristext','Wrist stretch','stretch','sec',0.5,'Mobility','fore','',30,'catcow');
E('chestdoor','Doorway chest stretch','stretch','sec',0.5,'Mobility','che','sho bic',30,{t:-90,a:[175,-95],l:[94,90],l2:[78,96],f:0,f2:0,fl:0,pr:[['post','hd']]});
E('shoulderext','Seated shoulder extension','stretch','sec',1,'Mobility','sho','che bic',20,{t:-100,a:[130,100],l:[0,0],fl:0});
E('tristretch','Overhead triceps stretch','stretch','sec',0.5,'Mobility','tri','lat sho',30,{t:-90,a:[-80,100],l:[90,90],f:0,fl:0});
E('crossbody','Cross-body shoulder stretch','stretch','sec',0.5,'Mobility','sho','trap',30,{t:-90,a:[5,5],a2:[40,-60],l:[90,90],f:0,fl:0});
E('jefferson','Jefferson curl','stretch','reps',1.5,'Mobility','ham low','calf trap',6,'fwdfold');
E('pancake','Pancake stretch','stretch','sec',2,'Mobility','ham glu','low',30,{t:-25,h:-10,a:[10,10],l:[5,5],l2:[-12,-12],fl:0});
E('frontsplit','Front split','stretch','sec',2.5,'Mobility','ham quad','glu calf',20,{t:-90,a:[80,95],l:[2,2],l2:[178,178],f2:null,fl:0});
E('backbridge','Back bridge','stretch','sec',2.5,'Mobility','sho abs','quad low glu che',15,{t:160,h:120,a:[100,95],l:[70,100],f:0,fl:0});
Object.assign(DESC,{
fwdfold:'Stand tall, hinge at the hips and let your upper body hang toward the floor. Bend your knees a little if your lower back rounds hard.',
seatedfold:'Sit with legs straight in front and reach your chest toward your thighs. Lead with your chest, not your head.',
hamstretch:'Lie on your back, raise one straight leg and pull it gently toward you with both hands. Swap sides.',
butterfly:'Sit with the soles of your feet together and let your knees fall outward. Sit tall, or lean forward for more.',
hipflexor:'Kneel in a lunge with the back knee down, tuck your hips under and shift forward until the front of the back hip opens. Swap sides.',
pigeon:'From all fours, bring one shin across in front of you and slide the other leg straight back. Lower your hips, then swap sides.',
quadstretch:'Stand on one leg and pull the other heel toward your glute, keeping your knees together. Swap sides.',
calfstretch:'Hands on a wall, step one leg back with the heel pressed down and the knee straight. Swap sides.',
ankle:'In a half-kneel facing a wall, drive the front knee forward over your toes without the heel lifting. Swap sides.',
downdog:'From hands and feet, push your hips up and back into an upside-down V and press your heels toward the floor.',
cobra:'Lie face down, hands under your shoulders, and press your chest up while your hips stay on the floor.',
childs:'Kneel, sit back onto your heels and fold forward with your arms stretched out along the floor.',
latstretch:'Kneel in front of a bench, place your elbows or hands on it and sink your chest toward the floor.',
catcow:'On hands and knees, slowly round your back up toward the ceiling, then let it sink and lift your chest. Each round trip is one rep.',
wristext:'On hands and knees, turn your fingers back toward your knees and rock gently backward. Then repeat on the backs of your hands.',
chestdoor:'Place your forearm on a door frame at shoulder height and turn your body away until the chest opens. Swap sides.',
shoulderext:'Sit with your hands on the floor behind you, fingers pointing back, and slide your hips forward until the front of the shoulders opens.',
tristretch:'Reach one arm overhead, bend the elbow so the hand drops behind your head, and ease the elbow back with the other hand. Swap sides.',
crossbody:'Bring one straight arm across your chest and hug it in with the other forearm. Swap sides.',
jefferson:'Stand tall and roll down one vertebra at a time until you hang in a forward fold, then roll back up just as slowly.',
pancake:'Sit with legs spread wide and walk your hands forward, bringing your chest toward the floor with a flat back.',
frontsplit:'One leg straight in front, one straight behind, hips square, lowering toward the floor. Use blocks under your hands while you build it.',
backbridge:'Lie on your back, hands by your ears and feet flat, then press up into an arch with straight arms.',
});

// ---- more stretches and warm-up moves
E('armcircle','Arm circles','stretch','reps',.5,'Mobility','sho','trap che',15,{t:-90,a:[-35,-35],a2:[-145,-145],l:[90,90],f:0,fl:0});
E('wristcircle','Wrist circles','stretch','reps',.5,'Mobility','fore','',15,{t:-90,a:[10,-20],l:[90,90],f:0,fl:0});
E('legswing','Leg swings','stretch','reps',.5,'Mobility','ham quad','glu',12,{t:-90,a:[100,80],l:[90,90],l2:[20,20],f:0,f2:-70,fl:0});
E('hipcircle','Hip circles','stretch','reps',.5,'Mobility','glu','low quad',10,{t:-90,a:[95,85],l:[90,90],l2:[-10,95],f:0,f2:null,fl:0});
E('ankcircle','Ankle circles','stretch','reps',.5,'Mobility','calf','',10,'hipcircle');
E('torsotwist','Standing torso twist','stretch','reps',.5,'Mobility','abs low','',16,{t:-90,a:[60,-20],l:[90,90],f:0,fl:0});
E('inchworm','Inchworm','stretch','reps',1,'Mobility','ham','sho abs calf',6,'pike');
E('wgs','World\'s greatest stretch','stretch','reps',1,'Mobility','quad glu','ham trap abs',6,{t:-50,a:[-85,-85],a2:[75,80],l:[5,95],l2:[150,172],f:0,f2:null,fl:0});
E('wallangel','Wall angel','stretch','reps',.5,'Mobility','sho trap','che',10,{t:-90,a:[-100,-80],l:[90,90],f:0,fl:0,pr:[['wall','hip',-4]]});
E('thread','Thread the needle','stretch','reps',.5,'Mobility','trap low','sho',8,'catcow');
E('neck','Neck stretch','stretch','sec',.5,'Mobility','trap','',20,{t:-90,h:-60,a:[95,85],l:[90,90],f:0,fl:0});
E('sidebend','Standing side bend','stretch','sec',.5,'Mobility','lat abs','low',20,{t:-72,h:-65,a:[-60,-50],a2:[100,90],l:[90,90],f:0,fl:0});
E('puppy','Puppy pose','stretch','sec',.5,'Mobility','sho lat','che abs',30,{t:40,h:20,a:[8,8],l:[90,180],f:null,fl:0});
E('bicepwall','Biceps wall stretch','stretch','sec',.5,'Mobility','bic','che sho fore',20,'chestdoor');
E('forearmflex','Forearm flexor stretch','stretch','sec',.5,'Mobility','fore','',20,'wristcircle');
E('sphinxst','Sphinx stretch','stretch','sec',.5,'Mobility','abs','low',30,{t:-35,h:-60,a:[70,0],l:[180,180],f:null,fl:0});
E('seatedtwist','Seated spinal twist','stretch','sec',.5,'Mobility','low abs','glu',30,{t:-90,a:[60,20],l:[0,0],l2:[-60,70],f2:null,fl:0});
E('supinetwist','Lying spinal twist','stretch','sec',.5,'Mobility','low','glu che',30,'kneehug');
E('kneehug','Knee hug','stretch','sec',.5,'Mobility','glu low','ham',20,{t:180,a:[-25,-10],l:[-140,30],l2:[0,0],f:null,fl:0});
E('figure4','Figure-four stretch','stretch','sec',.5,'Mobility','glu','low',30,{t:180,a:[10,-30],l:[-60,60],l2:[-30,120],f:null,f2:null,fl:0});
E('happybaby','Happy baby','stretch','sec',.5,'Mobility','glu','low ham',30,'deadbug');
E('ninety90','90/90 hip stretch','stretch','sec',1,'Mobility','glu','quad low',30,'butterfly');
E('frogst','Frog hip stretch','stretch','sec',1,'Mobility','glu ham','low',30,'childs');
E('lizard','Lizard pose','stretch','sec',1,'Mobility','quad glu','ham',30,'hipflexor');
E('halfsplit','Half split','stretch','sec',1,'Mobility','ham','calf',30,{t:-40,h:-25,a:[40,30],l:[30,30],l2:[90,180],f:-70,f2:null,fl:0});
E('widefold','Wide-leg forward fold','stretch','sec',1,'Mobility','ham glu','low calf',30,'fwdfold');
E('hero','Kneeling quad stretch','stretch','sec',1,'Mobility','quad','abs calf',20,{t:-110,a:[125,95],l:[20,180],f:null,fl:0});
E('shin','Kneeling shin stretch','stretch','sec',.5,'Mobility','calf','quad',20,'hero');
E('couch','Couch stretch','stretch','sec',1.5,'Mobility','quad','glu abs',30,'hipflexor');
E('germanhang','German hang','stretch','sec',2.5,'Mobility','sho','bic che',10,'skincat');
E('middlesplit','Middle split','stretch','sec',3,'Mobility','ham glu','low',20,'frontsplit');
Object.assign(DESC,{
armcircle:'Arms out to the sides, draw circles that grow from small to large, then reverse. A quick way to wake up the shoulders.',
wristcircle:'Clasp your hands or make loose fists and roll your wrists in slow circles both ways. Worth doing before any work on your hands.',
legswing:'Hold something for balance and swing one straight leg forward and back, a little higher each time. Swap sides.',
hipcircle:'Stand on one leg, lift the other knee and draw big circles with it, opening the hip out and around. Swap sides.',
ankcircle:'Lift one foot and roll the ankle through its full circle both ways. Swap sides.',
torsotwist:'Feet planted, arms loose, rotate your upper body side to side and let your arms swing. Count each turn.',
inchworm:'Fold forward, walk your hands out to a push-up position, then walk your feet up to your hands and stand.',
wgs:'Step into a deep lunge, drop the inside elbow toward the floor, then rotate and reach that arm to the ceiling. Swap sides.',
wallangel:'Back, head and arms against a wall, slide your arms up and down like a snow angel without letting them lift off.',
thread:'On hands and knees, slide one arm under your body along the floor until that shoulder rests down, then reach it up. Swap sides.',
neck:'Tip your ear toward your shoulder and let the weight of your head do the work. Swap sides.',
sidebend:'Reach one arm overhead and lean away from it, keeping both hips square. Swap sides.',
puppy:'From hands and knees, walk your hands forward and sink your chest toward the floor while your hips stay over your knees.',
bicepwall:'Place your palm flat on a wall behind you at shoulder height, arm straight, and turn your body away. Swap sides.',
forearmflex:'Hold one arm straight out, palm up, and gently pull the fingers down and back with the other hand. Swap sides.',
sphinxst:'Lie face down and prop yourself on your forearms, elbows under shoulders, letting your lower back relax.',
seatedtwist:'Sit tall, cross one foot over the other leg and rotate toward the raised knee, using your arm against it. Swap sides.',
supinetwist:'Lie on your back, pull one knee across your body toward the floor and look the other way. Swap sides.',
kneehug:'Lie on your back and pull one knee to your chest, keeping the other leg long. Swap sides.',
figure4:'Lie on your back, cross one ankle over the other knee and pull both legs toward you. Swap sides.',
happybaby:'Lie on your back, hold the outsides of your feet with knees wide and bent, and gently pull them down.',
ninety90:'Sit with one leg bent in front and one bent to the side, both at right angles, and lean over the front shin. Swap sides.',
frogst:'On hands and knees, spread your knees wide with feet turned out and ease your hips back toward your heels.',
lizard:'From a low lunge, bring both hands inside the front foot and lower toward your forearms. Swap sides.',
halfsplit:'Kneel on one knee, straighten the front leg with the heel down, and fold over it with a flat back. Swap sides.',
widefold:'Stand with feet wide, hinge at the hips and bring your hands, then your head, toward the floor.',
hero:'Kneel, sit back between or on your heels and lean back onto your hands until the front of the thighs opens.',
shin:'Kneel with the tops of your feet flat on the floor and sit back on your heels. Lift your knees slightly for more.',
couch:'Kneel with your back shin up against a wall or couch, front foot forward, then bring your torso upright. Swap sides.',
germanhang:'From a skin the cat, lower until you hang behind the bar with arms straight and shoulders open. Ease in slowly.',
middlesplit:'Legs straight out to each side, hips square to the front, lowering toward the floor. Support yourself on your hands.',
});
// moves that suit a warm-up before training
const WARM=new Set(['armcircle','wristcircle','legswing','hipcircle','ankcircle','torsotwist','inchworm','wgs','wallangel','thread','catcow','hang','deepsquat','downdog']);

// solid-set mark: the reps or seconds that earn a move its full value (defaults to the usual set)
const REF={squat:25,lunge:14,calf:25,bridge:20,crunch:25,situp:20,bicycle:30,russian:30,mountain:30,jumpsquat:15,wallpush:20,kneepush:15,incpush:15,pushup:15,widepush:12,benchdip:15,shouldertap:20,decline:12,diamond:10,row:10,erow:8,scap:10,stepup:14,revlunge:14,sbridge:12,scalf:15,deadbug:14,birddog:14,revcrunch:14,lraise:12,hknee:10,cossack:8,rdl:10,boxjump:8,tuckjump:10,burpee:12,vup:10,hollowrock:15,hindu:10,sphinx:8,pike:10,epike:8,bulg:10,pullup:6,chinup:6,negpull:5,dip:8,sbdip:6,c2b:5,widepull:5,clap:6,pppu:8,archer:6,typewriter:5,incone:5,apistol:5,boxpistol:5,pistol:4,shrimp:4,sissy:6,negnordic:5,nordic:3,hleg:6,t2b:5,wipers:5,highpull:4,negmu:3,muscleup:3,lpull:4,archerpull:4,typepull:3,onepull:2,onepush:3,wallwalk:4,neghspu:4,wallhspu:4,hspu:3,ninety:2,planchepu:2,tuckplpu:3,flraise:3,flpull:2,skincat:4,tuckdf:5,negdf:4,df:3,catcow:12,jefferson:8,
 hang:40,onehang:15,flexhang:20,plank:60,sideplank:40,longplank:20,hollow:30,superman:30,flutter:30,bear:30,wallsit:45,swallsit:20,deepsquat:60,support:30,wallhs:30,headstand:30,hs:15,onehs:5,frog:20,elbowlever:10,plean:20,tuckpl:10,advpl:8,strpl:5,planche:4,tuckfl:10,advfl:8,onefl:6,strfl:5,fl:5,tuckbl:10,backlever:6,tucksit:15,onel:10,lsit:10,straddlel:8,vsit:5,lhang:10,flag:4,
 fwdfold:45,seatedfold:45,hamstretch:45,butterfly:45,hipflexor:45,pigeon:45,quadstretch:45,calfstretch:45,ankle:45,downdog:45,cobra:45,childs:60,latstretch:45,wristext:45,chestdoor:45,shoulderext:30,tristretch:45,crossbody:45,pancake:45,frontsplit:30,backbridge:20};
Object.assign(REF,{armcircle:20,wristcircle:20,legswing:15,hipcircle:12,ankcircle:12,torsotwist:20,inchworm:8,wgs:8,wallangel:12,thread:10,neck:30,sidebend:30,puppy:45,bicepwall:30,forearmflex:30,sphinxst:45,seatedtwist:45,supinetwist:45,kneehug:30,figure4:45,happybaby:45,ninety90:45,frogst:45,lizard:45,halfsplit:45,widefold:45,hero:30,shin:30,couch:45,germanhang:15,middlesplit:30});
for(const k in B)B[k].ref=REF[k]||B[k].def;
// extra categories, only where a move truly belongs to more than one
const G2={muscleup:['push'],negmu:['push'],burpee:['push','core'],bear:['push'],shouldertap:['core'],flag:['pull','push'],lpull:['core'],
 tuckfl:['core'],advfl:['core'],onefl:['core'],strfl:['core'],fl:['core'],flraise:['core'],flpull:['core'],tuckbl:['core'],backlever:['core'],
 plean:['core'],tuckpl:['core'],advpl:['core'],strpl:['core'],planche:['core'],tuckplpu:['core'],planchepu:['core'],elbowlever:['core'],
 tucksit:['push'],onel:['push'],lsit:['push'],straddlel:['push'],vsit:['push'],hknee:['pull'],hleg:['pull'],lhang:['pull'],t2b:['pull'],wipers:['pull'],
 hang:['stretch'],skincat:['stretch'],germanhang:['pull'],inchworm:['core'],deepsquat:['stretch'],cossack:['stretch'],hindu:['stretch'],downdog:['push'],backbridge:['push'],jefferson:['legs']};
for(const k in G2)B[k].g2=G2[k];
// lead-up ladders used when a move is turned into a project
const CHAINS=[
 ['hang','scap','row','negpull','pullup','c2b','highpull','negmu','muscleup'],
 ['row','pullup','c2b','widepull','archerpull','typepull','onehang','onepull'],
 ['hang','row','pullup','hknee','hleg','lhang','lpull'],
 ['pullup','hleg','tuckfl','advfl','onefl','strfl','flraise','fl','flpull'],
 ['hang','hknee','skincat','tuckbl','backlever'],
 ['incpush','pushup','diamond','archer','typewriter','incone','onepush'],
 ['pushup','diamond','decline','clap'],
 ['pushup','plean','frog','pppu','tuckpl','advpl','tuckplpu','strpl','planche','planchepu'],
 ['pike','epike','wallhs','wallwalk','neghspu','wallhspu','hs','hspu','ninety'],
 ['pike','wallhs','wallwalk','hs','hspu','onehs'],
 ['plank','frog','plean','elbowlever'],
 ['benchdip','support','dip','sbdip'],
 ['squat','lunge','stepup','bulg','apistol','boxpistol','pistol'],
 ['squat','lunge','bulg','cossack','shrimp'],
 ['squat','wallsit','bulg','sissy'],
 ['bridge','sbridge','rdl','negnordic','nordic'],
 ['plank','support','tucksit','onel','lsit','straddlel','vsit'],
 ['lraise','hknee','hleg','lhang','t2b','wipers'],
 ['lraise','hollow','hleg','tuckdf','negdf','df'],
 ['sideplank','pullup','wallhs','hleg','df','flag'],
 ['seatedfold','hipflexor','pigeon','pancake','frontsplit'],
 ['cobra','shoulderext','bridge','backbridge'],
 ['butterfly','frogst','widefold','pancake','middlesplit'],
];

const PR=(id,name,color,steps)=>({id,name,color,steps:steps.map(([ex,target])=>({ex,target}))});
function defaultProjects(){return [
 PR('p-mu','Muscle-up','rose',[['hang',30],['row',10],['pullup',8],['c2b',5],['sbdip',8],['highpull',5],['negmu',3],['muscleup',1]]),
 PR('p-hspu','Handstand push-up','orange',[['pike',10],['epike',8],['wallhs',45],['neghspu',5],['wallhspu',5],['hs',20],['hspu',1]]),
 PR('p-fl','Front lever','cerulean',[['pullup',8],['hleg',8],['tuckfl',15],['advfl',12],['onefl',8],['strfl',6],['fl',5]]),
 PR('p-pl','Planche','violet',[['pushup',20],['plean',30],['frog',30],['tuckpl',15],['advpl',10],['strpl',6],['planche',3]]),
 PR('p-pistol','Pistol squat','emerald',[['squat',20],['lunge',12],['stepup',12],['bulg',10],['apistol',6],['boxpistol',5],['pistol',3]]),
 PR('p-vsit','V-sit','gamboge',[['plank',60],['support',30],['tucksit',20],['onel',15],['lsit',15],['vsit',5]]),
 PR('p-oap','One-arm push-up','ultra',[['incpush',15],['pushup',20],['diamond',12],['archer',8],['incone',5],['onepush',1]]),
 PR('p-df','Dragon flag','lime',[['lraise',12],['hollow',40],['hleg',8],['tuckdf',5],['negdf',3],['df',3]]),
]}
