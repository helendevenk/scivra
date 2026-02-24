"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { ReactNode } from "react";

interface SceneContainerProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  bloomIntensity?: number;
}

export function SceneContainer({
  children,
  cameraPosition = [0, 5, 12],
  bloomIntensity = 0.8,
}: SceneContainerProps) {
  return (
    <Canvas
      camera={{ position: cameraPosition, fov: 50 }}
      gl={{ antialias: true, alpha: true, toneMapping: 3 }}
      style={{ background: "transparent" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={0.6} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#00f5ff" />
      <pointLight position={[5, 3, 5]} intensity={0.3} color="#ff00ff" />

      {/* Starfield background */}
      <Stars
        radius={50}
        depth={40}
        count={1500}
        factor={3}
        saturation={0.5}
        fade
        speed={0.5}
      />

      {/* Neon grid floor */}
      <Grid
        infiniteGrid
        cellSize={1}
        sectionSize={5}
        cellColor="#00f5ff"
        sectionColor="#00ff88"
        cellThickness={0.4}
        sectionThickness={0.8}
        fadeDistance={30}
        fadeStrength={1.5}
      />

      {children}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2.1}
      />

      {/* Post-processing: Bloom for neon glow */}
      <EffectComposer>
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
