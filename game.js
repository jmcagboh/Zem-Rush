const $=id=>document.getElementById(id);
const R=new THREE.WebGLRenderer({antialias:true});
R.setPixelRatio(Math.min(devicePixelRatio,1.5));R.setSize(innerWidth,innerHeight);
R.shadowMap.enabled=true;document.body.prepend(R.domElement);
const UC={value:0,tg:0},UBZ={value:0},UBH={value:0};
THREE.Material.prototype.onBeforeCompile=function(sh){sh.uniforms.uC=UC;sh.uniforms.uBz=UBZ;sh.uniforms.uBh=UBH;sh.vertexShader='uniform float uC;uniform float uBz;uniform float uBh;\n'+sh.vertexShader.replace('#include <project_vertex>','vec4 wpb=modelMatrix*vec4(transformed,1.0);float dzb=max(0.0,-wpb.z);wpb.x+=uC*dzb*dzb*0.0011;float dbb=abs(wpb.z-uBz);wpb.y+=uBh*smoothstep(0.0,1.0,clamp((40.0-dbb)/22.0,0.0,1.0))*4.0;vec4 mvPosition=viewMatrix*wpb;gl_Position=projectionMatrix*mvPosition;')};
const S=new THREE.Scene(),SKY=0x8fd3f4;S.background=new THREE.Color(SKY);S.fog=new THREE.Fog(SKY,60,190);
const C=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,300);
const hemi=new THREE.HemisphereLight(0xffffff,0x9a8a60,.85);S.add(hemi);
const sun=new THREE.DirectionalLight(0xfff0d0,.8);sun.position.set(14,26,10);sun.castShadow=true;
sun.shadow.mapSize.set(1024,1024);const sc_=sun.shadow.camera;sc_.left=-18;sc_.right=18;sc_.top=30;sc_.bottom=-20;sc_.far=80;
S.add(sun);S.add(sun.target);
const M=(c,e)=>new THREE.MeshLambertMaterial({color:c,emissive:e||0});
const box=(w,h,d,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d,1,1,d>=80?80:1),m);o.position.set(x,y,z);return o};
const cyl=(r1,r2,h,m,seg=12)=>new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg),m);
// soleil
const sunM=new THREE.Mesh(new THREE.SphereGeometry(10,16,12),new THREE.MeshBasicMaterial({color:0xfff2a8,fog:false}));sunM.position.set(60,70,-230);sunM.material.onBeforeCompile=function(){};S.add(sunM);
// sol, route, trottoirs
const ground=new THREE.Mesh(new THREE.PlaneGeometry(400,400),M(0xc9a96b));ground.rotation.x=-Math.PI/2;ground.position.y=-.02;ground.receiveShadow=true;S.add(ground);
const sea=box(100,.02,400,M(0x1d7fb5,0x06304a),-90,-.01,-100);sea.visible=false;S.add(sea);
const road=box(10,.1,400,M(0x3b3b40),0,-.05,-100);road.receiveShadow=true;S.add(road);
[-1,1].forEach(s=>{const w=box(3,.3,400,M(0xb8b2a6),s*6.5,0,-100);w.receiveShadow=true;S.add(w);
S.add(box(.15,.02,400,M(0xffffff),s*4.9,.02,-100));});
const LANES=[-3,0,3],LEN=240;
// pointillés de voie
const dashM=M(0xf5f5f5,0x555555),dashes=[];
for(let i=0;i<24;i++)for(const x of [-1.5,1.5]){const d=box(.2,.02,3,dashM,x,.02,-i*10+10);S.add(d);dashes.push(d)}
// décor recyclé
const scen=[];let bc=[0xe8d9b5,0xd96c3b,0x2e8b57,0xf2c14e,0xc94c4c,0xeeeeee,0x4a90c2,0xe39ac0];
function building(side){
 const g=new THREE.Group(),h=5+Math.random()*10,w=6+Math.random()*3,trad=Math.random()<.35,col=bc[Math.random()*bc.length|0];
 if(trad){g.add(box(w,3.2,6,M(col),0,1.6,0));const r=cyl(0,w*.75,2.2,M(0x8b4a2b),4);r.rotation.y=Math.PI/4;r.position.y=4.3;r.scale.z=.8;g.add(r)}
 else{g.add(box(w,h,7,M(col),0,h/2,0));g.add(box(w+.4,.4,7.4,M(0x777777),0,h+.2,0));
  for(let f=1;f*3<h;f++)for(let k=-1;k<=1;k+=1)g.add(box(1,1.2,.1,M(0x223344,0x0a1a2a),k*w/3.6,f*3+.3,-3.55*(1)));}
 const shop=Math.random()<.65;if(shop){g.add(box(w-.8,2.4,.2,M(0x1c1c1c),0,1.2,-3.5));g.add(box(w-.4,.5,1.4,M([0xff3b3b,0x00a550,0xffd21f][Math.random()*3|0]),0,2.7,-4))}
 g.rotation.y=side<0?Math.PI/2:-Math.PI/2;
 const wrap=new THREE.Group();wrap.add(g);g.position.set(0,0,0);g.rotation.y=0;
 g.rotation.y=side<0?-Math.PI/2:Math.PI/2;
 wrap.userData.x=side*(8+4+3.2);wrap.userData.r=LEN;return wrap}
for(let i=0;i<14;i++)for(const s of [-1,1]){const b=building(s);b.position.set(s*(15.5),0,-i*(LEN/14)+8);b.userData.s=s;S.add(b);scen.push(b)}
function palm(){const g=new THREE.Group(),t=cyl(.18,.3,5,M(0x7a5230),8);t.position.y=2.5;t.rotation.z=.08;g.add(t);
 for(let i=0;i<7;i++){const l=box(.5,.08,3,M(0x1f8a3a),0,5,0);l.geometry.translate(0,0,1.5);l.rotation.y=i*.9;l.rotation.x=.45;g.add(l)}return g}
function sign(){const g=new THREE.Group();const p=cyl(.07,.07,3,M(0x888888),6);p.position.y=1.5;g.add(p);g.add(box(1.4,1.1,.1,M([0xd21f1f,0x1f5fd2,0xffd21f][Math.random()*3|0]),0,3.1,0));g.add(box(.9,.15,.12,M(0xffffff),0,3.1,.02));return g}
for(let i=0;i<10;i++)for(const s of [-1,1]){const o=i%3==2?sign():palm();o.position.set(s*(6.2+(i%2)*.8),0,-i*(LEN/10)+5);o.userData.s=s;o.userData.p=1;if(!(i%3==2))o.rotation.y=Math.random()*6;if(i%3==2)o.rotation.y=s>0?-Math.PI/2:Math.PI/2;
 o.traverse(m=>{if(m.isMesh)m.castShadow=false});S.add(o);scen.push(o)}
// joueur
const P=new THREE.Group(),yel=M(0xffd21f),blk=M(0x1a1a1a);
function wheel(){const w=new THREE.Group();const t=new THREE.Mesh(new THREE.TorusGeometry(.38,.12,8,16),blk);t.rotation.y=Math.PI/2;w.add(t);const hub=cyl(.08,.08,.2,M(0xaaaaaa),6);hub.rotation.z=Math.PI/2;w.add(hub);return w}
const wF=wheel(),wB=wheel();wF.position.set(0,.5,-.9);wB.position.set(0,.5,.9);P.add(wF,wB);
P.add(box(.5,.5,1.5,yel,0,.85,.1));P.add(box(.4,.12,.9,blk,0,1.2,.35));
const bar=new THREE.Group();bar.position.set(0,1.2,-.7);bar.add(box(1.1,.08,.08,blk));bar.add(box(.12,.12,.12,M(0xffffaa,0x886600),0,.05,-.15));P.add(bar);
const rider=new THREE.Group();rider.position.set(0,1.3,.35);
const ofM=M(0x008751),of2M=M(0xffd21f),tor=box(.5,.8,.35,ofM,0,.55,0);rider.add(tor);
const hdM=M(0xd21f1f),hd=new THREE.Mesh(new THREE.SphereGeometry(.26,12,10),hdM);hd.position.y=1.2;rider.add(hd);
rider.add(box(.18,.1,.2,M(0x111111),0,1.2,-.22));
const aL=box(.12,.12,.7,ofM,-.3,.7,-.35),aR=box(.12,.12,.7,ofM,.3,.7,-.35);rider.add(aL,aR);P.add(rider);
P.add(box(.9,.05,.5,M(0xffffff),0,.62,1.45));
const SK={g:0,m:0,o:0};try{Object.assign(SK,JSON.parse(localStorage.getItem('zemSkin')||'{}'))}catch(e){}
const MOTOS=[['Zem classique',0xffd21f,0,0],['Sport rouge',0xd21f1f,1,0],['Cargo bleu',0x2c7be5,0,1],['Zem doré',0xe0a800,1,1]];
const OUTS=[['Vert Togo',0x008751,0xffd21f,0xd21f1f],['Wax rouge',0xc0281c,0xffd21f,0xffd21f],['Bleu indigo',0x1f3f9f,0xffffff,0xffffff],['Orange soleil',0xe67e22,0x008751,0x111111]];
const hairM=M(0x2a1a10),fair=box(.62,.5,.55,yel,0,1,-.6),cargo=box(.7,.6,.6,M(0xeeeeee),0,1.05,1.5),stripe=box(.52,.12,.37,of2M,0,.8,0),skirt=cyl(.3,.46,.4,of2M,12),pony=new THREE.Group();
skirt.position.set(0,.18,.02);pony.add(new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),hairM));{const t=cyl(.07,.04,.5,hairM,6);t.position.set(0,-.28,.05);pony.add(t)}pony.position.set(0,1.1,.3);
P.add(fair,cargo);rider.add(stripe,skirt,pony);
function applySkin(){const m=MOTOS[SK.m],o=OUTS[SK.o],g=SK.g==1;yel.color.setHex(m[1]);fair.visible=!!m[2];cargo.visible=!!m[3];ofM.color.setHex(o[1]);of2M.color.setHex(o[2]);hdM.color.setHex(o[3]);skirt.visible=g;pony.visible=g;stripe.visible=!g;tor.scale.x=g?.85:1;aL.scale.x=aR.scale.x=g?.9:1;try{localStorage.setItem('zemSkin',JSON.stringify(SK))}catch(e){}}
applySkin();
P.traverse(o=>{if(o.isMesh)o.castShadow=true});const hl=new THREE.PointLight(0xfff2b0,0,24);hl.position.set(0,1.6,-2.5);P.add(hl);const sp=new THREE.SpotLight(0xfff2c0,0,50,.55,.6,1);sp.position.set(0,1.4,-1);sp.target.position.set(0,0,-20);P.add(sp,sp.target);P.add(box(.3,.12,.08,new THREE.MeshBasicMaterial({color:0xff2a2a}),0,.95,1.5));
const lampM=new THREE.MeshBasicMaterial({color:0xfff6c0}),lamp=new THREE.Mesh(new THREE.SphereGeometry(.13,10,8),lampM);lamp.position.set(0,1.12,-.98);P.add(lamp);
const bgm=new THREE.ConeGeometry(3,15,18,1,true);bgm.translate(0,-7.5,0);const beamM=new THREE.MeshBasicMaterial({color:0xfff2b0,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});const beam=new THREE.Mesh(bgm,beamM);beam.position.set(0,1.1,-1);beam.rotation.x=Math.PI/2-.07;P.add(beam);
P.add(box(.5,.12,.08,new THREE.MeshBasicMaterial({color:0xff2a2a}),0,.85,1.6));
S.add(P);
// obstacles (pools)
const OB=[],cols=[0xc0392b,0x2980b9,0xecf0f1,0x27ae60,0x8e44ad,0x333333];
function carMesh(taxi){const g=new THREE.Group(),m=M(taxi?0xffd21f:0xffffff);g.userData.body=m;
 g.add(box(2,.8,4,m,0,.8,0));g.add(box(1.7,.7,2,M(0x223344),0,1.5,.2));
 g.add(box(.5,.2,.1,M(0xff0000,0xaa0000),-.7,.9,2.02));g.add(box(.5,.2,.1,M(0xff0000,0xaa0000),.7,.9,2.02));
 for(const x of [-1,1])for(const z of [-1.3,1.3]){const w=cyl(.4,.4,.3,blk,10);w.rotation.z=Math.PI/2;w.position.set(x,.4,z);g.add(w)}
 if(taxi){g.add(box(.7,.25,.3,M(0xffffff,0x888800),0,1.97,.2))}return g}
function motoMesh(){const g=new THREE.Group(),m=M(0x2c7be5);g.userData.body=m;
 g.add(box(.45,.5,1.4,m,0,.8,0));for(const z of [-.8,.8]){const w=cyl(.38,.38,.15,blk,10);w.rotation.z=Math.PI/2;w.position.set(0,.4,z);g.add(w)}
 g.add(box(.45,.8,.3,M(0xffffff),0,1.4,.2));const h=new THREE.Mesh(new THREE.SphereGeometry(.24,10,8),M(0x222222));h.position.set(0,1.95,.2);g.add(h);return g}
function potMesh(){const g=new THREE.Group();const d=new THREE.Mesh(new THREE.CircleGeometry(1.1,14),M(0x0a0a0a));d.rotation.x=-Math.PI/2;d.position.y=.03;g.add(d);
 const r=new THREE.Mesh(new THREE.RingGeometry(1.1,1.5,14),M(0x55504a));r.rotation.x=-Math.PI/2;r.position.y=.04;g.add(r);
 for(let i=0;i<7;i++){const a=i*.9,c=box(.35,.14,.3,M(0x6a645c),Math.cos(a)*1.3,.07,Math.sin(a)*1.3);c.rotation.y=a;g.add(c)}return g}
function coneMesh(){const g=new THREE.Group();for(const x of [-.7,0,.7]){const c=cyl(.02,.3,.8,M(0xff6a00),8);c.position.set(x,.4,0);g.add(c);const s=cyl(.16,.22,.2,M(0xffffff),8);s.position.set(x,.4,0);g.add(s)}g.add(box(2,.1,.6,M(0xeeeeee),0,.05,0));return g}
function rbMesh(){const g=new THREE.Group();const c=cyl(2.35,2.35,.3,M(0xf0f0f0),24);c.scale.z=5;c.position.y=.15;g.add(c);const i=cyl(2.1,2.1,.36,M(0x3f9a3f),24);i.scale.z=5;i.position.y=.2;g.add(i);
g.add(box(.8,5,.8,M(0xf5f5f5),0,2.8,0));g.add(box(1.1,.4,1.1,M(0x008751),0,5.2,0));g.add(box(1.1,.25,1.1,M(0xffd21f),0,5.5,0));
for(const z of [-7,7]){const p=palm();p.position.set(0,.2,z);g.add(p)}g.userData.k='rb';return g}
const SH=['Bord de mer','Grand Marché','Quartier Tokoin','Port autonome'];
function mkSign(){const c=document.createElement('canvas');c.width=256;c.height=128;return new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)})}
function drawSign(m,a,b,col){const c=m.map.image,x=c.getContext('2d');x.fillStyle=col;x.fillRect(0,0,256,128);x.strokeStyle='#fff';x.lineWidth=6;x.strokeRect(6,6,244,116);x.fillStyle='#fff';x.textAlign='center';x.font='bold 34px sans-serif';x.fillText(a,128,56);x.font='bold 24px sans-serif';x.fillText(b,128,100);m.map.needsUpdate=true}
function forkMesh(){const g=new THREE.Group();const tri=(k,y,col)=>{const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.BufferAttribute(new Float32Array([0,y,12*k,2.6*k,y,-12*k,-2.6*k,y,-12*k]),3));ge.computeVertexNormals();const m=new THREE.Mesh(ge,new THREE.MeshLambertMaterial({color:col,side:THREE.DoubleSide}));g.add(m)};tri(1.15,.12,0xf0f0f0);tri(1,.2,0x3f9a3f);
const rd=M(0xd21f1f);for(const s of [-1,1])g.add(box(.6,7,.6,rd,s*8,3.5,-14));g.add(box(17,.6,.6,rd,0,7,-14));
const ml=mkSign(),mr=mkSign();const pl=new THREE.Mesh(new THREE.PlaneGeometry(5.6,2.8),ml),pr=new THREE.Mesh(new THREE.PlaneGeometry(5.6,2.8),mr);pl.position.set(-4,5.3,-13.6);pr.position.set(4,5.3,-13.6);g.add(pl,pr);g.userData.k='fk';g.userData.ml=ml;g.userData.mr=mr;return g}
function bh(){if(!BR.userData.on)return 0;const x=Math.min(1,Math.max(0,(40-Math.abs(BR.position.z))/22));return 4*x*x*(3-2*x)}
const BR=new THREE.Group();BR.userData.on=false;BR.visible=false;
{const w=M(0x1d7fb5,0x06304a),rl=M(0xeeeeee),ar=M(0xd21f1f);
for(const s of [-1,1]){BR.add(box(60,.02,79,w,s*38.8,.04,0));BR.add(box(.25,.15,80,rl,s*8,.6,0));BR.add(box(.2,.12,80,rl,s*8,1.1,0));for(let k=-4;k<=4;k++)BR.add(box(.3,1.1,.3,rl,s*8,.7,k*9))}
for(const z of [-25,0,25]){for(const s of [-1,1])BR.add(box(.6,7,.6,ar,s*8,3.5,z));BR.add(box(17,.6,.6,ar,0,7,z))}
S.add(BR)}
let rbT=30,brT=40,crvT=6,fkT=20,cornT=22,pushT=0;
const defs=[['rb',rbMesh,0,1],['rb',forkMesh,0,1],['pot',potMesh,0,6],['car',()=>carMesh(0),9,5],['taxi',()=>carMesh(1),8,5],['moto',motoMesh,12,4],['cone',coneMesh,0,4]];
for(const [n,f,sp,k] of defs)for(let i=0;i<k;i++){const m=f();m.visible=false;m.userData.t=n;m.userData.sp=sp;m.userData.on=false;
 m.traverse(o=>{if(o.isMesh)o.castShadow=n!='pot'});S.add(m);OB.push(m)}
// poussière / effets
const FX=[];for(let i=0;i<40;i++){const p=new THREE.Mesh(new THREE.SphereGeometry(.18,6,5),new THREE.MeshBasicMaterial({color:0xd8c39a,transparent:true,opacity:.6}));p.visible=false;p.userData={l:0};S.add(p);FX.push(p)}
const RICE=new THREE.Group();RICE.userData={on:false};
{const pl=cyl(.8,.6,.12,M(0xffffff),16);RICE.add(pl);const r=new THREE.Mesh(new THREE.SphereGeometry(.55,12,8),M(0xf5ecd0,0x332e20));r.scale.y=.6;r.position.set(-.15,.25,0);RICE.add(r);
const sa=new THREE.Mesh(new THREE.SphereGeometry(.42,12,8),M(0xc0281c,0x330800));sa.scale.y=.5;sa.position.set(.25,.2,.1);RICE.add(sa);
for(const [x,z] of [[.1,.3],[-.3,-.25],[.35,-.2]]){const e=new THREE.Mesh(new THREE.SphereGeometry(.09,6,5),M(0x2e7d32));e.position.set(x,.4,z);RICE.add(e)}
const gl=new THREE.Mesh(new THREE.RingGeometry(.9,1.15,20),new THREE.MeshBasicMaterial({color:0xffd21f,side:THREE.DoubleSide,transparent:true,opacity:.7}));gl.rotation.x=-Math.PI/2;gl.position.y=-.05;RICE.add(gl);
RICE.visible=false;S.add(RICE)}
let riceT=10,msgT=0;
let fxi=0;function fx(x,y,z,vx,vy,vz,col,sz){const p=FX[fxi++%FX.length];p.position.set(x,y,z);p.userData={l:.7,vx,vy,vz,s:sz};p.material.color.setHex(col);p.visible=true}
// état
let st='menu',speed=0,t=0,dist=0,score=0,lives=3,lane=1,px=0,inv=0,shake=0,spawnT=0,boost=0,keys={};
let best=0;try{best=+localStorage.getItem('zemBest')||0}catch(e){}
const ZN=[{name:'Boulevard du 13 Janvier (bord de mer)',g:0xe3cf9a,bc:[0xf2e6c4,0xffffff,0x4a90c2,0xf2c14e,0xeeeeee],sea:1},
{name:'Grand Marché de Lomé',g:0xb98a55,bc:[0xd96c3b,0xc94c4c,0xf2c14e,0xe39ac0,0x2e8b57],dn:.8},
{name:'Quartier Tokoin',g:0x8fae5a,bc:[0xe8d9b5,0x2e8b57,0xeeeeee,0xd96c3b]},
{name:'Port Autonome de Lomé',g:0x9a9a96,bc:[0x7a8a99,0x4a6a8a,0xc94c4c,0x888888,0xd9a441],dn:.9}];
const INFO=[['🌊','Boulevard du 13 Janvier','Grande artère de Lomé, ouverte sur la côte du golfe de Guinée.'],['🧵','Grand Marché de Lomé','Cœur commerçant de la capitale, célèbre pour le pagne wax et les « Nana Benz ».'],['🏘️','Quartier Tokoin','Quartier résidentiel de Lomé, connu pour son centre hospitalier.'],['🚢','Port autonome de Lomé','Port en eau profonde, porte d’entrée du commerce vers les pays du Sahel.']];
const card=(i,c)=>`<${c?'div class="dcard"':'span'} style="display:contents">${'<img src="img/lome'+i+'.jpg" alt="" onerror="this.remove()">'}<div>${INFO[i][0]} <b>${INFO[i][1]}</b>${INFO[i][2]}</div></${c?'div':'span'}>`;
const VIS=new Set(),NP=[[.431,.778],[.312,.778],[.07,.2125],[.908,.344]],LO=[-22,-40,-22,-22];let FKO=null;
function drawMap(c,big){const x=c.getContext('2d'),W=c.width,H=c.height;x.clearRect(0,0,W,H);x.fillStyle='#e8d9b5';x.fillRect(0,0,W,H);x.fillStyle='#1d7fb5';x.fillRect(0,H*.87,W,H*.13);
 const ln=(a,b,col,lw,d)=>{x.strokeStyle=col;x.lineWidth=lw;x.setLineDash(d||[]);x.beginPath();x.moveTo(NP[a][0]*W,NP[a][1]*H);x.lineTo(NP[b][0]*W,NP[b][1]*H);x.stroke();x.setLineDash([])};
 for(let a=0;a<4;a++)for(let b=a+1;b<4;b++)ln(a,b,'#777',big?3:1.5);
 if(FKO)for(const o of FKO)ln(zi,o,'#d21f1f',big?5:3,[8,6]);
 if(big){x.font='22px sans-serif';x.textAlign='center';x.fillText('🌉',(NP[1][0]+NP[2][0])*W/2,(NP[1][1]+NP[2][1])*H/2+8)}
 NP.forEach((p,i)=>{const cur=i==zi,v=VIS.has(i);x.fillStyle=cur?'#ffd21f':v?'#008751':'#999';x.beginPath();x.arc(p[0]*W,p[1]*H,big?15:6,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=2;x.stroke();if(big){x.fillStyle='#222';x.font='bold 14px sans-serif';x.textAlign='center';x.fillText(v||cur?SH[i]:'???',Math.min(W-55,Math.max(55,p[0]*W)),p[1]*H+LO[i])}});
 if(big){x.fillStyle='#fff';x.font='12px sans-serif';x.textAlign='center';x.fillText('Golfe de Guinée',W/2,H*.95);x.fillStyle='#333';x.fillRect(.173*W-5,.709*H-5,10,10);x.font='11px sans-serif';x.fillText('Monument de l’Indépendance',Math.max(80,.173*W),.709*H+20)}}
function drawMaps(){drawMap($('mm'),0);drawMap($('mc'),1)}
let mP=false;function openMap(){mP=(st=='play');if(mP)pause();$('pz').classList.add('hide');drawMaps();$('mp').classList.remove('hide')}
function closeMap(){$('mp').classList.add('hide');if(mP){mP=false;resume()}else if(st=='pause')$('pz').classList.remove('hide')}
let ciT=0;function showCard(i){VIS.add(i);drawMaps();const e=$('ci');e.innerHTML=card(i,0);e.classList.remove('hide');clearTimeout(ciT);ciT=setTimeout(()=>e.classList.add('hide'),6500)}
$('dg').innerHTML=INFO.map((_,i)=>`<div class="dcard">${'<img src="img/lome'+i+'.jpg" alt="" style="width:100%;height:110px" onerror="this.remove()">'}${INFO[i][0]} <b>${INFO[i][1]}</b>${INFO[i][2]}</div>`).join('');
function skinUI(){const hx=c=>'#'+c.toString(16).padStart(6,'0');const sw=(id,arr,key,bg)=>{$(id).innerHTML=arr.map((a,i)=>`<button class="ck sw${SK[key]==i?' sel':''}" data-k="${key}" data-i="${i}" style="background:${bg(a)}" aria-label="${a[0]}"></button>`).join('')};
$('sg').innerHTML=['👦 Garçon','👧 Fille'].map((a,i)=>`<button class="ck pill${SK.g==i?' sel':''}" data-k="g" data-i="${i}">${a}</button>`).join('');
sw('sm',MOTOS,'m',a=>hx(a[1]));sw('so',OUTS,'o',a=>`linear-gradient(135deg,${hx(a[1])} 50%,${hx(a[2])} 50%)`);$('mn').textContent=MOTOS[SK.m][0];$('on').textContent=OUTS[SK.o][0]}
$('cs').addEventListener('click',e=>{const b=e.target.closest('.ck');if(!b)return;SK[b.dataset.k]=+b.dataset.i;applySkin();skinUI()});
$('cu').onclick=()=>{$('menu').classList.add('hide');$('cs').classList.remove('hide');skinUI()};$('cback').onclick=()=>{$('cs').classList.add('hide');$('menu').classList.remove('hide')};
$('dv').onclick=()=>{$('menu').classList.add('hide');$('dc').classList.remove('hide')};$('dback').onclick=()=>{$('dc').classList.add('hide');$('menu').classList.remove('hide')};
const MS=[{k:'c',n:8,t:'Ramasse des pièces'},{k:'n',n:8,t:'Frôle des véhicules'},{k:'r',n:1,t:'Ramasse du riz ayimolou'},{k:'d',n:600,t:'Roule (m)'}];
let zi=0,lvl=0,zd=0,mdone=false,mi={c:0,n:0,r:0,d:0};
function rebuild(){for(let i=0;i<scen.length;i++){const o=scen[i];if(o.userData.p)continue;const n=building(o.userData.s);n.position.copy(o.position);n.userData.s=o.userData.s;n.userData.zz=zi;n.visible=!(ZN[zi].sea&&n.userData.s<0);S.remove(o);o.traverse(m=>{if(m.isMesh){m.geometry.dispose();m.material.dispose()}});S.add(n);scen[i]=n}}
let GT=0xe3cf9a,SEAT=-420;const gtc=new THREE.Color();
function rb1(i){const o=scen[i];if(o.userData.p)return;const n=building(o.userData.s);n.position.copy(o.position);n.userData.s=o.userData.s;n.userData.zz=zi;n.visible=!(ZN[zi].sea&&n.userData.s<0);S.remove(o);o.traverse(m=>{if(m.isMesh){m.geometry.dispose();m.material.dispose()}});S.add(n);scen[i]=n}
function applyZone(soft){const Z=ZN[zi];GT=Z.g;bc=Z.bc;SEAT=Z.sea?-90:-420;if(!soft){ground.material.color.setHex(Z.g);sea.position.x=SEAT;sea.visible=true;rebuild()}}
function save(){try{localStorage.setItem('zemSave',JSON.stringify({zi:(zi+1)%4,lvl:zi==3?lvl+1:lvl,score:Math.floor(score),dist:Math.floor(dist)}))}catch(e){}}
function ld(){try{return JSON.parse(localStorage.getItem('zemSave'))}catch(e){return null}}
function goZone(z){zi=z;zd=0;mdone=false;mi={c:0,n:0,r:0,d:0};applyZone(1);cm('📍 '+ZN[zi].name,2.4);drawMaps();const zq=zi;setTimeout(()=>{if(zi==zq)showCard(zq)},3500)}
function nextZone(){zi=(zi+1)%4;if(zi==0)lvl++;zd=0;mdone=false;mi={c:0,n:0,r:0,d:0};applyZone(1);cm('📍 '+ZN[zi].name,2.4);drawMaps();const zq=zi;setTimeout(()=>{if(zi==zq)showCard(zq)},3500)}
let eo,eg,MG,mus=0,step=0,mute=0;
function ia(){if(AC)return;AC=new(window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=mute?0:1;MG.connect(AC.destination);eo=AC.createOscillator();eg=AC.createGain();eo.type='sawtooth';eg.gain.value=0;eo.connect(eg);eg.connect(MG);eo.start()}
function tick(){setTimeout(tick,Math.max(95,175-speed*.9));if(st!='play'||!AC)return;const k=step++%16;
 if(k%4==0)beep(120,.14,'sine',.15,40);
 if(k==4||k==12)beep(240,.1,'triangle',.07,120);
 if(k%2==1)beep(7000,.03,'square',.012);
 if(k%2==0)beep(55*Math.pow(2,[0,0,3,0,5,3,7,5][k>>1]/12),.18,'sawtooth',.05);
 if(k%4==2&&Math.random()<.65)beep(220*Math.pow(2,[0,3,5,7,10,12][Math.random()*6|0]/12),.2,'triangle',.05)}
let nitro=0,turbo=0,combo=1,comboT=0,coinT=5,AC;
const cD=new THREE.Color(0x8fd3f4),cS=new THREE.Color(0xff9a5a),cN=new THREE.Color(0x0d1b3a),cT=new THREE.Color();
const COIN=[],coinG=new THREE.CylinderGeometry(.4,.4,.08,12),coinM=M(0xffc400,0x664400);
for(let i=0;i<20;i++){const c=new THREE.Mesh(coinG,coinM);c.rotation.order='YXZ';c.rotation.x=Math.PI/2;c.visible=false;c.userData.on=false;S.add(c);COIN.push(c)}
function beep(f,d,ty,vol,f2){try{ia();const o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime;o.type=ty||'square';o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+d);g.gain.setValueAtTime(vol||.05,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(MG);o.start();o.stop(n+d)}catch(e){}}
function cm(t,d){$('msg').textContent=t;msgT=d||1;$('msg').classList.remove('hide')}
function useTurbo(){if(st!='play'||turbo>0)return;if(nitro<40){cm('Turbo : '+Math.floor(nitro)+' / 40',.6);return}turbo=nitro/20;nitro=0;beep(200,.6,'sawtooth',.07,900);cm('TURBO !',.8)}
addEventListener('keydown',e=>{if(e.code=='Space'){e.preventDefault();useTurbo()}});
let ty=0;addEventListener('touchstart',e=>{ty=e.touches[0].clientY});addEventListener('touchend',e=>{if(ty-e.changedTouches[0].clientY>70)useTurbo()});
const upd=()=>{$('best').textContent='MEILLEUR '+best;$('lv').textContent='❤'.repeat(Math.max(lives,0))+'♡'.repeat(Math.max(0,3-lives))};
function start(r){st='play';t=0;dist=r?r.dist:0;score=r?r.score:0;zi=r?r.zi:0;lvl=r?r.lvl:0;zd=0;mdone=false;mi={c:0,n:0,r:0,d:0};applyZone();showCard(zi);if(!mus){mus=1;tick()}$('pz').classList.add('hide');lives=3;lane=1;px=0;inv=0;speed=22;spawnT=1;OB.forEach(o=>{o.visible=false;o.userData.on=false});rbT=30;brT=40;crvT=6;fkT=20;cornT=22;pushT=0;UC.value=0;UC.tg=0;BR.userData.on=false;BR.visible=false;RICE.visible=false;RICE.userData.on=false;riceT=10;nitro=0;turbo=0;combo=1;comboT=0;coinT=5;COIN.forEach(c=>{c.visible=false;c.userData.on=false});beep(300,.15,'triangle',.05,700);$('msg').classList.add('hide');$('menu').classList.add('hide');$('over').classList.add('hide');upd()}
function spawn(){const a=OB.filter(o=>!o.userData.on&&o.userData.t!='rb');if(!a.length)return;
 const free=[0,1,2];const rbo=OB.find(o=>o.userData.t=='rb'&&o.userData.on&&Math.abs(o.position.z+170)<26);if(rbo)free.splice(1,1);const n=Math.random()<Math.min(.04+t*.0015,.25)?2:1;
 for(let k=0;k<n;k++){const o=a[Math.random()*a.length|0];if(!o||o.userData.on)continue;const l=free.splice(Math.random()*free.length|0,1)[0];
  o.userData.on=true;o.visible=true;o.userData.ps=false;o.userData.lane=l;o.position.set(LANES[l],0,-170-k*6);
  if(o.userData.body)o.userData.body.color.setHex(o.userData.t=='car'?cols[Math.random()*cols.length|0]:o.userData.t=='moto'?cols[Math.random()*cols.length|0]:0xffd21f)}}
function over(){st='over';if(score>best){best=score;try{localStorage.setItem('zemBest',best)}catch(e){}}upd();$('cp2').classList.toggle('hide',!ld());$('res').textContent='Score : '+score+' · Distance : '+Math.floor(dist)+' m · Meilleur : '+best;$('over').classList.remove('hide')}
function go(d){if(st!='play')return;lane=Math.max(0,Math.min(2,lane+d))}
addEventListener('keydown',e=>{if(e.key=='ArrowLeft'){go(-1);e.preventDefault()}else if(e.key=='ArrowRight'){go(1);e.preventDefault()}else if(e.key=='ArrowUp'||e.key=='ArrowDown'){keys[e.key]=1;e.preventDefault()}});
addEventListener('keyup',e=>{keys[e.key]=0});
let tx=0;addEventListener('touchstart',e=>{tx=e.touches[0].clientX});addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>30)go(d>0?1:-1)});
function pause(){if(st=='play'){st='pause';$('pz').classList.remove('hide')}}
function resume(){if(st=='pause'){st='play';$('pz').classList.add('hide')}}
function refreshCont(){const v=ld();$('cont').classList.toggle('hide',!v);if(v)$('cont').textContent='CONTINUER · '+ZN[v.zi].name}
function toMenu(){st='menu';$('ci').classList.add('hide');$('pz').classList.add('hide');$('over').classList.add('hide');$('menu').classList.remove('hide');$('mis').textContent='';refreshCont()}
$('go').onclick=()=>start();$('re').onclick=()=>start();$('cont').onclick=()=>start(ld());$('cp2').onclick=()=>start(ld());
$('bp').onclick=pause;$('rs').onclick=resume;$('bh').onclick=toMenu;$('hm').onclick=toMenu;$('hm2').onclick=toMenu;
$('bm').onclick=()=>{mute=!mute;if(MG)MG.gain.value=mute?0:1;$('bm').textContent=mute?'🔇':'🔊'};
document.addEventListener('click',e=>{if(e.target.blur)e.target.blur()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
addEventListener('keydown',e=>{if(e.code=='KeyP'||e.code=='Escape'){st=='pause'?resume():pause()}if(e.code=='KeyH'){beep(420,.22,'square',.07);setTimeout(()=>beep(530,.3,'square',.07),130)}});
if('ontouchstart' in window||navigator.maxTouchPoints>0)document.body.classList.add('touch');
const pd=(id,f)=>$(id).addEventListener('pointerdown',e=>{e.preventDefault();f()});
pd('tl',()=>go(-1));pd('tr',()=>go(1));pd('tt',()=>useTurbo());
addEventListener('keydown',e=>{if(e.code=='KeyA'||e.code=='KeyQ')go(-1);if(e.code=='KeyD')go(1)});
if(!document.fullscreenEnabled){$('bf').style.display='none';$('rf').style.display='none'}
let stgP=false;
function openStg(){stgP=(st=='play');if(stgP)pause();$('pz').classList.add('hide');$('stg').classList.remove('hide')}
function closeStg(){$('stg').classList.add('hide');if(stgP){stgP=false;resume()}else if(st=='pause')$('pz').classList.remove('hide')}
let AV=0;try{AV=+localStorage.getItem('zemAV')||0}catch(e){}
function toggleAV(){AV=1-AV;$('bv').textContent=AV?'🚗':'🚁';try{localStorage.setItem('zemAV',AV)}catch(e){}}
$('bv').textContent=AV?'🚗':'🚁';$('bv').onclick=toggleAV;addEventListener('keydown',e=>{if(e.code=='KeyV')toggleAV()});
$('gear').onclick=openStg;$('mapb').onclick=openMap;$('mm').onclick=openMap;$('mback').onclick=closeMap;$('gsat').onclick=()=>{const g=$('gm');if(!g.classList.contains('hide')){g.classList.add('hide');return}const q=['Boulevard du 13 Janvier, Lomé','Grand Marché, Lomé','Tokoin, Lomé','Port autonome de Lomé'][zi]||'Lomé, Togo';$('gf').src='https://maps.google.com/maps?q='+encodeURIComponent(q)+'&t=k&z=16&output=embed';g.classList.remove('hide')};$('mset').onclick=openStg;$('sclose').onclick=closeStg;
$('bh').addEventListener('click',()=>{$('stg').classList.add('hide');stgP=false});
$('bf').onclick=()=>{try{if(document.fullscreenElement)document.exitFullscreen();else{document.documentElement.requestFullscreen();screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})}}catch(e){}};
refreshCont();
addEventListener('resize',()=>{R.setSize(innerWidth,innerHeight);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()});
// boucle
const clk=new THREE.Clock();let acc=0,fr=0,q=2;
function loop(){requestAnimationFrame(loop);const dt=Math.min(clk.getDelta(),.05);if(eg){eg.gain.setTargetAtTime(st=='play'?.03:0,AC.currentTime,.1);eo.frequency.value=45+speed*2}if(st=='pause'){R.render(S,C);return}
 acc+=dt;fr++;if(acc>2){const avg=acc/fr;if(avg>1/40&&q>0){q--;if(q==1){R.setPixelRatio(1);R.setSize(innerWidth,innerHeight)}if(q==0){sun.castShadow=false;R.shadowMap.enabled=false}}acc=0;fr=0}
 const play=st=='play';
 if(play){t+=dt;const base=Math.min(22+t*.7+lvl*4,80);boost+=((keys.ArrowUp?.25:keys.ArrowDown?-.3:0)-boost)*Math.min(1,dt*4);speed=base*(1+boost)*(turbo>0?1.45:1);if(turbo>0){turbo-=dt;shake=Math.max(shake,.12)}
  dist+=speed*dt;score+=speed*dt*.8*combo*(turbo>0?2:1);score=Math.floor(score*100)/100;
  zd+=speed*dt;mi.d=zd;const mm=MS[zi];if(!mdone&&mi[mm.k]>=mm.n){mdone=true;save();cm('✔ Mission accomplie · Checkpoint !',2.2);beep(660,.15,'triangle',.07,1320)}
  $('mis').textContent='📍 '+ZN[zi].name+' · '+(mdone?'✔ mission accomplie':mm.t+' '+Math.min(Math.floor(mi[mm.k]),mm.n)+'/'+mm.n)+(lvl?' · Niv. '+(lvl+1):'');
  if((mdone&&zd>=250)||zd>=700)nextZone();
  comboT-=dt;if(comboT<=0)combo=1;$('cmb').textContent=combo>1?'COMBO ×'+combo:'';$('tbi').style.width=nitro+'%';$('tt').style.setProperty('--p',nitro);$('tt').classList.toggle('rdy',nitro>=40);
  coinT-=dt;if(coinT<=0){coinT=6+Math.random()*5;const l=Math.random()*3|0;for(let k=0;k<5;k++){const c=COIN.find(o=>!o.userData.on);if(!c)break;c.userData.on=true;c.visible=true;c.position.set(LANES[l],1,-170-k*4)}}
  riceT-=dt;if(riceT<=0&&!RICE.userData.on){riceT=14+Math.random()*10;const busy=OB.filter(o=>o.userData.on&&o.position.z<-140).map(o=>o.userData.lane);const fl=[0,1,2].filter(l=>!busy.includes(l));if(fl.length){const l=fl[Math.random()*fl.length|0];RICE.userData.on=true;RICE.visible=true;RICE.position.set(LANES[l],1,-170)}}
  crvT-=dt;if(crvT<=0){crvT=6+Math.random()*6;const cs=[-1,-.7,0,.7,1];let cn;do{cn=cs[Math.random()*5|0]}while(cn===UC.tg);UC.tg=cn}UC.value+=(UC.tg-UC.value)*Math.min(1,dt*.5);
  cornT-=dt;if(cornT<=0){cornT=28+Math.random()*18;if(!BR.userData.on&&!OB.some(o=>o.userData.t=='rb'&&o.userData.on)){const d=Math.random()<.5?-1:1;UC.tg=d*1.9;crvT=8;cm('⚠ Virage serré à '+(d<0?'gauche':'droite')+' : prends l’intérieur !',2.8)}}
  if(Math.abs(UC.value)>1.1){const inner=UC.value>0?2:0;pushT-=dt;if(pushT<=0){pushT=1.1;lane=Math.max(0,Math.min(2,lane+(inner==2?-1:1)))}if(lane==inner)score+=12*combo*dt}
  rbT-=dt;if(rbT<=0){rbT=45+Math.random()*30;const r=OB.some(o=>o.userData.k=='fk'&&o.userData.on)?0:OB.find(o=>o.userData.k=='rb'&&!o.userData.on);if(r){r.userData.on=true;r.visible=true;r.userData.ps=true;r.position.set(0,0,-180);cm('⭕ Rond-point : la voie du milieu est bloquée',2.2)}}
  fkT-=dt;if(fkT<=0){fkT=30+Math.random()*20;const f=OB.find(o=>o.userData.k=='fk'&&!o.userData.on),busy=OB.some(o=>o.userData.t=='rb'&&o.userData.on);if(f&&!busy){const ar=[0,1,2,3].filter(i=>i!==zi),zl=ar.splice(Math.random()*ar.length|0,1)[0],zr=ar[Math.random()*ar.length|0];f.userData.zl=zl;f.userData.zr=zr;FKO=[zl,zr];drawMaps();f.userData.dc=false;drawSign(f.userData.ml,'◀ GAUCHE',SH[zl],'#008751');drawSign(f.userData.mr,'DROITE ▶',SH[zr],'#c0281c');f.userData.on=true;f.visible=true;f.userData.ps=true;f.position.set(0,0,-180);UC.tg=0;crvT=10;cm('🔀 Carrefour : choisis ta route !',2.6)}}
  brT-=dt;if(brT<=0&&!BR.userData.on){brT=40+Math.random()*25;BR.userData.on=true;BR.visible=true;BR.position.set(0,0,-250);cm('🌉 Pont : monte et profite de la vue !',2.4)}
  spawnT-=dt;if(spawnT<=0){spawn();spawnT=Math.max(.7,28/speed)*(.9+Math.random()*.6)*(ZN[zi].dn||1)}
  $('sc').textContent=Math.floor(score);$('di').textContent=Math.floor(dist);$('sp').textContent=Math.floor(speed*2.2);
 }else speed=Math.max(speed*.97,play?0:8);
 const v=play?speed:(st=='menu'?10:speed*.5);
 const tgt=LANES[lane];const old=px;px+=(tgt-px)*Math.min(1,dt*9);P.position.x=px;
 const lean=(tgt-px)*-.14;P.rotation.z+=(lean-P.rotation.z)*Math.min(1,dt*10);P.rotation.y=(tgt-px)*-.08;
 const bob=Math.sin(performance.now()*.02)*.02;P.position.y=bob;wF.rotation.x-=v*dt*2.4;wB.rotation.x-=v*dt*2.4;
 rider.rotation.x=-.12-boost*.4;aL.rotation.x=aR.rotation.x=Math.sin(performance.now()*.03)*.03;
 if(inv>0){inv-=dt;P.visible=Math.floor(inv*12)%2==0;if(inv<=0)P.visible=true}
 for(const d of dashes){d.position.z+=v*dt;if(d.position.z>14)d.position.z-=240}
 gtc.setHex(GT);ground.material.color.lerp(gtc,Math.min(1,dt*.8));sea.position.x+=(SEAT-sea.position.x)*Math.min(1,dt*.7);
 for(let i=0;i<scen.length;i++){let o=scen[i];o.position.z+=v*dt;if(o.position.z>14){o.position.z-=LEN;if(!o.userData.p&&o.userData.zz!==zi){rb1(i);o=scen[i]}}o.scale.setScalar(BR.userData.on&&Math.abs(o.position.z-BR.position.z)<40?.001:1)}
 if(BR.userData.on){BR.position.z+=v*dt;if(BR.position.z>60){BR.userData.on=false;BR.visible=false}}
 UBZ.value=BR.position.z;UBH.value=BR.userData.on?1:0;
 // obstacles
 for(const o of OB){if(!o.userData.on)continue;o.position.z+=(v-o.userData.sp)*dt;
  if(o.userData.k=='fk'&&!o.userData.dc&&o.position.z>-2){o.userData.dc=true;const L=px<0;FKO=null;goZone(L?o.userData.zl:o.userData.zr);UC.tg=L?-1.1:1.1;crvT=10}
  if(play&&!o.userData.ps&&o.position.z>1.8){o.userData.ps=true;if(o.userData.t!='pot'&&Math.abs(o.position.x-px)<3.7){combo=Math.min(combo+1,5);comboT=4;mi.n++;nitro=Math.min(100,nitro+12);if(msgT<=0)cm('FRÔLÉ ×'+combo,.5);beep(660,.06)}}
  if(o.userData.t=='moto'||o.userData.t=='car'||o.userData.t=='taxi')o.rotation.z=0;
  if(play&&inv<=0){const hz=o.userData.t=='rb'?11:o.userData.t=='pot'?1.0:o.userData.t=='moto'?1.2:o.userData.t=='cone'?.9:1.9;const hx=o.userData.t=='rb'?2.5:o.userData.t=='car'||o.userData.t=='taxi'?1.35:.95;
   if(Math.abs(o.position.z-P.position.z)<hz+.6&&Math.abs(o.position.x-px)<hx){
    lives--;combo=1;inv=1.6;beep(160,.35,'sawtooth',.1,40);shake=.6;upd();boost=-.3;
    for(let i=0;i<14;i++)fx(px,.6,0,(Math.random()-.5)*8,Math.random()*5,(Math.random()-.5)*6,i%2?0xff7a00:0xffd21f,1.2);
    if(o.userData.t!='rb'){o.userData.on=false;o.visible=false}if(lives<=0){over()}}}
  if(o.position.z>(o.userData.t=='rb'?34:16)){o.userData.on=false;o.visible=false}}
 // pièces
 for(const c of COIN){if(!c.userData.on)continue;c.position.z+=v*dt;c.rotation.y+=dt*5;
  if(play&&Math.abs(c.position.z)<1.3&&Math.abs(c.position.x-px)<1.3){c.userData.on=false;c.visible=false;score+=10*combo;mi.c++;nitro=Math.min(100,nitro+3);beep(880+Math.random()*200,.08,'square',.04);fx(px,1,0,0,3,-2,0xffc400,.7)}
  else if(c.position.z>16){c.userData.on=false;c.visible=false}}
 // riz ayimolou
 if(RICE.userData.on){RICE.position.z+=v*dt;RICE.rotation.y+=dt*2.5;RICE.position.y=1+Math.sin(performance.now()*.006)*.15;
  if(play&&Math.abs(RICE.position.z)<1.6&&Math.abs(RICE.position.x-px)<1.3){lives=Math.min(lives+1,5);score+=50;mi.r++;upd();RICE.userData.on=false;RICE.visible=false;cm('+1 VIE · Riz ayimolou !',1.6);beep(520,.4,'triangle',.08,1040);
   for(let i=0;i<16;i++)fx(px,1,0,(Math.random()-.5)*7,Math.random()*5,(Math.random()-.5)*6,i%2?0xffd21f:0x2ecc71,1)}
  else if(RICE.position.z>16){RICE.userData.on=false;RICE.visible=false}}
 if(msgT>0){msgT-=dt;if(msgT<=0)$('msg').classList.add('hide')}
 // poussière
 if(play&&Math.random()<.7)fx(px+(Math.random()-.5)*.4,.15,1.6,(Math.random()-.5)*1.5,.8+Math.random(),v*.35,0xd8c39a,.8);
 for(const p of FX){if(!p.visible)continue;const u=p.userData;u.l-=dt;if(u.l<=0){p.visible=false;continue}
  p.position.x+=u.vx*dt;p.position.y+=u.vy*dt;p.position.z+=u.vz*dt;p.scale.setScalar(u.s*(1.4-u.l));p.material.opacity=u.l*.8}
 // caméra
 shake=Math.max(0,shake-dt*1.6);const sx=(Math.random()-.5)*shake*.6,sy=(Math.random()-.5)*shake*.6;
 P.scale.setScalar(AV?1.6:1);
 if(AV){C.position.set(px*.5+sx,24+bh()+sy,14+(C.aspect<1?6:0));C.lookAt(px*.4,bh(),-11)}
 else{C.position.set(px*.6+sx,3.7+bh()+sy+(C.aspect<1?1:0),8.2+boost*-.8+(C.aspect<1?2.8:0));C.lookAt(px*.45+UC.value*1.8,1+bh(),-10);C.rotation.z+=P.rotation.z*.45-UC.value*.035}
 C.fov+=((62+(C.aspect<1?14:0)+Math.min(speed,110)*.28+boost*10+(turbo>0?12:0))-C.fov)*Math.min(1,dt*3);C.updateProjectionMatrix();
 const nn=.5-.5*Math.cos(t/100*6.2832);cT.copy(nn<.5?cD:cS).lerp(nn<.5?cS:cN,nn<.5?nn*2:nn*2-1);S.background.copy(cT);S.fog.color.copy(cT);hemi.intensity=.85-nn*.45;sun.intensity=.8-nn*.65;hl.intensity=nn*1.4;sp.intensity=nn*2.5;beamM.opacity=Math.min(.3,nn*.35);
 sun.position.set(px+14,26,10);sun.target.position.set(px,0,-5);
 R.render(S,C)}
upd();loop();
