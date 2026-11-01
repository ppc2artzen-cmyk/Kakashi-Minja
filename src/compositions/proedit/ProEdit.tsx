import { loadFont } from "@remotion/fonts";
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Freeze,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Pro Edit: one burgundy pill carries the whole video. Times come from the timeline JSON, in seconds of output.

const FONT = "Montserrat";
loadFont({ family: FONT, url: staticFile("fonts/Montserrat-800.woff2"), weight: "800" });

const KEY = "#8E1B3D";
const u = (cqw: number) => cqw * 10.8; // the storyboard's units, on the 1080 canvas
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const OVER = Easing.bezier(0.3, 1.35, 0.5, 1);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
const tween = (s: number, a: number, b: number, from: number, to: number, ease = OUT) =>
  interpolate(s, [a, b], [from, to], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const ICONS: Record<string, React.ReactNode> = {
  rupee: <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3M9 13c6.667 0 6.667-10 0-10" />,
  target: (<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>),
  flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
  heart: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,
  up: (<><path d="M22 7 13.5 15.5 8.5 10.5 2 17" /><path d="M16 7h6v6" /></>),
  arrow: (<><path d="M7 7h10v10" /><path d="M7 17 17 7" /></>),
  user: (<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>),
};
const Icon: React.FC<{ name: string; size: number; color?: string }> = ({ name, size, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
    {ICONS[name]}
  </svg>
);

const capStyle: React.CSSProperties = {
  position: "absolute", left: u(5), right: u(5), textAlign: "center", fontFamily: FONT, fontWeight: 800,
  fontSize: u(10.4), lineHeight: 1.1, color: "#fff",
};
const stroke: React.CSSProperties = { WebkitTextStroke: `${u(1.5)}px #000`, paintOrder: "stroke fill" };
const chip: React.CSSProperties = { color: "#fff", backgroundColor: KEY, padding: `0 ${u(2.2)}px`, borderRadius: u(1.6) };

// Words light up one by one. "*" marks the key word.
const Caption: React.FC<{ s: number; words: string[]; top?: number }> = ({ s, words, top = 110 }) => (
  <div style={{ ...capStyle, top: u(top) }}>
    {words.map((raw, i) => {
      const isKey = raw.startsWith("*");
      const t = s - i * 0.13;
      const style: React.CSSProperties = isKey
        ? { ...chip, opacity: tween(t, 0, 0.1, 0, 1), transform: `scale(${t < 0.28 ? tween(t, 0, 0.28, 0.7, 1.2) : tween(t, 0.28, 0.56, 1.2, 1)})` }
        : { ...stroke, opacity: tween(t, 0, 0.3, 0, 1), transform: `translateY(${tween(t, 0, 0.3, u(3), 0)}px)` };
      return (
        <React.Fragment key={i}>
          <span style={{ display: "inline-block", ...style }}>{isKey ? raw.slice(1) : raw}</span>{" "}
        </React.Fragment>
      );
    })}
  </div>
);

const Pill: React.FC<{ s: number; text: string; top: number; size: number; icon?: string }> = ({ s, text, top, size, icon }) => {
  const reveal = tween(s, 0, 0.4, 100, 0, OVER);
  return (
    <div style={{ position: "absolute", top: u(top), left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.45em", whiteSpace: "nowrap", backgroundColor: KEY, color: "#fff",
          border: `${u(0.55)}px solid #fff`, fontFamily: FONT, fontWeight: 800, fontSize: u(size), lineHeight: 1.25,
          padding: `${u(1.2)}px ${u(3.4)}px`, borderRadius: u(2), clipPath: `inset(0 ${Math.max(0, reveal)}% 0 0 round ${u(2)}px)`,
        }}
      >
        {text}
        {icon ? <Icon name={icon} size={u(size)} /> : null}
      </div>
    </div>
  );
};

const Badge: React.FC<{ s: number; icon: string; top: number; left: number; size: number }> = ({ s, icon, top, left, size }) => {
  const t = s - 0.25;
  return (
    <div
      style={{
        position: "absolute", top: u(top), left: u(left), width: u(size), height: u(size), borderRadius: "50%", backgroundColor: KEY, color: "#fff",
        border: `${u(0.6)}px solid #fff`, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box",
        opacity: tween(t, 0, 0.1, 0, 1), transform: `scale(${tween(t, 0, 0.4, 0.3, 1, OVER)}) rotate(${tween(t, 0, 0.4, -22, 6, OVER)}deg)`,
      }}
    >
      <Icon name={icon} size={u(size) * 0.62} />
    </div>
  );
};

const Dots: React.FC<{ s: number; top: number; stagger: number; extra?: number }> = ({ s, top, stagger, extra = 0 }) => (
  <div style={{ position: "absolute", top: u(top), left: u(15), right: u(15), display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: u(1.5) }}>
    {Array.from({ length: 60 + extra }).map((_, i) => {
      const on = s >= (i < 60 ? i * stagger : 1.1 + (i - 60) * 0.05);
      return (
        <div key={i} style={{ aspectRatio: "1", borderRadius: "50%", backgroundColor: on ? KEY : "rgba(255,255,255,0.2)", boxShadow: on ? `inset 0 0 0 ${u(0.4)}px #fff` : "none" }} />
      );
    })}
  </div>
);

const Chart: React.FC<{ s: number; from: number; to: number; delay: number }> = ({ s, from, to, delay }) => {
  const len = tween(s, delay, delay + 1.12, from, to, INOUT);
  const pts = "2,40 18,36 32,38 48,26 62,28 78,14 96,3";
  const line = (color: string, w: number) => (
    <polyline points={pts} pathLength={100} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={100} strokeDashoffset={100 - len} />
  );
  return (
    <svg viewBox="0 0 100 44" style={{ position: "absolute", top: u(122), left: u(10), width: u(80), overflow: "visible" }}>
      {line("#fff", 3.4)}
      {line(KEY, 1.9)}
    </svg>
  );
};

const Notifs: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ position: "absolute", top: u(116), left: u(13), right: u(13), display: "grid", gap: u(1.8) }}>
    {[0, 1, 2].map((i) => {
      const t = s - i * 0.2;
      return (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: u(2.6), backgroundColor: "#fff", color: "#111", borderRadius: u(2.4), padding: `${u(1.8)}px ${u(2.6)}px`, fontFamily: FONT, fontWeight: 800, fontSize: u(4.5), lineHeight: 1.1, opacity: tween(t, 0, 0.32, 0, 1), transform: `translateY(${tween(t, 0, 0.32, u(7), 0)}px)` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: u(7), height: u(7), borderRadius: "50%", backgroundColor: KEY, color: "#fff", flex: "none" }}><Icon name="user" size={u(4.2)} /></div>
          <span style={{ flex: 1 }}>New follower</span>
          <Icon name="heart" size={u(4.5)} color={KEY} />
        </div>
      );
    })}
  </div>
);

const Hero: React.FC<{ s: number; len: number }> = ({ s, len }) => {
  const inset = s < 0.36 ? tween(s, 0, 0.36, 1, 0, INOUT) : tween(s, len - 0.44, len, 0, 1, INOUT);
  const scale = s < 0.28 ? tween(s, 0, 0.28, 1.7, 0.96) : s < 0.4 ? tween(s, 0.28, 0.4, 0.96, 1.03) : tween(s, 0.4, 0.55, 1.03, 1);
  const shake = s < 0.5 ? Math.sin(s * 90) * u(1) * (1 - s / 0.5) : 0;
  const textOn = tween(s, 0.08, 0.2, 0, 1) * tween(s, len - 0.34, len - 0.12, 1, 0);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: KEY, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        clipPath: `inset(${62 * inset}% ${25 * inset}% ${30 * inset}% ${25 * inset}% round ${u(2) * inset}px)`, transform: `translateX(${shake}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: u(1), fontFamily: FONT, fontWeight: 800, fontSize: u(16.5), lineHeight: 1, color: "#fff", whiteSpace: "nowrap", opacity: textOn, transform: `scale(${scale})` }}>
        <Icon name="rupee" size={u(15)} />10 LAKH
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: u(26), height: u(26), marginTop: u(6), borderRadius: "50%", backgroundColor: "#fff", color: KEY, opacity: textOn, transform: `scale(${tween(s, 0.3, 0.7, 0.3, 1, OVER)})` }}>
        <Icon name="rupee" size={u(15)} />
      </div>
    </AbsoluteFill>
  );
};

type Line = { text: string; start: number; end: number; hi: number };
export type ProEditProps = {
  videoFile: string;
  musicFile: string;
  musicVolume: number;
  total: number;
  segments: { src: number; out: number; len: number }[];
  moments: { at: number; end: number; sixty: number; grow: number }[];
  lines: Line[];
  cues: { t: number; file: string; gain: number }[];
};

const Moment: React.FC<{ i: number; s: number; len: number; m: ProEditProps["moments"][number] }> = ({ i, s, len, m }) => {
  switch (i) {
    case 0: return <><Caption s={s} words={["MY", "NAME", "IS"]} top={96} /><Pill s={s} text="MANISH" top={112} size={11} /></>;
    case 1: return <><Pill s={s} text="60 DAYS" top={106} size={12} /><Dots s={s} top={126} stagger={m.sixty / 60} /></>;
    case 2: return <Hero s={s} len={len} />;
    case 3: return <Pill s={s} text="COACHING BUSINESS" top={112} size={5.9} icon="target" />;
    case 4: return <><Caption s={s} words={["LOVING", "THE", "*PROCESS"]} /><Badge s={s} icon="flame" top={90} left={76} size={14} /></>;
    case 5: return <><Caption s={s} words={["I", "*LOVE", "THE", "RESPONSE"]} /><Badge s={s} icon="heart" top={90} left={76} size={14} /></>;
    case 6: return <><Pill s={s} text="NEW FOLLOWERS" top={100} size={7} icon="up" /><Notifs s={s - m.grow} /></>;
    case 7: return <Caption s={s} words={["EACH", "AND", "*EVERY", "DAY"]} />;
    case 8: return <><Caption s={s} words={["HOW", "TO", "*GROW"]} top={96} /><Chart s={s} from={0} to={52} delay={m.grow} /></>;
    case 9: return <><Caption s={s} words={["WE", "CAN", "*GROW"]} top={96} /><Chart s={s} from={52} to={100} delay={m.grow} /></>;
    case 10: return <Caption s={s} words={["I", "*LOVE", "THE", "PROCESS"]} />;
    case 11: return <Pill s={s} text="THANK YOU SO MUCH" top={112} size={6} icon="heart" />;
    case 12: return <><Caption s={s} words={["THIS", "*JOURNEY"]} top={96} /><Badge s={s} icon="arrow" top={80} left={78} size={13} /><Dots s={s} top={116} stagger={0.018} extra={20} /></>;
    default: return <Pill s={s} text="THANK YOU" top={100} size={10} icon="heart" />;
  }
};

export const ProEdit: React.FC<ProEditProps> = ({ videoFile, musicFile, musicVolume, total, segments, moments, lines, cues }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;

  const mi = moments.findIndex((m) => t >= m.at && t < m.end);
  const li = mi < 0 ? lines.findIndex((l) => t >= l.start && t < l.end) : -1;
  const m = mi >= 0 ? moments[mi] : null;
  const s = m ? t - m.at : 0;

  // A small change of framing on each cut, a punch on the coaching pill, a slow push in the quiet moments.
  const segIndex = Math.max(0, segments.findIndex((g) => t >= g.out && t < g.out + g.len));
  let zoom = segIndex % 2 ? 1.05 : 1;
  if (mi === 3) zoom += tween(s, 0, 0.25, 0.1, 0.03);
  if (mi === 7 || mi === 10) zoom += tween(s, 0, m!.end - m!.at, 0, 0.05, Easing.linear);

  const last = segments[segments.length - 1];
  const holdFrom = Math.round((last.out + last.len) * fps);
  const lastSrcFrame = Math.round((last.src + last.len) * fps) - 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, filter: "contrast(1.07) saturate(1.14) brightness(0.97)" }}>
        {segments.map((g, i) => (
          <Sequence key={i} from={Math.round(g.out * fps)} durationInFrames={Math.round(g.len * fps)} premountFor={15}>
            <OffthreadVideo src={staticFile(videoFile)} trimBefore={Math.round(g.src * fps)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Sequence>
        ))}
        <Sequence from={holdFrom}>
          <Freeze frame={lastSrcFrame}>
            <OffthreadVideo src={staticFile(videoFile)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Freeze>
        </Sequence>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(0,0,0,0.42) 100%)" }} />

      {m ? <Moment i={mi} s={s} len={m.end - m.at} m={m} /> : null}
      {li >= 0 ? (
        <div style={{ ...capStyle, top: u(110), opacity: tween(t - lines[li].start, 0, 0.1, 0, 1), transform: `scale(${tween(t - lines[li].start, 0, 0.22, 0.8, 1, OVER)})` }}>
          {lines[li].text.toUpperCase().split(" ").map((w, i) => (
            <React.Fragment key={i}>
              <span style={i === lines[li].hi ? { display: "inline-block", ...chip } : stroke}>{w}</span>{" "}
            </React.Fragment>
          ))}
        </div>
      ) : null}

      <Audio src={staticFile(musicFile)} volume={(f) => musicVolume * interpolate(f, [durationInFrames - 1.5 * fps, durationInFrames - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      {cues.map((c, i) => (
        <Sequence key={i} from={Math.round(c.t * fps)} premountFor={15}>
          <Audio src={staticFile(`sfx/${c.file}`)} volume={c.gain} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
