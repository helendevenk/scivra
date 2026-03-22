/**
 * 场景初始化代码片段（简化版鼠标控制）
 *
 * 依赖:
 * - Three.js r134
 */

module.exports = `
// === 场景初始化 ===
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

// 相机
const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
camera.position.set(0, 5, 15);
camera.lookAt(0, 0, 0);

// 渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// 简化的相机控制
const controls = { update: () => {} }; // 兼容性对象
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let cameraRotation = { theta: 0, phi: Math.PI / 4 };
let cameraDistance = 15;

renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    cameraRotation.theta -= deltaX * 0.01;
    cameraRotation.phi -= deltaY * 0.01;

    // 限制垂直旋转角度
    cameraRotation.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraRotation.phi));

    previousMousePosition = { x: e.clientX, y: e.clientY };

    updateCameraPosition();
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

renderer.domElement.addEventListener('wheel', (e) => {
    e.preventDefault();
    cameraDistance += e.deltaY * 0.01;
    cameraDistance = Math.max(5, Math.min(50, cameraDistance));
    updateCameraPosition();
});

function updateCameraPosition() {
    camera.position.x = cameraDistance * Math.sin(cameraRotation.phi) * Math.cos(cameraRotation.theta);
    camera.position.y = cameraDistance * Math.cos(cameraRotation.phi);
    camera.position.z = cameraDistance * Math.sin(cameraRotation.phi) * Math.sin(cameraRotation.theta);
    camera.lookAt(0, 0, 0);
}

// 响应式
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
`;
