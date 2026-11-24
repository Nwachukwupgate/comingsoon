"use client";

import { Environment, Lightformer, PerformanceMonitor, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { reportSlow } from "@/lib/useMotionMode";
import type { Progress } from "./types";

type V3 = [number, number, number];
export type Shot = { azimuth: number; elevation: number; distance: number; target: V3; shiftX: number; shiftY?: number };

const lerp = THREE.MathUtils.lerp;
const ease = (t: number) => t * t * (3 - 2 * t);

/** Moves the camera between two shots as the visitor scrolls. */
function Rig({ progress, from, to, onReady }: { progress: Progress; from: Shot; to: Shot; onReady: () => void }) {
  const { camera, size, invalidate } = useThree();
  const p = useRef(-1);
  const frames = useRef(0);
  const target = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    const goal = progress.current ?? 0;
    p.current = p.current < 0 ? goal : THREE.MathUtils.damp(p.current, goal, 9, Math.min(dt, 0.05));
    const t = ease(p.current);
    const mix = (a: number, b: number) => lerp(a, b, t);
    const az = mix(from.azimuth, to.azimuth);
    const el = mix(from.elevation, to.elevation);
    const narrow = Math.max(1, 1.55 / (size.width / size.height));
    const d = mix(from.distance, to.distance) * narrow;
    target.current.set(...(from.target.map((v, i) => mix(v, to.target[i])) as V3));
    camera.position.set(
      target.current.x + Math.sin(az) * Math.cos(el) * d,
      target.current.y + Math.sin(el) * d,
      target.current.z + Math.cos(az) * Math.cos(el) * d,
    );
    camera.lookAt(target.current);
    // Slide the picture sideways to leave room for the text. Mirrored for RTL.
    const dir = document.documentElement.dir === "rtl" ? -1 : 1;
    (camera as THREE.PerspectiveCamera).setViewOffset(
      size.width, size.height,
      -dir * mix(from.shiftX, to.shiftX) * size.width,
      -mix(from.shiftY ?? 0, to.shiftY ?? 0) * size.height,
      size.width, size.height,
    );
    if (frames.current < 4 && ++frames.current === 4) onReady();
    if (Math.abs(p.current - goal) > 0.0004) invalidate();
  });
  return null;
}

/** Asks for a new frame whenever the scroll position has changed. */
function Wake({ progress }: { progress: Progress }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let last = -1;
    let id = 0;
    const loop = () => {
      if (progress.current !== last) {
        last = progress.current ?? 0;
        invalidate();
      }
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(id);
  }, [progress, invalidate]);
  return null;
}

export function SuppliedModel({ url, size = 8 }: { url: string; size?: number }) {
  // Draco decoder is served from public/draco, so nothing loads from a CDN.
  const { scene } = useGLTF(url, "/draco/");
  const box = new THREE.Box3().setFromObject(scene);
  const dim = box.getSize(new THREE.Vector3());
  const mid = box.getCenter(new THREE.Vector3());
  const k = size / Math.max(dim.x, dim.y, dim.z);
  return (
    <group scale={k} position={[-mid.x * k, -box.min.y * k, -mid.z * k]}>
      <primitive object={scene} />
    </group>
  );
}

export function Lights({ dark = false, area = 14 }: { dark?: boolean; area?: number }) {
  return (
    <>
      <hemisphereLight args={["#ffffff", dark ? "#134179" : "#C9D2DE", dark ? 0.4 : 0.75]} />
      <directionalLight
        position={[area * 0.7, area * 1.1, area * 0.65]}
        intensity={dark ? 2.1 : 1.85}
        color="#FFF4EA"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-area}
        shadow-camera-right={area}
        shadow-camera-top={area}
        shadow-camera-bottom={-area}
        shadow-camera-far={area * 4}
      />
      <directionalLight position={[-area, area * 0.5, -area * 0.6]} intensity={dark ? 0.9 : 0.45} color="#BCD0EA" />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={dark ? 1.1 : 0.7} position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[14, 14, 1]} />
        <Lightformer form="rect" intensity={dark ? 1.5 : 0.6} position={[-8, 3, 4]} rotation-y={Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={0.7} color="#FFD9C2" position={[8, 2, -4]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
      </Environment>
    </>
  );
}

type Props = {
  progress: Progress;
  from: Shot;
  to: Shot;
  onReady: () => void;
  children: ReactNode;
  dark?: boolean;
  area?: number;
  /** Keep rendering while visible, for scenes with their own movement. */
  alive?: boolean;
};

export default function Stage({ progress, from, to, onReady, children, dark, area, alive }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(host.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className="absolute inset-0">
      <Canvas
        shadows="percentage"
        dpr={[1, dpr]}
        frameloop={!visible ? "never" : alive ? "always" : "demand"}
        camera={{ fov: 26, near: 1, far: 160 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.NeutralToneMapping }}
      >
        {alive && <PerformanceMonitor bounds={() => [24, 50]} onDecline={() => (dpr > 1 ? setDpr(1) : reportSlow())} />}
        <Lights dark={dark} area={area} />
        {children}
        <Rig progress={progress} from={from} to={to} onReady={onReady} />
        {visible && <Wake progress={progress} />}
      </Canvas>
    </div>
  );
}
