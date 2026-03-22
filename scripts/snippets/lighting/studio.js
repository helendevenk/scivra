/**
 * 工作室光照系统
 *
 * 适合产品展示和细节观察的光照设置
 */

module.exports = `
// === 工作室光照系统 ===

// 主光源（顶部）
const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
mainLight.position.set(0, 10, 0);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
scene.add(mainLight);

// 前方补光
const frontLight = new THREE.DirectionalLight(0xffffff, 0.6);
frontLight.position.set(0, 5, 10);
scene.add(frontLight);

// 左侧光
const leftLight = new THREE.DirectionalLight(0xffffff, 0.4);
leftLight.position.set(-10, 5, 0);
scene.add(leftLight);

// 右侧光
const rightLight = new THREE.DirectionalLight(0xffffff, 0.4);
rightLight.position.set(10, 5, 0);
scene.add(rightLight);

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);
`;
