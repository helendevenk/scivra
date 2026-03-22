/**
 * Bloom 后处理效果
 *
 * 依赖:
 * - Three.js EffectComposer
 * - Three.js RenderPass
 * - Three.js UnrealBloomPass
 *
 * CDN:
 * <script src="https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/postprocessing/EffectComposer.js"></script>
 * <script src="https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/postprocessing/RenderPass.js"></script>
 * <script src="https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/postprocessing/UnrealBloomPass.js"></script>
 */

module.exports = `
// === Bloom 后处理效果 ===

const composer = new THREE.EffectComposer(renderer);

// 渲染通道
const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

// Bloom 通道
const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,  // strength
    0.4,  // radius
    0.85  // threshold
);
composer.addPass(bloomPass);

// 注意：在动画循环中使用 composer.render() 替代 renderer.render()
`;
