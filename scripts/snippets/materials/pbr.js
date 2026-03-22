/**
 * PBR 材质系统
 *
 * 提供物理基础渲染（PBR）材质预设
 */

module.exports = `
// === PBR 材质系统 ===

// 材质预设
const materialPresets = {
    metal: {
        metalness: 0.8,
        roughness: 0.2,
        envMapIntensity: 1.0
    },
    plastic: {
        metalness: 0.0,
        roughness: 0.5,
        envMapIntensity: 0.5
    },
    glass: {
        metalness: 0.0,
        roughness: 0.1,
        transparent: true,
        opacity: 0.3,
        envMapIntensity: 1.0,
        transmission: 0.9
    },
    rubber: {
        metalness: 0.0,
        roughness: 0.9,
        envMapIntensity: 0.3
    },
    water: {
        metalness: 0.0,
        roughness: 0.0,
        transparent: true,
        opacity: 0.8,
        envMapIntensity: 1.0
    }
};

// 创建材质函数
function createMaterial(preset, color) {
    const config = materialPresets[preset] || materialPresets.plastic;
    return new THREE.MeshStandardMaterial({
        color: color,
        ...config
    });
}

// 环境贴图（可选，提升视觉质量）
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const envMap = pmremGenerator.fromScene(
    new THREE.RoomEnvironment(),
    0.04
).texture;
scene.environment = envMap;
`;
