"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Box, Boxes, color, mat, Rod, seeded, Soft, type Item } from "./kit";

type V3 = [number, number, number];
const DECK = 1.45;
const BRIDGE_Z = 2.6;

/** A tower as a stack of floor slabs, like a paper model. */
function tower(x: number, z: number, w: number, d: number, h: number, opts: { twist?: number; taper?: number; c?: string } = {}) {
  const floors: Item[] = [];
  const core: Item[] = [];
  const step = 0.26;
  const n = Math.max(2, Math.round(h / step));
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const k = 1 - (opts.taper ?? 0) * t;
    const r = (opts.twist ?? 0) * t;
    floors.push({ p: [x, 0.06 + i * step, z], s: [w * k, 0.09, d * k], c: opts.c ?? color.white, r });
    core.push({ p: [x, 0.06 + i * step + step / 2, z], s: [w * k * 0.9, step, d * k * 0.9], c: i % 3 ? "#A2B7D3" : color.glass, r });
  }
  floors.push({ p: [x, 0.06 + n * step, z], s: [w * (1 - (opts.taper ?? 0)), 0.12, d * (1 - (opts.taper ?? 0))], c: color.white, r: opts.twist });
  return { floors, core };
}

function City() {
  const { floors, core, low } = useMemo(() => {
    const all = [
      tower(5.2, -3.4, 1.2, 1.2, 4.6),
      tower(6.9, -4.6, 1.3, 1.1, 6.2),
      tower(8.8, -5.2, 1.2, 1.4, 5.0),
      tower(10.9, -4.4, 1.3, 1.3, 6.8, { taper: 0.25 }),
      tower(12.3, -2.6, 1.1, 1.2, 4.1),
      tower(9.9, -2.2, 1.15, 1.15, 5.9, { twist: Math.PI / 2 }),
      tower(6.2, -1.2, 1.1, 1.3, 3.3),
      tower(12.4, 0.2, 1.2, 1.2, 3.2),
      tower(11.3, 4.8, 1.2, 1.2, 2.9),
      tower(9.5, 5.9, 1.4, 1, 2.2),
      tower(5.4, 5.6, 1.2, 1, 2.0),
      tower(7.5, 6.2, 1, 1, 3.0),
    ];
    const rnd = seeded(21);
    const l: Item[] = [];
    for (let i = 0; i < 46; i++) {
      const x = 4.2 + rnd() * 9.2;
      const z = -6.6 + rnd() * 13.4;
      if (Math.abs(z - BRIDGE_Z) < 1.1 || (x > 6.4 && x < 9.4 && z > -3.6 && z < 1.6)) continue;
      const h = 0.35 + rnd() * 0.9;
      l.push({ p: [x, h / 2, z], s: [0.45 + rnd() * 0.5, h, 0.45 + rnd() * 0.5], c: rnd() > 0.7 ? color.stone : color.white });
    }
    return { floors: all.flatMap((a) => a.floors), core: all.flatMap((a) => a.core), low: l };
  }, []);

  return (
    <group>
      <Boxes items={floors} />
      <Boxes items={core} rough={0.3} />
      <Boxes items={low} />
      {/* Stepped spire */}
      <group position={[7.9, 0, -1.2]}>
        {[
          [0.98, 2.4], [0.82, 4.1], [0.66, 5.6], [0.5, 6.9], [0.35, 8], [0.22, 9], [0.12, 9.9],
        ].map(([r, h], i) => (
          <group key={h} rotation-y={i * 0.35}>
            {[0, 1, 2].map((k) => (
              <mesh key={k} position={[Math.cos((k * 2 * Math.PI) / 3) * r * 0.5, h / 2, Math.sin((k * 2 * Math.PI) / 3) * r * 0.5]} material={mat(i % 2 ? "#E6EAEF" : color.white)} castShadow receiveShadow>
                <cylinderGeometry args={[r * 0.5, r * 0.56, h, 14]} />
              </mesh>
            ))}
            <mesh position={[0, h / 2, 0]} material={mat("#B0C2DA", 0.35)} castShadow>
              <cylinderGeometry args={[r * 0.5, r * 0.6, h + 0.05, 10]} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 10.7, 0]} material={mat(color.slate, 0.4)} castShadow>
          <cylinderGeometry args={[0.012, 0.06, 1.9, 8]} />
        </mesh>
      </group>
      {/* Frame */}
      <group position={[12.2, 0, 2.6]} rotation-y={-0.5}>
        <Box at={[-0.8, 1.7, 0]} size={[0.34, 3.4, 0.5]} />
        <Box at={[0.8, 1.7, 0]} size={[0.34, 3.4, 0.5]} />
        <Box at={[0, 3.5, 0]} size={[1.94, 0.34, 0.5]} />
        <Box at={[0, 0.12, 0]} size={[1.94, 0.24, 0.5]} />
      </group>
      <Construction at={[4.9, 0, 0.4]} />
    </group>
  );
}

/** Tower under construction with an orange tower crane. */
export function Construction({ at, floors = 9 }: { at: V3; floors?: number }) {
  const items = useMemo(() => {
    const out: Item[] = [];
    for (let i = 0; i <= floors; i++) {
      const y = i * 0.38 + 0.06;
      out.push({ p: [0, y, 0], s: [1.5, 0.08, 1.2], c: color.stone });
      if (i === floors) break;
      for (const x of [-0.65, 0, 0.65]) for (const z of [-0.5, 0.5]) out.push({ p: [x, y + 0.19, z], s: [0.08, 0.38, 0.08], c: color.white });
      if (i < floors - 3) out.push({ p: [-0.1, y + 0.19, 0], s: [1.2, 0.3, 0.9], c: "#A2B7D3" });
    }
    for (const x of [-0.4, 0.3]) out.push({ p: [x, floors * 0.38 + 0.3, 0.1], s: [0.06, 0.45, 0.06], c: color.slate });
    return out;
  }, [floors]);
  const H = floors * 0.38 + 1.9;
  return (
    <group position={at}>
      <Boxes items={items} />
      <group position={[-1.15, 0, -0.3]}>
        {[-0.1, 0.1].map((x) => [-0.1, 0.1].map((z) => <Rod key={`${x}${z}`} from={[x, 0, z]} to={[x, H, z]} r={0.022} hex={color.orange} />))}
        {Array.from({ length: Math.floor(H / 0.4) }, (_, i) => (
          <group key={i}>
            <Rod from={[-0.1, i * 0.4, 0.1]} to={[0.1, i * 0.4 + 0.4, 0.1]} r={0.014} hex={color.orange} />
            <Rod from={[-0.1, i * 0.4 + 0.4, -0.1]} to={[0.1, i * 0.4, -0.1]} r={0.014} hex={color.orange} />
          </group>
        ))}
        <group position={[0, H, 0]} rotation-y={-0.45}>
          <Rod from={[-1.1, 0.02, 0]} to={[2.9, 0.02, 0]} r={0.035} hex={color.orange} />
          <Rod from={[-1.1, 0.22, 0]} to={[2.6, 0.22, 0]} r={0.022} hex={color.orange} />
          {Array.from({ length: 12 }, (_, i) => <Rod key={i} from={[-1 + i * 0.3, i % 2 ? 0.22 : 0.02, 0]} to={[-0.7 + i * 0.3, i % 2 ? 0.02 : 0.22, 0]} r={0.013} hex={color.orange} />)}
          <Rod from={[0, 0, 0]} to={[0, 0.85, 0]} r={0.035} hex={color.orange} />
          <Rod from={[0, 0.85, 0]} to={[2.2, 0.2, 0]} r={0.012} hex={color.orange} />
          <Rod from={[0, 0.85, 0]} to={[-1, 0.2, 0]} r={0.012} hex={color.orange} />
          <Box at={[-0.95, -0.12, 0]} size={[0.35, 0.3, 0.26]} hex={color.navy} />
          <Box at={[0.18, -0.12, 0.12]} size={[0.24, 0.26, 0.22]} hex={color.white} />
          <Rod from={[2, 0, 0]} to={[2, -1.15, 0]} r={0.01} hex={color.navy} />
          <Box at={[2, -1.25, 0]} size={[0.4, 0.16, 0.3]} hex={color.white} />
        </group>
      </group>
    </group>
  );
}

export function Crane({ at, hex }: { at: V3; hex: string }) {
  return (
    <group position={at}>
      {[-0.55, 0.55].map((z) => (
        <group key={z}>
          <Rod from={[-0.6, 0, z]} to={[-0.6, 3, z]} r={0.06} hex={hex} />
          <Rod from={[0.6, 0, z]} to={[0.6, 3, z]} r={0.06} hex={hex} />
          <Rod from={[-0.6, 1.4, z]} to={[0.6, 1.4, z]} r={0.045} hex={hex} />
          <Rod from={[-0.6, 0.1, z]} to={[0.6, 1.4, z]} r={0.03} hex={hex} />
          <Rod from={[-1.7, 3, z * 0.5]} to={[3.4, 3, z * 0.5]} r={0.06} hex={hex} />
          <Rod from={[0.4, 4.1, 0]} to={[3.2, 3.05, z * 0.5]} r={0.02} hex={hex} />
          <Rod from={[0.4, 4.1, 0]} to={[-1.6, 3.05, z * 0.5]} r={0.02} hex={hex} />
          <Rod from={[0.6, 3, z]} to={[0.4, 4.1, 0]} r={0.04} hex={hex} />
          <Rod from={[-0.6, 3, z]} to={[0.4, 4.1, 0]} r={0.04} hex={hex} />
        </group>
      ))}
      <Box at={[-0.9, 3.22, 0]} size={[0.7, 0.36, 0.5]} hex={color.white} />
      <Box at={[2.1, 2.86, 0]} size={[0.3, 0.16, 0.4]} hex={color.navy} />
      <Rod from={[2.1, 2.8, 0]} to={[2.1, 1.75, 0]} r={0.012} hex={color.navy} />
      <Box at={[2.1, 1.6, 0]} size={[0.36, 0.3, 0.9]} hex={color.orange} />
    </group>
  );
}

const boxColors = [color.white, color.white, color.stone, color.slate, color.navy, color.navy, color.orange, "#3F6699"];

function containerStacks() {
  const rnd = seeded(5);
  const out: Item[] = [];
  for (let bx = 0; bx < 5; bx++)
    for (let bz = 0; bz < 12; bz++) {
      const x = -12.4 + bx * 1.45;
      const z = -6.4 + bz * 1.06 + (bz > 4 ? 0.5 : 0);
      if (Math.abs(z - BRIDGE_Z) < 1.2) continue;
      const n = Math.floor(rnd() * 4.2);
      for (let k = 0; k < n; k++)
        for (const dx of [-0.21, 0.21])
          if (rnd() > 0.12) out.push({ p: [x + dx, 0.19 + k * 0.36, z], s: [0.38, 0.34, 0.92], c: boxColors[Math.floor(rnd() * boxColors.length)] });
    }
  return out;
}

export function Ship() {
  const { hull, boxes } = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-3.4, -0.72);
    s.lineTo(2.4, -0.72);
    s.quadraticCurveTo(3.5, -0.5, 4.1, 0);
    s.quadraticCurveTo(3.5, 0.5, 2.4, 0.72);
    s.lineTo(-3.4, 0.72);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.8, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2 });
    g.rotateX(-Math.PI / 2);
    const rnd = seeded(12);
    const items: Item[] = [];
    for (let i = 0; i < 9; i++)
      for (let j = 0; j < 3; j++)
        for (let k = 0; k < 1 + Math.floor(rnd() * 3); k++)
          items.push({ p: [-2 + i * 0.52, 0.86 + k * 0.34, -0.45 + j * 0.45], s: [0.48, 0.32, 0.4], c: boxColors[Math.floor(rnd() * boxColors.length)] });
    return { hull: g, boxes: items };
  }, []);
  return (
    <group position={[-1.1, -0.62, -2.6]} rotation-y={Math.PI / 2}>
      <mesh geometry={hull} material={mat(color.navy, 0.5)} castShadow receiveShadow />
      <Box at={[0, 0.12, 0]} size={[5.6, 0.16, 1.56]} hex={color.orange} />
      <Boxes items={boxes} />
      <Box at={[-2.85, 1.4, 0]} size={[0.6, 1.5, 1.2]} />
      <Box at={[-2.78, 1.95, 0]} size={[0.62, 0.16, 1.34]} hex={color.navy} rough={0.2} />
      <Box at={[-3.1, 2.3, 0]} size={[0.16, 0.5, 0.3]} hex={color.orange} />
    </group>
  );
}

/** Suspension bridge: the tagline, drawn. */
function Bridge() {
  const { cable, hangers } = useMemo(() => {
    const top = 5.1;
    const sag = (x: number) => DECK + 0.45 + (top - DECK - 0.45) * (x / 4.2) ** 2;
    const pts: THREE.Vector3[] = [new THREE.Vector3(-8.6, DECK, 0)];
    for (let x = -4.2; x <= 4.21; x += 0.35) pts.push(new THREE.Vector3(x, sag(x), 0));
    pts.push(new THREE.Vector3(8.6, DECK, 0));
    const left = new THREE.LineCurve3(pts[0], pts[1]);
    const right = new THREE.LineCurve3(pts[pts.length - 2], pts[pts.length - 1]);
    const main = new THREE.CatmullRomCurve3(pts.slice(1, -1));
    const h: { x: number; y: number }[] = [];
    for (let x = -3.85; x <= 3.86; x += 0.35) h.push({ x, y: sag(x) });
    for (let i = 1; i < 11; i++) {
      const x = 4.2 + i * 0.4;
      const y = top - ((top - DECK) * (x - 4.2)) / 4.4;
      h.push({ x, y }, { x: -x, y });
    }
    const g = [new THREE.TubeGeometry(left, 2, 0.06, 8), new THREE.TubeGeometry(main, 60, 0.06, 8), new THREE.TubeGeometry(right, 2, 0.06, 8)];
    return { cable: g, hangers: h };
  }, []);
  return (
    <group position={[0, 0, BRIDGE_Z]}>
      <Box at={[0, DECK - 0.1, 0]} size={[19, 0.2, 1.5]} />
      <Box at={[0, DECK + 0.01, 0]} size={[19, 0.02, 1.16]} hex={color.slate} />
      <Boxes items={Array.from({ length: 32 }, (_, i) => ({ p: [-9.2 + i * 0.6, DECK + 0.03, 0] as V3, s: [0.28, 0.01, 0.04] as V3 }))} />
      {/* Ramps */}
      <Box at={[10.6, DECK / 2 - 0.06, 0]} size={[3.2, 0.2, 1.5]} rot={[0, 0, -0.46]} />
      <Box at={[-10.6, DECK / 2 - 0.06, 0]} size={[3.2, 0.2, 1.5]} rot={[0, 0, 0.46]} />
      {[-8, -6, 6, 8].map((x) => <Box key={x} at={[x, DECK / 2 - 0.1, 0]} size={[0.3, DECK, 1]} hex={color.stone} />)}
      {[-4.2, 4.2].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          {[-0.72, 0.72].map((z) => <Box key={z} at={[0, 2.2, z]} size={[0.3, 6.2, 0.22]} hex={color.navy} />)}
          <Box at={[0, 5.15, 0]} size={[0.26, 0.26, 1.66]} hex={color.navy} />
          <Box at={[0, 3.5, 0]} size={[0.2, 0.18, 1.5]} hex={color.navy} />
          <Box at={[0, -0.5, 0]} size={[1, 0.8, 2.2]} hex={color.stone} />
        </group>
      ))}
      {[-0.72, 0.72].map((z) => (
        <group key={z} position={[0, 0, z]}>
          {cable.map((g, i) => <mesh key={i} geometry={g} material={mat(color.orange, 0.5)} castShadow />)}
          {hangers.map(({ x, y }) => <Rod key={x} from={[x, DECK, 0]} to={[x, y, 0]} r={0.012} hex={color.navy} />)}
        </group>
      ))}
    </group>
  );
}

/** Small trucks crossing the bridge in both directions. */
function Traffic({ still }: { still?: boolean }) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  const lanes = [
    { z: 0.3, dir: 1, start: 0.46, hex: color.orange },
    { z: 0.3, dir: 1, start: 0.02, hex: color.navy },
    { z: -0.3, dir: -1, start: 0.62, hex: color.navy },
    { z: -0.3, dir: -1, start: 0.18, hex: color.slate },
  ];
  useFrame(({ clock }) => {
    lanes.forEach((l, i) => {
      const g = refs.current[i];
      if (!g) return;
      const t = (l.start + (still ? 0 : clock.elapsedTime * 0.022)) % 1;
      const x = -9 + t * 18;
      g.position.x = l.dir * x;
      g.visible = t > 0.01 && t < 0.99;
    });
  });
  return (
    <group position={[0, DECK + 0.02, BRIDGE_Z]}>
      {lanes.map((l, i) => (
        <group key={i} ref={(g) => { refs.current[i] = g; }} position={[0, 0, l.z]} rotation-y={l.dir > 0 ? 0 : Math.PI}>
          <Box at={[-0.12, 0.27, 0]} size={[0.72, 0.36, 0.3]} hex={l.hex} />
          <Box at={[0.4, 0.21, 0]} size={[0.24, 0.26, 0.28]} />
          <Box at={[0.5, 0.26, 0]} size={[0.05, 0.1, 0.24]} hex={color.navy} rough={0.2} />
          <Box at={[0.02, 0.06, 0]} size={[0.98, 0.08, 0.24]} hex={color.rubber} />
        </group>
      ))}
    </group>
  );
}

export default function SkylineModel({ still }: { still?: boolean }) {
  const stacks = useMemo(() => containerStacks(), []);
  return (
    <group>
      {/* Base, water and the two banks */}
      <Soft at={[0, -1.16, 0]} size={[28.6, 0.5, 15.8]} hex={color.navy} radius={0.12} />
      <Box at={[0, -0.75, 0]} size={[27.6, 0.5, 14.9]} hex={color.water} rough={0.18} metal={0.1} />
      <Soft at={[-8.7, -0.4, 0]} size={[10.6, 0.8, 15.2]} hex={color.stone} radius={0.08} />
      <Soft at={[8.7, -0.4, 0]} size={[10.6, 0.8, 15.2]} hex={color.stone} radius={0.08} />
      <Box at={[-3.6, 0.03, 0]} size={[0.3, 0.06, 15]} hex={color.slate} />
      <Box at={[-5.1, 0.015, 0]} size={[1.2, 0.03, 15]} hex="#C2CDDD" />
      <Boxes items={stacks} />
      <Crane at={[-4.4, 0, -4.6]} hex={color.navy} />
      <Crane at={[-4.4, 0, -1.6]} hex={color.orange} />
      <Ship />
      <City />
      <Bridge />
      <Traffic still={still} />
    </group>
  );
}
