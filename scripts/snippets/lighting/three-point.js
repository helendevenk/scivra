/**
 * 三点光照系统
 *
 * 专业的三点光照设置：
 * - Key Light（主光源）：主要照明
 * - Fill Light（补光）：填充阴影
 * - Back Light（背光）：轮廓光
 */

module.exports = `
// === 三点光照系统 ===

// 主光源（Key Light）- 主要照明
const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
keyLight.position.set(5, 10, 7);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 50;
keyLight.shadow.camera.left = -10;
keyLight.shadow.camera.right = 10;
keyLight.shadow.camera.top = 10;
keyLight.shadow.camera.bottom = -10;
scene.add(keyLight);

// 补光（Fill Light）- 填充阴影
const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
fillLight.position.set(-5, 5, -5);
scene.add(fillLight);

// 背光（Back Light）- 轮廓光
const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
backLight.position.set(0, 5, -10);
scene.add(backLight);

// 环境光 - 基础照明
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
`;
