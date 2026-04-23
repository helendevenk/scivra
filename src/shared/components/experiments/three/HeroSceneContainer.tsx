"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { ReactNode } from "react";

interface HeroSceneContainerProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
}

/**
 * Lightweight R3F container tuned for above-the-fold hero rendering.
 * Drops Stars, Grid, and Bloom/EffectComposer from the full SceneContainer
 * to keep TTI low on the landing page. For full experiment detail pages,
 * use SceneContainer.tsx.
 *
 * OrbitControls are limited so users can rotate to see 3D-ness but can't
 * fly the camera away from the scene.
 */
export function HeroSceneContainer({
  children,
  cameraPosition = [6, 4, 14],
}: HeroSceneContainerProps) {
  return (
    <Canvas
      camera={{ position: cameraPosition, fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={0.65} />
      <pointLight position={[-6, 4, -6]} intensity={0.7} color="#4ee5f5" />
      <pointLight position={[6, 2, 4]} intensity={0.45} color="#f5bc4a" />

      {children}

      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.48}
        minAzimuthAngle={-Math.PI * 0.4}
        maxAzimuthAngle={Math.PI * 0.4}
      />
    </Canvas>
  );
}
