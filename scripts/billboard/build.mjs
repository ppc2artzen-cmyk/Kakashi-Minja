// Billboard edit of Project 1. Times are written in source seconds and mapped through the cuts.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "..", "..", "templates", "billboard-project1");

// Kept parts of the source. The cut inside each pair of parts is a measured silence, except 16.4 to 25.54.
const KEEP = [[0.74, 7.66], [7.94, 10.98], [11.25, 13.83], [14.11, 16.4], [25.54, 32.2]];
const HOLD = 1.2;
const segs = [];
let acc = 0;
for (const [a, b] of KEEP) { segs.push({ a, b, o: acc }); acc += b - a; }
const SPEECH = +acc.toFixed(3);
const DUR = +(acc + HOLD).toFixed(3);
const m = (t) => {
  for (const s of segs) { if (t < s.a) return +s.o.toFixed(3); if (t <= s.b) return +(s.o + t - s.a).toFixed(3); }
  return SPEECH;
};

let n = 0;
const clip = (id, start, end, html, cls = "") => {
  n++;
  return `<div id="${id}" class="clip ${cls}" data-start="${start.toFixed(3)}" data-duration="${Math.max(0.1, end - start).toFixed(3)}" data-track-index="${n % 8 + 1}">${html}</div>`;
};
const ICON = {
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrow: '<path d="M4 12h15"/><path d="m13 5 7 7-7 7"/>',
  cursor: '<path d="M4 3l7.5 18 2.6-7.4L21.5 11z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/>',
};
const ico = (k, size) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none">${ICON[k]}</svg>`;

// Beat boundaries in output seconds
const B = {
  b1: [0, m(3.42)], b2: [m(3.47), m(7.66)], b3: [m(7.94), m(10.98)], b4: [m(11.25), m(13.83)], b5: [m(14.11), m(16.4)],
  b6: [m(25.54), m(27.27)], b7: [m(27.27), m(30.25)], b8: [m(30.25), DUR],
};

const behind = [
  clip("mo1", m(8.31), B.b3[1], "MONTHLY", "b big sm"), clip("mo2", m(8.61), B.b3[1], "EXPENSES", "b big sm2"),
  clip("w1", m(11.51), B.b4[1], "WORK", "b big"), clip("w2", m(11.67), B.b4[1], "FROM", "b big"), clip("w3", m(11.83), B.b4[1], "HOME", "b big"),
  clip("rays", m(15.87), B.b5[1], "", "b"),
  clip("k1", m(25.61), B.b6[1], "KUCH", "b big huge"), clip("k2", m(26.57), B.b6[1], "NAHI", "b big huge"),
].join("\n");

const check = `<b>${ico("check", 70)}</b>`;
const front = [
  clip("hi", 0, m(2.11), "HELLO GUYS, NAMASTE", "f rail"),
  clip("nbar", m(2.05), B.b1[1], "", "f bar"), clip("nm", m(2.11), B.b1[1], "KRIPA TALREJA", "f barText"),
  clip("agar", B.b2[0], B.b2[1], "AGAR AAP BHI", "f rail topRail"),
  clip("c1", m(4.27), B.b2[1], `${check}OFFICE GOING`, "f chip"), clip("c2", m(5.65), B.b2[1], `${check}COLLEGE STUDENT`, "f chip"), clip("c3", m(6.77), B.b2[1], `${check}HOUSE WIFE`, "f chip"),
  clip("bal", m(9.95), B.b3[1], "BALANCE", "f tag"),
  clip("chart", m(9.5), B.b3[1], '<i id="h1"></i><i id="h2"></i><i id="h3"></i><i id="h4"></i>', "f"),
  clip("sr", m(12.13), B.b4[1], "OPPORTUNITY <em>SEARCH</em> KAR RAHE HAIN?", "f rail"),
  clip("mn", B.b5[0], m(15.17), "MAIN AAPKE LIYE LAYI HOON", "f rail"),
  clip("ba", m(15.17), B.b5[1], "BAHUT ACCHI", "f top2"), clip("obar", m(15.8), B.b5[1], "", "f bar"), clip("opp", m(15.87), B.b5[1], "OPPORTUNITY", "f barText big2"),
  clip("kh", m(26.81), B.b6[1], "KARNA HAI", "f tag"),
  clip("bl", B.b7[0], m(28.61), "BAS LINK PAR", "f rail topRail"),
  clip("phone", B.b7[0], B.b7[1], `<div class="pt">${ico("link", 46)}YOUR LINK</div><div class="fld"><u id="f1"></u></div><div class="fld"><u id="f2"></u></div><div id="btn">CLICK KARIYE</div>`, "f"),
  clip("rip", m(28.61), m(28.61) + 0.55, "", "f"),
  clip("cur", B.b7[0], B.b7[1], `<span>${ico("cursor", 150)}</span>`, "f"),
  clip("ck", m(28.61), m(29.15), "ABHI CLICK KARIYE", "f rail topRail"), clip("ff", m(29.15), B.b7[1], "FORM FILL KARIYE", "f rail topRail"),
  clip("mbar", m(30.63), DUR, "", "f bar"), clip("mv", m(30.63), DUR, `JUST MOVE AHEAD`, "f barText big3"),
  clip("ar", m(30.97), DUR, ico("arrow", 190), "f"),
  clip("cta", SPEECH - 0.1, DUR, "CLICK THE LINK", "f rail"),
].join("\n");

const WHIPS = [B.b3[0], B.b4[0], B.b6[0], B.b8[0]];
const whips = WHIPS.map((t, i) => clip(`whip${i}`, Math.max(0, t - 0.12), t + 0.14, "", "whip")).join("\n");

// Every sound is a different recording. All files are CC0 from the bundled library.
const sfx = [
  [m(2.11), "pop/fs-258269-mouth-pop.ogg", 0.5], [m(4.27), "click/fs788933.ogg", 0.55], [m(5.65), "click/kenney-interface-select-001.ogg", 0.55], [m(6.77), "click/kenney-interface-select-003.ogg", 0.55],
  [B.b3[0] - 0.07, "whoosh/fs-683101-quick-woosh.ogg", 0.5], [m(8.31), "impact/kenney-impact-impactpunch-heavy-000.ogg", 0.4], [m(9.95), "ding/kenney-interface-confirmation-001.ogg", 0.45],
  [B.b4[0] - 0.07, "whoosh/fs810485.ogg", 0.55], [m(11.51), "impact/fs-177242-cinematic-impact.ogg", 1], [m(11.83), "impact/kenney-impact-impactpunch-heavy-001.ogg", 0.5],
  [m(15.17), "pop/fs-447910-plop.ogg", 0.45], [m(15.87), "riser/kenney-digital-powerup1.ogg", 0.5],
  [B.b6[0] - 0.07, "whoosh/fs830856.ogg", 0.5], [m(26.57), "impact/fs745291.ogg", 0.55],
  [B.b7[0], "transition/fs-786514-swoosh-v2.ogg", 0.45], [m(28.61), "click/kenney-interface-click-001.ogg", 0.8], [m(29.15), "typing/fs-416777-digital-typing-wav.ogg", 0.3], [m(29.93), "ding/kenney-interface-confirmation-002.ogg", 0.45],
  [B.b8[0] - 0.07, "whoosh/fs393811.ogg", 0.5], [m(30.97), "pop/fs-824189-pop-in-sfx.ogg", 0.5], [SPEECH, "impact/kenney-impact-impactsoft-heavy-000.ogg", 0.55],
];
if (new Set(sfx.map((s) => s[1])).size !== sfx.length) throw new Error("repeated sound");
const audio = sfx.map(([t, f, v], i) => `<audio id="sfx${i}" class="clip" data-start="${Math.max(0, t).toFixed(3)}" data-track-index="${20 + i}" data-volume="${v}" src="assets/sfx/${f}"></audio>`).join("\n");

const css = `
@font-face{font-family:"Anton";src:url("assets/fonts/anton-latin-400-normal.woff2") format("woff2");font-weight:400}
*{margin:0;padding:0;box-sizing:border-box}
html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#000}
#root{position:relative;width:100%;height:100%;overflow:hidden;font-family:"Anton",sans-serif}
#cam{position:absolute;inset:0;transform-origin:50% 38%}
#cam video{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover}
#base{z-index:1}#cut{z-index:30}
.b{position:absolute;z-index:10}.f{position:absolute;z-index:40}
.big{left:0;right:0;text-align:center;font-weight:400;font-size:400px;line-height:.98;color:#FFD60A;letter-spacing:.005em;text-shadow:0 10px 0 rgba(0,0,0,.28)}
#w1{top:40px}#w2{top:410px}#w3{top:780px}
.sm{font-size:300px;top:90px}.sm2{font-size:250px;top:400px}
.huge{font-size:520px}#k1{top:30px}#k2{top:520px}
#rays{left:-500px;top:-250px;width:2080px;height:2080px;border-radius:50%;background:repeating-conic-gradient(#FFD60A 0 10deg,transparent 10deg 20deg);opacity:.92}
.rail{left:50px;right:50px;top:1500px;text-align:center;font-size:76px;line-height:1.1;color:#fff;-webkit-text-stroke:10px #000;paint-order:stroke fill;letter-spacing:.02em}
.rail em{font-style:normal;color:#FFD60A}
.topRail{top:930px}
.bar{left:-30px;width:1140px;top:1170px;height:260px;background:#FFD60A;transform-origin:0 50%}
.barText{left:0;right:0;top:1180px;text-align:center;color:#000;font-size:190px;line-height:1.22;letter-spacing:.01em}
.big2{font-size:214px;line-height:1.12}.big3{font-size:176px;line-height:1.36}
.chip{left:70px;display:flex;align-items:center;gap:26px;background:#FFD60A;color:#000;font-size:100px;line-height:1.16;padding:14px 40px 14px 18px;letter-spacing:.01em;white-space:nowrap}
.chip b{display:flex;align-items:center;justify-content:center;width:104px;height:104px;background:#000;color:#FFD60A;flex:none}
#c1{top:1040px}#c2{top:1200px}#c3{top:1360px}
.tag{left:0;right:0;text-align:center;top:1110px;color:#000}
#bal,#kh{left:50%;right:auto;background:#FFD60A;font-size:120px;line-height:1.2;padding:4px 44px;white-space:nowrap;margin-left:-250px}
#kh{top:1240px;margin-left:-260px}
#chart{left:190px;width:700px;top:1290px;height:300px;display:flex;align-items:flex-end;gap:30px;padding:30px;background:rgba(0,0,0,.72);border:4px solid #FFD60A}
#chart i{flex:1;background:#FFD60A;height:210px;transform-origin:50% 100%}
.top2{left:0;right:0;top:1040px;text-align:center;font-size:112px;line-height:1;color:#fff;-webkit-text-stroke:12px #000;paint-order:stroke fill}
#phone{left:290px;top:1030px;width:500px;height:640px;background:#fff;border:14px solid #0b0b0b;border-radius:56px;padding:44px 30px 30px;color:#000;box-shadow:0 30px 80px rgba(0,0,0,.45)}
.pt{display:flex;align-items:center;gap:14px;font-size:46px;line-height:1.2;letter-spacing:.02em;margin-bottom:24px}
.fld{height:90px;background:#ececec;margin-bottom:18px;overflow:hidden}.fld u{display:block;height:100%;background:#FFD60A;transform-origin:0 50%}
#btn{background:#000;color:#FFD60A;text-align:center;font-size:62px;line-height:1;padding:34px 8px;margin-top:40px;letter-spacing:.02em}
#rip{left:390px;top:1395px;width:300px;height:300px;border:12px solid #FFD60A;border-radius:50%}
#cur{left:520px;top:1400px;color:#000}#cur span{display:block;color:#000}#cur svg{fill:#fff;filter:drop-shadow(0 8px 10px rgba(0,0,0,.45))}
#ar{left:445px;top:1440px;color:#FFD60A;filter:drop-shadow(0 6px 0 #000)}
#cta{top:1660px}
.whip{position:absolute;z-index:60;left:-80px;top:0;width:1240px;height:1920px;background:#FFD60A}
`;

const js = `
const slam=(s,t)=>{tl.fromTo(s,{scale:1.9,opacity:0},{scale:1,opacity:1,duration:.2,ease:"power4.out"},t);};
const rise=(s,t)=>tl.fromTo(s,{y:44,opacity:0},{y:0,opacity:1,duration:.22,ease:"power3.out"},t);
const barIn=(s,t)=>tl.fromTo(s,{scaleX:0},{scaleX:1,duration:.2,ease:"power4.out"},t);
const shake=(t,a)=>{tl.to("#cam",{x:a,y:a*.8,duration:.04,ease:"none"},t+.12);tl.to("#cam",{x:0,y:0,duration:.16,ease:"power2.out"},t+.16);};
const chip=(s,t)=>tl.fromTo(s,{x:-1100},{x:0,duration:.26,ease:"back.out(1.5)"},t);

// camera
tl.set("#cam",{scale:1},0);
tl.to("#cam",{scale:1.06,duration:${m(2.11).toFixed(3)},ease:"none"},0);
tl.to("#cam",{scale:1.16,duration:.22,ease:"power4.out"},${m(2.11)});
tl.set("#cam",{scale:1},${B.b2[0]});
tl.to("#cam",{scale:1.09,duration:${(B.b2[1] - B.b2[0]).toFixed(3)},ease:"none"},${B.b2[0]});
tl.set("#cam",{scale:1.05},${B.b3[0]});
tl.to("#cam",{scale:1.12,duration:${(B.b3[1] - B.b3[0]).toFixed(3)},ease:"none"},${B.b3[0]});
tl.set("#cam",{scale:1},${B.b4[0]});
tl.to("#cam",{scale:1.1,duration:${(B.b4[1] - B.b4[0]).toFixed(3)},ease:"power1.inOut"},${B.b4[0]});
tl.set("#cam",{scale:1.04},${B.b5[0]});
tl.to("#cam",{scale:1.16,duration:.3,ease:"power4.out"},${m(15.87)});
tl.set("#cam",{scale:1},${B.b6[0]});
tl.to("#cam",{scale:1.08,duration:${(B.b6[1] - B.b6[0]).toFixed(3)},ease:"none"},${B.b6[0]});
tl.set("#cam",{scale:1.03},${B.b7[0]});
tl.set("#cam",{scale:1},${B.b8[0]});
tl.to("#cam",{scale:1.12,duration:${(DUR - B.b8[0]).toFixed(3)},ease:"power1.out"},${B.b8[0]});

// 1 hook
rise("#hi",0);barIn("#nbar",${m(2.05)});slam("#nm",${m(2.11)});shake(${m(2.11)},9);
// 2 who it is for
rise("#agar",${B.b2[0]});chip("#c1",${m(4.27)});chip("#c2",${m(5.65)});chip("#c3",${m(6.77)});
// 3 expenses
slam("#mo1",${m(8.31)});slam("#mo2",${m(8.61)});shake(${m(8.31)},8);
tl.fromTo("#chart",{y:380},{y:0,duration:.3,ease:"power4.out"},${m(9.5)});
[["#h1",.95],["#h2",.5],["#h3",.28],["#h4",.72]].forEach(([s,v])=>{tl.set(s,{scaleY:v},${m(9.5)});tl.to(s,{scaleY:.62,duration:.42,ease:"power3.inOut"},${m(9.95)});});
slam("#bal",${m(9.95)});
// 4 hero: work from home, words land on her voice
slam("#w1",${m(11.51)});shake(${m(11.51)},12);slam("#w2",${m(11.67)});slam("#w3",${m(11.83)});shake(${m(11.83)},10);rise("#sr",${m(12.13)});
// 5 opportunity, the rays arrive with the word
rise("#mn",${B.b5[0]});rise("#ba",${m(15.17)});barIn("#obar",${m(15.8)});slam("#opp",${m(15.87)});
tl.fromTo("#rays",{scale:.2,opacity:0,rotation:0},{scale:1,opacity:.92,rotation:30,duration:.32,ease:"power4.out"},${m(15.87)});
tl.to("#rays",{rotation:60,duration:${(B.b5[1] - m(15.87) - 0.32).toFixed(3)},ease:"none"},${(m(15.87) + 0.32).toFixed(3)});
// 6 nothing to do
slam("#k1",${m(25.61)});slam("#k2",${m(26.57)});shake(${m(26.57)},12);slam("#kh",${m(26.81)});
// 7 the click sets off the form
rise("#bl",${B.b7[0]});
tl.fromTo("#phone",{y:900},{y:0,duration:.34,ease:"power4.out"},${B.b7[0]});
tl.fromTo("#cur",{x:420,y:300},{x:0,y:0,duration:${(m(28.61) - B.b7[0] - 0.08).toFixed(3)},ease:"power3.inOut"},${B.b7[0]});
tl.to("#cur",{scale:.82,duration:.07,ease:"power2.in"},${(m(28.61) - 0.07).toFixed(3)});
tl.to("#cur",{scale:1,duration:.14,ease:"back.out(1.7)"},${m(28.61)});
tl.to("#btn",{scale:.92,duration:.07,ease:"power2.in"},${(m(28.61) - 0.07).toFixed(3)});
tl.to("#btn",{scale:1,duration:.14,ease:"back.out(1.7)"},${m(28.61)});
tl.fromTo("#rip",{scale:.2,opacity:1},{scale:1.5,opacity:0,duration:.55,ease:"power2.out"},${m(28.61)});
rise("#ck",${m(28.61)});rise("#ff",${m(29.15)});
tl.set("#f1",{scaleX:0},0);tl.set("#f2",{scaleX:0},0);
tl.to("#f1",{scaleX:1,duration:.34,ease:"power2.out"},${m(29.15)});tl.to("#f2",{scaleX:1,duration:.34,ease:"power2.out"},${m(29.5)});
// 8 move ahead
barIn("#mbar",${m(30.63)});slam("#mv",${m(30.63)});
tl.fromTo("#ar",{x:-900},{x:0,duration:.3,ease:"power4.out"},${m(30.97)});
tl.to("#ar",{x:260,duration:${(DUR - m(30.97) - 0.3).toFixed(3)},ease:"none"},${(m(30.97) + 0.3).toFixed(3)});
rise("#cta",${(SPEECH - 0.1).toFixed(3)});
// whips carry the eye left across each new idea
${WHIPS.map((t, i) => `tl.fromTo("#whip${i}",{x:1300},{x:-1300,duration:.26,ease:"none"},${Math.max(0, t - 0.12).toFixed(3)});`).join("\n")}
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>${css}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920" data-fps="30">
  <div id="cam">
    <video id="base" class="clip" data-start="0" data-duration="${DUR}" data-track-index="0" src="assets/clip.mp4" playsinline data-has-audio="true"></video>
    ${behind}
    <video id="cut" class="clip" data-start="0" data-duration="${DUR}" data-track-index="9" src="assets/cutout.webm" playsinline muted data-layout-allow-occlusion></video>
  </div>
  ${front}
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
writeFileSync(join(dir, "edit.json"), JSON.stringify({ keep: KEEP, hold: HOLD, duration: DUR, beats: B, sfx: sfx.map(([t, f]) => ({ t, f })) }, null, 1));
console.log(`duration ${DUR}s, ${sfx.length} different sounds, no music`);
console.log(Object.entries(B).map(([k, v]) => `${k} ${v[0].toFixed(2)}-${v[1].toFixed(2)}`).join(" | "));
