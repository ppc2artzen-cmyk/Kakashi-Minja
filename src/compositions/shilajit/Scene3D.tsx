import { useMemo } from "react";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { interpolate, Easing } from "remotion";
import { SCENES, SceneId } from "./timeline";

// ---------- helpers ----------

/** Smooth 0→1→0 visibility for a scene (or list of scenes), with in/out ramps. */
const visibility = (frame: number, ids: SceneId[], ramp = 15) => {
  let v = 0;
  for (const id of ids) {
    const s = SCENES.find((x) => x.id === id)!;
    const end = s.from + s.duration;
    const val = interpolate(
      frame,
      [s.from - ramp, s.from + ramp, end - ramp, end + ramp],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
    );
    v = Math.max(v, val);
  }
  return v;
};

/** Deterministic pseudo-random (no Math.random — renders must be identical every frame). */
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ---------- the shilajit rock ----------

const useRockGeometry = (seed = 0, detail = 4) =>
  useMemo(() => {
    let g: THREE.BufferGeometry = new THREE.IcosahedronGeometry(1, detail);
    g.deleteAttribute("normal");
    g.deleteAttribute("uv");
    g = mergeVertices(g);
    const p = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).normalize();
      const r =
        1 +
        0.16 * Math.sin(3 * v.x + 1.7 + seed) * Math.cos(2.5 * v.y + seed) +
        0.1 * Math.sin(5 * v.z + 2 * v.x + seed * 2) +
        0.05 * Math.sin(9 * v.y + 4 * v.z);
      v.multiplyScalar(r);
      p.setXYZ(i, v.x, v.y * 0.85, v.z);
    }
    g.computeVertexNormals();
    return g;
  }, [seed, detail]);

const Rock: React.FC<{
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  seed?: number;
}> = ({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], seed = 0 }) => {
  const geometry = useRockGeometry(seed);
  return (
    <mesh geometry={geometry} position={position} scale={scale} rotation={rotation}>
      <meshPhysicalMaterial
        color="#2b1a0f"
        roughness={0.32}
        metalness={0.15}
        clearcoat={1}
        clearcoatRoughness={0.18}
      />
    </mesh>
  );
};

// ---------- scene pieces ----------

const Mountains: React.FC<{ v: number; frame: number }> = ({ v, frame }) => {
  if (v <= 0) return null;
  const peaks = [
    { x: -1.3, h: 2.2, r: 1.0, z: -2.5 },
    { x: 0.2, h: 2.9, r: 1.2, z: -3 },
    { x: 1.4, h: 2.0, r: 0.9, z: -2.4 },
    { x: -0.5, h: 1.6, r: 0.8, z: -1.8 },
  ];
  return (
    <group position={[0, -1.6 + (1 - v) * -1.5, 0]} rotation={[0, frame * 0.002, 0]}>
      {peaks.map((p, i) => (
        <group key={i} position={[p.x, (p.h / 2) * v, p.z]} scale={[1, v, 1]}>
          <mesh>
            <coneGeometry args={[p.r, p.h, 5]} />
            <meshStandardMaterial color="#3b4a63" roughness={0.9} flatShading />
          </mesh>
          {/* snow cap */}
          <mesh position={[0, p.h * 0.36, 0]}>
            <coneGeometry args={[p.r * 0.28, p.h * 0.28, 5]} />
            <meshStandardMaterial color="#e8eef7" roughness={0.6} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const ResinDrip: React.FC<{ v: number; frame: number; origin: [number, number, number] }> = ({
  v,
  frame,
  origin,
}) => {
  if (v <= 0) return null;
  const cycle = 50;
  const t = (frame % cycle) / cycle;
  const stretch = interpolate(t, [0, 0.6, 1], [0.2, 1, 0.4]);
  const fall = interpolate(t, [0, 0.6, 1], [0, 0.15, 1.8], { easing: Easing.in(Easing.quad) });
  const s = 0.11 * v;
  return (
    <mesh position={[origin[0], origin[1] - fall, origin[2]]} scale={[s, s * (1 + stretch), s]}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshPhysicalMaterial color="#1c0f07" roughness={0.1} clearcoat={1} metalness={0.2} />
    </mesh>
  );
};

const Strata: React.FC<{ v: number; frame: number }> = ({ v, frame }) => {
  if (v <= 0) return null;
  const colors = ["#5a4030", "#7a5a3c", "#4a3528", "#8c6a48", "#3d2b20"];
  return (
    <group position={[0, -1.05, -0.6]} rotation={[0.25, -0.5, 0]}>
      {colors.map((c, i) => {
        const slide = interpolate(v, [0, 1], [i % 2 === 0 ? -4 : 4, 0]);
        return (
          <mesh key={i} position={[slide, i * 0.17 - 0.3, 0]}>
            <boxGeometry args={[2.6, 0.15, 1.6]} />
            <meshStandardMaterial color={c} roughness={0.95} />
          </mesh>
        );
      })}
      {/* plant particles slowly sinking into the layers */}
      {new Array(14).fill(0).map((_, i) => {
        const speed = 0.006 + rand(i) * 0.006;
        const y = 1.6 - ((frame * speed + rand(i + 9) * 2) % 2.2);
        return (
          <mesh
            key={`leaf-${i}`}
            position={[(rand(i + 3) - 0.5) * 2.2, y, (rand(i + 5) - 0.5) * 1.2]}
            rotation={[frame * 0.03 + i, frame * 0.02, i]}
            scale={0.07 * v}
          >
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#6f9a4a" roughness={0.7} flatShading />
          </mesh>
        );
      })}
    </group>
  );
};

const MINERAL_COLORS = ["#d4a537", "#b87333", "#9c3b28", "#c9ccd1", "#e0c068", "#7a8b99", "#a0522d", "#f0d58c"];

const Minerals: React.FC<{ v: number; frame: number }> = ({ v, frame }) => {
  if (v <= 0) return null;
  return (
    <group rotation={[0.35, 0, 0.15]}>
      {MINERAL_COLORS.map((c, i) => {
        const a = (i / MINERAL_COLORS.length) * Math.PI * 2 + frame * 0.025;
        const r = 0.98 * v;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * r, Math.sin(a * 2) * 0.15, Math.sin(a) * r]}
            scale={0.11 * v}
          >
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={c} metalness={0.7} roughness={0.25} flatShading />
          </mesh>
        );
      })}
    </group>
  );
};

const GoldRing: React.FC<{ v: number; frame: number }> = ({ v, frame }) => {
  if (v <= 0) return null;
  return (
    <group scale={v}>
      <mesh rotation={[Math.PI / 2.2, 0, frame * 0.01]}>
        <torusGeometry args={[1.05, 0.022, 16, 128]} />
        <meshStandardMaterial color="#e2b553" metalness={0.9} roughness={0.2} emissive="#5a3d08" />
      </mesh>
      <mesh rotation={[Math.PI / 2.1, 0.2, -frame * 0.015]}>
        <torusGeometry args={[1.2, 0.012, 16, 128]} />
        <meshStandardMaterial color="#f3d488" metalness={0.9} roughness={0.25} emissive="#4a3206" />
      </mesh>
    </group>
  );
};

const Forms: React.FC<{ v: number; frame: number }> = ({ v, frame }) => {
  if (v <= 0) return null;
  const pop = (i: number) =>
    interpolate(v, [i * 0.15, i * 0.15 + 0.55], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(1.6)),
    });
  const spin = frame * 0.02;
  return (
    <group position={[0, -0.35, 0]}>
      {/* resin */}
      <Rock position={[-0.78, 0.55, 0]} scale={0.32 * pop(0)} rotation={[0.3, spin, 0]} seed={2} />
      {/* powder pile */}
      <mesh position={[0.78, 0.45, 0]} scale={0.38 * pop(1)} rotation={[0, spin, 0]}>
        <coneGeometry args={[1, 0.9, 48]} />
        <meshStandardMaterial color="#6b4a2f" roughness={1} />
      </mesh>
      {/* capsule */}
      <group position={[0, -0.6, 0]} scale={0.42 * pop(2)} rotation={[0.4, spin, Math.PI / 3]}>
        <mesh position={[0, 0.35, 0]}>
          <capsuleGeometry args={[0.5, 0.7, 12, 32]} />
          <meshPhysicalMaterial color="#3a2414" roughness={0.25} clearcoat={1} />
        </mesh>
      </group>
    </group>
  );
};

// ---------- whole 3D scene ----------

export const Scene3D: React.FC<{ frame: number }> = ({ frame }) => {
  const vResin = visibility(frame, ["resin"]);
  const vCent = visibility(frame, ["centuries"]);
  const vMin = visibility(frame, ["minerals"]);
  const vAyur = visibility(frame, ["ayurveda", "end"]);
  const vForms = visibility(frame, ["forms"]);

  // Main rock: big in intro, sits on strata, shrinks away for "forms".
  const introPop = interpolate(frame, [0, 35], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });
  const rockScale =
    0.72 * introPop * (1 - vForms) + 0.02 * vForms - 0.12 * vCent - 0.14 * vResin;
  const rockY = -0.45 - 0.35 * vResin + 0.1 * vCent;

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#fff1dc" />
      <directionalLight position={[-4, 1, -3]} intensity={2.2} color="#ffb547" />
      <pointLight position={[0, -2, 3]} intensity={6} color="#ff9a3c" distance={8} />

      <Mountains v={vResin} frame={frame} />
      <Strata v={vCent} frame={frame} />

      <group position={[0, rockY, 0]}>
        {rockScale > 0.03 && (
          <Rock scale={rockScale} rotation={[0.25 + frame * 0.004, frame * 0.012, 0.05]} />
        )}
        <ResinDrip v={vResin} frame={frame} origin={[0.1, -0.7, 0.2]} />
        <Minerals v={vMin} frame={frame} />
        <GoldRing v={vAyur} frame={frame} />
      </group>

      <Forms v={vForms} frame={frame} />
    </>
  );
};
