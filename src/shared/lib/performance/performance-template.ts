/**
 * 性能检测和自适应渲染模板
 * 这些代码将被嵌入到 UPG 生成的 HTML 中
 */

import type { PerformanceTier } from './performance-tier';
import { getRenderConfig, generateRendererCode, generateFPSMonitorCode } from './adaptive-renderer';

/**
 * 生成完整的性能检测和配置代码（嵌入到 HTML <script> 中）
 */
export function generatePerformanceDetectionCode(): string {
  return `
// ========== 设备性能检测 ==========
function detectDevicePerformanceTier() {
  // 检测设备类型
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isTablet = /tablet|ipad|playbook|silk/i.test(ua) || (isMobile && window.innerWidth >= 768);
  const deviceType = isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop');

  // 检测 GPU
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  let gpuScore = 50;

  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    const rendererLower = renderer.toLowerCase();

    if (rendererLower.includes('nvidia') || rendererLower.includes('geforce')) {
      gpuScore = 80;
    } else if (rendererLower.includes('amd') || rendererLower.includes('radeon')) {
      gpuScore = 75;
    } else if (rendererLower.includes('apple') || rendererLower.includes('m1') || rendererLower.includes('m2')) {
      gpuScore = 85;
    } else if (rendererLower.includes('intel')) {
      gpuScore = 60;
    }

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    if (maxTextureSize >= 16384) gpuScore += 10;
    else if (maxTextureSize < 4096) gpuScore -= 10;
  } else {
    gpuScore = 0;
  }

  // 检测内存和 CPU
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 2;

  // 综合判断性能等级
  let tier = 'medium';

  if (deviceType === 'mobile') {
    tier = (memory >= 6 && gpuScore >= 60) ? 'medium' : 'low';
  } else if (deviceType === 'tablet') {
    if (memory >= 8 && gpuScore >= 70) tier = 'high';
    else if (memory >= 4 && gpuScore >= 50) tier = 'medium';
    else tier = 'low';
  } else {
    const totalScore = (gpuScore * 0.5) + (cores / 8 * 100 * 0.3) + (memory / 16 * 100 * 0.2);
    if (totalScore >= 75) tier = 'high';
    else if (totalScore >= 50) tier = 'medium';
    else tier = 'low';
  }

  // 检查用户手动设置
  try {
    const saved = localStorage.getItem('upg_performance_tier');
    if (saved && ['high', 'medium', 'low'].includes(saved)) {
      tier = saved;
    }
  } catch (e) {}

  return { tier, deviceType, gpuScore, memory, cores };
}

// 执行检测
const deviceInfo = detectDevicePerformanceTier();
console.log('Device Performance:', deviceInfo);

// ========== 性能配置 ==========
const performanceConfig = {
  high: {
    antialias: true,
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    shadowMapEnabled: true,
    maxParticles: 10000,
    geometryDetail: 'high',
    targetFPS: 60,
    enableAdaptiveDegradation: false,
  },
  medium: {
    antialias: true,
    pixelRatio: 1,
    shadowMapEnabled: false,
    maxParticles: 5000,
    geometryDetail: 'medium',
    targetFPS: 45,
    enableAdaptiveDegradation: true,
  },
  low: {
    antialias: false,
    pixelRatio: 1,
    shadowMapEnabled: false,
    maxParticles: 1000,
    geometryDetail: 'low',
    targetFPS: 30,
    enableAdaptiveDegradation: true,
  },
};

const config = performanceConfig[deviceInfo.tier];
console.log('Render Config:', config);
`.trim();
}

/**
 * 生成性能模式切换 UI 代码
 */
export function generatePerformanceControlUI(): string {
  return `
<!-- 性能模式切换器 -->
<div id="performance-control" style="position: fixed; top: 10px; right: 10px; z-index: 1000; background: rgba(0,0,0,0.7); padding: 10px; border-radius: 8px; color: white; font-size: 12px;">
  <div style="margin-bottom: 5px;">性能模式:</div>
  <select id="performance-selector" style="width: 100%; padding: 5px; border-radius: 4px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2);">
    <option value="auto">自动检测</option>
    <option value="high">高性能</option>
    <option value="medium">中等</option>
    <option value="low">省电模式</option>
  </select>
  <div id="fps-display" style="margin-top: 5px; font-size: 11px; opacity: 0.7;">FPS: --</div>
</div>

<script>
// 性能模式切换逻辑
const performanceSelector = document.getElementById('performance-selector');
const fpsDisplay = document.getElementById('fps-display');

// 加载保存的设置
try {
  const saved = localStorage.getItem('upg_performance_tier');
  if (saved) {
    performanceSelector.value = saved === 'auto' ? 'auto' : saved;
  } else {
    performanceSelector.value = 'auto';
  }
} catch (e) {}

// 监听切换事件
performanceSelector.addEventListener('change', (e) => {
  const value = e.target.value;
  try {
    if (value === 'auto') {
      localStorage.removeItem('upg_performance_tier');
    } else {
      localStorage.setItem('upg_performance_tier', value);
    }
  } catch (e) {}

  // 提示用户刷新页面
  if (confirm('性能模式已更改，需要刷新页面以应用新设置。是否立即刷新？')) {
    window.location.reload();
  }
});

// FPS 监控
let frameCount = 0;
let lastTime = performance.now();

function updateFPS() {
  frameCount++;
  const currentTime = performance.now();
  const elapsed = currentTime - lastTime;

  if (elapsed >= 1000) {
    const fps = Math.round((frameCount * 1000) / elapsed);
    fpsDisplay.textContent = \`FPS: \${fps}\`;

    // 根据 FPS 改变颜色
    if (fps >= config.targetFPS * 0.9) {
      fpsDisplay.style.color = '#10B981'; // 绿色
    } else if (fps >= config.targetFPS * 0.7) {
      fpsDisplay.style.color = '#F59E0B'; // 黄色
    } else {
      fpsDisplay.style.color = '#EF4444'; // 红色
    }

    frameCount = 0;
    lastTime = currentTime;
  }
}
</script>
`.trim();
}

/**
 * 生成移动端触摸优化代码
 */
export function generateMobileTouchOptimization(): string {
  return `
// ========== 移动端触摸优化 ==========
if (deviceInfo.deviceType === 'mobile' || deviceInfo.deviceType === 'tablet') {
  // 防止页面滚动冲突
  const canvas = document.getElementById('canvas');

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault(); // 防止双指缩放页面
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // 防止拖动时滚动页面
  }, { passive: false });

  // 禁用长按菜单
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // 添加触摸提示
  const touchHint = document.createElement('div');
  touchHint.textContent = '👆 单指旋转 | ✌️ 双指缩放';
  touchHint.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; z-index: 999; pointer-events: none;';
  document.body.appendChild(touchHint);

  // 3秒后淡出提示
  setTimeout(() => {
    touchHint.style.transition = 'opacity 1s';
    touchHint.style.opacity = '0';
    setTimeout(() => touchHint.remove(), 1000);
  }, 3000);
}
`.trim();
}

/**
 * 生成完整的性能优化模板（包含检测 + UI + 优化）
 */
export function generateCompletePerformanceTemplate(): string {
  return `
${generatePerformanceDetectionCode()}

${generateMobileTouchOptimization()}

<!-- 在 </body> 前插入性能控制 UI -->
${generatePerformanceControlUI()}
`.trim();
}

/**
 * 将性能检测代码注入到现有 HTML 中
 */
export function injectPerformanceCode(html: string): string {
  // 在第一个 <script> 标签之前插入性能检测代码
  const performanceCode = `<script>\n${generatePerformanceDetectionCode()}\n</script>\n`;

  const scriptIndex = html.indexOf('<script>');
  if (scriptIndex !== -1) {
    return html.slice(0, scriptIndex) + performanceCode + html.slice(scriptIndex);
  }

  // 如果没有 <script> 标签，在 </head> 前插入
  const headEndIndex = html.indexOf('</head>');
  if (headEndIndex !== -1) {
    return html.slice(0, headEndIndex) + performanceCode + html.slice(headEndIndex);
  }

  // 兜底：在 <body> 后插入
  const bodyIndex = html.indexOf('<body>');
  if (bodyIndex !== -1) {
    return html.slice(0, bodyIndex + 6) + performanceCode + html.slice(bodyIndex + 6);
  }

  return html;
}

/**
 * 将性能控制 UI 注入到现有 HTML 中
 */
export function injectPerformanceUI(html: string): string {
  const uiCode = generatePerformanceControlUI();

  // 在 </body> 前插入
  const bodyEndIndex = html.lastIndexOf('</body>');
  if (bodyEndIndex !== -1) {
    return html.slice(0, bodyEndIndex) + uiCode + '\n' + html.slice(bodyEndIndex);
  }

  return html;
}

/**
 * 将移动端优化代码注入到现有 HTML 中
 */
export function injectMobileOptimization(html: string): string {
  const mobileCode = `<script>\n${generateMobileTouchOptimization()}\n</script>\n`;

  // 在最后一个 </script> 后插入
  const lastScriptIndex = html.lastIndexOf('</script>');
  if (lastScriptIndex !== -1) {
    return html.slice(0, lastScriptIndex + 9) + '\n' + mobileCode + html.slice(lastScriptIndex + 9);
  }

  return html;
}
