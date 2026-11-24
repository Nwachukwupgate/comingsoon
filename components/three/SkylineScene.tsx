"use client";

import SkylineModel from "./SkylineModel";
import Stage, { SuppliedModel, type Shot } from "./Stage";
import type { SceneProps } from "./types";

const heroFrom: Shot = { azimuth: 0.45, elevation: 0.34, distance: 57, target: [0, 2.1, 0], shiftX: 0.22, shiftY: 0.04 };
const heroTo: Shot = { azimuth: -0.62, elevation: 0.16, distance: 25, target: [2.6, 3, 0.8], shiftX: 0.33, shiftY: 0.05 };

export default function SkylineScene({ progress, modelUrl, onReady }: SceneProps) {
  return (
    <Stage progress={progress} from={heroFrom} to={heroTo} onReady={onReady} area={18} alive>
      {modelUrl ? <SuppliedModel url={modelUrl} size={26} /> : <SkylineModel />}
    </Stage>
  );
}
