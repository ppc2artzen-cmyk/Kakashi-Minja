// Turns the approved storyboard (cues, caption lines, moments) into output times after the jump cuts.
import { writeFileSync } from "node:fs";
import { buildSound } from "./storyboard-sound.mjs";

const [, , voiceFile, previewFile, sfxDir, linesFile, outFile] = process.argv;
const { cues, lines } = buildSound({ voiceFile, previewFile, sfxDir, linesFile, moments: [] });

const SRC_END = 45.34, HOLD = 1.5, RISER = 2.46;
// Cut only inside silences measured in the original audio (keeping 0.04 s each side).
const keep = [[0, 14.42], [14.56, 23.56], [23.71, 32.04], [32.32, SRC_END]];
let out = 0;
const segments = keep.map(([a, b]) => { const g = { src: a, out: +out.toFixed(3), len: +(b - a).toFixed(3) }; out += b - a; return g; });
const speechEnd = out;
const total = +(speechEnd + HOLD).toFixed(3);
const map = (t) => {
  for (const g of segments) { if (t < g.src) return g.out; if (t <= g.src + g.len) return +(g.out + (t - g.src)).toFixed(3); }
  return total;
};

const TIMES = [[0.74,1.4],[1.4,2.76],[6.16,7.55],[7.6,9.3],[9.38,10.6],[15.34,16.8],[18.34,20.6],[24.56,25.7],[29.0,30.8],[32.4,34.2],[36.26,37.3],[37.36,39.4],[41.34,43.9],[44.44,99]];
const moments = TIMES.map(([a, b], i) => ({
  at: map(a), end: b === 99 ? total : map(b),
  sixty: i === 1 ? +(map(1.98) - map(1.4)).toFixed(3) : 0,
  // when the key word lands, relative to the start of the moment
  grow: i === 6 ? +(map(19.0) - map(18.34)).toFixed(3) : i === 8 ? +(map(29.92) - map(29.0)).toFixed(3) : i === 9 ? +(map(32.78) - map(32.4)).toFixed(3) : 0,
}));
const mappedCues = cues.map((c) => ({ t: map(c.endsAt ? c.t - RISER : c.t), file: c.s, gain: c.g })).sort((a, b) => a.t - b.t);
const mappedLines = lines.map((l) => ({ ...l, start: map(l.start), end: map(l.end) }));

const data = { videoFile: "video/input.mp4", musicFile: "audio/music.mp3", musicVolume: 0.3, total, segments, moments, lines: mappedLines, cues: mappedCues };
writeFileSync(outFile, JSON.stringify(data, null, 1));
console.log(`output ${total}s, ${mappedCues.length} cues, ${new Set(mappedCues.map((c) => c.file)).size} unique, removed ${(SRC_END - speechEnd).toFixed(2)}s of silence`);
