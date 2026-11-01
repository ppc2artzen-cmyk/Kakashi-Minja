import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Hormozi-style captions on top of a talking-head video.
// Caption lines come from public/captions/<name>.json (built from the Whisper transcript).

const FONT = "Montserrat";
[400, 600, 800].forEach((w) =>
  loadFont({ family: FONT, url: staticFile(`fonts/Montserrat-${w}.woff2`), weight: String(w) }),
);

export type CaptionLine = {
  text: string;
  start: number; // seconds
  end: number; // seconds
  hi: number; // index of the highlighted word, -1 for none
};

export type HormoziProps = {
  videoFile: string;
  lines: CaptionLine[];
};

const KEY_COLOR = "#FFE600";

const Line: React.FC<{ line: CaptionLine; startFrame: number }> = ({ line, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - startFrame, fps, config: { damping: 11, stiffness: 220 }, durationInFrames: 10 });
  const scale = interpolate(pop, [0, 1], [0.72, 1]);
  const words = line.text.toUpperCase().split(" ");

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1180,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "0 26px",
        transform: `scale(${scale})`,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 118,
        lineHeight: 1.12,
        textAlign: "center",
        letterSpacing: 1,
      }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            color: i === line.hi ? KEY_COLOR : "#FFFFFF",
            WebkitTextStroke: "14px #000",
            paintOrder: "stroke fill",
            textShadow: "0 8px 0 rgba(0,0,0,0.55)",
          }}
        >
          {w}
        </span>
      ))}
    </div>
  );
};

export const HormoziCaptions: React.FC<HormoziProps> = ({ videoFile, lines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const current = lines.find((l) => frame >= Math.round(l.start * fps) && frame < Math.round(l.end * fps));
  const startFrame = current ? Math.round(current.start * fps) : 0;

  // Slow push-in over every line; extra punch when the line has a highlighted word.
  let zoom = 1;
  if (current) {
    const t = (frame - startFrame) / Math.max(1, Math.round((current.end - current.start) * fps));
    zoom = 1 + 0.035 * t;
    if (current.hi >= 0) {
      // quick in-and-out bump during the first 14 frames of the line
      zoom += 0.05 * Math.sin(Math.PI * Math.min(1, (frame - startFrame) / 14));
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo src={staticFile(videoFile)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {current ? <Line key={startFrame} line={current} startFrame={startFrame} /> : null}
    </AbsoluteFill>
  );
};
