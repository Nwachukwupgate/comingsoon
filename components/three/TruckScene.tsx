"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { color, mat } from "./kit";
import Stage, { SuppliedModel, type Shot } from "./Stage";
import TruckModel from "./TruckModel";
import type { Progress, SceneProps } from "./types";

const truckFrom: Shot = { azimuth: 0.75, elevation: 0.2, distance: 29, target: [-0.4, 1.5, 0], shiftX: 0.2 };
const truckTo: Shot = { azimuth: 0.95 + Math.PI * 2, elevation: 0.12, distance: 22, target: [0.6, 1.7, 0], shiftX: 0.24 };

/** Round plinth the model stands on. */
export function Plinth({ r = 6.6 }: { r?: number }) {
  return (
    <group>
      <mesh position={[0, -0.15, 0]} material={mat("#1B3A63", 0.8)} receiveShadow>
        <cylinderGeometry args={[r, r, 0.3, 96]} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation-x={-Math.PI / 2} material={mat(color.orange, 0.6)}>
        <ringGeometry args={[r - 0.22, r - 0.16, 128]} />
      </mesh>
    </group>
  );
}

function Rolling({ progress }: { progress: Progress }) {
  const spin = useRef(0);
  useFrame(() => {
    spin.current = (progress.current ?? 0) * 16;
  });
  return <TruckModel spin={spin} />;
}

export default function TruckScene({ progress, modelUrl, onReady }: SceneProps) {
  return (
    <Stage progress={progress} from={truckFrom} to={truckTo} onReady={onReady} dark area={9}>
      <Plinth />
      <group position={[1, 0, 0]}>
        {modelUrl ? <SuppliedModel url={modelUrl} size={9} /> : <Rolling progress={progress} />}
      </group>
    </Stage>
  );
}
