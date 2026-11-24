"use client";

import { RoundedBox } from "@react-three/drei";
import { useLayoutEffect, useRef, type ComponentProps } from "react";
import * as THREE from "three";

/* Everything is drawn like a matte architectural model: white and pale stone,
   navy for structure, orange only where the eye should go. */
export const color = {
  white: "#F6F7F9",
  stone: "#D9E0EA",
  slate: "#9DAEC6",
  glass: "#7E9BC2",
  water: "#34557C",
  navy: "#0A2A58",
  orange: "#F76B0B",
  rubber: "#121B2B",
} as const;

const materials = new Map<string, THREE.MeshStandardMaterial>();
export function mat(hex: string, roughness = 0.7, metalness = 0) {
  const key = `${hex}${roughness}${metalness}`;
  if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({ color: hex, roughness, metalness }));
  return materials.get(key)!;
}

type V3 = [number, number, number];
const unitBox = new THREE.BoxGeometry(1, 1, 1);

export function Box({ at, size, hex = color.white, rough, metal, rot }: { at: V3; size: V3; hex?: string; rough?: number; metal?: number; rot?: V3 }) {
  return <mesh geometry={unitBox} material={mat(hex, rough, metal)} position={at} scale={size} rotation={rot} castShadow receiveShadow />;
}

export function Soft({ at, size, hex = color.white, radius = 0.06, rough = 0.6, metal = 0, rot }: { at: V3; size: V3; hex?: string; radius?: number; rough?: number; metal?: number; rot?: V3 }) {
  return (
    <RoundedBox args={size} radius={radius} smoothness={3} position={at} rotation={rot} material={mat(hex, rough, metal)} castShadow receiveShadow />
  );
}

export function Rod({ from, to, r = 0.03, hex = color.white }: { from: V3; to: V3; r?: number; hex?: string }) {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const d = b.clone().sub(a);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  return (
    <mesh position={a.add(b).multiplyScalar(0.5)} quaternion={q} material={mat(hex)} castShadow>
      <cylinderGeometry args={[r, r, d.length(), 6]} />
    </mesh>
  );
}

export type Item = { p: V3; s: V3; c?: string; r?: number };

/** Many boxes in one draw call. */
export function Boxes({ items, rough = 0.75, ...rest }: { items: Item[]; rough?: number } & Omit<ComponentProps<"instancedMesh">, "args">) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current!;
    const o = new THREE.Object3D();
    const c = new THREE.Color();
    items.forEach((it, i) => {
      o.position.set(...it.p);
      o.rotation.set(0, it.r ?? 0, 0);
      o.scale.set(...it.s);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      mesh.setColorAt(i, c.set(it.c ?? color.white));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items]);
  return (
    <instancedMesh ref={ref} args={[unitBox, undefined, items.length]} castShadow receiveShadow {...rest}>
      <meshStandardMaterial roughness={rough} />
    </instancedMesh>
  );
}

/** Repeatable "random" so the model looks the same on every visit. */
export function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}
