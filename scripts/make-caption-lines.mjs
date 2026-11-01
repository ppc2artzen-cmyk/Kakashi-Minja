// Turns a Whisper transcript.json (word timestamps) into short Hormozi-style caption lines.
// Usage: node scripts/make-caption-lines.mjs <transcript.json> <out.json> [fixes.json]
// fixes.json (optional): { "wrong word": "right word", ... }  (applied word by word, case-insensitive)
import { readFileSync, writeFileSync } from "node:fs";

const [, , input, output, fixesFile] = process.argv;
const t = JSON.parse(readFileSync(input, "utf8"));
const fixes = fixesFile ? JSON.parse(readFileSync(fixesFile, "utf8")) : {};

const KEYWORDS = new Set([
  "60", "10", "lakh", "rupees", "coaching", "followers", "grow", "love", "loving",
  "process", "thank", "journey",
]);

const clean = (w) => w.replace(/[^\p{L}\p{N}'-]/gu, "");
const words = t.words.map((w) => {
  const raw = w.text.trim();
  const fixed = fixes[clean(raw).toLowerCase()] ?? clean(raw);
  return { text: fixed, start: w.start, end: w.end, stop: /[.,!?;:]$/.test(raw) };
}).filter((w) => w.text);

const STOP = new Set(["and","the","i","i'm","my","of","a","to","with","so","it's","all","this","we","how","like","then","for","in","on","is","that"]);
const lines = [];
let cur = [];
const flush = () => {
  if (!cur.length) return;
  const text = cur.map((w) => w.text).join(" ");
  const hi = cur.findIndex((w) => KEYWORDS.has(w.text.toLowerCase()));
  lines.push({ text, start: cur[0].start, end: cur[cur.length - 1].end, hi });
  cur = [];
};
for (let i = 0; i < words.length; i++) {
  const w = words[i];
  const prev = cur[cur.length - 1];
  if (prev && w.start - prev.end > 0.4) flush();
  cur.push(w);
  const chars = cur.reduce((n, x) => n + x.text.length + 1, 0);
  if (cur.length >= 3 || chars > 18 || w.stop) {
    // never leave a line ending on a filler word: push it to the next line
    const carry = [];
    while (cur.length > 1 && !w.stop && STOP.has(cur[cur.length - 1].text.toLowerCase())) carry.unshift(cur.pop());
    flush();
    cur = carry;
  }
}
flush();

// Each line stays until the next one starts (max 0.5s hold if there is a pause).
for (let i = 0; i < lines.length; i++) {
  const next = lines[i + 1];
  const hold = lines[i].end + 0.5;
  lines[i].end = next ? Math.min(next.start, hold) : hold;
  lines[i].start = Math.max(0, +lines[i].start.toFixed(2));
  lines[i].end = +lines[i].end.toFixed(2);
}
writeFileSync(output, JSON.stringify(lines, null, 1));
console.log(lines.length + " lines");
for (const l of lines) console.log(`${l.start.toFixed(2)}-${l.end.toFixed(2)}  ${l.text}${l.hi >= 0 ? "   [key: " + l.text.split(" ")[l.hi] + "]" : ""}`);
