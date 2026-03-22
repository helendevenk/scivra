/**
 * 室外光照系统
 *
 * 模拟自然光照，适合地球科学实验
 */

module.exports = `
// === 室外光照系统 ===

// 太阳光（主光源）
const sunLight = new THREE.DirectionalLight(0xffffee, 1.2);
sunLight.position.set(10, 15, 5);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.left = -20;
sunLight.shadow.camera.right = 20;
sunLight.shadow.camera.top = 20;
sunLight.shadow.camera.bottom = -20;
scene.add(sunLight);

// 天空光（环境光）
const skyLight = new THREE.HemisphereLight(0x87ceeb, 0x545454, 0.6);
scene.add(skyLight);

// 地面反射光
const groundLight = new THREE.DirectionalLight(0xffffff, 0.3);
groundLight.position.set(0, -5, 0);
scene.add(groundLight);
`;
