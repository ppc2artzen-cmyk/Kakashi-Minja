// Writes 4 HyperFrames look tests for one 5.7 s moment. Layer order: footage, words, cutout of the speaker, front text.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "templates", "look-tests");
const DUR = 5.7;

const clip = (id, start, dur, html, cls = "", style = "") =>
  `<div id="${id}" class="clip ${cls}" data-start="${start}" data-duration="${dur}" data-track-index="1" style="${style}">${html}</div>`;

const page = ({ fonts, css, behind, front, js }) => `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>
${fonts.map(([f, file, w, s]) => `@font-face{font-family:"${f}";src:url("assets/fonts/${file}") format("woff2");font-weight:${w};font-style:${s || "normal"}}`).join("\n")}
*{margin:0;padding:0;box-sizing:border-box}
html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#000}
#root{position:relative;width:100%;height:100%;overflow:hidden}
#cam{position:absolute;inset:0;transform-origin:50% 38%}
#cam video{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover}
#base{z-index:1}#cut{z-index:30}
.b{position:absolute;z-index:10}.f{position:absolute;z-index:40}
${css}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
  <div id="cam">
    <video id="base" class="clip" data-start="0" data-duration="${DUR}" data-track-index="0" src="assets/clip.mp4" playsinline data-has-audio="true"></video>
    ${behind}
    <video id="cut" class="clip" data-start="0" data-duration="${DUR}" data-track-index="9" src="assets/cutout.webm" playsinline muted data-layout-allow-occlusion></video>
  </div>
  ${front}
</div>
<script>
const tl=gsap.timeline({paused:true});
${js}
window.__timelines["main"]=tl;tl.seek(0);
</script></body></html>
`;

const looks = {
  // A: giant condensed poster type, yellow on black, hard slams and camera punches.
  "a-billboard": {
    fonts: [["Anton", "anton-latin-400-normal.woff2", 400]],
    css: `
.big{font:400 400px/0.98 "Anton",sans-serif;color:#FFD60A;left:0;right:0;text-align:center;letter-spacing:.005em;text-shadow:0 10px 0 rgba(0,0,0,.28)}
#w1{top:40px}#w2{top:410px}#w3{top:780px}
.rail{left:60px;right:60px;top:1500px;text-align:center;font:400 74px/1.1 "Anton",sans-serif;color:#fff;-webkit-text-stroke:10px #000;paint-order:stroke fill;letter-spacing:.02em}
.rail em{font-style:normal;color:#FFD60A}
#bar{left:-30px;top:1170px;width:1140px;height:270px;background:#FFD60A;transform-origin:0 50%}
#opp{left:0;right:0;top:1178px;text-align:center;font:400 214px/1.17 "Anton",sans-serif;color:#000;letter-spacing:.005em}
#top2{left:0;right:0;top:1040px;text-align:center;font:400 112px/1 "Anton",sans-serif;color:#fff;-webkit-text-stroke:12px #000;paint-order:stroke fill}`,
    behind: clip("w1", 0.35, 2.55, "WORK", "b big") + clip("w2", 0.55, 2.35, "FROM", "b big") + clip("w3", 0.88, 2.02, "HOME", "b big"),
    front: clip("r1", 0.4, 2.5, 'OPPORTUNITY <em>SEARCH</em> KAR RAHE HAIN?', "f rail") +
      clip("top2", 3.9, 1.8, "BAHUT ACCHI", "f") + clip("bar", 4.75, 0.95, "", "f") + clip("opp", 4.9, 0.8, "OPPORTUNITY", "f"),
    js: `
["#w1","#w2","#w3"].forEach((s,i)=>{const t=[.35,.55,.88][i];tl.fromTo(s,{scale:1.9,opacity:0},{scale:1,opacity:1,duration:.2,ease:"power4.out"},t);
tl.fromTo("#cam",{x:0,y:0},{x:i%2?10:-10,y:8,duration:.04,ease:"none"},t+.16);tl.to("#cam",{x:0,y:0,duration:.14,ease:"power2.out"},t+.2);});
tl.fromTo("#cam",{scale:1},{scale:1.1,duration:2.2,ease:"power1.inOut"},.4);
tl.fromTo("#r1",{y:40,opacity:0},{y:0,opacity:1,duration:.22,ease:"power3.out"},.4);
tl.to("#cam",{scale:1.02,duration:.28,ease:"power4.inOut"},2.84);
tl.fromTo("#top2",{y:60,opacity:0},{y:0,opacity:1,duration:.24,ease:"power3.out"},3.9);
tl.to("#cam",{scale:1.14,duration:.3,ease:"power4.out"},4.75);
tl.fromTo("#bar",{scaleX:0},{scaleX:1,duration:.2,ease:"power4.out"},4.75);
tl.fromTo("#opp",{scale:1.5,opacity:0},{scale:1,opacity:1,duration:.2,ease:"power4.out"},4.9);`,
  },

  // B: magazine feel. Big serif italic in warm cream and gold, soft blur-ins, one drawn gold line.
  "b-editorial": {
    fonts: [["Serif", "instrument-serif-latin-400-italic.woff2", 400, "italic"], ["Serif", "instrument-serif-latin-400-normal.woff2", 400], ["Sora", "sora-latin-700-normal.woff2", 700]],
    css: `
#tint{position:absolute;inset:0;z-index:5;background:linear-gradient(180deg,rgba(40,24,8,.58) 0%,rgba(40,24,8,.12) 48%,rgba(20,12,4,.72) 100%)}
.big{font:italic 400 200px/.92 "Serif",serif;color:#F7EBD3;letter-spacing:-.02em;white-space:nowrap}
#w1{left:80px;top:96px}#w2{right:80px;top:96px}#w3{left:0;right:0;top:250px;text-align:center;font-size:400px;color:#E8B93C}
.kick{left:0;right:0;text-align:center;font:700 34px/1 "Sora",sans-serif;letter-spacing:.34em;color:#E8B93C}
#k1{top:1330px}
#s1{left:70px;right:70px;top:1386px;text-align:center;font:400 88px/1.08 "Serif",serif;color:#F7EBD3}
#k2{top:1320px;color:#F7EBD3}
#opp{left:0;right:0;top:1370px;text-align:center;font:italic 400 186px/1 "Serif",serif;color:#E8B93C;letter-spacing:-.02em}
#rule{left:190px;top:1570px;width:700px;height:6px;background:#E8B93C;transform-origin:0 50%}`,
    behind: `<div id="tint"></div>` + clip("w1", 0.35, 2.55, "work", "b big") + clip("w2", 0.55, 2.35, "from", "b big") + clip("w3", 0.88, 2.02, "home", "b big"),
    front: clip("k1", 0.4, 2.5, "OPPORTUNITY", "f kick") + clip("s1", 1.2, 1.7, "search kar rahe hain", "f") +
      clip("k2", 3.9, 1.8, "BAHUT ACCHI", "f kick") + clip("opp", 4.85, 0.85, "opportunity", "f") + clip("rule", 4.85, 0.85, "", "f"),
    js: `
["#w1","#w2","#w3"].forEach((s,i)=>{tl.fromTo(s,{opacity:0,y:50,filter:"blur(22px)"},{opacity:1,y:0,filter:"blur(0px)",duration:.55,ease:"power3.out"},[.35,.55,.88][i]);});
tl.fromTo("#cam",{scale:1.0},{scale:1.06,duration:2.8,ease:"none"},.1);
tl.fromTo("#k1",{opacity:0,letterSpacing:"0.6em"},{opacity:1,letterSpacing:"0.34em",duration:.5,ease:"power3.out"},.4);
tl.fromTo("#s1",{opacity:0,y:24},{opacity:1,y:0,duration:.45,ease:"power3.out"},1.2);
tl.to("#cam",{scale:1.0,duration:.4,ease:"power3.inOut"},2.8);
tl.fromTo("#k2",{opacity:0,letterSpacing:"0.6em"},{opacity:1,letterSpacing:"0.34em",duration:.5,ease:"power3.out"},3.9);
tl.fromTo("#opp",{opacity:0,filter:"blur(18px)",scale:1.08},{opacity:1,filter:"blur(0px)",scale:1,duration:.5,ease:"power3.out"},4.85);
tl.fromTo("#rule",{scaleX:0},{scaleX:1,duration:.55,ease:"power3.inOut"},5.0);`,
  },

  // C: cut paper and stickers. Yellow and cobalt strips, tilted labels, stop-motion steps.
  "c-paper-pop": {
    fonts: [["Bricolage", "bricolage-grotesque-latin-800-normal.woff2", 800]],
    css: `
.strip{position:absolute;z-index:8;left:-60px;width:1200px;clip-path:polygon(0 8%,12% 2%,28% 7%,46% 1%,63% 6%,81% 2%,100% 8%,100% 93%,84% 98%,66% 93%,47% 99%,29% 94%,13% 99%,0 92%)}
#p1{top:150px;height:330px;background:#FFD60A;transform-origin:0 50%}
#p2{top:500px;height:330px;background:#1E3DF5;transform-origin:100% 50%}
.big{font:800 176px/1 "Bricolage",sans-serif;letter-spacing:-.04em;left:0;right:0;text-align:center;white-space:nowrap}
#w1{top:226px;color:#000}#w2{top:520px;color:#fff;font-size:270px}
.stick{font:800 76px/1 "Bricolage",sans-serif;color:#000;background:#fff;padding:18px 34px;border-radius:10px;white-space:nowrap;box-shadow:10px 10px 0 #1E3DF5}
#s1{left:90px;top:1250px}#s2{left:170px;top:1380px;background:#FFD60A;box-shadow:10px 10px 0 #000}
#s3{left:230px;top:1180px;background:#1E3DF5;color:#fff;box-shadow:10px 10px 0 #FFD60A}
#opp{left:70px;top:1320px;font:800 122px/1 "Bricolage",sans-serif;letter-spacing:-.04em;color:#000;background:#FFD60A;padding:26px 36px;border-radius:14px;box-shadow:14px 14px 0 #000;white-space:nowrap}`,
    behind: clip("p1", 0.3, 2.6, "", "strip") + clip("p2", 0.55, 2.35, "", "strip") + clip("w1", 0.38, 2.52, "WORK FROM", "b big") + clip("w2", 0.88, 2.02, "HOME", "b big"),
    front: clip("s1", 1.2, 1.7, "opportunity", "f stick") + clip("s2", 1.75, 1.15, "search kar rahe hain?", "f stick") +
      clip("s3", 3.9, 1.8, "bahut acchi", "f stick") + clip("opp", 4.85, 0.85, "OPPORTUNITY", "f"),
    js: `
const pop=(s,t,r)=>tl.fromTo(s,{scale:.2,rotation:r-18,opacity:0},{scale:1,rotation:r,opacity:1,duration:.25,ease:"steps(4)"},t);
tl.fromTo("#p1",{scaleX:0},{scaleX:1,duration:.25,ease:"steps(5)"},.3);
tl.fromTo("#p2",{scaleX:0},{scaleX:1,duration:.25,ease:"steps(5)"},.55);
tl.fromTo("#w1",{x:-70,opacity:0},{x:0,opacity:1,duration:.2,ease:"steps(4)"},.38);
tl.fromTo("#w2",{x:70,opacity:0},{x:0,opacity:1,duration:.2,ease:"steps(4)"},.88);
pop("#s1",1.2,-4);pop("#s2",1.75,3);pop("#s3",3.9,-5);pop("#opp",4.85,-3);
tl.fromTo("#cam",{scale:1},{scale:1.05,duration:2.6,ease:"steps(16)"},.3);
tl.to("#cam",{scale:1,duration:.2,ease:"steps(4)"},2.9);`,
  },

  // D: dark premium. Footage dimmed, big amber gradient type behind the speaker, glass panels.
  "d-dark-glass": {
    fonts: [["Sora", "sora-latin-800-normal.woff2", 800], ["Grotesk", "space-grotesk-latin-700-normal.woff2", 700]],
    css: `
#dim{position:absolute;inset:0;z-index:5;background:linear-gradient(180deg,rgba(6,6,10,.86) 0%,rgba(6,6,10,.62) 45%,rgba(6,6,10,.9) 100%)}
.big{font:800 248px/.98 "Sora",sans-serif;letter-spacing:-.05em;left:0;right:0;text-align:center;color:#FFC400;background:linear-gradient(180deg,#FFE97A 0%,#FFB300 60%,#FF7A00 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
#w1{top:150px}#w2{top:400px}#w3{top:650px}
.glass{position:absolute;z-index:40;left:90px;right:90px;border-radius:40px;background:rgba(255,255,255,.12);border:2px solid rgba(255,255,255,.4);box-shadow:0 30px 80px rgba(0,0,0,.5);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);padding:36px 44px;color:#fff}
.lab{font:700 34px/1.2 "Grotesk",sans-serif;letter-spacing:.14em;color:#FFC400}
.val{font:800 74px/1.1 "Sora",sans-serif;letter-spacing:-.03em;margin-top:8px}
#g1{top:1330px}#g2{top:1290px}
#fill{height:12px;border-radius:6px;margin-top:24px;background:linear-gradient(90deg,#FFE97A,#FF7A00);transform-origin:0 50%}`,
    behind: `<div id="dim"></div>` + clip("w1", 0.35, 2.55, "WORK", "b big") + clip("w2", 0.55, 2.35, "FROM", "b big") + clip("w3", 0.88, 2.02, "HOME", "b big"),
    front: clip("g1", 1.1, 1.8, '<div class="lab">SEARCH KAR RAHE HAIN</div><div class="val">Opportunity</div>', "glass") +
      clip("g2", 3.9, 1.8, '<div class="lab">BAHUT ACCHI</div><div class="val" id="v2">Opportunity</div><div id="fill"></div>', "glass"),
    js: `
["#w1","#w2","#w3"].forEach((s,i)=>{tl.fromTo(s,{y:120,opacity:0},{y:0,opacity:1,duration:.4,ease:"power4.out"},[.35,.55,.88][i]);});
tl.fromTo("#cam",{scale:1},{scale:1.07,duration:2.5,ease:"power1.inOut"},.3);
tl.fromTo("#g1",{y:90,opacity:0},{y:0,opacity:1,duration:.4,ease:"back.out(1.5)"},1.1);
tl.to("#cam",{scale:1,duration:.32,ease:"power4.inOut"},2.86);
tl.fromTo("#g2",{y:90,opacity:0},{y:0,opacity:1,duration:.4,ease:"back.out(1.5)"},3.9);
tl.fromTo("#fill",{scaleX:0},{scaleX:1,duration:.75,ease:"power2.inOut"},4.8);`,
  },
};

for (const [name, look] of Object.entries(looks)) {
  const dir = join(root, name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), page(look));
}
console.log("wrote", Object.keys(looks).join(", "));
