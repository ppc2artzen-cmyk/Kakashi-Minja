// Highlighter Pop storyboard for one video: real frames, overlays, and a live sound preview. No render needed.
// Usage: node make-highlighter-pop.mjs <framesDir> <font800.woff2> <preview.mp4> <voice.mp3> <sfxDir> <out.html>
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [, , framesDir, fontFile, previewFile, voiceFile, sfxDir, outFile] = process.argv;
const b64 = (p) => readFileSync(p).toString("base64");
const img = (t) => `data:image/jpeg;base64,${b64(join(framesDir, `t_${t}.jpg`))}`;

const ICONS = {
  check: '<path d="M20 6 9 17l-5-5"/>',
  star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1z"/>',
  home: '<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/>',
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  pointer: '<path d="M4 4l7 17 2.5-7L21 11.5z"/>',
};
const ico = (n) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
const cap = (words, top = 110, size = 10) =>
  `<div class="cap" style="top:${top}cqw;font-size:${size}cqw">` +
  words.map((w, i) => { const k = w.startsWith("*"); return `<span class="w${k ? " k" : ""}" style="--i:${i}">${k ? w.slice(1) : w}</span>`; }).join(" ") + "</div>";
const hl = (text, top, size = 9, extra = "") => `<div class="hl" style="top:${top}cqw;font-size:${size}cqw">${text}${extra}</div>`;
const stock = (label, cls, style = "") => `<div class="stock ${cls}" style="${style}"><span>${label}</span></div>`;

const beats = [
  { t: "2.4", at: 0.37, end: 3.42, says: "Hello guys, namaste, Kripa Talreja this side", fx: "Kinetic type",
    over: cap(["HELLO", "GUYS,", "NAMASTE"], 96, 9) + hl("KRIPA TALREJA", 118, 8.5),
    move: "A yellow highlighter wipes across, and the name slides out of it.", sound: "Soft pop" },
  { t: "6.9", at: 3.47, end: 7.6, says: "Agar aap bhi office going person hain, college student hain, ya house wife hain", fx: "Checklist + Polaroid",
    over: `<div class="checks">${["OFFICE GOING", "COLLEGE STUDENT", "HOUSE WIFE"].map((x, i) => `<div class="chk" style="--i:${i}"><b>${ico("check")}</b>${x}</div>`).join("")}</div>` +
      stock("Stock: office", "pola", "--r:-7deg;left:6cqw;top:12cqw") + stock("Stock: student", "pola", "--r:5deg;left:36cqw;top:6cqw") + stock("Stock: at home", "pola", "--r:-3deg;left:66cqw;top:13cqw"),
    move: "A check ticks on each word as she says it. Three small photo cards drop in at the top.", sound: "3 different clicks", flag: "Stock photos waiting for your API key" },
  { t: "8.6", at: 7.65, end: 10.9, says: "Aur apne monthly expenses ko acche se balance karne ke liye", fx: "Glass widget",
    over: hl("MONTHLY EXPENSES", 104, 7.6) + `<div class="glass"><i style="--h:82%"></i><i style="--h:60%"></i><i style="--h:44%"></i><i style="--h:60%"></i></div>` + cap(["*BALANCE"], 151, 8),
    move: "A glass panel rises with bars that even out on the word balance. The bars are illustration only.", sound: "Whoosh, then a soft ding", flag: "Illustration, no real data" },
  { t: "12.0", at: 10.91, end: 13.8, says: "Koi work from home opportunity search kar rahe hain", fx: "Zoom through (one hero moment)",
    over: `<div class="flood"><div class="slam">WORK<br/>FROM HOME</div><div class="slamI">${ico("home")}</div>${stock("Stock: laptop at home", "wide")}</div>`,
    move: "A yellow screen bursts in and the words slam down. It only happens once, so it feels big.", sound: "Riser, whoosh, then the biggest impact", flag: "Stock clip waiting for your API key" },
  { t: "15.4", at: 13.83, end: 16.6, says: "Toh main aapke liye layi hoon ek bahut acchi opportunity", fx: "Kinetic type",
    over: cap(["BAHUT", "ACCHI"], 96, 8) + hl("OPPORTUNITY", 110, 9.6) + `<div class="stars">${ico("star")}${ico("star")}${ico("star")}</div>`,
    move: "Yellow block slides up, and stars pop beside it one by one.", sound: "Pop, and a small sparkle" },
  { t: "18.4", at: 16.73, end: 19.6, says: "Jahan pe aap ghar pe baithe, 2-3 ghanta de ke", fx: "Timeline",
    over: `<div class="ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" class="bg"/><circle cx="50" cy="50" r="42" class="fg" pathLength="100"/></svg><strong>2-3</strong><em>GHANTA</em></div>` + cap(["GHAR", "PE", "*BAITHE"], 94, 8),
    move: "A clock ring fills as she says the hours.", sound: "Fast tick, then a click" },
  { t: "20.6", at: 19.67, end: 23.2, says: "Monthly 10-20K tak ka generate kar sakte hain", fx: "Plain caption only",
    over: cap(["MONTHLY", "10-20K", "TAK"], 110, 8.6),
    move: "Plain white caption, with no highlight and no money graphics, on purpose.", sound: "None", flag: "Income claim: please confirm this line first" },
  { t: "24.0", at: 23.25, end: 25.0, says: "Which is a great great opportunity, right?", fx: "Breather",
    over: cap(["GREAT", "*OPPORTUNITY"], 110, 8.6),
    move: "Slow push-in on her face. This quiet moment sets up the call to action.", sound: "Very quiet tick" },
  { t: "26.4", at: 25.06, end: 27.2, says: "Toh aapko kuch nahi karna hai", fx: "Kinetic type",
    over: cap(["KUCH", "*NAHI", "KARNA"], 110, 10),
    move: "Words light up one at a time, and the framing changes slightly on the cut.", sound: "Soft pop" },
  { t: "28.8", at: 27.27, end: 30.2, says: "Bas diye gaye link par abhi click kariye, apna form fill kariye", fx: "Phone mockup",
    over: `<div class="ph"><div class="ph-t">Your link</div><div class="ph-f"></div><div class="ph-f"></div><div class="ph-b">CLICK KARIYE</div><div class="ptr">${ico("pointer")}</div></div>`,
    move: "A phone rises, a pointer taps the button on the word click, and the form fills. It shows a generic form.", sound: "Whoosh, tap, soft ding", flag: "Illustration: send the real link page if you have it" },
  { t: "31.0", at: 30.25, end: 34.0, says: "And just move ahead", fx: "Ending",
    over: hl("JUST MOVE AHEAD", 104, 7, ico("arrow")) + `<div class="cta">Click the link</div>`,
    move: "The yellow block returns, an arrow pushes right, and it holds about 1.5 s longer to read.", sound: "Whoosh, gentle impact" },
];

// Every cue gets its own recording. All of these files are CC0.
const dir = (d) => readdirSync(join(sfxDir, d)).filter((f) => f.endsWith(".ogg")).sort().map((f) => `${d}/${f}`);
const pops = dir("pop"), clicks = dir("click"), dings = dir("ding"), whooshes = ["kit/whoosh.ogg", "whoosh/fs-683101-quick-woosh.ogg", "whoosh/fs810485.ogg", "whoosh/fs830856.ogg", "whoosh/fs393811.ogg"];
const cues = [
  [2.11, pops[0], 0.34], [4.27, clicks[0], 0.34], [5.65, clicks[1], 0.34], [6.77, clicks[2], 0.34],
  [7.6, whooshes[0], 0.3], [9.95, dings[0], 0.28],
  ["riser", "riser/fs-685256-riser-sound-effect-short-wav.ogg", 0.34], [11.26, whooshes[1], 0.45], [11.33, "impact/fs-177242-cinematic-impact.ogg", 1],
  [13.8, whooshes[2], 0.3], [15.87, pops[1], 0.34], [16.2, dings[1], 0.2],
  [18.29, "tick/fs528561.ogg", 0.2], [18.81, clicks[3], 0.3], [24.0, "tick/fs384187.ogg", 0.1], [26.57, pops[2], 0.28],
  [27.2, whooshes[3], 0.3], [28.61, clicks[4], 0.45], [29.43, dings[2], 0.28], [30.25, whooshes[4], 0.3], [32.2, "impact/kenney-impact-impactsoft-heavy-000.ogg", 0.4],
].map(([t, s, g]) => ({ t, s, g, endsAt: t === "riser" }));
if (new Set(cues.map((c) => c.s)).size !== cues.length) throw new Error("repeated sound");
for (const c of cues) if (c.endsAt) c.t = 11.33;
const sfx = Object.fromEntries(cues.map((c) => [c.s, b64(join(sfxDir, c.s))]));
const tracks = [
  { id: 1168, name: "Coffee or Tea", feel: "Positive, modern", best: true },
  { id: 702, name: "Pop 09", feel: "Bright, positive pop" },
  { id: 130, name: "Tech House vibes", feel: "High energy, about 122 BPM" },
];

const css = `
@font-face{font-family:"Mont";src:url(data:font/woff2;base64,${b64(fontFile)}) format("woff2");font-weight:800}
:root{--bg:#111214;--panel:#1b1d21;--ink:#f2f2f0;--mute:#a6a8ad;--line:#2c2f34;--key:#FFD60A}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 "Segoe UI",system-ui,sans-serif}
main{max-width:1280px;margin:0 auto;padding:28px 16px 60px}
h1{font:800 30px/1.15 "Mont","Segoe UI",sans-serif;margin:0 0 6px}h2{font:800 19px/1.2 "Mont","Segoe UI",sans-serif;margin:34px 0 12px}
.sub{color:var(--mute);margin:0 0 20px;max-width:72ch}
.studio{display:grid;grid-template-columns:minmax(220px,300px) 1fr;gap:22px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:18px;margin-bottom:24px}
.studio h2{margin:0 0 4px}.note{color:var(--mute);margin:0 0 14px;font-size:13.5px}
.btn{font:700 15px "Segoe UI",sans-serif;background:var(--key);color:#000;border:0;border-radius:8px;padding:11px 20px;cursor:pointer}
.btn:focus-visible,.hear:focus-visible{outline:2px solid #fff;outline-offset:2px}
.ctrl{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:10px}.clock{font-variant-numeric:tabular-nums;color:var(--mute)}
input[type=range]{width:100%;accent-color:var(--key)}
.ticks{position:relative;height:10px;margin:2px 0 14px}.ticks i{position:absolute;top:0;width:2px;height:10px;background:var(--key)}
.tracks{display:grid;gap:6px;margin-bottom:12px}.tracks label{display:flex;gap:9px;align-items:baseline;padding:7px 10px;border:1px solid var(--line);border-radius:8px;cursor:pointer}
.tracks label:has(input:checked){border-color:var(--key)}.tracks input{accent-color:var(--key)}.tracks small{color:var(--mute);display:block}
.best{color:var(--key);font-weight:600;font-size:12px;margin-left:6px}
.levels{display:grid;grid-template-columns:auto 1fr;gap:6px 12px;align-items:center;max-width:420px}
.err{color:#ffb37a;font-weight:600;min-height:1.4em;margin:8px 0 0;font-size:13.5px}
.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:8px}
.fact{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px 14px}.fact b{display:block;color:var(--key);margin-bottom:2px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:12px;overflow:hidden}.card.now{outline:2px solid var(--key);outline-offset:-2px}
.meta{padding:12px 14px 14px;font-size:13.5px}.meta p{margin:6px 0 0;color:var(--mute)}.meta p b{color:var(--ink);font-weight:600}
.row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.num{background:var(--key);color:#000;font-weight:700;border-radius:5px;padding:0 7px}.time{color:var(--mute);font-variant-numeric:tabular-nums}.type{font-weight:600}
.says{color:var(--ink)!important;font-style:italic}.flag{color:#ffb37a!important;font-weight:600}
.hear{font:600 13px "Segoe UI",sans-serif;margin-top:9px;background:transparent;color:var(--key);border:1px solid var(--key);border-radius:6px;padding:5px 10px;cursor:pointer}
table{width:100%;border-collapse:collapse;font-size:14px}td,th{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}th{color:var(--mute);font-weight:600}.wrap{overflow-x:auto}

.phone{position:relative;aspect-ratio:9/16;container-type:inline-size;overflow:hidden;background:#000}
.phone img,.phone video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:contrast(1.06) saturate(1.1)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,transparent 58%,rgba(0,0,0,.35) 100%)}
.ico{width:1em;height:1em;fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;flex:none}
.cap{position:absolute;left:4cqw;right:4cqw;text-align:center;font-family:"Mont",sans-serif;font-weight:800;font-style:italic;line-height:1.14;color:#fff;-webkit-text-stroke:1.2cqw #000;paint-order:stroke fill}
.w{display:inline-block;animation:word 4s cubic-bezier(.16,1,.3,1) infinite;animation-delay:calc(var(--i)*.13s)}
.k{color:#000;background:var(--key);-webkit-text-stroke:0;padding:0 2cqw;transform-origin:50% 60%;animation-name:wordKey}
@keyframes word{0%{opacity:0;transform:translateY(3cqw)}8%,88%{opacity:1;transform:none}96%,100%{opacity:0}}
@keyframes wordKey{0%{opacity:0;transform:scale(.7)}7%{opacity:1;transform:scale(1.18)}14%,88%{opacity:1;transform:scale(1)}96%,100%{opacity:0}}
.hl{position:absolute;left:50%;transform:translateX(-50%) skewX(-6deg);display:inline-flex;align-items:center;gap:.4em;white-space:nowrap;background:var(--key);color:#000;font-family:"Mont",sans-serif;font-weight:800;font-style:italic;padding:.9cqw 3cqw;animation:hl 4s cubic-bezier(.3,1.3,.5,1) infinite}
@keyframes hl{0%{clip-path:inset(0 100% 0 0)}10%,88%{clip-path:inset(0 0 0 0)}96%,100%{clip-path:inset(0 0 0 100%)}}
.checks{position:absolute;top:104cqw;left:8cqw;right:8cqw;display:grid;gap:2cqw}
.chk{display:flex;align-items:center;gap:2.4cqw;background:rgba(0,0,0,.72);color:#fff;font:800 6cqw/1.1 "Mont",sans-serif;font-style:italic;padding:1.8cqw 2.4cqw;border-radius:1.6cqw;animation:rise 4s cubic-bezier(.16,1,.3,1) infinite;animation-delay:calc(var(--i)*.28s)}
.chk b{display:flex;align-items:center;justify-content:center;width:7cqw;height:7cqw;background:var(--key);color:#000;border-radius:1.2cqw;font-size:5cqw;flex:none}
@keyframes rise{0%{opacity:0;transform:translateY(6cqw)}8%,88%{opacity:1;transform:none}96%,100%{opacity:0}}
.stock{display:flex;align-items:center;justify-content:center;text-align:center;background:repeating-linear-gradient(45deg,#3a3d44 0 2cqw,#2b2e34 2cqw 4cqw);color:#fff;font:600 3cqw/1.2 "Segoe UI",sans-serif;border:.5cqw dashed var(--key)}
.stock span{background:rgba(0,0,0,.65);padding:.6cqw 1.2cqw}
.pola{position:absolute;width:28cqw;height:34cqw;border:1.2cqw solid #fff;border-bottom-width:4.5cqw;outline:.4cqw dashed var(--key);transform:rotate(var(--r));animation:drop 4s cubic-bezier(.3,1.3,.5,1) infinite}
@keyframes drop{0%{opacity:0;translate:0 -8cqw}9%,88%{opacity:1;translate:0 0}96%,100%{opacity:0}}
.glass{position:absolute;left:16cqw;right:16cqw;top:118cqw;height:30cqw;display:flex;gap:3cqw;align-items:flex-end;padding:3cqw;border-radius:3cqw;background:rgba(255,255,255,.22);backdrop-filter:blur(6px);border:.4cqw solid rgba(255,255,255,.55);animation:rise 4s cubic-bezier(.16,1,.3,1) infinite}
.glass i{flex:1;height:var(--h);background:var(--key);border-radius:1cqw}
.flood{position:absolute;inset:0;background:var(--key);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5cqw;animation:flood 4s cubic-bezier(.65,0,.35,1) infinite}
@keyframes flood{0%{clip-path:inset(60% 25% 30% 25%)}9%,86%{clip-path:inset(0)}96%,100%{clip-path:inset(60% 25% 30% 25%)}}
.slam{font:800 15cqw/1.02 "Mont",sans-serif;font-style:italic;color:#000;text-align:center;animation:slam 4s cubic-bezier(.2,1.5,.4,1) infinite}
@keyframes slam{0%,6%{transform:scale(1.6);opacity:0}13%{transform:scale(.97);opacity:1}18%,86%{transform:none;opacity:1}94%,100%{opacity:0}}
.slamI{font-size:12cqw;color:#000;display:none}.wide{width:78cqw;height:44cqw;border-color:#000}
.stars{position:absolute;top:130cqw;left:0;right:0;display:flex;justify-content:center;gap:3cqw;font-size:8cqw;color:var(--key)}.stars .ico{fill:var(--key);animation:rise 4s cubic-bezier(.3,1.4,.5,1) infinite}.stars .ico:nth-child(2){animation-delay:.15s}.stars .ico:nth-child(3){animation-delay:.3s}
.ring{position:absolute;left:30cqw;width:40cqw;height:40cqw;top:112cqw;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,.6);border-radius:50%;color:#fff}
.ring svg{position:absolute;inset:0;transform:rotate(-90deg)}.ring circle{fill:none;stroke-width:7}.bg{stroke:rgba(255,255,255,.25)}.fg{stroke:var(--key);stroke-dasharray:100;stroke-dashoffset:30;animation:fill 4s cubic-bezier(.65,0,.35,1) infinite}
@keyframes fill{0%{stroke-dashoffset:100}28%,88%{stroke-dashoffset:30}96%,100%{stroke-dashoffset:100}}
.ring strong{font:800 11cqw/1 "Mont",sans-serif;font-style:italic}.ring em{font:800 3.6cqw/1.2 "Mont",sans-serif;font-style:normal}
.ph{position:absolute;left:27cqw;width:46cqw;top:88cqw;height:80cqw;background:#fff;border:1.4cqw solid #111;border-radius:6cqw;padding:7cqw 3.4cqw 3cqw;display:grid;gap:2.6cqw;align-content:start;color:#111;animation:rise 4s cubic-bezier(.16,1,.3,1) infinite}
.ph-t{font:800 4.4cqw/1.2 "Mont",sans-serif}.ph-f{height:7cqw;background:#e8e9eb;border-radius:1.2cqw}.ph-b{background:var(--key);color:#000;text-align:center;font:800 4.3cqw/1 "Mont",sans-serif;font-style:italic;padding:3cqw 1cqw;border-radius:1.6cqw}
.ptr{position:absolute;right:5cqw;bottom:4cqw;font-size:10cqw;color:#000}.ptr .ico{fill:#fff}
.cta{position:absolute;left:0;right:0;top:124cqw;text-align:center;color:#fff;font:800 5.4cqw/1 "Mont",sans-serif;-webkit-text-stroke:.9cqw #000;paint-order:stroke fill}
body:not(.play) .phone:not(.live) *{animation:none!important}
@media (max-width:640px){.studio{grid-template-columns:1fr}.studio .phone{max-width:240px;margin:0 auto}}
`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Highlighter Pop Storyboard</title><style>${css}</style></head><body><main>
<h1>Highlighter Pop: Project 1</h1>
<p class="sub">Press play to see and hear the plan on the real video. Nothing has been rendered. Hatched boxes marked "Stock" will hold real photos and clips once your API key is connected.</p>
<section class="studio" aria-label="Preview">
  <div class="phone live" id="livePhone"><video id="vid" muted playsinline preload="auto" src="data:video/mp4;base64,${b64(previewFile)}"></video><div class="vig"></div><div id="over"></div></div>
  <div><h2>Preview</h2><p class="note">Low quality on purpose. Your voice is boosted here because the original is quiet, and the final will be properly mastered. Jump cuts aren't applied yet.</p>
    <div class="ctrl"><button class="btn" id="go" type="button">&#9654; Play preview</button><span class="clock" id="clock">0:00 / 0:33</span></div>
    <input id="seek" type="range" min="0" max="33.2" step="0.05" value="0" aria-label="Video position"/><div class="ticks" id="ticks"></div>
    <h2 style="font-size:15px">Background music</h2>
    <div class="tracks">${tracks.map((t) => `<label><input type="radio" name="trk" value="${t.id}"${t.best ? " checked" : ""}/><span>${t.name}${t.best ? '<span class="best">My pick</span>' : ""}<small>${t.feel}</small></span></label>`).join("")}<label><input type="radio" name="trk" value="0"/><span>No music</span></label></div>
    <div class="levels"><label for="mVol">Music</label><input id="mVol" type="range" min="0" max="0.5" step="0.01" value="0.14"/><label for="sVol">Sound effects</label><input id="sVol" type="range" min="0" max="1.5" step="0.05" value="1"/></div>
    <p class="err" id="err" role="status"></p></div>
</section>
<div class="facts">
  <div class="fact"><b>Look</b>Yellow highlight blocks, italic bold type, white text with a black outline.</div>
  <div class="fact"><b>One hero moment</b>Only "work from home" gets the full-screen burst.</div>
  <div class="fact"><b>Language</b>Hinglish captions in English letters. Please check my spelling.</div>
  <div class="fact"><b>Effects used</b>7 of the 14 on your list, one per idea, plus plain captions and quiet moments.</div>
</div>
<h2>The 11 beats</h2><button class="btn" id="play" type="button" style="margin-bottom:16px">Play the moves</button>
<section class="grid">${beats.map((b, i) => `<article class="card"><div class="phone"><img src="${img(b.t)}" alt="Frame at ${b.t} seconds"/><div class="vig"></div>${b.over}</div><div class="meta"><div class="row"><span class="num">${i + 1}</span><span class="time">${Math.floor(b.at / 60)}:${String(Math.floor(b.at)).padStart(2, "0")}</span><span class="type">${b.fx}</span></div><p class="says">"${b.says}"</p><p><b>Move:</b> ${b.move}</p><p><b>Sound:</b> ${b.sound}</p>${b.flag ? `<p class="flag">${b.flag}</p>` : ""}<button class="hear" type="button" data-at="${b.at}">&#9654; Hear this moment</button></div></article>`).join("")}</section>
<h2>Jump cuts (only real silences)</h2><div class="wrap"><table><tr><th>Where</th><th>Silence</th></tr>
<tr><td>0:00</td><td>0.8 s at the start</td></tr><tr><td>0:07</td><td>0.3 s</td></tr><tr><td>0:10</td><td>0.3 s</td></tr><tr><td>0:13</td><td>0.3 s</td></tr><tr><td>0:25</td><td>0.5 s</td></tr><tr><td>0:32</td><td>Last 0.8 s, replaced by the ending hold</td></tr></table></div>
</main><script>
const CUES=${JSON.stringify(cues)},SFX=${JSON.stringify(sfx)},BEATS=${JSON.stringify(beats.map((b) => ({ at: b.at, end: b.end, over: b.over })))};
const VOICE=new Audio("data:audio/mpeg;base64,${b64(voiceFile)}");const music=new Audio();music.preload="none";music.loop=true;
const $=(i)=>document.getElementById(i),vid=$("vid"),over=$("over"),seek=$("seek"),go=$("go"),clock=$("clock"),err=$("err");
const END=33.15;let ctx,buf={},sg,playing=false,next=0,cur=-2,timer=0;
const fmt=(t)=>Math.floor(t/60)+":"+String(Math.floor(t%60)).padStart(2,"0");
$("ticks").innerHTML=CUES.map(c=>'<i style="left:'+((c.t/33.2)*100)+'%"></i>').join("");
async function setup(){if(ctx)return;ctx=new (window.AudioContext||window.webkitAudioContext)();sg=ctx.createGain();sg.gain.value=+$("sVol").value;sg.connect(ctx.destination);
const vg=ctx.createGain();vg.gain.value=2.5;ctx.createMediaElementSource(VOICE).connect(vg).connect(ctx.destination);
await Promise.all(Object.entries(SFX).map(async([k,d])=>{buf[k]=await ctx.decodeAudioData(Uint8Array.from(atob(d),c=>c.charCodeAt(0)).buffer)}));
CUES.forEach(c=>{if(c.endsAt)c.t=Math.max(0,c.t-buf[c.s].duration)});CUES.sort((a,b)=>a.t-b.t)}
function fire(c){const n=ctx.createBufferSource(),g=ctx.createGain();n.buffer=buf[c.s];g.gain.value=c.g;n.connect(g).connect(sg);n.start()}
function point(t){next=CUES.findIndex(c=>c.t>=t);if(next<0)next=CUES.length}
const fail=()=>{if(music.getAttribute("src"))err.textContent="The music couldn't load here. Your voice and the sound effects still play."};music.addEventListener("error",fail);
function setMusic(){const id=+document.querySelector("input[name=trk]:checked").value;err.textContent="";if(!id){music.pause();music.removeAttribute("src");return}
const u="https://assets.mixkit.co/music/"+id+"/"+id+".mp3";if(music.dataset.u!==u){music.dataset.u=u;music.src=u;music.load()}music.volume=+$("mVol").value;
if(playing){const f=()=>{try{music.currentTime=VOICE.currentTime}catch(e){}music.play().catch(fail)};music.readyState>0?f():music.addEventListener("loadedmetadata",f,{once:true})}}
function paint(t){const m=BEATS.findIndex(b=>t>=b.at&&t<b.end);if(m===cur)return;cur=m;document.querySelectorAll(".card.now").forEach(c=>c.classList.remove("now"));
if(m<0){over.innerHTML="";return}over.innerHTML=BEATS[m].over;document.querySelectorAll(".card")[m].classList.add("now");
setTimeout(()=>{if(cur===m)over.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=Math.max(a.currentTime,1500)})},900)}
function tick(){if(!playing)return;const t=VOICE.currentTime;while(next<CUES.length&&CUES[next].t<=t){fire(CUES[next]);next++}
if(Math.abs(vid.currentTime-t)>.25)vid.currentTime=t;seek.value=t;clock.textContent=fmt(t)+" / 0:33";paint(t);if(t>=END||VOICE.ended)stop()}
async function start(){await setup();await ctx.resume();playing=true;go.innerHTML="&#10074;&#10074; Pause";point(VOICE.currentTime);vid.currentTime=VOICE.currentTime;await VOICE.play();vid.play().catch(()=>{});setMusic();clearInterval(timer);timer=setInterval(tick,30)}
function stop(){playing=false;clearInterval(timer);go.innerHTML="&#9654; Play preview";VOICE.pause();vid.pause();music.pause()}
go.addEventListener("click",()=>{playing?stop():start().catch(e=>{err.textContent="Preview couldn't start: "+e.message;stop()})});
function jump(t){VOICE.currentTime=t;vid.currentTime=t;seek.value=t;if(ctx)point(t);clock.textContent=fmt(t)+" / 0:33";paint(t);if(playing&&music.src){try{music.currentTime=t}catch(e){}}}
seek.addEventListener("input",()=>jump(+seek.value));document.querySelectorAll("input[name=trk]").forEach(r=>r.addEventListener("change",setMusic));
$("mVol").addEventListener("input",()=>{music.volume=+$("mVol").value});$("sVol").addEventListener("input",()=>{if(sg)sg.gain.value=+$("sVol").value});
document.querySelectorAll(".hear").forEach(b=>b.addEventListener("click",()=>{jump(Math.max(0,+b.dataset.at-.8));$("livePhone").scrollIntoView({block:"center"});if(!playing)go.click()}));
const pb=$("play");const setP=(on)=>{document.body.classList.toggle("play",on);pb.textContent=on?"Pause the moves":"Play the moves"};
if(!matchMedia("(prefers-reduced-motion: reduce)").matches)setP(true);pb.addEventListener("click",()=>setP(!document.body.classList.contains("play")));
paint(0);
</script></body></html>`;
writeFileSync(outFile, html);
console.log(`${beats.length} beats, ${cues.length} sound cues (all different), ${Math.round(html.length / 1024)} KB`);
