"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Box, Boxes, color, mat, Soft, type Item } from "./kit";

const tyre = new THREE.CylinderGeometry(0.5, 0.5, 0.36, 28).rotateX(Math.PI / 2);
const hub = new THREE.CylinderGeometry(0.26, 0.28, 0.38, 20).rotateX(Math.PI / 2);
const bolt = new THREE.CylinderGeometry(0.1, 0.1, 0.42, 12).rotateX(Math.PI / 2);

function Wheel({ x, z, spin }: { x: number; z: number; spin?: { current: number } }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (g.current && spin) g.current.rotation.z = -spin.current;
  });
  return (
    <group ref={g} position={[x, 0.5, z]}>
      <mesh geometry={tyre} material={mat(color.rubber, 0.9)} castShadow />
      <mesh geometry={hub} material={mat(color.slate, 0.35, 0.5)} />
      <mesh geometry={bolt} material={mat(color.navy, 0.5)} />
    </group>
  );
}

export type TruckKind = "dryBox" | "chiller" | "van" | "heavyDuty";

/** Cargo truck facing +x. Wheels rest on y = 0. */
export default function TruckModel({ kind = "dryBox", spin, accent = color.orange, cab = color.white }: { kind?: TruckKind; spin?: { current: number }; accent?: string; cab?: string }) {
  const long = kind === "heavyDuty" ? 8.4 : kind === "van" ? 3.6 : 6.4;
  const tall = kind === "van" ? 2.1 : 2.75;
  const back = 1.15 - long;
  const ribs = useMemo<Item[]>(() => {
    const out: Item[] = [];
    if (kind === "van") return out;
    const n = Math.floor(long / 0.4);
    for (let i = 1; i < n; i++) {
      const x = back + i * 0.4;
      for (const z of [-1.215, 1.215]) out.push({ p: [x, 1.12 + tall / 2, z], s: [0.1, tall - 0.5, 0.05], c: kind === "chiller" ? color.white : "#ECEFF3" });
    }
    return out;
  }, [back, kind, long, tall]);
  const rear = kind === "heavyDuty" ? [back + 1.1, back + 2.2, back + 3.3] : kind === "van" ? [back + 0.9] : [back + 1.1, back + 2.2];
  const axles = [2.25, ...(kind === "heavyDuty" ? [0.15] : []), ...rear];
  const mid = back + long / 2;

  return (
    <group>
      {/* Chassis */}
      <Box at={[(back + 3.3) / 2, 0.82, 0]} size={[3.3 - back, 0.22, 0.95]} hex={color.navy} />
      {kind !== "van" && <Soft at={[mid + 0.3, 0.72, 1.02]} size={[1.5, 0.5, 0.3]} hex={color.slate} rough={0.4} metal={0.4} radius={0.08} />}
      {kind !== "van" && <Soft at={[mid + 0.3, 0.72, -1.02]} size={[1.5, 0.5, 0.3]} hex={color.slate} rough={0.4} metal={0.4} radius={0.08} />}

      {/* Cargo body */}
      <Soft at={[mid, 1.1 + tall / 2, 0]} size={[long, tall, 2.4]} radius={0.05} />
      <Boxes items={ribs.length ? ribs : [{ p: [mid, 1.2, 0], s: [0.1, 0.1, 0.1] }]} />
      <Box at={[mid, 1.16, 0]} size={[long + 0.04, 0.14, 2.46]} hex={color.navy} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Box at={[mid, 1.62, s * 1.235]} size={[long - 0.06, 0.34, 0.05]} hex={accent} rough={0.5} />
        </group>
      ))}
      {/* Rear doors */}
      <Box at={[back - 0.02, 1.1 + tall / 2, 0]} size={[0.05, tall - 0.16, 0.04]} hex={color.slate} />
      {[-0.45, 0.45].map((z) => <Box key={z} at={[back - 0.04, 1.1 + tall / 2, z]} size={[0.06, tall - 0.3, 0.05]} hex={color.slate} rough={0.4} metal={0.4} />)}
      {[-0.95, 0.95].map((z) => <Box key={z} at={[back - 0.04, 0.95, z]} size={[0.08, 0.16, 0.3]} hex={accent} />)}
      {kind === "chiller" && <Soft at={[1.32, 3.1, 0]} size={[0.5, 0.9, 1.7]} hex={color.stone} radius={0.1} />}

      {/* Cab */}
      <Soft at={[2.3, 1.9, 0]} size={[2, 2.05, 2.3]} hex={cab} radius={0.18} />
      <Soft at={[2.35, 1.02, 0]} size={[2.1, 0.62, 2.34]} hex={color.navy} radius={0.12} />
      {kind !== "van" && <Soft at={[1.95, 3.15, 0]} size={[1.25, 0.7, 2]} hex={cab} radius={0.22} rot={[0, 0, -0.16]} />}
      <Soft at={[3.27, 2.25, 0]} size={[0.12, 0.95, 2]} hex={color.navy} radius={0.05} rough={0.08} metal={0.3} rot={[0, 0, 0.06]} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Soft at={[2.62, 2.25, s * 1.13]} size={[0.95, 0.8, 0.08]} hex={color.navy} radius={0.04} rough={0.08} metal={0.3} />
          <Box at={[2.35, 1.48, s * 1.16]} size={[1.7, 0.16, 0.03]} hex={accent} />
          <Box at={[2.2, 1.95, s * 1.165]} size={[0.28, 0.05, 0.04]} hex={color.slate} />
          <Soft at={[3.2, 2.35, s * 1.36]} size={[0.16, 0.62, 0.2]} hex={color.navy} radius={0.06} />
          <Soft at={[3.36, 1.05, s * 0.86]} size={[0.14, 0.22, 0.46]} hex="#FFF7EC" radius={0.06} rough={0.2} />
          <Box at={[3.4, 0.82, s * 0.86]} size={[0.06, 0.08, 0.4]} hex={color.orange} />
        </group>
      ))}
      {[0, 1, 2].map((i) => <Box key={i} at={[3.32, 1.42 + i * 0.14, 0]} size={[0.08, 0.06, 1.3]} hex={color.slate} rough={0.3} metal={0.5} />)}
      <Soft at={[3.38, 0.75, 0]} size={[0.22, 0.34, 2.36]} hex={color.slate} radius={0.08} rough={0.45} />

      {axles.map((x, i) =>
        [-1, 1].map((s) => (
          <group key={`${x}${s}`}>
            <Wheel x={x} z={s * 0.98} spin={spin} />
            {i > 0 && kind !== "van" && <Wheel x={x} z={s * 0.6} spin={spin} />}
            <Box at={[x, 1.06, s * 1.02]} size={[1.18, 0.07, 0.42]} hex={color.navy} />
          </group>
        )),
      )}
    </group>
  );
}
