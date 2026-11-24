"use client";

import { useMemo } from "react";
import { Box, Boxes, color, mat, seeded, Soft, type Item } from "./kit";

function Tree({ at, k = 1 }: { at: [number, number, number]; k?: number }) {
  return (
    <group position={at} scale={k}>
      <mesh position={[0, 0.35, 0]} material={mat(color.slate)} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.7, 6]} />
      </mesh>
      <mesh position={[0, 0.85, 0]} material={mat(color.stone, 0.95)} castShadow>
        <icosahedronGeometry args={[0.34, 1]} />
      </mesh>
    </group>
  );
}

/** Residential tower on a podium. One home is picked out in orange. */
export default function BuildingModel({ floors = 22, podium = true, highlight = true, seed = 7, lit = false }: { floors?: number; podium?: boolean; highlight?: boolean; seed?: number; lit?: boolean }) {
  const h = 0.42;
  const base = podium ? 1.25 : 0.25;
  const home = { floor: Math.round(floors * 0.62), side: 1 };

  const { slabs, glass, rails } = useMemo(() => {
    const rnd = seeded(seed);
    const s: Item[] = [];
    const g: Item[] = [];
    const r: Item[] = [];
    for (let i = 0; i < floors; i++) {
      const y = base + i * h;
      const shift = Math.sin(i * 0.42) * 0.22;
      const top = i > floors - 4;
      const w = top ? 2.5 : 3.1;
      s.push({ p: [0, y, 0], s: [w + 0.3, 0.09, w + 0.1], c: color.white });
      s.push({ p: [shift, y, 0], s: [w + 0.5, 0.07, w * 0.72], c: color.white });
      s.push({ p: [0, y, shift], s: [w * 0.66, 0.07, w + 0.75], c: color.white });
      g.push({ p: [0, y + h / 2, 0], s: [w, h - 0.06, w - 0.25], c: lit && rnd() > 0.86 ? "#F7C9A6" : rnd() > 0.5 ? color.glass : "#95B0D3" });
      for (const k of [-1, 1]) {
        r.push({ p: [0, y + 0.15, shift + k * (w + 0.72) / 2], s: [w * 0.66, 0.2, 0.025], c: color.stone });
        r.push({ p: [shift + k * (w + 0.47) / 2, y + 0.15, 0], s: [0.025, 0.2, w * 0.72], c: color.stone });
      }
      // Corner fins
      for (const x of [-1, 1]) for (const z of [-1, 1]) g.push({ p: [x * (w / 2 + 0.02), y + h / 2, z * (w / 2 - 0.1)], s: [0.16, h, 0.16], c: color.white });
    }
    return { slabs: s, glass: g, rails: r };
  }, [base, floors, lit, seed]);

  const roof = base + floors * h;
  return (
    <group>
      <Boxes items={slabs} />
      <Boxes items={glass} rough={0.22} />
      <Boxes items={rails} rough={0.3} />
      <Soft at={[0, roof + 0.05, 0]} size={[2.9, 0.14, 2.9]} />
      <Box at={[0, roof + 0.55, 0]} size={[1.3, 0.9, 1.3]} hex={color.stone} />
      <Box at={[0, roof + 1.05, 0]} size={[1.7, 0.08, 1.7]} />
      <Box at={[0.35, roof + 1.8, 0.35]} size={[0.05, 1.5, 0.05]} hex={color.slate} />

      {highlight && (
        <group position={[0, base + home.floor * h, 0]}>
          <Box at={[0, h / 2, 1.72]} size={[2.06, h - 0.04, 0.62]} hex={color.orange} rough={0.5} />
          <Box at={[1.58, h / 2, 0.55]} size={[0.4, h - 0.04, 1.15]} hex={color.orange} rough={0.5} />
        </group>
      )}

      {podium && (
        <group>
          <Soft at={[0, 0.62, 0.2]} size={[6.6, 0.95, 5.4]} radius={0.08} />
          <Box at={[0, 0.5, 2.92]} size={[5.8, 0.6, 0.06]} hex={color.glass} rough={0.15} />
          <Box at={[3.32, 0.5, 0.2]} size={[0.06, 0.6, 4.6]} hex={color.glass} rough={0.15} />
          <Box at={[-3.32, 0.5, 0.2]} size={[0.06, 0.6, 4.6]} hex={color.glass} rough={0.15} />
          <Box at={[0, 0.92, 3.2]} size={[1.9, 0.09, 1]} hex={color.navy} />
          {[-0.8, 0.8].map((x) => <Box key={x} at={[x, 0.5, 3.6]} size={[0.06, 0.8, 0.06]} hex={color.navy} />)}
          {/* Pool deck */}
          <Box at={[-2.45, 1.11, 1.2]} size={[1.1, 0.04, 2.3]} hex={color.water} rough={0.12} />
          {[-0.2, 0.6, 1.4, 2.2].map((z) => <Tree key={z} at={[2.75, 1.09, z]} k={0.62} />)}
        </group>
      )}
    </group>
  );
}

export function BuildingPlot() {
  return (
    <group>
      <Soft at={[0, -0.05, 0]} size={[11.5, 0.36, 10]} hex={color.stone} radius={0.1} />
      <Box at={[0, 0.14, 4.15]} size={[11.5, 0.02, 1]} hex={color.slate} />
      <Boxes items={Array.from({ length: 12 }, (_, i) => ({ p: [-5.2 + i * 0.95, 0.16, 4.15] as [number, number, number], s: [0.42, 0.01, 0.06] as [number, number, number] }))} />
      {[-4.8, -3.9, 3.9, 4.8].map((x) => <Tree key={x} at={[x, 0.12, 3]} />)}
      {[-4.4, 4.5].map((x) => <Tree key={x} at={[x, 0.12, -2.4]} k={1.2} />)}
      <Tree at={[4.6, 0.12, 0.4]} k={0.9} />
      <Tree at={[-4.7, 0.12, 0.9]} k={0.95} />
      <Box at={[-4.3, 0.28, 4.15]} size={[0.75, 0.22, 0.34]} hex={color.navy} />
      <Box at={[2.7, 0.28, 4.15]} size={[0.75, 0.22, 0.34]} hex={color.orange} />
    </group>
  );
}
