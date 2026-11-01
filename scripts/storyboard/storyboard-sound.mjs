// Sound preview for the storyboard page: voice + sound effects + music in sync, no render.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const b64 = (p) => readFileSync(p).toString("base64");

export function buildSound({ voiceFile, previewFile, sfxDir, linesFile, moments }) {
  // Every cue gets its own recording: no sound is used twice. All files here are CC0 (bundled library).
  const dir = (d) => readdirSync(join(sfxDir, d)).filter((f) => f.endsWith(".ogg")).sort().map((f) => `${d}/${f}`);
  const HERO = { riser: "riser/fs-685256-riser-sound-effect-short-wav.ogg", impact: "impact/fs-177242-cinematic-impact.ogg", end: "impact/kenney-impact-impactsoft-heavy-000.ogg",
    dots: "typing/fs-511418-data-reveal-sound.ogg", dots2: "riser/kenney-digital-powerup1.ogg", sixty: "click/fs788933.ogg",
    card1: "ding/kenney-interface-confirmation-001.ogg", card2: "ding/kenney-interface-confirmation-002.ogg", card3: "ding/kenney-interface-confirmation-003.ogg" };
  const WH = ["kit/whoosh.ogg", "transition/fs-786514-swoosh-v2.ogg", "whoosh/fs-683101-quick-woosh.ogg", "whoosh/fs810485.ogg", "whoosh/fs830856.ogg", "whoosh/fs393811.ogg"];
  const taken = new Set([...Object.values(HERO), ...WH]);
  const free = (d) => dir(d).filter((f) => !taken.has(f));
  const popsAll = free("pop");
  const keyPool = popsAll.slice(0, 12);
  const families = [dir("tick"), free("click"), dir("ui-blip"), [...popsAll.slice(12), "kit/pop.ogg"], [...free("ding"), "kit/click.ogg", "kit/tick.ogg"]].map((f) => [...f]);
  const capPool = [];
  while (families.some((f) => f.length)) families.forEach((f) => { if (f.length) capPool.push(f.shift()); });
  let ci = 0, ki = 0, wi = 0;
  const cap = (t) => [t, capPool[ci++], 0.13, "caption"];
  const key = (t) => [t, keyPool[ki++], 0.34, "key word"];
  const wh = (t, g, why) => [t, WH[wi++], g, why];
  const cues = [
    cap(0.22), cap(0.74), key(1.08),
    [1.4, HERO.dots, 0.3, "dots fill"], [1.98, HERO.sixty, 0.45, "60 lands"],
    cap(2.76), cap(3.42), cap(4.66), cap(5.2),
    [6.16, HERO.riser, 0.4, "build-up", "endsAt"], wh(6.09, 0.45, "pill bursts"), [6.16, HERO.impact, 1, "10 LAKH"],
    wh(7.53, 0.4, "pill collapses"), key(7.6),
    cap(8.5), cap(9.38), key(9.82), cap(10.4), cap(11.28), cap(12.16), key(13.2),
    cap(14.44), key(15.64), cap(16.08), cap(16.82), cap(17.8), wh(18.27, 0.25, "graphic enters"),
    [19.0, HERO.card1, 0.3, "card 1"], [19.2, HERO.card2, 0.3, "card 2"], [19.4, HERO.card3, 0.3, "card 3"],
    cap(20.66), key(21.58), cap(22.4), cap(23.56), cap(24.16), key(25.22), cap(25.74), cap(26.24), cap(27.52), cap(28.18),
    cap(29.48), wh(29.85, 0.3, "line draws"), key(29.92), cap(30.88), cap(32.46),
    wh(32.71, 0.25, "line climbs"), key(32.78), cap(33.6), key(36.42),
    wh(37.29, 0.25, "pill returns"), key(37.36), cap(38.2), cap(39.34), cap(40.28), cap(41.34),
    [41.8, HERO.dots2, 0.3, "dots return"], key(42.2), cap(42.98), cap(43.74),
    [44.44, HERO.end, 0.45, "ending"],
  ].map((c) => {
    if (!c[1]) throw new Error("ran out of sounds at " + c[0]);
    return { t: c[0], s: c[1], g: c[2], why: c[3], endsAt: c[4] === "endsAt" };
  });
  const uniq = new Set(cues.map((c) => c.s));
  if (uniq.size !== cues.length) throw new Error(`repeated sounds: ${cues.length} cues, ${uniq.size} unique`);
  console.log(`${cues.length} cues, ${uniq.size} different sounds`);
  const sfxData = Object.fromEntries([...uniq].map((f) => [f, b64(join(sfxDir, f))]));
  const lines = JSON.parse(readFileSync(linesFile, "utf8"));

  const tracks = [
    { id: 1168, name: "Coffee or Tea", by: "Michael Ramir C.", feel: "Positive, modern, electronic", best: true },
    { id: 834, name: "It's Love", by: "Michael Ramir C.", feel: "Warm and uplifting" },
    { id: 702, name: "Pop 09", by: "Grigoriy Nuzhny", feel: "Bright, positive pop" },
    { id: 130, name: "Tech House vibes", by: "Alejandro Magaña", feel: "High energy, about 122 BPM" },
  ];

  const css = `
.studio { display:grid; grid-template-columns:minmax(220px,300px) 1fr; gap:22px; background:var(--panel); border:1px solid var(--line); border-radius:12px; padding:18px; margin-bottom:28px; }
.studio h2 { margin:0 0 4px; }
.studio .note { color:var(--mute); margin:0 0 14px; font-size:13.5px; }
.ctrl { display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:10px; }
.bigbtn { font:700 15px "Segoe UI",sans-serif; background:var(--key); color:#fff; border:0; border-radius:8px; padding:11px 20px; cursor:pointer; }
.bigbtn:focus-visible,.hear:focus-visible { outline:2px solid #fff; outline-offset:2px; }
.clock { font-variant-numeric:tabular-nums; color:var(--mute); }
.scrub { position:relative; margin:4px 0 16px; }
.scrub input { width:100%; margin:0; accent-color:#C84B6E; }
.ticks { position:relative; height:10px; margin-top:2px; }
.ticks i { position:absolute; top:2px; width:2px; height:6px; background:#6d7076; }
.ticks i.big { background:var(--keyT); height:10px; top:0; }
.tracks { display:grid; gap:6px; margin-bottom:14px; }
.tracks label { display:flex; gap:9px; align-items:baseline; padding:7px 10px; border:1px solid var(--line); border-radius:8px; cursor:pointer; }
.tracks label:has(input:checked) { border-color:var(--keyT); }
.tracks input { accent-color:#C84B6E; }
.tracks small { color:var(--mute); display:block; }
.best { color:var(--keyT); font-weight:600; font-size:12px; margin-left:6px; }
.levels { display:grid; grid-template-columns:auto 1fr; gap:6px 12px; align-items:center; max-width:420px; }
.levels input { accent-color:#C84B6E; width:100%; }
.err { color:#ffb37a; font-weight:600; min-height:1.4em; margin:8px 0 0; font-size:13.5px; }
.phone video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:contrast(1.07) saturate(1.14) brightness(.97); }
.cap.plain { top:110cqw; }
.cap.plain .y { display:inline-block; color:#fff; background:var(--key); -webkit-text-stroke:0; padding:0 2.2cqw; border-radius:1.6cqw; }
.cap.plain { animation:capPop .22s cubic-bezier(.3,1.4,.5,1) both; }
@keyframes capPop { from { transform:scale(.8); opacity:0; } to { transform:none; opacity:1; } }
.hear { font:600 13px "Segoe UI",sans-serif; margin-top:9px; background:transparent; color:var(--keyT); border:1px solid var(--keyT); border-radius:6px; padding:5px 10px; cursor:pointer; }
.card.now { outline:2px solid var(--keyT); outline-offset:-2px; }
@media (max-width:640px) { .studio { grid-template-columns:1fr; } .studio .phone { max-width:240px; margin:0 auto; } }
`;

  const html = `
<section class="studio" aria-label="Sound preview">
  <div class="phone live" id="livePhone"><video id="vid" muted playsinline preload="auto" src="data:video/mp4;base64,${b64(previewFile)}"></video><div class="vig"></div><div id="liveOver"></div></div>
  <div>
    <h2>Hear it before we render</h2>
    <p class="note">Your real video and voice with the sound effects and music playing live. The video here is low quality on purpose, and it doesn't have the jump cuts yet. The real render will be sharp.</p>
    <div class="ctrl"><button class="bigbtn" id="go" type="button">&#9654; Play preview</button><span class="clock" id="clock">0:00 / 0:45</span></div>
    <div class="scrub"><input id="seek" type="range" min="0" max="45.3" step="0.05" value="0" aria-label="Video position" /><div class="ticks" id="ticks"></div></div>
    <h2 style="font-size:15px">Background music</h2>
    <div class="tracks" id="tracks">
      ${tracks.map((t) => `<label><input type="radio" name="trk" value="${t.id}"${t.best ? " checked" : ""} /><span>${t.name}${t.best ? '<span class="best">My pick</span>' : ""}<small>${t.feel}, by ${t.by}</small></span></label>`).join("")}
      <label><input type="radio" name="trk" value="0" /><span>No music<small>Add a trending sound yourself inside Instagram</small></span></label>
    </div>
    <div class="levels">
      <label for="mVol">Music</label><input id="mVol" type="range" min="0" max="0.5" step="0.01" value="0.14" />
      <label for="sVol">Sound effects</label><input id="sVol" type="range" min="0" max="1.5" step="0.05" value="1" />
    </div>
    <p class="err" id="err" role="status"></p>
  </div>
</section>`;

  const script = `
const CUES=${JSON.stringify(cues)};
const SFX=${JSON.stringify(sfxData)};
const LINES=${JSON.stringify(lines)};
const MOMENTS=${JSON.stringify(moments)};
const VOICE=new Audio("data:audio/mpeg;base64,${b64(voiceFile)}");
VOICE.preload="auto";
const music=new Audio(); music.preload="none"; music.loop=true;
const $=(i)=>document.getElementById(i);
const vid=$("vid"), over=$("liveOver"), seek=$("seek"), go=$("go"), clock=$("clock"), err=$("err");
const END=45.34; let ctx,buf={},sfxGain,playing=false,next=0,cur="",timer=0;
const fmt=(t)=>Math.floor(t/60)+":"+String(Math.floor(t%60)).padStart(2,"0");
$("ticks").innerHTML=CUES.map(c=>'<i class="'+(c.g>=0.4?"big":"")+'" style="left:'+(c.t/45.3*100)+'%"></i>').join("");
async function setup(){
  if(ctx) return; ctx=new (window.AudioContext||window.webkitAudioContext)();
  sfxGain=ctx.createGain(); sfxGain.gain.value=+$("sVol").value; sfxGain.connect(ctx.destination);
  await Promise.all(Object.entries(SFX).map(async([k,d])=>{const a=Uint8Array.from(atob(d),c=>c.charCodeAt(0)).buffer; buf[k]=await ctx.decodeAudioData(a);}));
  CUES.forEach(c=>{ if(c.endsAt) c.t=Math.max(0,c.t-buf[c.s].duration); });
  CUES.sort((a,b)=>a.t-b.t);
}
function fire(c,off){ const n=ctx.createBufferSource(), g=ctx.createGain(); n.buffer=buf[c.s]; g.gain.value=c.g; n.connect(g).connect(sfxGain); n.start(0,off||0); }
function point(t){ next=CUES.findIndex(c=>c.t>=t); if(next<0) next=CUES.length; }
function setMusic(){
  const id=+document.querySelector('input[name=trk]:checked').value; err.textContent="";
  if(!id){ music.pause(); music.removeAttribute("src"); return; }
  const u="https://assets.mixkit.co/music/"+id+"/"+id+".mp3";
  if(music.dataset.u!==u){ music.dataset.u=u; music.src=u; music.load(); }
  music.volume=+$("mVol").value;
  if(playing){ const go2=()=>{try{music.currentTime=VOICE.currentTime}catch(e){} music.play().catch(fail)}; music.readyState>0?go2():music.addEventListener("loadedmetadata",go2,{once:true}); }
}
const fail=()=>{ if(music.getAttribute("src")) err.textContent="The music couldn't load here. Voice and sound effects still play."; };
music.addEventListener("error",fail);
function moment(t){ return MOMENTS.findIndex(m=>t>=m.at&&t<m.end); }
function lineAt(t){ return LINES.findIndex(l=>t>=l.start&&t<l.end); }
function paint(t){
  const m=moment(t), key=m>=0?"m"+m:"l"+lineAt(t);
  if(key===cur) return; cur=key;
  document.querySelectorAll(".card.now").forEach(c=>c.classList.remove("now"));
  if(m>=0){ over.innerHTML=MOMENTS[m].over; document.querySelectorAll(".card")[m].classList.add("now");
    setTimeout(()=>{ if(cur===key) over.getAnimations({subtree:true}).forEach(a=>{a.pause(); a.currentTime=Math.max(a.currentTime,1400);}); },900);
  } else { const l=LINES[lineAt(t)]; if(!l){over.innerHTML="";return;}
    over.innerHTML='<div class="cap plain">'+l.text.toUpperCase().split(" ").map((w,i)=>'<span class="'+(i===l.hi?"y":"")+'">'+w+"</span>").join(" ")+"</div>"; }
}
function tick(){
  if(!playing) return;
  const t=VOICE.currentTime;
  while(next<CUES.length&&CUES[next].t<=t){ fire(CUES[next]); next++; }
  if(Math.abs(vid.currentTime-t)>0.25) vid.currentTime=t;
  if(music.src&&!music.paused){ const f=t>END-2?Math.max(0,(END-t)/2):1; music.volume=+$("mVol").value*f; }
  seek.value=t; clock.textContent=fmt(t)+" / 0:45"; paint(t);
  if(t>=END-0.05||VOICE.ended){ stop(); }
}
async function start(){ await setup(); await ctx.resume(); playing=true; go.innerHTML="&#10074;&#10074; Pause";
  point(VOICE.currentTime); vid.currentTime=VOICE.currentTime; await VOICE.play(); vid.play().catch(()=>{}); setMusic(); clearInterval(timer); timer=setInterval(tick,30); }
function stop(){ playing=false; clearInterval(timer); go.innerHTML="&#9654; Play preview"; VOICE.pause(); vid.pause(); music.pause(); }
go.addEventListener("click",()=>{ playing?stop():start().catch(e=>{err.textContent="Preview couldn't start: "+e.message;stop();}); });
function jump(t){ VOICE.currentTime=t; vid.currentTime=t; seek.value=t; if(ctx) point(t); clock.textContent=fmt(t)+" / 0:45"; paint(t); if(playing&&music.src){try{music.currentTime=t}catch(e){}} }
seek.addEventListener("input",()=>jump(+seek.value));
document.querySelectorAll('input[name=trk]').forEach(r=>r.addEventListener("change",setMusic));
$("mVol").addEventListener("input",()=>{music.volume=+$("mVol").value});
$("sVol").addEventListener("input",()=>{if(sfxGain) sfxGain.gain.value=+$("sVol").value});
document.querySelectorAll(".hear").forEach(b=>b.addEventListener("click",()=>{ jump(Math.max(0,+b.dataset.at-0.8)); $("livePhone").scrollIntoView({behavior:"auto",block:"center"}); if(!playing) go.click(); }));
paint(0);
`;
  return { css, html, script, cues, lines };
}
