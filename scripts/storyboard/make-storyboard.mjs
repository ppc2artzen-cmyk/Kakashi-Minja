import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildSound } from "./storyboard-sound.mjs";

const [, , framesDir, fontFile, outFile, voiceFile, previewFile, sfxDir, linesFile] = process.argv;
const img = (t) => "data:image/jpeg;base64," + readFileSync(join(framesDir, `t_${t}.jpg`)).toString("base64");
const font = readFileSync(fontFile).toString("base64");

const ICONS = {
  rupee: '<path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3M9 13c6.667 0 6.667-10 0-10"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  up: '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
  arrow: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
};
const ico = (n, cls = "") => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
const cap = (words, top = 110) =>
  `<div class="cap" style="top:${top}cqw">` +
  words.map((w, i) => {
    const key = w.startsWith("*");
    return `<span class="w${key ? " k" : ""}" style="--i:${i}">${key ? w.slice(1) : w}</span>`;
  }).join(" ") + `</div>`;
const pill = (text, top = 112, size = 8) => `<div class="pill" style="top:${top}cqw;font-size:${size}cqw">${text}</div>`;
const badge = (n, top, left, size = 15) => `<div class="emo" style="top:${top}cqw;left:${left}cqw;width:${size}cqw;height:${size}cqw">${ico(n)}</div>`;
const dots = (lit, extra = 0, top = 126) => {
  let s = `<div class="dots" style="top:${top}cqw">`;
  for (let i = 0; i < 60 + extra; i++) s += `<i class="${i < lit ? "on" : ""}${i >= 60 ? " more" : ""}" style="--i:${i}"></i>`;
  return s + "</div>";
};
const notif = () => `<div class="notifs">` + [0, 1, 2].map((i) => `<div class="n" style="--i:${i}"><b>${ico("user")}</b><span>New follower</span><em>${ico("heart")}</em></div>`).join("") + `</div>`;
const chart = (pct) => `<svg class="chart" viewBox="0 0 100 44" style="--len:${pct}"><polyline pathLength="100" points="2,40 18,36 32,38 48,26 62,28 78,14 96,3" /><polyline class="top" pathLength="100" points="2,40 18,36 32,38 48,26 62,28 78,14 96,3" /></svg>`;

const cards = [
  { t: "0.9", time: "0:00", says: "Hi guys, my name is Manish", over: cap(["MY", "NAME", "IS"], 96) + pill("MANISH", 112, 11), type: "Face + name",
    move: "Burgundy bar wipes in, the name slides up out of it. This pill stays alive for the whole video.", sound: "Pop as the name lands, quiet sound on each caption" },
  { t: "2.1", time: "0:02", says: "It's been 60 days", over: pill("60 DAYS", 106, 12) + dots(60), type: "Face + graphic",
    move: "Pill shrinks into a badge. 60 dots light up one by one and finish exactly on the word \"60\".", sound: "Fast ticks, click on 60" },
  { t: "5.9", time: "0:06", says: "...making 10 lakh rupees", over: `<div class="flood"><div class="slam"><span class="cur">&#8377;</span>10 LAKH</div><div class="slamE">${ico("rupee")}</div></div>`, type: "HERO: one time only",
    move: "The pill bursts to fill the whole screen. Number slams in, overshoots, and shakes the frame.", sound: "Riser builds up, whoosh, then the loudest impact of the video", flag: "Confirm the line first" },
  { t: "7.9", time: "0:07", says: "...with my coaching business", over: pill(`COACHING BUSINESS ${ico("target")}`, 112, 5.9), type: "Face + pill",
    move: "Burgundy screen collapses back into the pill, revealing your face with a punch zoom.", sound: "Whoosh" },
  { t: "9.9", time: "0:09", says: "...loving the process", over: cap(["LOVING", "THE", "*PROCESS"]) + badge("flame", 90, 76, 14), type: "Face + caption",
    move: "Words light up as you say them. The flame icon pops in on \"process\" with a small tilt.", sound: "Pop" },
  { t: "15.7", time: "0:15", says: "I love the response", over: cap(["I", "*LOVE", "THE", "RESPONSE"]) + badge("heart", 90, 76, 14), type: "Face + caption",
    move: "\"LOVE\" scales up as it gets its burgundy block, then settles so you can read it.", sound: "Soft pop" },
  { t: "19.1", time: "0:19", says: "...all the new followers", over: pill(`NEW FOLLOWERS ${ico("up")}`, 100, 7) + notif(), type: "Face + graphic",
    move: "Three follower cards stack up from below, one after another, like phone notifications.", sound: "3 light clicks", flag: "Illustration, no real names or numbers" },
  { t: "24.2", time: "0:24", says: "...each and every day", over: cap(["EACH", "AND", "*EVERY", "DAY"]), type: "Breather: just you",
    move: "No graphics. Slow push-in only. A pro edit needs quiet moments so the big ones hit.", sound: "Only a quiet caption sound and the music" },
  { t: "30.0", time: "0:30", says: "...how to grow myself", over: cap(["HOW", "TO", "*GROW"], 96) + chart(52), type: "Face + graphic",
    move: "A line starts drawing itself and climbs as you say \"grow\".", sound: "Light whoosh", flag: "Illustration, no real data" },
  { t: "32.9", time: "0:32", says: "...how we can grow this", over: cap(["WE", "CAN", "*GROW"], 96) + chart(100), type: "Face + graphic",
    move: "Same line carries on and reaches the top on the second \"grow\". One idea, two hits.", sound: "Rising tick" , flag: "Illustration, no real data" },
  { t: "36.6", time: "0:36", says: "...and I love the process", over: cap(["I", "*LOVE", "THE", "PROCESS"]), type: "Breather: just you",
    move: "Personal line, so it stays on your face. Only the words move.", sound: "Pop on LOVE, nothing else" },
  { t: "37.6", time: "0:37", says: "Thank you so much", over: pill(`THANK YOU SO MUCH ${ico("heart")}`, 112, 6), type: "Face + pill",
    move: "Pill returns from below with a soft bounce, the same object as the start.", sound: "Soft pop" },
  { t: "42.3", time: "0:42", says: "...continue this journey", over: cap(["THIS", "*JOURNEY"], 96) + badge("arrow", 80, 78, 13) + dots(60, 20, 116), type: "Callback",
    move: "The 60 dots from the start come back and keep going past 60. Pays off the opening.", sound: "Fast ticks" },
  { t: "44.7", time: "0:44", says: "Thank you so much", over: pill(`THANK YOU ${ico("heart")}`, 100, 10), type: "Ending",
    move: "Pill grows big and holds about 1.5 s longer than you speak, so it can be read.", sound: "Gentle impact" },
];

const TIMES = [[0.74,1.4],[1.4,2.76],[6.16,7.55],[7.6,9.3],[9.38,10.6],[15.34,16.8],[18.34,20.6],[24.56,25.7],[29.0,30.8],[32.4,34.2],[36.26,37.3],[37.36,39.4],[41.34,43.9],[44.44,45.4]];
const sound = buildSound({ voiceFile, previewFile, sfxDir, linesFile, moments: cards.map((c, i) => ({ at: TIMES[i][0], end: TIMES[i][1], over: c.over })) });

const cardHtml = (c, i) => `
<article class="card">
  <div class="phone"><img src="${img(c.t)}" alt="Frame at ${c.time}" /><div class="vig"></div>${c.over}</div>
  <div class="meta">
    <div class="row"><span class="num">${i + 1}</span><span class="time">${c.time}</span><span class="type">${c.type}</span></div>
    <p class="says">"${c.says}"</p>
    <p><b>Move:</b> ${c.move}</p>
    <p><b>Sound:</b> ${c.sound}</p>
    ${c.flag ? `<p class="flag">${c.flag}</p>` : ""}
    <button class="hear" type="button" data-at="${TIMES[i][0]}">&#9654; Hear this moment</button>
  </div>
</article>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Pro Edit Storyboard</title>
<style>
@font-face { font-family: "Mont"; src: url(data:font/woff2;base64,${font}) format("woff2"); font-weight: 800; }
:root { --bg:#111214; --panel:#1b1d21; --ink:#f2f2f0; --mute:#a6a8ad; --line:#2c2f34; --key:#8E1B3D; --keyT:#F4B7C7; }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--ink); font:15px/1.5 "Segoe UI",system-ui,sans-serif; }
main { max-width:1280px; margin:0 auto; padding:28px 16px 60px; }
h1 { font:800 30px/1.15 "Mont","Segoe UI",sans-serif; margin:0 0 6px; }
h2 { font:800 19px/1.2 "Mont","Segoe UI",sans-serif; margin:40px 0 12px; }
.sub { color:var(--mute); margin:0 0 20px; max-width:70ch; }
.facts { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; margin-bottom:28px; }
.fact { background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:12px 14px; }
.fact b { display:block; color:var(--keyT); margin-bottom:2px; }
.grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:18px; }
.card { background:var(--panel); border:1px solid var(--line); border-radius:12px; overflow:hidden; }
.meta { padding:12px 14px 14px; font-size:13.5px; }
.meta p { margin:6px 0 0; color:var(--mute); }
.meta p b { color:var(--ink); font-weight:600; }
.row { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.num { background:var(--key); color:#fff; font-weight:700; border-radius:5px; padding:0 7px; }
.time { font-variant-numeric:tabular-nums; color:var(--mute); }
.type { font-weight:600; }
.says { color:var(--ink) !important; font-style:italic; }
.flag { color:#ffb37a !important; font-weight:600; }
table { width:100%; border-collapse:collapse; font-size:14px; }
td,th { text-align:left; padding:8px 10px; border-bottom:1px solid var(--line); vertical-align:top; }
th { color:var(--mute); font-weight:600; }
.wrap { overflow-x:auto; }

/* the phone: 1cqw = 10.8 px on the real 1080 canvas */
.phone { position:relative; aspect-ratio:9/16; container-type:inline-size; overflow:hidden; background:#000; }
.phone img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:contrast(1.07) saturate(1.14) brightness(.97); animation:push 4s linear infinite; }
.vig { position:absolute; inset:0; background:radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(0,0,0,.42) 100%); }
@keyframes push { from { transform:scale(1); } to { transform:scale(1.05); } }

.cap { position:absolute; left:5cqw; right:5cqw; text-align:center; font:800 10.4cqw/1.1 "Mont",sans-serif; color:#fff; -webkit-text-stroke:1.5cqw #000; paint-order:stroke fill; }
.w { display:inline-block; animation:word 4s cubic-bezier(.16,1,.3,1) infinite; animation-delay:calc(var(--i) * .13s); }
.k { color:#fff; background:var(--key); -webkit-text-stroke:0; padding:0 2.2cqw; border-radius:1.6cqw; animation-name:wordKey; }
@keyframes word { 0% { opacity:0; transform:translateY(3cqw); } 8%,88% { opacity:1; transform:none; } 96%,100% { opacity:0; } }
@keyframes wordKey { 0% { opacity:0; transform:scale(.7); } 7% { opacity:1; transform:scale(1.2); } 14%,88% { opacity:1; transform:scale(1); } 96%,100% { opacity:0; } }

.pill { position:absolute; left:50%; transform:translateX(-50%); display:inline-flex; align-items:center; gap:.45em; white-space:nowrap; background:var(--key); color:#fff; border:.55cqw solid #fff; font-family:"Mont",sans-serif; font-weight:800; padding:1.2cqw 3.4cqw; border-radius:2cqw; animation:pill 4s cubic-bezier(.3,1.35,.5,1) infinite; }
@keyframes pill { 0% { clip-path:inset(0 100% 0 0 round 2cqw); } 10%,88% { clip-path:inset(0 0 0 0 round 2cqw); } 96%,100% { clip-path:inset(0 0 0 100% round 2cqw); } }
.ico { width:1em; height:1em; fill:none; stroke:currentColor; stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round; flex:none; }
.emo { position:absolute; display:flex; align-items:center; justify-content:center; background:var(--key); color:#fff; border:.6cqw solid #fff; border-radius:50%; animation:emo 4s cubic-bezier(.3,1.5,.5,1) infinite; animation-delay:.25s; }
@keyframes emo { 0% { opacity:0; transform:scale(.3) rotate(-22deg); } 10%,88% { opacity:1; transform:scale(1) rotate(6deg); } 96%,100% { opacity:0; } }

.dots { position:absolute; left:15cqw; right:15cqw; display:grid; grid-template-columns:repeat(10,1fr); gap:1.5cqw; }
.emo .ico { width:62%; height:62%; }
.dots i { aspect-ratio:1; border-radius:50%; background:rgba(255,255,255,.2); }
.dots i.on, .dots i.more { box-shadow:inset 0 0 0 .4cqw #fff; }
.dots i.on { animation:dot 4s steps(1) infinite; animation-delay:calc(var(--i) * .018s); background:var(--key); }
.dots i.more { background:var(--key); animation:dot 4s steps(1) infinite; animation-delay:calc(1.1s + (var(--i) - 60) * .05s); }
@keyframes dot { 0% { background:rgba(255,255,255,.2); } 1%,90% { background:var(--key); } 100% { background:rgba(255,255,255,.2); } }

.flood { position:absolute; inset:0; background:var(--key); display:flex; flex-direction:column; align-items:center; justify-content:center; animation:flood 4s cubic-bezier(.65,0,.35,1) infinite; }
@keyframes flood { 0% { clip-path:inset(62% 25% 30% 25% round 2cqw); } 9%,84% { clip-path:inset(0 0 0 0 round 0); } 95%,100% { clip-path:inset(62% 25% 30% 25% round 2cqw); } }
.slam { font:800 16.5cqw/1 "Mont",sans-serif; color:#fff; letter-spacing:-.02em; white-space:nowrap; animation:slam 4s cubic-bezier(.2,1.5,.4,1) infinite; }
.cur { font-family:"Segoe UI","Arial",sans-serif; font-weight:900; margin-right:.5cqw; }
.slamE { display:flex; align-items:center; justify-content:center; width:26cqw; height:26cqw; margin-top:6cqw; border-radius:50%; background:#fff; color:var(--key); font-size:15cqw; animation:emo 4s cubic-bezier(.3,1.5,.5,1) infinite; animation-delay:.3s; }
@keyframes slam { 0%,6% { transform:scale(1.7); opacity:0; } 13% { transform:scale(.96) rotate(-1deg); opacity:1; } 16% { transform:scale(1.03) rotate(1deg); } 20%,84% { transform:none; opacity:1; } 92%,100% { transform:none; opacity:0; } }

.notifs { position:absolute; top:116cqw; left:13cqw; right:13cqw; display:grid; gap:1.8cqw; }
.n { display:flex; align-items:center; gap:2.6cqw; background:#fff; color:#111; border-radius:2.4cqw; padding:1.8cqw 2.6cqw; font:800 4.5cqw/1.1 "Mont",sans-serif; animation:notif 4s cubic-bezier(.16,1,.3,1) infinite; animation-delay:calc(var(--i) * .2s); }
.n b { display:flex; align-items:center; justify-content:center; width:7cqw; height:7cqw; border-radius:50%; background:var(--key); color:#fff; font-size:4.2cqw; flex:none; }
.n span { flex:1; }
.n em { font-style:normal; color:var(--key); display:flex; }
@keyframes notif { 0% { opacity:0; transform:translateY(7cqw); } 8%,86% { opacity:1; transform:none; } 94%,100% { opacity:0; } }

.chart { position:absolute; top:122cqw; left:10cqw; width:80cqw; overflow:visible; }
.chart polyline { fill:none; stroke:#fff; stroke-width:3.4; stroke-linecap:round; stroke-linejoin:round; stroke-dasharray:100; stroke-dashoffset:calc(100 - var(--len)); animation:draw 4s cubic-bezier(.65,0,.35,1) infinite; }
.chart polyline.top { stroke:var(--key); stroke-width:1.9; }
@keyframes draw { 0% { stroke-dashoffset:100; } 28%,88% { stroke-dashoffset:calc(100 - var(--len)); } 96%,100% { stroke-dashoffset:100; } }

body:not(.play) .phone:not(.live) * { animation:none !important; }
${sound.css}
.playbtn { font:600 14px "Segoe UI",sans-serif; background:var(--key); color:#fff; border:0; border-radius:8px; padding:9px 16px; cursor:pointer; margin-bottom:22px; }
.playbtn:focus-visible { outline:2px solid #fff; outline-offset:2px; }
</style></head>
<body><main>
<h1>Pro Edit Storyboard</h1>
<p class="sub">Press play to hear your voice, the sound effects and the music together. Below that, you can check each key moment. Nothing has been rendered yet.</p>

${sound.html}
<div class="facts">
  <div class="fact"><b>The big idea</b>One burgundy pill travels through the whole video. It changes shape instead of cutting, so it feels designed, not assembled.</div>
  <div class="fact"><b>One hero moment</b>Only "10 lakh" gets the full-screen slam. Everything else stays smaller, so that moment hits hard.</div>
  <div class="fact"><b>Your face stays clear</b>Graphics sit on your black sweater, below your chin and above the Reels buttons.</div>
  <div class="fact"><b>Sound</b>Your voice is always loudest. Every caption and key word gets its own different sound, with music underneath the whole video.</div>
  <div class="fact"><b>Look</b>Montserrat ExtraBold, one burgundy accent with white text, richer colors, soft dark edges, and matching custom icons on key words.</div>
</div>

<h2>The 14 key moments</h2>
<button class="playbtn" id="play" type="button">Play the moves</button>
<section class="grid">${cards.map(cardHtml).join("")}</section>

<h2>Jump cuts (removes your hesitations)</h2>
<div class="wrap"><table>
<tr><th>Where</th><th>What gets cut</th><th>About</th></tr>
<tr><td>0:08</td><td>Long "and..." before "then loving"</td><td>0.5 s</td></tr>
<tr><td>0:26</td><td>Pause after "I seek"</td><td>1 s</td></tr>
<tr><td>0:28</td><td>Pause after "and learn"</td><td>0.7 s</td></tr>
<tr><td>0:31</td><td>Pause after "how we"</td><td>0.9 s</td></tr>
</table></div>
<p class="sub" style="margin-top:10px">Each cut also changes the zoom a little, so the jump looks intentional. With the longer ending, the video goes from 45 s to about 43 s. These times come from the transcript, so please listen to these spots in the draft. I can't hear audio myself.</p>
</main><script>
${sound.script}
const b=document.getElementById("play");
const set=(on)=>{document.body.classList.toggle("play",on);b.textContent=on?"Pause the moves":"Play the moves";};
if(!matchMedia("(prefers-reduced-motion: reduce)").matches) set(true);
b.addEventListener("click",()=>set(!document.body.classList.contains("play")));
</script></body></html>`;

writeFileSync(outFile, html);
console.log("written", outFile, Math.round(html.length / 1024) + " KB");
