// Premium Creator final in burgundy. Times are seconds in the raw video, taken from the word timings. No cuts.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "..", "..", "templates", "premium-final");
const DUR = 19.5;

const TAKES = [
  { from: 0, to: 4.233, gains: [0.987, 0.951, 0.943] },
  { from: 4.233, to: 9.5, gains: [1.027, 1.006, 1.02] },
  { from: 9.5, to: 15.033, gains: [1.0625, 1.068, 1.119] },
  { from: 15.033, to: 99, gains: [0.89, 0.862, 0.872] },
];
// Only these parts need the speaker cut out, so words can sit behind him.
const CUTS = [[5.0, 5.95], [7.3, 8.2], [17.6, DUR]];
const PIPS = [[9.44, 11.1], [12.84, 16.78]];

let n = 0;
const clip = (id, a, b, html = "", cls = "") => { n++; return `<div id="${id}" class="clip ${cls}" data-start="${a.toFixed(3)}" data-duration="${(b - a).toFixed(3)}" data-track-index="${n % 8 + 1}">${html}</div>`; };
const RS = `<svg class="rs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3M9 13c6.667 0 6.667-10 0-10"/></svg>`;

const notes = Array.from({ length: 12 }, (_, i) => `<div id="n${i}" class="note" style="left:${(i * 89 + 25) % 1000}px"><span>&#8377;</span></div>`).join("");

const behind = [
  clip("dim", 5.0, 5.95, "", "dimL"),
  clip("ring", 5.08, 5.95, "", "ringGlow"),
  clip("gN", 5.08, 5.95, "MANISH", "giant gNm"),
  clip("mbg", 7.33, 8.2, '<img src="assets/rupee.jpg" alt="" /><div class="tint"></div>', "mBg"),
  clip("notes", 7.33, 8.2, notes, "notes"),
  clip("gL", 7.4, 8.2, `${RS}10 LAKH`, "giant gLk"),
  clip("p1", 7.5, 8.2, '<img src="assets/hand.jpg" alt="" />', "photo mid pa"),
  clip("p2", 7.62, 8.2, '<img src="assets/rupee.jpg" alt="" />', "photo mid pb"),
  clip("gP", 17.7, DUR, "PRO EDIT", "giant gPr"),
].join("\n");

const front = [
  clip("s1", 0, 1.48, "AGAR AAP BHI APNE", "sm one"), clip("c1", 0.96, 1.62, "VIDEOS MEIN", "chip two"),
  clip("stack", 1.6, 4.05, `<div id="k1" class="card"><span class="ic">Aa</span>CAPTION</div><div id="k2" class="card"><span class="ic">&#10022;</span>VFX</div><div id="k3" class="card"><span class="ic wave"><i></i><i></i><i></i><i></i><i></i></span>SOUND EFFECT</div>`, "stack"),
  clip("sL", 3.2, 4.05, "LANA CHAHTE HAIN?", "sm one"),
  clip("s3", 4.08, 4.98, "SO HI GUYS", "sm one"), clip("e1", 4.42, 4.98, "&#128075;", "emoji eW"),
  clip("s4", 5.0, 5.72, "MY NAME IS", "sm one"), clip("c4", 5.36, 5.95, "MANISH", "chip two"),
  clip("s5", 5.88, 7.3, "IT'S MY", "sm one"), clip("c5", 6.2, 7.3, "7TH DAY", "chip two"),
  clip("cal", 6.2, 7.3, '<div class="calT">DAY</div><div class="calN">7</div>', "cal"),
  clip("s6", 7.36, 8.2, "MAKING", "sm one"), clip("c6", 7.92, 8.2, "RUPEES", "chip two"), clip("e2", 7.5, 8.2, "&#128176;", "emoji eM"),
  clip("s7", 8.2, 9.42, "WITH MY", "sm one"), clip("c7", 8.6, 9.42, "COACHING BUSINESS", "chip two"),
  clip("p3", 8.62, 9.42, '<img src="assets/hand.jpg" alt="" />', "photo pc"),
  clip("sadb", 9.44, 11.1, `<img src="assets/blur.jpg" alt="" />`, "sadB"),
  clip("g18", 9.48, 11.1, "18 GHANTE", "giant g18 top"),
  clip("sadp", 9.6, 11.1, `<img src="assets/sad.png" alt="" />`, "sadP"),
  clip("e3", 10.0, 11.1, "&#128553;", "emoji eS"),
  clip("s8", 9.5, 11.1, "YE SKILL BANANE MEIN", "sm one"), clip("c8", 10.3, 11.1, "18 GHANTE LAGE", "chip two"),
  clip("s9", 11.12, 12.84, "BUT AAPKA", "sm one"), clip("c9", 11.74, 12.84, "TIME SAVE", "chip two"),
  clip("clock", 11.3, 12.84, `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="cb"/><circle id="cf" cx="50" cy="50" r="44" class="cf" pathLength="100"/><path id="cm" d="M50 50V16" class="ch"/><path d="M50 50l18 10" class="ch"/></svg>`, "clock"),
  clip("cardbg", 12.84, 16.78, "", "cardBg"),
  clip("ph1", 12.9, 14.86, `<div class="pHead">Comments</div>${[70, 52, 62, 74, 48, 66].map((w, i) => `<div class="line" id="l${i}"><b></b><u style="width:${w}%"></u></div>`).join("")}<div class="input"><span id="typed">SKILLS</span><span>&#10148;</span></div>`, "phone"),
  clip("ph2", 14.86, 16.78, `<div class="pHead">Messages</div><div id="bA" class="bub">SKILLS</div><div id="bB" class="bub me">Yeh rahe saare links</div><div id="lk1" class="lnk"><i></i>Link 1</div><div id="lk2" class="lnk"><i></i>Link 2</div><div id="lk3" class="lnk"><i></i>Link 3</div>`, "phone"),
  clip("s10", 12.86, 14.86, "MUJHE BAS", "sm one"), clip("c10", 13.5, 14.86, "COMMENT KARO", "chip two"),
  clip("s11", 14.88, 16.78, "AAPKI DMS MEIN", "sm one"), clip("c11", 15.76, 16.78, "SAARE LINKS", "chip two"),
  clip("s12", 16.8, DUR, "PHIR AAP BHI EK", "sm one"), clip("c12", 17.68, DUR, "PROFESSIONALLY EDIT", "chip two"),
].join("\n");

const cuts = CUTS.map(([a, b], i) => `<video id="cut${i}" class="clip cut" data-start="${a}" data-duration="${(b - a).toFixed(3)}" data-track-index="${30 + i}" src="assets/cut${i}.webm" playsinline muted data-layout-allow-occlusion></video>`).join("\n");
const pips = PIPS.map(([a, b], i) => `<div class="pipWrap" id="pw${i}"><video id="pip${i}" class="clip pipV" data-start="${a}" data-duration="${(b - a).toFixed(3)}" data-media-start="${a}" data-track-index="${40 + i}" src="assets/clip.mp4" playsinline muted style="top:PIPTOP${i}px"></video></div>`).join("\n");
const WH = [7.33, 9.44, 12.84, 16.78];
const whips = WH.map((t, i) => clip(`whip${i}`, Math.max(0, t - 0.13), t + 0.14, "", "whip")).join("\n");

// Every sound is a different recording. All files are CC0 from the bundled library.
const sfx = [
  [0.96, "pop/fs-258269-mouth-pop.ogg", 0.5], [1.68, "click/fs788933.ogg", 0.5], [2.22, "click/kenney-interface-select-001.ogg", 0.5], [2.8, "click/kenney-interface-select-003.ogg", 0.5],
  [4.44, "pop/fs-447910-plop.ogg", 0.4], [5.08, "impact/kenney-impact-impactpunch-heavy-000.ogg", 0.5], [5.36, "pop/fs-824189-pop-in-sfx.ogg", 0.4], [6.2, "ding/kenney-interface-confirmation-001.ogg", 0.4],
  [7.26, "whoosh/fs-683101-quick-woosh.ogg", 0.5], [7.4, "impact/fs-177242-cinematic-impact.ogg", 1], [7.72, "ding/kenney-interface-glass-001.ogg", 0.6], [7.94, "ding/kenney-interface-glass-002.ogg", 0.6], [8.62, "pop/fs527522.ogg", 0.4],
  [9.37, "whoosh/fs810485.ogg", 0.5], [10.3, "impact/kenney-impact-impactsoft-heavy-001.ogg", 0.6], [11.76, "tick/fs528561.ogg", 0.5], [12.12, "ding/kenney-interface-confirmation-002.ogg", 0.45],
  [12.77, "whoosh/fs830856.ogg", 0.5], [14.14, "typing/fs-416777-digital-typing-wav.ogg", 0.35], [14.86, "transition/fs-786514-swoosh-v2.ogg", 0.4], [15.3, "ding/kenney-interface-confirmation-003.ogg", 0.45], [15.78, "click/kenney-interface-click-001.ogg", 0.45], [16.04, "click/kenney-interface-select-002.ogg", 0.45], [16.26, "tick/fs384187.ogg", 0.45],
  [16.71, "whoosh/fs393811.ogg", 0.5], [17.7, "impact/kenney-impact-impactsoft-heavy-000.ogg", 0.7],
];
if (new Set(sfx.map((s) => s[1])).size !== sfx.length) throw new Error("repeated sound");
const LEVEL = 0.5;
const audio = sfx.map(([t, f, v], i) => { const len = f.startsWith("impact/") ? 0.9 : f.startsWith("typing/") ? 0.6 : 0.5; return `<audio id="sfx${i}" class="clip" data-start="${t}" data-duration="${len}" data-fade-out="0.15" data-track-index="${60 + i}" data-volume="${(v * LEVEL).toFixed(3)}" src="assets/sfx/${f}"></audio>`; }).join("\n");

const css = `
@font-face{font-family:"Anton";src:url("assets/fonts/anton-latin-400-normal.woff2") format("woff2");font-weight:400}
@font-face{font-family:"Sora";src:url("assets/fonts/sora-latin-800-normal.woff2") format("woff2");font-weight:800}
*{margin:0;padding:0;box-sizing:border-box}
html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#000}
#root{position:relative;width:1080px;height:1920px;overflow:hidden}
#cam{position:absolute;inset:0;transform-origin:50% 36%}
#base{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;z-index:1}
.cut{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;z-index:30}
#grade{position:absolute;inset:0;z-index:29;background:radial-gradient(ellipse at 50% 38%,transparent 56%,rgba(16,4,8,.4) 100%),linear-gradient(180deg,transparent 68%,rgba(16,4,8,.5) 100%)}
.dimL{position:absolute;inset:0;z-index:4;background:rgba(34,4,14,.74)}
.ringGlow{position:absolute;z-index:6;left:190px;top:210px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(247,238,221,.34) 0%,rgba(247,238,221,.1) 55%,transparent 72%);border:6px solid rgba(247,238,221,.5)}
.mBg{position:absolute;inset:0;z-index:5}.mBg img{width:100%;height:100%;object-fit:cover;display:block}.tint{position:absolute;inset:0;background:rgba(50,6,20,.76)}
.notes{position:absolute;inset:0;z-index:7}
.note{position:absolute;top:-120px;width:150px;height:76px;background:#E9E2CC;border:4px solid #7E1434;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#7E1434;font:800 44px/1 "Sora",sans-serif}
.giant{position:absolute;z-index:10;left:0;right:0;font-family:"Anton",sans-serif;font-weight:400;line-height:1;white-space:nowrap;display:flex;justify-content:center;align-items:center;gap:8px;letter-spacing:.005em}
.gNm{top:60px;font-size:330px;color:#F7EEDD}.gLk{top:50px;font-size:252px;color:#F7EEDD}.gPr{top:50px;font-size:300px;color:#7E1434}
.g18{top:50px;font-size:236px;color:#F7EEDD}.giant.top{z-index:42}
.rs{height:.72em;width:.72em;flex:none}
.photo{position:absolute;z-index:46;width:380px;height:470px;border-radius:28px;overflow:hidden;border:6px solid #F7EEDD;box-shadow:0 26px 60px rgba(0,0,0,.45)}
.photo img{width:100%;height:100%;object-fit:cover;display:block}
.mid{z-index:20;width:360px;height:440px}.pa{left:-30px;top:640px}.pb{left:730px;top:690px}.pc{left:640px;top:210px}
.sm{position:absolute;z-index:45;left:50px;right:50px;text-align:center;font:800 48px/1.1 "Sora",sans-serif;color:#fff;letter-spacing:.02em;text-shadow:0 3px 14px rgba(0,0,0,.7)}
.one{top:1290px}
.chip{position:absolute;z-index:45;left:50%;top:1356px;font:400 112px/1.18 "Anton",sans-serif;color:#fff;background:#7E1434;padding:6px 38px 10px;border-radius:14px;letter-spacing:.015em;white-space:nowrap;box-shadow:0 18px 40px rgba(40,4,16,.45);border:3px solid rgba(247,238,221,.28);transform-origin:50% 50%}
.emoji{position:absolute;z-index:46;font-size:190px;line-height:1;font-family:"Noto Color Emoji",sans-serif}
.eW{left:90px;top:640px}.eM{left:60px;top:1110px}.eS{left:90px;top:400px;font-size:150px}
.stack{position:absolute;z-index:46;left:150px;right:150px;top:1380px;display:grid;gap:22px}
.card{display:flex;align-items:center;gap:30px;font:800 54px/1 "Sora",sans-serif;color:#fff;padding:24px 30px;border-radius:24px;background:rgba(30,6,14,.62);border:2px solid rgba(247,238,221,.4)}
.ic{display:flex;align-items:center;justify-content:center;width:82px;height:82px;border-radius:18px;background:#F7EEDD;color:#7E1434;font:800 42px/1 "Sora",sans-serif;flex:none;gap:5px}
.wave i{display:block;width:7px;background:#7E1434;border-radius:4px}.wave i:nth-child(1){height:22px}.wave i:nth-child(2){height:48px}.wave i:nth-child(3){height:34px}.wave i:nth-child(4){height:56px}.wave i:nth-child(5){height:26px}
.cal{position:absolute;z-index:46;left:70px;top:150px;width:300px;border-radius:30px;overflow:hidden;background:#F7EEDD;box-shadow:0 24px 50px rgba(0,0,0,.4);text-align:center}
.calT{background:#7E1434;color:#fff;font:800 44px/1 "Sora",sans-serif;padding:20px;letter-spacing:.14em}.calN{font:400 210px/1.12 "Anton",sans-serif;color:#7E1434}
.sadB{position:absolute;inset:0;z-index:40}.sadB img{width:100%;height:100%;object-fit:cover;display:block}
.sadP{position:absolute;z-index:41;left:-260px;top:345px;width:1600px;height:1000px}.sadP img{width:100%;height:100%;object-fit:contain;object-position:center bottom;display:block}
.clock{position:absolute;z-index:46;left:46px;top:900px;width:320px;height:320px;background:rgba(30,6,14,.7);border-radius:50%}
.clock svg{width:100%;height:100%;display:block}.cb,.cf,.ch{fill:none;stroke-linecap:round}.cb{stroke:rgba(247,238,221,.3);stroke-width:7}.cf{stroke:#F7EEDD;stroke-width:7;stroke-dasharray:100;transform:rotate(-90deg);transform-origin:50% 50%}.ch{stroke:#fff;stroke-width:5}
#cm{transform-origin:50% 50%;transform-box:view-box}
.cardBg{position:absolute;inset:0;z-index:40;background:radial-gradient(circle at 50% 30%,#8E1B3D 0%,#4E0B22 58%,#23040F 100%)}
.phone{position:absolute;z-index:44;left:300px;top:150px;width:480px;height:940px;border-radius:64px;background:#fff;border:14px solid #120c0e;padding:66px 26px 26px;box-shadow:0 34px 70px rgba(0,0,0,.5);display:flex;flex-direction:column;gap:20px;color:#111}
.pHead{font:800 38px/1 "Sora",sans-serif;margin-bottom:10px}
.line{display:flex;align-items:center;gap:16px}.line b{width:62px;height:62px;border-radius:50%;background:#dcdcdc;flex:none}.line u{display:block;height:20px;border-radius:10px;background:#e4e4e4;text-decoration:none}
.input{margin-top:auto;display:flex;justify-content:space-between;align-items:center;font:800 42px/1 "Sora",sans-serif;background:#F7EEDD;color:#7E1434;border:4px solid #7E1434;padding:24px 26px;border-radius:999px}
#typed{display:inline-block;overflow:hidden;white-space:nowrap;width:190px}
.bub{align-self:flex-end;background:#e9e9ea;font:800 30px/1.2 "Sora",sans-serif;padding:18px 24px;border-radius:26px}.bub.me{align-self:flex-start;background:#7E1434;color:#fff}
.lnk{display:flex;align-items:center;gap:16px;font:800 28px/1 "Sora",sans-serif;background:#F7EEDD;color:#7E1434;padding:22px;border-radius:20px}.lnk i{width:30px;height:30px;border-radius:50%;background:#7E1434;display:block}
.pipWrap{position:absolute;z-index:47;left:350px;top:1490px;width:380px;height:380px;border-radius:50%;overflow:hidden;border:8px solid #F7EEDD;box-shadow:0 20px 50px rgba(0,0,0,.5)}
.pipV{position:absolute;width:480px;height:853px;left:-50px;max-width:none}
.whip{position:absolute;z-index:60;left:-80px;top:0;width:1240px;height:1920px;background:#7E1434}
`;

const js = `
const ease4="power4.out";
const chip=(s,t)=>tl.fromTo(s,{xPercent:-50,scale:1.5,opacity:0},{xPercent:-50,scale:1,opacity:1,duration:.2,ease:ease4},t);
const sm=(s,t)=>tl.fromTo(s,{y:30,opacity:0},{y:0,opacity:1,duration:.2,ease:"power3.out"},t);
const pop=(s,t,r=0)=>tl.fromTo(s,{scale:.2,rotation:r-18,opacity:0},{scale:1,rotation:r,opacity:1,duration:.26,ease:"back.out(1.6)"},t);
const slam=(s,t)=>tl.fromTo(s,{scale:1.6,opacity:0},{scale:1,opacity:1,duration:.2,ease:ease4},t);
const shake=(t,a)=>{tl.to("#cam",{x:a,y:a*.8,duration:.04,ease:"none"},t+.1);tl.to("#cam",{x:0,y:0,duration:.16,ease:"power2.out"},t+.14);};

// camera: a slow push, reset on each new idea
[[0,1.6,1,1.05],[1.6,4.08,1,1.04],[4.08,5.0,1.02,1.06],[5.0,5.95,1,1.05],[5.95,7.33,1.02,1.07],[7.33,8.2,1,1.04],[8.2,9.44,1.02,1.08],[11.1,12.84,1,1.07],[16.78,19.5,1,1.09]].forEach(([a,b,s0,s1])=>{tl.set("#cam",{scale:s0},a);tl.to("#cam",{scale:s1,duration:b-a,ease:"none"},a);});

sm("#s1",0);chip("#c1",.96);
tl.fromTo("#stack",{y:300,opacity:0},{y:0,opacity:1,duration:.3,ease:ease4},1.6);
[["#k1",1.68],["#k2",2.22],["#k3",2.8]].forEach(([s,t])=>{tl.to(s,{backgroundColor:"#7E1434",borderColor:"#F7EEDD",scale:1.05,duration:.14,ease:"power3.out"},t);tl.to(s,{scale:1,duration:.14,ease:"power2.out"},t+.14);});
sm("#sL",3.2);
sm("#s3",4.08);pop("#e1",4.42,-6);tl.to("#e1",{rotation:12,duration:.18,yoyo:true,repeat:1,ease:"sine.inOut"},4.68);
tl.fromTo("#dim",{opacity:0},{opacity:1,duration:.2,ease:"power2.out"},5.0);
tl.fromTo("#ring",{scale:.6,opacity:0},{scale:1,opacity:1,duration:.3,ease:"back.out(1.5)"},5.08);
slam("#gN",5.08);shake(5.08,8);sm("#s4",5.0);chip("#c4",5.36);
sm("#s5",5.88);chip("#c5",6.2);pop("#cal",6.2,-3);
tl.fromTo("#mbg",{opacity:0},{opacity:1,duration:.1,ease:"none"},7.33);
for(let i=0;i<12;i++){tl.fromTo("#n"+i,{y:0,rotation:(i%2?-1:1)*20},{y:2150,rotation:(i%2?1:-1)*90,duration:.95,ease:"none"},7.33+((i*37)%10)*.025);}
slam("#gL",7.4);shake(7.4,12);pop("#p1",7.5,-7);pop("#p2",7.62,6);pop("#e2",7.5,-6);sm("#s6",7.36);chip("#c6",7.92);
sm("#s7",8.2);chip("#c7",8.6);tl.fromTo("#p3",{x:520,rotation:10},{x:0,rotation:3,duration:.3,ease:ease4},8.62);
tl.fromTo("#sadp",{x:-200,opacity:0},{x:0,opacity:1,duration:.3,ease:ease4},9.6);
tl.fromTo("#sadp",{scale:1},{scale:1.05,duration:1.4,ease:"none"},9.7);
slam("#g18",9.48);pop("#e3",10.0,-6);sm("#s8",9.5);chip("#c8",10.3);
tl.fromTo("#pw0",{scale:0},{scale:1,duration:.26,ease:"back.out(1.5)"},9.6);tl.set("#pw0",{scale:0},11.1);
sm("#s9",11.12);chip("#c9",11.74);pop("#clock",11.3);
tl.fromTo("#cf",{strokeDashoffset:0},{strokeDashoffset:100,duration:1.3,ease:"power2.inOut"},11.4);
tl.fromTo("#cm",{rotation:0},{rotation:-720,duration:1.3,ease:"power2.inOut"},11.4);
tl.fromTo("#ph1",{y:1100},{y:0,duration:.36,ease:ease4},12.9);
for(let i=0;i<6;i++){tl.fromTo("#l"+i,{x:-50,opacity:0},{x:0,opacity:1,duration:.22,ease:"power3.out"},13.05+i*.1);}
tl.fromTo("#typed",{width:0},{width:190,duration:.34,ease:"steps(6)"},14.14);
sm("#s10",12.86);chip("#c10",13.5);
tl.fromTo("#pw1",{scale:0},{scale:1,duration:.26,ease:"back.out(1.5)"},12.96);
tl.fromTo("#ph2",{x:700},{x:0,duration:.28,ease:ease4},14.86);
pop("#bA",15.0);pop("#bB",15.3);
[["#lk1",15.78],["#lk2",16.04],["#lk3",16.26]].forEach(([s,t])=>tl.fromTo(s,{x:-60,opacity:0},{x:0,opacity:1,duration:.22,ease:"back.out(1.4)"},t));
sm("#s11",14.88);chip("#c11",15.76);
tl.set("#pw1",{scale:0},16.78);
sm("#s12",16.8);slam("#gP",17.7);shake(17.7,10);chip("#c12",17.68);
${WH.map((t, i) => `tl.fromTo("#whip${i}",{x:1300},{x:-1300,duration:.27,ease:"none"},${Math.max(0, t - 0.13).toFixed(3)});`).join("\n")}
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>${css}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920" data-fps="30">
  <div id="cam">
    <video id="base" class="clip" data-start="0" data-duration="${DUR}" data-track-index="0" src="assets/clip.mp4" playsinline data-has-audio="true"></video>
    <div id="grade"></div>
    ${behind}
    ${cuts}
  </div>
  ${front}
  ${pips}
  ${whips}
  ${audio}
</div>
<script>
const tl=gsap.timeline({paused:true});
${js}
window.__timelines["main"]=tl;tl.seek(0);
</script></body></html>
`;
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "index.html"), html);
const beats = [[1.2, "b1"], [2.5, "b2"], [4.7, "b3"], [5.55, "b4"], [6.6, "b5"], [7.8, "b6"], [8.95, "b7"], [10.6, "b8"], [12.2, "b9"], [14.5, "b10"], [16.4, "b11"], [18.4, "b12"]];
writeFileSync(join(dir, "plan.json"), JSON.stringify({ takes: TAKES, cuts: CUTS, pips: PIPS, beats, sfx: sfx.map((s) => s[1]), blurAt: 10.5 }, null, 1));
console.log(`${DUR}s, ${sfx.length} different sounds, ${n} timed graphics, no music`);
