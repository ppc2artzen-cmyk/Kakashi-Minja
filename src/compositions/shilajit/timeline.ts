// All scene timings in one place (30 fps). Adjust these to match the voiceover.
export const FPS = 30;

export type SceneId =
  | "intro"
  | "resin"
  | "centuries"
  | "minerals"
  | "ayurveda"
  | "forms"
  | "end";

export type Scene = {
  id: SceneId;
  from: number; // start frame
  duration: number; // length in frames
  headline: string;
  sub?: string;
};

export const SCENES: Scene[] = [
  { id: "intro", from: 0, duration: 90, headline: "What is\nShilajit?" },
  {
    id: "resin",
    from: 90,
    duration: 180,
    headline: "A natural resin",
    sub: "Seeps from rocks high in the Himalayas",
  },
  {
    id: "centuries",
    from: 270,
    duration: 180,
    headline: "Centuries in the making",
    sub: "Plant matter slowly breaks down between layers of rock",
  },
  {
    id: "minerals",
    from: 450,
    duration: 150,
    headline: "Fulvic acid\n+ trace minerals",
  },
  {
    id: "ayurveda",
    from: 600,
    duration: 180,
    headline: "Rooted in Ayurveda",
    sub: "Used in India's traditional medicine for thousands of years",
  },
  {
    id: "forms",
    from: 780,
    duration: 180,
    headline: "Resin · Powder · Capsule",
    sub: "The forms you'll find today",
  },
  {
    id: "end",
    from: 960,
    duration: 90,
    headline: "Choose\nlab-tested.",
    sub: "Purity matters.",
  },
];

export const TOTAL_FRAMES = SCENES[SCENES.length - 1].from + SCENES[SCENES.length - 1].duration;

/** The scene active at a given frame. */
export const sceneOf = (frame: number) =>
  SCENES.find((s) => frame >= s.from && frame < s.from + s.duration) ?? SCENES[SCENES.length - 1];
