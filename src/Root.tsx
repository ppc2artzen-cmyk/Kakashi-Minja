import { Composition } from "remotion";
import { MyComp } from "./compositions/MyComp";
import { WhatIsShilajit } from "./compositions/shilajit/WhatIsShilajit";
import { FPS, TOTAL_FRAMES } from "./compositions/shilajit/timeline";
import { HormoziCaptions } from "./compositions/hormozi/HormoziCaptions";
import demo1Lines from "../public/captions/demo1.json";
import { ProEdit, ProEditProps } from "./compositions/proedit/ProEdit";
import demo1Timeline from "./compositions/proedit/demo1.timeline.json";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComp}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="WhatIsShilajit"
        component={WhatIsShilajit}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Demo1Hormozi"
        component={HormoziCaptions}
        durationInFrames={1361}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoFile: "video/input.mp4", lines: demo1Lines }}
      />
      <Composition
        id="ProEditDemo1"
        component={ProEdit}
        durationInFrames={Math.round(demo1Timeline.total * 30)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={demo1Timeline as ProEditProps}
      />
    </>
  );
};
