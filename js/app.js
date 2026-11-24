const $=s=>document.querySelector(s);
const app=$('#app');
const sh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const josa=(w,a,b)=>{const c=w.charCodeAt(w.length-1);return (c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28)?a:b};
const store={get(k,d){try{const v=localStorage.getItem('kba_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('kba_'+k,JSON.stringify(v))}catch(e){}}};
let S={easy:store.get('easy',false),big:store.get('big',false),sound:store.get('sound',true)};
document.body.classList.toggle('big',S.big);

/* 효과음 */
let AC=null;
function beep(type){if(!S.sound)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const seq={ok:[[660,.08],[880,.12]],no:[[220,.18]],tick:[[520,.04]],end:[[523,.1],[659,.1],[784,.1],[1046,.25]]}[type];let t=AC.currentTime;seq.forEach(([f,d])=>{const o=AC.createOscillator(),g=AC.createGain();o.type=type==='no'?'sawtooth':'triangle';o.frequency.value=f;g.gain.setValueAtTime(.15,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d);t+=d})}catch(e){}}
function confetti(){const c=['#c8922a','#7a2e1f','#2f7d4f','#1f2a44','#f6d78b'];for(let i=0;i<40;i++){const d=document.createElement('div');d.className='confetti';d.style.left=Math.random()*100+'vw';d.style.background=c[i%5];d.style.animationDuration=(1.5+Math.random()*1.5)+'s';d.style.animationDelay=Math.random()*.4+'s';document.body.appendChild(d);setTimeout(()=>d.remove(),3500)}}

let G=null,T=null;
function stop(){clearInterval(T);if(G){clearTimeout(G.to);G.dead=true;cancelAnimationFrame(G.raf)}}

const MODES={
 who:{ic:'🕵️',t:'누구일까요?',d:'힌트 3개로 성경 인물 맞히기'},
 ox:{ic:'⭕',t:'OX 스피드',d:'60초 동안 맞다·틀리다 연타'},
 order:{ic:'⏳',t:'누가 먼저?',d:'두 사람 중 먼저 살았던 인물 고르기'},
 noah:{ic:'🚢',t:'노아의 방주',d:'동물 8종을 짝지어 태우기 · 60초',arc:1,note:'📖 창세기 8장 — 물이 줄어들자 노아가 비둘기를 날려 보냈고, 비둘기는 감람나무 새 잎을 물고 돌아왔어요. 하나님은 무지개로 다시는 홍수로 멸하지 않겠다고 약속하셨어요(9장).',endArt:'noah_dove',credit:'귀스타브 도레, 〈방주에서 날려 보낸 비둘기〉(1866) · 퍼블릭 도메인'},
 brick:{ic:'🧱',t:'인물 블록깨기',d:'벽돌 뒤에 숨은 인물 설명 읽고 맞히기',arc:1},
 sling:{ic:'🪨',t:'다윗의 물맷돌',d:'물맷돌을 당겨 정답 방패 맞히기',arc:1,note:'📖 사무엘상 17장 — 소년 다윗은 시냇가의 매끄러운 돌 다섯 개와 물매로 골리앗을 이겼어요.'}
};
const START={};

function home(){
 stop();G=null;
 const t=D[Math.floor(Date.now()/864e5)%D.length];
 app.innerHTML=`
 <span class="badge">KKUMBAON ARCADE</span>
 <h1>꿈바온 성경 아케이드</h1>
 <div class="sub">꿈바온 디지털도서관 인물대백과로 만든 성경 게임</div>
 <div class="card today"><div class="sub" style="margin:0">📖 오늘의 인물</div>
  <div class="nm">${t.n}</div><div style="font-size:.85em;color:var(--mute)">${t.era} · ${t.ref}</div>
  <div style="margin-top:6px">${t.role}</div></div>
 <h3 style="margin:18px 0 0">🎮 아케이드</h3>
 ${Object.entries(MODES).filter(([k,m])=>m.arc).map(([k,m])=>modeCard(k,m)).join('')}
 <h3 style="margin:18px 0 0">🧠 퀴즈</h3>
 ${Object.entries(MODES).filter(([k,m])=>!m.arc).map(([k,m])=>modeCard(k,m)).join('')}
 <div class="card">
  <div class="toggle"><div><b>쉬운 모드</b><br><small style="color:var(--mute)">보기 2개 · 시간 제한 없음 · 하트 무제한</small></div><button class="sw ${S.easy?'on':''}" data-t="easy" aria-label="쉬운 모드"></button></div>
  <div class="toggle" style="margin-top:14px"><div><b>큰 글씨</b></div><button class="sw ${S.big?'on':''}" data-t="big" aria-label="큰 글씨"></button></div>
  <div class="toggle" style="margin-top:14px"><div><b>효과음</b></div><button class="sw ${S.sound?'on':''}" data-t="sound" aria-label="효과음"></button></div>
 </div>
 <div class="foot">인물 정보 출처: <a href="https://kkumbaon.com/kkumbaon-library/" target="_blank" rel="noopener">꿈바온 디지털 도서관</a> 제1관 인물대백과<br>프로토타입 · 수록 인물 ${D.length}명</div>`;
 app.querySelectorAll('.mode').forEach(e=>e.onclick=()=>START[e.dataset.m]());
 app.querySelectorAll('.sw').forEach(e=>e.onclick=()=>{const k=e.dataset.t;S[k]=!S[k];store.set(k,S[k]);document.body.classList.toggle('big',S.big);home()});
}

function modeCard(k,m){return `<div class="card mode" data-m="${k}"><div class="ic">${m.ic}</div><div><b>${m.t}</b><small>${m.d}</small></div><div class="best">최고<strong>${store.get('best_'+k+(S.easy?'_e':''),0)}</strong></div></div>`}
function hud(){
 const lives=S.easy?'':`<span class="hearts">${'❤️'.repeat(Math.max(G.lives,0))}${'🤍'.repeat(Math.max(3-G.lives,0))}</span>`;
 const prog=G.noProg?'':G.mode==='ox'?(S.easy?`${G.round+1} / ${G.total}`:''):`${Math.min(G.round+1,G.total)} / ${G.total}`;
 return `<div class="hud"><button class="btn ghost" style="padding:6px 12px;font-size:.85em" onclick="home()">✕</button><span>${prog}</span>${lives}<span class="sc">${G.score}</span></div>`;
}

/* ───── 1. 누구일까요? ───── */
function startWho(){G={mode:'who',round:0,total:10,score:0,lives:3,combo:0,correct:0,wrong:[],pool:sh(D).slice(0,10)};nextWho()}
function nextWho(){
 stop();
 if(G.round>=G.total||G.lives<=0)return end();
 const p=G.pool[G.round],n=S.easy?2:4;
 G.cur={p,opts:sh([p,...sh(D.filter(x=>x!==p)).slice(0,n-1)]),stage:S.easy?3:1,lock:false,t:0,max:18};
 drawWho();
 if(!S.easy){T=setInterval(()=>{G.cur.t+=.1;const s=G.cur.t<6?1:G.cur.t<12?2:3;if(s!==G.cur.stage){G.cur.stage=s;beep('tick');drawClues()}const b=$('#bar');if(b)b.style.width=Math.max(0,100-G.cur.t/G.cur.max*100)+'%';if(G.cur.t>=G.cur.max)answerWho(-1)},100)}
}
function drawWho(){
 const c=G.cur;
 app.innerHTML=hud()+(S.easy?'':'<div class="bar"><i id="bar" style="width:100%"></i></div>')+
 `<div class="card"><div class="q">이 사람은 누구일까요?</div><div id="clues"></div></div>
 <div class="opts ${S.easy?'two':''}">${c.opts.map((o,i)=>`<button class="btn" data-i="${i}">${o.n}</button>`).join('')}</div>
 <div class="state" id="st"></div><div id="more"></div>`;
 drawClues();
 app.querySelectorAll('.opts .btn').forEach(b=>b.onclick=()=>answerWho(+b.dataset.i));
}
function drawClues(){
 const c=G.cur,p=c.p,items=[['시대',p.era],['성경',p.ref],['설명',p.role]];
 $('#clues').innerHTML=items.map((x,i)=>i<c.stage?`<div class="clue"><span class="k">힌트${i+1} ${x[0]}</span><span>${x[1]}</span></div>`:`<div class="clue lock"><span class="k">힌트${i+1}</span><span>${i===1?'6초 뒤 공개':'12초 뒤 공개'}</span></div>`).join('');
}
function answerWho(i){
 const c=G.cur;if(c.lock)return;c.lock=true;stop();
 const ok=i>=0&&c.opts[i]===c.p,btns=app.querySelectorAll('.opts .btn');
 btns.forEach((b,k)=>{if(c.opts[k]===c.p)b.classList.add('ok');else if(k===i)b.classList.add('no');else b.classList.add('dim')});
 const st=$('#st');
 if(ok){G.combo++;G.correct++;const base=S.easy?100:[0,300,200,100][c.stage]+Math.round((c.max-c.t)*5);const pts=base*(G.combo>=3?2:1);G.score+=pts;st.className='state g';st.innerHTML=`정답! +${pts}${G.combo>=3?`<span class="combo">🔥 ${G.combo}콤보 ×2</span>`:''}`;beep('ok')}
 else{G.combo=0;if(!S.easy)G.lives--;G.wrong.push(c.p);st.className='state r';st.textContent=i<0?'시간 초과!':'아쉬워요!';beep('no');app.querySelector('.opts').classList.add('shake')}
 c.stage=3;drawClues();
 upd();$('#more').innerHTML=`<div class="info"><b>${c.p.n}</b> · ${c.p.era}<br>${c.p.role}<br><small>📖 ${c.p.ref}</small></div><button class="btn gold" style="width:100%;margin-top:12px" id="nx">다음 ▶</button>`;
 $('#nx').onclick=()=>{G.round++;nextWho()};
 if(!S.easy)G.to=setTimeout(()=>{if(G&&G.cur===c){G.round++;nextWho()}},3200);
}

/* ───── 2. OX 스피드 ───── */
function startOX(){G={mode:'ox',round:0,total:15,score:0,lives:3,combo:0,correct:0,wrong:[],time:60};nextOX();
 if(!S.easy){T=setInterval(()=>{G.time-=.1;const b=$('#bar');if(b)b.style.width=Math.max(0,G.time/60*100)+'%';const tt=$('#tt');if(tt)tt.textContent=Math.ceil(Math.max(0,G.time))+'초';if(G.time<=0){stop();end()}},100)}}
function nextOX(){
 if(S.easy&&G.round>=G.total)return end();
 const p=D[Math.random()*D.length|0],truth=Math.random()<.5;
 const other=sh(D.filter(x=>Math.abs(x.r-p.r)>=2))[0];
 G.cur={p,truth,shown:truth?p:other,lock:false};
 const lives=G.lives;
 app.innerHTML=hud().replace(/<span class="hearts">.*?<\/span>/,'')+(S.easy?'':`<div class="bar"><i id="bar" style="width:${G.time/60*100}%"></i></div><div class="center" style="font-weight:900;color:var(--wine)" id="tt">${Math.ceil(G.time)}초</div>`)+
 `<div class="card"><div class="q">${p.n}${josa(p.n,'은','는')}</div><div class="clue" style="justify-content:center;text-align:center;font-size:1.08em">${G.cur.shown.role}</div><div class="center" style="color:var(--mute)">맞을까요?</div></div>
 <div class="ox"><button class="btn ok" data-v="1">O</button><button class="btn no" data-v="0">X</button></div>
 <div class="state" id="st">${G.combo>=3?`<span class="combo">🔥 ${G.combo}콤보</span>`:''}</div><div id="more"></div>`;
 app.querySelectorAll('.ox .btn').forEach(b=>b.onclick=()=>answerOX(b.dataset.v==='1'));
}
function answerOX(v){
 const c=G.cur;if(c.lock)return;c.lock=true;const ok=v===c.truth,st=$('#st');
 if(ok){G.combo++;G.correct++;const pts=100*(1+Math.floor(G.combo/3));G.score+=pts;st.className='state g';st.innerHTML=`정답! +${pts}${G.combo>=3?`<span class="combo">🔥 ${G.combo}콤보</span>`:''}`;beep('ok')}
 else{G.combo=0;G.wrong.push(c.p);st.className='state r';st.textContent=S.easy?'아쉬워요!':'아쉬워요! -3초';if(!S.easy)G.time-=3;beep('no');app.querySelector('.ox').classList.add('shake')}
 upd();G.round++;
 if(S.easy||!ok){
  $('#more').innerHTML=`<div class="info">${c.truth?'맞아요. ':`이 설명은 <b>${c.shown.n}</b>의 이야기예요. `}<b>${c.p.n}</b>${josa(c.p.n,'은','는')} ${c.p.role}.<br><small>📖 ${c.p.ref}</small></div>`+(S.easy?`<button class="btn gold" style="width:100%;margin-top:12px" id="nx">다음 ▶</button>`:'');
  if(S.easy)$('#nx').onclick=nextOX;else G.to=setTimeout(()=>{if(G&&G.time>0)nextOX()},1800);
 }else G.to=setTimeout(()=>{if(G&&G.time>0)nextOX()},450);
}

/* ───── 3. 누가 먼저? ───── */
function startOrder(){G={mode:'order',round:0,total:10,score:0,lives:3,combo:0,correct:0,wrong:[]};nextOrder()}
function nextOrder(){
 stop();if(G.round>=G.total||G.lives<=0)return end();
 let a,b;do{[a,b]=sh(D).slice(0,2)}while(a.r===b.r);
 G.cur={a,b,lock:false,t:0};
 app.innerHTML=hud()+(S.easy?'':'<div class="bar"><i id="bar" style="width:100%"></i></div>')+
 `<div class="card"><div class="q">누가 먼저 살았을까요?</div><div class="center" style="color:var(--mute);font-size:.9em">성경 역사에서 더 앞선 사람을 누르세요</div></div>
 <div class="duo">${[a,b].map((p,i)=>`<button class="btn" data-i="${i}">${p.n}${S.easy?`<span class="era">${p.era}</span>`:''}</button>`).join('')}</div>
 <div class="state" id="st"></div><div id="more"></div>`;
 app.querySelectorAll('.duo .btn').forEach(x=>x.onclick=()=>answerOrder(+x.dataset.i));
 if(!S.easy)T=setInterval(()=>{G.cur.t+=.1;const bb=$('#bar');if(bb)bb.style.width=Math.max(0,100-G.cur.t*10)+'%';if(G.cur.t>=10)answerOrder(-1)},100);
}
function answerOrder(i){
 const c=G.cur;if(c.lock)return;c.lock=true;stop();
 const first=c.a.r<c.b.r?0:1,ok=i===first,btns=app.querySelectorAll('.duo .btn'),pp=[c.a,c.b];
 btns.forEach((b,k)=>{b.classList.add(k===first?'ok':'no');if(!S.easy)b.innerHTML=`${pp[k].n}<span class="era">${pp[k].era}</span>`});
 const st=$('#st');
 if(ok){G.combo++;G.correct++;const pts=(S.easy?100:100+Math.round((10-c.t)*20))*(G.combo>=3?2:1);G.score+=pts;st.className='state g';st.innerHTML=`정답! +${pts}${G.combo>=3?`<span class="combo">🔥 ${G.combo}콤보 ×2</span>`:''}`;beep('ok')}
 else{G.combo=0;if(!S.easy)G.lives--;G.wrong.push(pp[first],pp[1-first]);st.className='state r';st.textContent=i<0?'시간 초과!':'아쉬워요!';beep('no')}
 upd();$('#more').innerHTML=`<div class="info"><b>${pp[first].n}</b>(${pp[first].era}) → <b>${pp[1-first].n}</b>(${pp[1-first].era})</div><button class="btn gold" style="width:100%;margin-top:12px" id="nx">다음 ▶</button>`;
 $('#nx').onclick=()=>{G.round++;nextOrder()};
 if(!S.easy)G.to=setTimeout(()=>{if(G&&G.cur===c){G.round++;nextOrder()}},2400);
}

/* ───── 결과 ───── */
function end(){
 stop();const k='best_'+G.mode+(S.easy?'_e':''),best=store.get(k,0),nb=G.score>best;if(nb)store.set(k,G.score);
 beep('end');if(nb||G.correct>=7)confetti();
 const uniq=[...new Map(G.wrong.map(p=>[p.n,p])).values()];
 const rt=G.correct/G.total;const msg=rt>=.9?'성경 박사님이세요! 🏆':rt>=.6?'훌륭해요! 👏':rt>=.3?'좋은 출발이에요 🙂':'다시 도전해 볼까요? 💪';
 const m=G.mode;G=null;
 app.innerHTML=`<span class="badge">${MODES[m].t}</span>
 <div class="card center"><div style="color:var(--mute)">최종 점수</div><div class="big-score">${lastScore}</div>
 <div>${nb?'🎉 <b>최고 기록 경신!</b>':`최고 기록 ${best}`}</div><div style="margin-top:8px;font-weight:700">${msg}</div>${MODES[m].endArt?`<img src="assets/art/${MODES[m].endArt}.jpg" alt="" onerror="this.remove()" style="width:100%;border-radius:12px;margin-top:12px;filter:sepia(.25)"><div class="credit">${MODES[m].credit}</div>`:''}${MODES[m].note?`<div class="info" style="text-align:left">${MODES[m].note}</div>`:''}</div>
 ${uniq.length?`<div class="card list"><b style="color:var(--ink)">📚 다시 보면 좋은 인물</b>${uniq.map(p=>`<div class="it"><b>${p.n}</b> · <small>${p.era} · ${p.ref}</small><br>${p.role}</div>`).join('')}</div>`:''}
 <div class="row"><button class="btn gold" style="flex:1" id="again">다시 하기</button><button class="btn ghost" style="flex:1" onclick="home()">처음으로</button></div>`;
 $('#again').onclick=()=>START[m]();
}

Object.assign(START,{who:startWho,ox:startOX,order:startOrder,noah:startNoah,brick:startBrick,sling:startSling});
function add(n){G.score=Math.max(0,G.score+n);upd()}
function cvScreen(pre,post,ratio){
 app.innerHTML=hud()+(pre||'')+`<canvas id="cv" style="width:100%;display:block;border-radius:16px;touch-action:none;user-select:none;box-shadow:0 3px 0 var(--line)"></canvas>`+(post||'')+'<div class="state" id="st"></div><div id="more"></div>';
 const cv=$('#cv'),w=cv.clientWidth,h=Math.round(Math.min(w*ratio,innerHeight*.66)),dpr=window.devicePixelRatio||1;
 cv.style.height=h+'px';cv.width=w*dpr;cv.height=h*dpr;const x=cv.getContext('2d');x.scale(dpr,dpr);x.textAlign='center';x.textBaseline='middle';
 Object.assign(G,{W:w,H:h,cv,x,fx:[]});
 return e=>{const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
}
function loop(fn){G.dead=false;let last=performance.now();const me=G;const f=t=>{if(G!==me||me.dead)return;const dt=Math.min(.04,(t-last)/1000);last=t;fn(dt);if(G===me&&!me.dead)me.raf=requestAnimationFrame(f)};me.raf=requestAnimationFrame(f)}
function drawFx(dt){const x=G.x;G.fx=G.fx.filter(f=>(f.l-=dt)>0);G.fx.forEach(f=>{x.globalAlpha=Math.min(1,f.l*2);x.font='900 '+(f.s||18)+'px Noto Sans KR';x.lineWidth=4;x.strokeStyle='rgba(0,0,0,.45)';x.strokeText(f.t,f.x,f.y);x.fillStyle=f.c;x.fillText(f.t,f.x,f.y);f.y-=dt*30});x.globalAlpha=1}
function wrapText(x,txt,maxW){const out=[];let line='';for(const ch of txt){if(x.measureText(line+ch).width>maxW&&line){out.push(line);line=ch.trim()?ch:''}else line+=ch}if(line)out.push(line);return out}

/* ───── 아케이드 1. 노아의 방주 (v2: 도레 판화 · 승선 명단 · 황금 비둘기 · 물이 차오름) ───── */
const ART={};
function art(k){if(!ART[k]){const i=new Image();i.onload=()=>{i.ok=1};i.src='assets/art/'+k+'.jpg';ART[k]=i}return ART[k].ok?ART[k]:null}
['noah_deluge','noah_dove'].forEach(art);
const ANIM=[['🦁','사자'],['🐘','코끼리'],['🦒','기린'],['🐑','양'],['🐄','소'],['🐫','낙타'],['🐇','토끼'],['🦓','얼룩말']];
function vib(ms){try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}}
function startNoah(){
 stop();G={mode:'noah',dead:true};
 app.innerHTML=`<div class="hud"><button class="btn ghost" style="padding:6px 12px;font-size:.85em" onclick="home()">✕</button><span class="badge">창세기 6~9장</span><span></span></div>
 <div class="hero" style="background-image:linear-gradient(180deg,rgba(20,24,36,.15),rgba(20,24,36,.85)),url(assets/art/noah_deluge.jpg)">
  <div class="hero-t">노아의 방주</div>
  <div class="hero-s">세상이 악해지자 하나님은 큰 홍수를 예고하셨어요. 노아는 말씀대로 방주를 짓고, 짐승들을 암수 한 쌍씩 태웠어요.</div>
 </div>
 <div class="card">
  <div class="rule"><span>👆</span>화면을 좌우로 밀어 방주를 움직여요</div>
  <div class="rule"><span>🦁🦁</span>같은 동물 2마리를 받으면 <b>한 쌍 탑승</b></div>
  <div class="rule"><span>📜</span>8종 모두 태우면 <b>방주 완성 +500</b></div>
  <div class="rule"><span>✨</span>빛나는 비둘기는 <b>+100점, +5초</b></div>
  <div class="rule"><span>⚡</span>번개는 피하세요${S.easy?' (쉬운 모드: 점수만 조금 깎여요)':' — 하트가 줄어요'}</div>
 </div>
 <button class="btn gold" style="width:100%" id="go">🚢 출항하기</button>
 <div class="credit">배경: 귀스타브 도레, 〈대홍수〉(1866) · 퍼블릭 도메인</div>`;
 $('#go').onclick=()=>{beep('tick');playNoah()};
}
function playNoah(){
 G={mode:'noah',noProg:1,round:0,total:8,score:0,lives:3,combo:0,correct:0,wrong:[],time:60,items:[],spawn:.6,bag:{},done:{},ships:1,shake:0,dove:9,parts:[],flash:0};
 const pos=cvScreen('','<div class="center sub" style="margin-top:8px">← 화면을 좌우로 밀어 방주를 움직이세요 →</div>',1.35);
 G.ark=G.tx=G.W/2;
 G.cv.onpointerdown=G.cv.onpointermove=e=>{G.tx=pos(e).x};
 addEventListener('keydown',e=>{if(!G||G.mode!=='noah')return;if(e.key==='ArrowLeft')G.tx-=40;if(e.key==='ArrowRight')G.tx+=40});
 const rain=[...Array(70)].map(()=>({x:Math.random()*G.W,y:Math.random()*G.H,s:.6+Math.random()*.8}));
 const splash=(x0,y0,c)=>{for(let i=0;i<12;i++)G.parts.push({x:x0,y:y0,vx:(Math.random()-.5)*220,vy:-Math.random()*220,l:.6,c})};
 loop(dt=>{
  const{W,H,x}=G;G.time-=dt;if(G.time<=0||G.lives<=0)return finishNoah();
  const el=60-G.time,aw=S.easy?132:104,rise=Math.min(1,el/60)*H*.12,ay=H-62-rise*.5;
  G.tx=Math.max(aw/2,Math.min(W-aw/2,G.tx));G.ark+=(G.tx-G.ark)*Math.min(1,dt*14);
  // 생성
  if((G.spawn-=dt)<=0){G.spawn=Math.max(.34,(S.easy?1.1:.78)-el/140);
   const bolt=Math.random()<(S.easy?.07:.1+el/380);
   let sp;if(!bolt){const need=ANIM.filter(a=>!G.done[a[0]]);sp=(need.length&&Math.random()<.7)?need[Math.random()*need.length|0]:ANIM[Math.random()*ANIM.length|0]}
   G.items.push({e:bolt?'⚡':sp[0],nm:bolt?'':sp[1],bolt,x:26+Math.random()*(W-52),y:-24,v:(S.easy?85:118)+el*(S.easy?1.1:2.6)+Math.random()*40,w:Math.random()*6})}
  if((G.dove-=dt)<=0){G.dove=11+Math.random()*5;G.items.push({e:'🕊️',gold:1,x:30+Math.random()*(W-60),y:-24,v:95,w:0})}
  // 충돌
  G.items.forEach(it=>{it.y+=it.v*dt;it.w+=dt*3;if(it.gold)it.x+=Math.sin(it.w)*40*dt;
   if(!it.done&&it.y>ay-26&&it.y<ay+10&&Math.abs(it.x-G.ark)<aw/2){it.done=1;
    if(it.bolt){if(!S.easy)G.lives--;add(-30);G.fx.push({t:'⚡ 쾅!',x:it.x,y:ay-40,c:'#ff8a7a',l:.9});beep('no');vib(120);G.shake=.35;G.flash=.25;G.combo=0}
    else if(it.gold){G.time+=5;add(100);G.fx.push({t:'✨ 황금 비둘기 +100 · +5초',x:W/2,y:H*.36,c:'#f6d78b',l:1.4,s:19});beep('ok');splash(it.x,ay-20,'#f6d78b')}
    else{G.bag[it.e]=(G.bag[it.e]||0)+1;splash(it.x,ay-14,'#cfe3ff');
     if(G.bag[it.e]%2===0){G.combo++;const pts=60+Math.min(G.combo,5)*10;add(pts);beep('ok');vib(30);
      const first=!G.done[it.e];G.done[it.e]=1;if(first)G.correct++;
      G.fx.push({t:it.e+it.e+' '+it.nm+' 한 쌍 탑승! +'+pts,x:W/2,y:H*.42,c:'#f6d78b',l:1.3,s:18});
      if(ANIM.every(a=>G.done[a[0]])){add(500);G.fx.push({t:'📜 방주 완성! +500',x:W/2,y:H*.3,c:'#fff',l:2,s:26});beep('end');G.done={};G.ships++;G.bag={}}}
     else{add(10);G.fx.push({t:'+10',x:it.x,y:ay-40,c:'#fff',l:.6});beep('tick')}}}});
  G.items=G.items.filter(it=>!it.done&&it.y<H+30);
  // 그리기
  x.save();if(G.shake>0){G.shake-=dt;x.translate((Math.random()-.5)*10,0)}
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1b2236');g.addColorStop(1,'#56688c');x.fillStyle=g;x.fillRect(-10,0,W+20,H);
  const bg=art('noah_deluge');if(bg){const s=Math.max(W/bg.width,H/bg.height);x.globalAlpha=.28;x.filter='sepia(.6)';x.drawImage(bg,(W-bg.width*s)/2,(H-bg.height*s)/2,bg.width*s,bg.height*s);x.filter='none';x.globalAlpha=1}
  if(G.flash>0){G.flash-=dt;x.fillStyle='rgba(255,255,230,'+(G.flash*2)+')';x.fillRect(0,0,W,H)}
  x.strokeStyle='rgba(200,220,255,.4)';x.lineWidth=1.4;const rs=1+el/30;rain.forEach(r=>{r.y+=380*rs*r.s*dt;r.x-=70*dt;if(r.y>H){r.y=-10;r.x=Math.random()*W*1.2}x.beginPath();x.moveTo(r.x,r.y);x.lineTo(r.x-4,r.y+12*r.s);x.stroke()});
  G.items.forEach(it=>{if(it.gold){x.shadowColor='#f6d78b';x.shadowBlur=22}x.font=(it.bolt?36:it.gold?34:32)+'px serif';x.fillText(it.e,it.x,it.y);x.shadowBlur=0});
  // 방주
  const ax=G.ark,bob=Math.sin(performance.now()/400)*2,by=ay+bob;
  x.fillStyle='#d9a441';x.fillRect(ax-aw*.3,by-38,aw*.6,24);x.fillStyle='#3a2410';for(let i=0;i<3;i++)x.fillRect(ax-aw*.2+i*aw*.16,by-31,aw*.07,9);
  x.fillStyle='#7a2e1f';x.beginPath();x.moveTo(ax-aw*.36,by-38);x.lineTo(ax,by-56);x.lineTo(ax+aw*.36,by-38);x.fill();
  x.fillStyle='#8b5a2b';x.beginPath();x.moveTo(ax-aw/2,by-14);x.lineTo(ax+aw/2,by-14);x.lineTo(ax+aw*.38,by+14);x.lineTo(ax-aw*.38,by+14);x.fill();
  x.strokeStyle='#5e3a19';x.lineWidth=2;for(let i=1;i<3;i++){x.beginPath();x.moveTo(ax-aw/2+i*4,by-14+i*9);x.lineTo(ax+aw/2-i*4,by-14+i*9);x.stroke()}
  // 물
  const t=performance.now()/600,wy=ay+10;
  [['rgba(46,110,166,.75)',0],['#245a8c',8]].forEach(([c,o])=>{x.fillStyle=c;x.beginPath();x.moveTo(-10,H);for(let i=-10;i<=W+10;i+=10)x.lineTo(i,wy+o+Math.sin(i/28+t+o)*5);x.lineTo(W+10,H);x.fill()});
  G.parts=G.parts.filter(p=>(p.l-=dt)>0);G.parts.forEach(p=>{p.vy+=600*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;x.globalAlpha=p.l*1.6;x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,3,0,7);x.fill()});x.globalAlpha=1;
  // 상단 HUD + 승선 명단
  x.fillStyle='rgba(0,0,0,.42)';x.fillRect(0,0,W,66);x.font='900 18px Noto Sans KR';x.textAlign='left';x.fillStyle=G.time<10?'#ff8a7a':'#fff';x.fillText('⏱ '+Math.ceil(G.time),12,20);
  x.textAlign='right';x.fillStyle='#f6d78b';x.fillText((G.ships>1?'방주 '+G.ships+'호 · ':'')+Object.keys(G.done).length+'/8쌍',W-12,20);x.textAlign='center';
  const cw=(W-16)/8;ANIM.forEach((a,i)=>{const cx=8+cw*i+cw/2,c=G.bag[a[0]]||0,ok=G.done[a[0]];x.globalAlpha=ok?1:c%2?.75:.28;x.font='22px serif';x.fillText(a[0],cx,46);x.globalAlpha=1;if(ok){x.fillStyle='#7ee08f';x.font='900 11px Noto Sans KR';x.fillText('✓',cx+11,56)}else if(c%2){x.fillStyle='#f6d78b';x.font='900 10px Noto Sans KR';x.fillText('½',cx+11,56)}});
  const ph=el<20?'비가 내리기 시작했어요':el<45?'폭우가 쏟아져요!':'물이 차오르고 있어요!';x.font='12px Noto Sans KR';x.fillStyle='rgba(230,236,248,.8)';x.fillText(ph,W/2,80);
  drawFx(dt);x.restore();
 });
}
function finishNoah(){
 stop();const{W,H,x}=G;
 // 무지개 피날레
 const cols=['#e74c3c','#f39c12','#f1c40f','#2ecc71','#3498db','#3f51b5','#9b59b6'];x.lineWidth=7;cols.forEach((c,i)=>{x.strokeStyle=c;x.globalAlpha=.85;x.beginPath();x.arc(W/2,H*.95,W*.55-i*7,Math.PI,0);x.stroke()});x.globalAlpha=1;
 x.font='900 22px Noto Sans KR';x.fillStyle='#fff';x.strokeStyle='rgba(0,0,0,.5)';x.lineWidth=5;const msg=G.lives<=0?'번개를 너무 많이 맞았어요':'비가 그쳤어요! 🌈';x.strokeText(msg,W/2,H*.45);x.fillText(msg,W/2,H*.45);
 G.to=setTimeout(end,1600);
}

/* ───── 아케이드 2. 인물 블록깨기 ───── */
function startBrick(){G={mode:'brick',round:0,total:3,score:0,lives:3,combo:0,correct:0,wrong:[],pool:sh(D).slice(0,3)};nextBrick()}
function nextBrick(){
 stop();if(G.round>=G.total||G.lives<=0)return end();
 const p=G.pool[G.round],opts=sh([p,...sh(D.filter(q=>q!==p)).slice(0,S.easy?1:3)]);
 G.cur={p,opts,lock:false};
 const pos=cvScreen('',`<div class="opts ${S.easy?'two':''}" style="margin-top:10px">${opts.map((o,i)=>`<button class="btn" data-i="${i}">${o.n}</button>`).join('')}</div><div class="center sub" style="margin-top:8px">화면을 눌러 공 발사 · 일찍 맞힐수록 남은 벽돌만큼 보너스!</div>`,1.05);
 const{W,H}=G,cols=6,rows=5,top=46,bw=(W-16)/cols,bh=26;
 G.bricks=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)G.bricks.push({x:8+c*bw,y:top+r*bh,w:bw-3,h:bh-3,a:1,col:['#7a2e1f','#a0522d','#c8922a','#2f7d4f','#1f5a8a'][r]});
 G.pw=S.easy?120:86;G.px=W/2;G.ball={x:W/2,y:H-40,vx:0,vy:0,stuck:1};G.sp=S.easy?250:330;
 G.x.font='700 16px Noto Sans KR';G.lines=wrapText(G.x,p.role,W-40);
 G.cv.onpointermove=e=>{G.px=pos(e).x};
 G.cv.onpointerdown=e=>{G.px=pos(e).x;if(G.ball.stuck){G.ball.stuck=0;const a=-Math.PI/2+(Math.random()-.5)*.6;G.ball.vx=Math.cos(a)*G.sp;G.ball.vy=Math.sin(a)*G.sp}};
 app.querySelectorAll('.opts .btn').forEach(b=>b.onclick=()=>answerBrick(+b.dataset.i,b));
 loop(dt=>{
  const{x}=G,b=G.ball,py=H-22;G.px=Math.max(G.pw/2,Math.min(W-G.pw/2,G.px));
  if(b.stuck){b.x=G.px;b.y=py-12}else{
   b.x+=b.vx*dt;b.y+=b.vy*dt;
   if(b.x<7){b.x=7;b.vx=Math.abs(b.vx)}if(b.x>W-7){b.x=W-7;b.vx=-Math.abs(b.vx)}if(b.y<7){b.y=7;b.vy=Math.abs(b.vy)}
   if(b.vy>0&&b.y>py-9&&b.y<py+6&&Math.abs(b.x-G.px)<G.pw/2+6){const o=(b.x-G.px)/(G.pw/2),a=-Math.PI/2+o*1.05;G.sp=Math.min(G.sp*1.02,S.easy?320:470);b.vx=Math.cos(a)*G.sp;b.vy=Math.sin(a)*G.sp;beep('tick')}
   for(const k of G.bricks){if(k.a&&b.x>k.x-6&&b.x<k.x+k.w+6&&b.y>k.y-6&&b.y<k.y+k.h+6){k.a=0;const ox=Math.min(Math.abs(b.x-k.x),Math.abs(b.x-k.x-k.w)),oy=Math.min(Math.abs(b.y-k.y),Math.abs(b.y-k.y-k.h));if(ox<oy)b.vx*=-1;else b.vy*=-1;add(10);break}}
   if(b.y>H+10){if(!S.easy){G.lives--;upd();beep('no')}if(G.lives<=0&&!S.easy){G.wrong.push(G.cur.p);return end()}b.stuck=1;G.fx.push({t:S.easy?'다시!':'💔 공을 놓쳤어요',x:W/2,y:H*.6,c:'#ff8a7a',l:1})}
  }
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#fffaf0');g.addColorStop(1,'#efe1bf');x.fillStyle=g;x.fillRect(0,0,W,H);
  // 숨은 글
  x.fillStyle='#2b2118';x.font='700 16px Noto Sans KR';const lh=24,ty=top+rows*bh/2-(G.lines.length-1)*lh/2;G.lines.forEach((l,i)=>x.fillText(l,W/2,ty+i*lh));
  x.font='12px Noto Sans KR';x.fillStyle='#7a6a55';x.fillText(G.cur.p.era+' · '+G.cur.p.ref,W/2,top+rows*bh+14);
  const left=G.bricks.filter(k=>k.a).length;
  G.bricks.forEach(k=>{if(!k.a)return;x.fillStyle=k.col;x.beginPath();x.roundRect?x.roundRect(k.x,k.y,k.w,k.h,5):x.rect(k.x,k.y,k.w,k.h);x.fill();x.fillStyle='rgba(255,255,255,.18)';x.fillRect(k.x+3,k.y+3,k.w-6,4)});
  if(left<G.bricks.length)null;else{}
  x.font='900 14px Noto Sans KR';x.fillStyle='#7a2e1f';x.fillText('남은 벽돌 '+left+' · 보너스 +'+(200+left*15),W/2,20);
  x.fillStyle='#1f2a44';x.beginPath();x.roundRect?x.roundRect(G.px-G.pw/2,py,G.pw,10,5):x.rect(G.px-G.pw/2,py,G.pw,10);x.fill();
  x.fillStyle='#c8922a';x.beginPath();x.arc(b.x,b.y,7,0,7);x.fill();
  if(b.stuck){x.font='700 14px Noto Sans KR';x.fillStyle='#2b2118';x.fillText('👆 눌러서 발사',W/2,H-60)}
  drawFx(dt);
 });
}
function answerBrick(i,btn){
 const c=G.cur;if(c.lock||btn.disabled)return;
 if(c.opts[i]===c.p){c.lock=true;const left=G.bricks.filter(k=>k.a).length,bonus=200+left*15;G.correct++;add(bonus);G.bricks.forEach(k=>k.a=0);G.ball.stuck=1;
  btn.classList.add('ok');app.querySelectorAll('.opts .btn').forEach(b=>{if(b!==btn)b.classList.add('dim')});
  const st=$('#st');st.className='state g';st.textContent='정답! 보너스 +'+bonus;beep('ok');
  $('#more').innerHTML=`<div class="info"><b>${c.p.n}</b> · ${c.p.era}<br>${c.p.role}<br><small>📖 ${c.p.ref}</small></div><button class="btn gold" style="width:100%;margin-top:12px" id="nx">${G.round+1>=G.total?'결과 보기':'다음 인물 ▶'}</button>`;
  $('#nx').onclick=()=>{G.round++;nextBrick()};
 }else{btn.classList.add('no');btn.disabled=true;beep('no');if(!G.wrong.includes(c.p))G.wrong.push(c.p);if(!S.easy){G.lives--;upd();if(G.lives<=0)return end()}const st=$('#st');st.className='state r';st.textContent='아니에요! 벽돌을 더 깨 보세요'}
}

/* ───── 아케이드 3. 다윗의 물맷돌 ───── */
function startSling(){G={mode:'sling',round:0,total:8,score:0,lives:3,combo:0,correct:0,wrong:[],pool:sh(D).slice(0,8)};nextSling()}
function nextSling(){
 stop();if(G.round>=G.total||G.lives<=0)return end();
 const p=G.pool[G.round],opts=sh([p,...sh(D.filter(q=>q!==p)).slice(0,S.easy?1:2)]);
 G.cur={p,lock:false,shots:0};
 const pos=cvScreen(`<div class="card" style="margin:0 0 10px;padding:12px 14px"><small style="color:var(--mute)">🎯 이 사람의 방패를 맞히세요 · ${p.era}</small><div style="font-weight:700;margin-top:4px">${p.role}</div></div>`,'<div class="center sub" style="margin-top:8px">돌을 뒤로 끌었다 놓으면 날아가요</div>',.95);
 const{W,H}=G,O={x:Math.max(85,W*.25),y:H*.66};G.O=O;
 const ys=S.easy?[H*.3,H*.62]:[H*.15,H*.46,H*.76];
 G.tg=opts.map((o,i)=>({p:o,x:W*(S.easy?.78:.72+(i%2)*.12),y0:ys[i],y:ys[i],r:S.easy?34:27,ph:Math.random()*6,amp:S.easy?0:12+G.round*4}));
 G.st={x:O.x,y:O.y,vx:0,vy:0,fly:0};G.drag=0;
 G.cv.onpointerdown=e=>{const q=pos(e);if(!G.st.fly&&!G.cur.lock&&Math.hypot(q.x-G.st.x,q.y-G.st.y)<70){G.drag=1;G.cv.setPointerCapture(e.pointerId)}};
 G.cv.onpointermove=e=>{if(!G.drag)return;const q=pos(e);let dx=q.x-O.x,dy=q.y-O.y;const d=Math.hypot(dx,dy),m=82;if(d>m){dx*=m/d;dy*=m/d}G.st.x=O.x+dx;G.st.y=O.y+dy};
 G.cv.onpointerup=G.cv.onpointercancel=()=>{if(!G.drag)return;G.drag=0;const dx=G.st.x-O.x,dy=G.st.y-O.y;if(Math.hypot(dx,dy)<12){G.st.x=O.x;G.st.y=O.y;return}G.st.vx=-dx*8.2;G.st.vy=-dy*8.2;G.st.fly=1;G.cur.shots++;beep('tick')};
 loop(dt=>{
  const{x}=G,s=G.st,gr=520;
  G.tg.forEach(t=>{if(!t.dead){t.ph+=dt*1.6;t.y=t.y0+Math.sin(t.ph)*t.amp}else{t.y+=t.fv*dt;t.fv+=600*dt}});
  if(s.fly){s.vy+=gr*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;
   for(const t of G.tg){if(!t.dead&&Math.hypot(s.x-t.x,s.y-t.y)<t.r+8){
    if(t.p===G.cur.p){G.cur.lock=true;s.fly=0;const pts=Math.max(100,300-(G.cur.shots-1)*80);G.correct++;add(pts);t.hit=1;G.fx.push({t:'명중! +'+pts,x:t.x,y:t.y-40,c:'#2f7d4f',l:1.2,s:22});beep('ok');
     $('#more').innerHTML=`<div class="info"><b>${G.cur.p.n}</b> · ${G.cur.p.ref}</div><button class="btn gold" style="width:100%;margin-top:12px" id="nx">${G.round+1>=G.total?'결과 보기':'다음 ▶'}</button>`;$('#nx').onclick=()=>{G.round++;nextSling()};
     if(!S.easy)G.to=setTimeout(()=>{if(G&&G.mode==='sling'&&G.cur.lock){G.round++;nextSling()}},2200);
    }else{t.dead=1;t.fv=-120;G.fx.push({t:t.p.n+' 아니에요',x:t.x,y:t.y-40,c:'#b23a2e',l:1});beep('no');if(!G.wrong.includes(G.cur.p))G.wrong.push(G.cur.p);if(!S.easy){G.lives--;upd();if(G.lives<=0)return end()}s.fly=0;s.x=G.O.x;s.y=G.O.y}
    break}}
   if(s.fly&&(s.x>W+30||s.y>H+30||s.x<-30)){s.fly=0;s.x=G.O.x;s.y=G.O.y;G.fx.push({t:'빗나갔어요',x:W/2,y:H*.15,c:'#7a6a55',l:.8})}
  }
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#bfe0f5');g.addColorStop(.7,'#f6e7c1');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle='#d9b779';x.beginPath();x.moveTo(0,H*.8);x.quadraticCurveTo(W*.5,H*.7,W,H*.82);x.lineTo(W,H);x.lineTo(0,H);x.fill();
  
  // 과녁 방패
  G.tg.forEach(t=>{if(t.y>H+60)return;x.save();x.translate(t.x,t.y);if(t.dead)x.rotate(.6);
   x.fillStyle=t.hit?'#2f7d4f':'#7a2e1f';x.beginPath();x.arc(0,0,t.r,0,7);x.fill();x.lineWidth=5;x.strokeStyle='#c8922a';x.stroke();x.fillStyle='#f6d78b';x.beginPath();x.arc(0,0,t.r*.3,0,7);x.fill();
   x.font='900 14px Noto Sans KR';const tw=x.measureText(t.p.n).width+14;x.fillStyle='rgba(31,42,68,.92)';x.fillRect(-tw/2,t.r+4,tw,22);x.fillStyle='#fff';x.fillText(t.p.n,0,t.r+15.5);x.restore()});
  // 물매
  const O=G.O;x.strokeStyle='#5e3a19';x.lineWidth=7;x.lineCap='round';x.beginPath();x.moveTo(O.x,H*.95);x.lineTo(O.x,O.y+30);x.lineTo(O.x-16,O.y);x.moveTo(O.x,O.y+30);x.lineTo(O.x+16,O.y);x.stroke();
  if(!s.fly){x.strokeStyle='#7a2e1f';x.lineWidth=3;x.beginPath();x.moveTo(O.x-16,O.y);x.lineTo(s.x,s.y);x.lineTo(O.x+16,O.y);x.stroke()}
  if(G.drag){const vx=-(s.x-O.x)*8.2,vy=-(s.y-O.y)*8.2,n=S.easy?26:7;x.fillStyle='rgba(43,33,24,.45)';for(let i=1;i<=n;i++){const tt=i*.05;x.beginPath();x.arc(s.x+vx*tt,s.y+vy*tt+gr*tt*tt/2,3,0,7);x.fill()}}
  x.fillStyle='#6b6b6b';x.beginPath();x.arc(s.x,s.y,9,0,7);x.fill();x.fillStyle='#9a9a9a';x.beginPath();x.arc(s.x-3,s.y-3,3,0,7);x.fill();
  if(!s.fly&&!G.drag&&!G.cur.lock&&G.cur.shots===0){x.font='700 13px Noto Sans KR';x.fillStyle='#2b2118';x.fillText('👈 돌을 뒤로 끌어 보세요',O.x+70,O.y+50)}
  drawFx(dt);
 });
}

let lastScore=0;
function upd(){const e=app.querySelector('.hud .sc');if(e&&G)e.textContent=G.score;const h=app.querySelector('.hud .hearts');if(h&&G)h.textContent='❤️'.repeat(Math.max(G.lives,0))+'🤍'.repeat(Math.max(3-G.lives,0))}
const _end=end;end=function(){lastScore=G.score;_end()};
home();
