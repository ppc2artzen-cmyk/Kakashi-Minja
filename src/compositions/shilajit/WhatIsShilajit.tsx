import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Easing,
  getStaticFiles,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Scene3D } from "./Scene3D";
import { SCENES, TOTAL_FRAMES } from "./timeline";

// ---------- fonts (bundled in public/fonts, no internet needed) ----------
const FONT = "Montserrat";
for (const w of ["400", "600", "800"]) {
  loadFont({ family: FONT, url: staticFile(`fonts/Montserrat-${w}.woff2`), weight: w });
}

// ---------- audio files (added to public/audio) ----------
const VOICEOVER = "audio/shilajit-voiceover.mp3";
const MUSIC = "audio/shilajit-music.mp3";
const hasFile = (name: string) => getStaticFiles().some((f) => f.name === name);

// ---------- text overlay ----------
const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {SCENES.map((s) => {
        const local = frame - s.from;
        if (local < 0 || local >= s.duration) return null;

        const enter = spring({ frame: local, fps, config: { damping: 16, mass: 0.8 } });
        const exit = interpolate(local, [s.duration - 12, s.duration], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const subIn = interpolate(local, [10, 28], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const isIntro = s.id === "intro";

        return (
          <div
            key={s.id}
            style={{
              position: "absolute",
              top: isIntro ? 300 : 230,
              left: 90,
              right: 90,
              textAlign: "center",
              opacity: exit,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: isIntro ? 150 : 96,
                lineHeight: 1.05,
                letterSpacing: -2,
                whiteSpace: "pre-line",
                color: "#fff6e6",
                textShadow: "0 6px 30px rgba(0,0,0,0.55)",
                transform: `translateY(${(1 - enter) * 60}px) scale(${0.9 + enter * 0.1})`,
                opacity: enter,
              }}
            >
              {s.headline}
            </div>
            {s.sub ? (
              <div
                style={{
                  marginTop: 34,
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 46,
                  lineHeight: 1.25,
                  color: "#f0c879",
                  opacity: subIn,
                  transform: `translateY(${(1 - subIn) * 24}px)`,
                }}
              >
                {s.sub}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

// ---------- main composition ----------
export const WhatIsShilajit: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const musicVolume = (f: number) =>
    interpolate(f, [0, 20, TOTAL_FRAMES - 45, TOTAL_FRAMES], [0, 0.16, 0.16, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const glow = 0.55 + 0.1 * Math.sin(frame / 25);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 60%, rgba(120,62,18,${glow}) 0%, #1a0d06 45%, #07040a 100%)`,
      }}
    >
      <AbsoluteFill>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0, 0, 6.2], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene3D frame={frame} />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* subtle vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <Headline />

      {hasFile(VOICEOVER) ? <Audio src={staticFile(VOICEOVER)} /> : null}
      {hasFile(MUSIC) ? <Audio src={staticFile(MUSIC)} volume={musicVolume} loop /> : null}
    </AbsoluteFill>
  );
};
