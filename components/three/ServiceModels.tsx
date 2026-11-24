"use client";

import { useMemo } from "react";
import BuildingModel, { BuildingPlot } from "./BuildingModel";
import { Box, Boxes, color, seeded, Soft, type Item } from "./kit";
import { Construction, Crane, Ship } from "./SkylineModel";
import TruckModel from "./TruckModel";
import { Plinth } from "./TruckScene";

/* The four models on the services turntable. Each is centred and stands on y = 0. */

export function ProjectModel() {
  return (
    <group scale={1.12} position={[-0.6, 0.4, 0.2]}>
      <Soft at={[0.6, -0.2, -0.3]} size={[8.8, 0.4, 7.2]} hex={color.stone} radius={0.1} />
      <Construction at={[-0.5, 0, 0.1]} floors={11} />
      <Construction at={[3.3, 0, -1.7]} floors={6} />
      <group scale={0.19} position={[2.1, 0, 2.1]}><TruckModel kind="heavyDuty" /></group>
      <group scale={0.19} position={[-2.2, 0, 2.2]} rotation-y={-0.5}><TruckModel kind="van" accent={color.navy} /></group>
      {[[1.1, 0.9], [1.5, 0.9], [1.3, 0.45], [4.2, 0.6], [3.9, 0.9]].map(([x, z], i) => (
        <Box key={i} at={[x, 0.12, z]} size={[0.32, 0.24, 0.5]} hex={i % 2 ? color.white : color.orange} />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <Box key={i} at={[-3.3 + i * 0.86, 0.17, 3.1]} size={[0.8, 0.32, 0.03]} hex={i % 3 === 1 ? color.orange : color.white} />
      ))}
    </group>
  );
}

export function LogisticsModel() {
  return (
    <group scale={0.74} position={[0, 0.22, 0]}>
      <Plinth r={7.4} />
      <group position={[0.6, 0, -2.5]}><TruckModel kind="heavyDuty" accent={color.navy} /></group>
      <group position={[1.6, 0, 2]}><TruckModel kind="dryBox" cab={color.orange} /></group>
    </group>
  );
}

export function RealEstateModel() {
  return (
    <group scale={0.82} position={[0, 0.2, 0]}>
      <BuildingPlot />
      <BuildingModel floors={15} />
    </group>
  );
}

const boxColors = [color.white, color.white, color.navy, color.navy, color.orange, color.slate, "#3F6699"];

export function SourcingModel() {
  const stacks = useMemo<Item[]>(() => {
    const rnd = seeded(14);
    const out: Item[] = [];
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 9; j++) {
        const n = 1 + Math.floor(rnd() * 3.4);
        for (let k = 0; k < n; k++)
          out.push({ p: [-5 + i * 0.5, 0.18 + k * 0.36, -4.3 + j * 1.06], s: [0.44, 0.34, 0.96], c: boxColors[Math.floor(rnd() * boxColors.length)] });
      }
    return out;
  }, []);
  return (
    <group scale={0.86} position={[0, 1, 0]}>
      <Soft at={[0, -0.9, 0]} size={[10.8, 0.5, 10.4]} hex={color.navy} radius={0.1} />
      <Box at={[0.1, -0.62, 0]} size={[10.4, 0.4, 10]} hex={color.water} rough={0.18} metal={0.1} />
      <Soft at={[-3.5, -0.3, 0]} size={[3.6, 0.7, 10]} hex={color.stone} radius={0.08} />
      <Boxes items={stacks} />
      <Crane at={[-2.7, 0.04, -2]} hex={color.orange} />
      <Crane at={[-2.7, 0.04, 1.6]} hex={color.navy} />
      <group position={[1.6, 0, 2.6]}><Ship /></group>
    </group>
  );
}
