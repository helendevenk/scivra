/**
 * 性能优化工具
 *
 * 设备检测和性能优化
 */

module.exports = `
// === 性能优化工具 ===

// 设备检测
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isLowEnd = isMobile || navigator.hardwareConcurrency <= 4;

// 根据设备调整质量
if (isLowEnd) {
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = false;
} else {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// FPS 监控
let lastTime = performance.now();
let frames = 0;
let fps = 60;

function updateFPS() {
    frames++;
    const currentTime = performance.now();
    if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
    }
}

// 响应式处理
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
`;
