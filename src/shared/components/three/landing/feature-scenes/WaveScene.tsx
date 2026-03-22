'use client';
/* eslint-disable react-hooks/refs, react-hooks/set-state-in-effect, react-hooks/purity, react-hooks/immutability, react-hooks/static-components */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  varying vec3 vPosition;

  void main() {
    vec3 pos = position;
    pos.z = sin(pos.x * 2.0 + uTime) * 0.3 + cos(pos.y * 1.5 + uTime * 0.7) * 0.2;
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec3 vPosition;

  void main() {
    float brightness = (vPosition.z + 0.5) / 1.0;
    gl_FragColor = vec4(0.29, 0.56, 0.85, 0.8 * brightness + 0.2);
  }
`;

export function WaveScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
        },
        transparent: true,
        side: THREE.DoubleSide,
        wireframe: true,
      }),
    []
  );

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} rotation={[-0.3, 0.3, 0]}>
      <planeGeometry args={[3, 3, 20, 20]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
