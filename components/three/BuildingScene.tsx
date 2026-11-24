"use client";

import BuildingModel, { BuildingPlot } from "./BuildingModel";
import Stage, { SuppliedModel, type Shot } from "./Stage";
import type { SceneProps } from "./types";

const buildingFrom: Shot = { azimuth: 0.6, elevation: 0.28, distance: 38, target: [0, 5.4, 0], shiftX: 0.2 };
const buildingTo: Shot = { azimuth: 0.6 + Math.PI * 1.9, elevation: 0.1, distance: 24, target: [0, 6.6, 0], shiftX: 0.24 };

export default function BuildingScene({ progress, modelUrl, onReady }: SceneProps) {
  return (
    <Stage progress={progress} from={buildingFrom} to={buildingTo} onReady={onReady} dark area={12}>
      {modelUrl ? (
        <SuppliedModel url={modelUrl} size={12} />
      ) : (
        <>
          <BuildingPlot />
          <BuildingModel lit />
        </>
      )}
    </Stage>
  );
}
