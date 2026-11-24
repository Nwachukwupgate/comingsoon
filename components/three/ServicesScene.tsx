"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import * as THREE from "three";
import { color, mat } from "./kit";
import { LogisticsModel, ProjectModel, RealEstateModel, SourcingModel } from "./ServiceModels";
import Stage, { type Shot } from "./Stage";
import type { Progress, SceneProps } from "./types";

const RADIUS = 11.5;
const COUNT = 4;
const QUARTER = (Math.PI * 2) / COUNT;
/** Share of each service's scroll spent showing it. The rest turns the table. */
const HOLD = 0.79;

const shot: Shot = { azimuth: 0, elevation: 0.27, distance: 31, target: [0, 2.3, RADIUS], shiftX: 0.215, shiftY: 0.005 };

const ease = (t: number) => t * t * (3 - 2 * t);

/** Which service is showing (0 to 3, with fractions while turning), how far into
    it the visitor is, and how close the model should be. */
function place(p: number) {
  const s = Math.min(p * COUNT, COUNT - 0.0001);
  const i = Math.floor(s);
  const f = s - i;
  const last = i === COUNT - 1;
  const turn = last || f < HOLD ? 0 : ease((f - HOLD) / (1 - HOLD));
  const inside = last ? f : Math.min(f / HOLD, 1);
  return { at: i + turn, inside, near: Math.sin(Math.min(inside, 1) * Math.PI * 0.5) * (1 - turn), index: i };
}

function Turntable({ progress }: { progress: Progress }) {
  const table = useRef<THREE.Group>(null);
  const spots = useRef<(THREE.Group | null)[]>([]);
  const spins = useRef<(THREE.Group | null)[]>([]);
  const p = useRef(-1);

  useFrame(({ invalidate }, dt) => {
    const goal = progress.current ?? 0;
    p.current = p.current < 0 ? goal : THREE.MathUtils.damp(p.current, goal, 9, Math.min(dt, 0.05));
    if (Math.abs(p.current - goal) > 0.0002) invalidate();
    const { at, near } = place(p.current);
    if (table.current) {
      table.current.rotation.y = -at * QUARTER;
      // Move the table towards the camera: the zoom.
      table.current.position.z = near * 2.6;
    }
    for (let k = 0; k < COUNT; k++) {
      const away = Math.abs(k - at);
      const spot = spots.current[k];
      if (spot) {
        // Only the model in front shows; the next grows in as the table turns.
        const size = THREE.MathUtils.smoothstep(1 - away, 0.02, 0.5);
        spot.visible = size > 0.01;
        spot.scale.setScalar(Math.max(size, 0.01));
      }
      const spin = spins.current[k];
      // Each model keeps turning while it is in view.
      if (spin) spin.rotation.y = START[k] + (p.current * COUNT - k) * 1.35;
    }
  });

  return (
    <group ref={table}>
      <mesh position={[0, -0.16, 0]} material={mat("#E3E9F2", 0.9)} receiveShadow>
        <cylinderGeometry args={[RADIUS + 6.4, RADIUS + 6.4, 0.3, 128]} />
      </mesh>
      <mesh position={[0, 0.003, 0]} rotation-x={-Math.PI / 2} material={mat(color.orange, 0.6)}>
        <ringGeometry args={[RADIUS + 5.9, RADIUS + 6.0, 160]} />
      </mesh>
      {MODELS.map((model, k) => (
        <group
          key={k}
          ref={(g) => { spots.current[k] = g; }}
          position={[Math.sin(k * QUARTER) * RADIUS, 0, Math.cos(k * QUARTER) * RADIUS]}
          rotation-y={k * QUARTER}
        >
          <group ref={(g) => { spins.current[k] = g; }}>{model}</group>
        </group>
      ))}
    </group>
  );
}

const MODELS: ReactNode[] = [<ProjectModel key="p" />, <LogisticsModel key="l" />, <RealEstateModel key="r" />, <SourcingModel key="s" />];
/** Best starting angle for each model. */
const START = [-0.95, -1.1, -0.95, -0.95];

export default function ServicesScene({ progress, onReady }: SceneProps) {
  return (
    <Stage progress={progress} from={shot} to={shot} onReady={onReady} area={20} shadowAt={[0, 0, RADIUS]}>
      <fog attach="fog" args={["#E9EEF6", 32, 56]} />
      <Turntable progress={progress} />
    </Stage>
  );
}
