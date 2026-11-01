import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const MyComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [30, 50], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barWidth = interpolate(frame, [60, 120], [0, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, Helvetica, sans-serif",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          fontSize: 110,
          fontWeight: 800,
          color: "white",
          transform: `scale(${titleScale})`,
        }}
      >
        Hello Remotion
      </div>
      <div
        style={{
          marginTop: 30,
          fontSize: 48,
          color: "#93c5fd",
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        Rendered on GitHub Actions
      </div>
      <div
        style={{
          marginTop: 60,
          height: 14,
          width: barWidth,
          borderRadius: 7,
          backgroundColor: "#38bdf8",
        }}
      />
    </AbsoluteFill>
  );
};
