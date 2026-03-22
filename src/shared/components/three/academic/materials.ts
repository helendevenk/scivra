import * as THREE from 'three';

export function createAcademicBlueMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#3B82F6'),
    metalness: 0.0,
    roughness: 0.05,
    transparent: true,
    opacity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    emissive: new THREE.Color('#1E40AF'),
    emissiveIntensity: 0.6,
    envMapIntensity: 1.5,
  });
}

export function createGoldEdgeMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F59E0B'),
    metalness: 0.8,
    roughness: 0.15,
    emissive: new THREE.Color('#D97706'),
    emissiveIntensity: 0.8,
    envMapIntensity: 2.0,
  });
}

export function createElectronMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#60A5FA'),
    metalness: 0.2,
    roughness: 0.1,
    emissive: new THREE.Color('#3B82F6'),
    emissiveIntensity: 2.0,
    envMapIntensity: 1.0,
  });
}
