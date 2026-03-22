'use client';

export function AcademicLighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        color="#f5e6c8"
      />
      <pointLight
        position={[-4, 3, -4]}
        intensity={0.8}
        color="#60A5FA"
      />
      <pointLight
        position={[4, -2, 3]}
        intensity={0.4}
        color="#F59E0B"
      />
    </>
  );
}
