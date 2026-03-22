/**
 * 性能优化模块测试
 * 验证性能检测和自适应渲染功能
 */

import {
  detectDeviceType,
  detectGPU,
  detectCPU,
  detectMemory,
  detectNetwork,
  getDeviceInfo,
} from './device-detector';

import {
  calculatePerformanceTier,
  getPerformanceTier,
  getUserPreferredTier,
  saveUserPreferredTier,
} from './performance-tier';

import {
  getRenderConfig,
  generateRendererCode,
  generateGeometryCode,
  generateFPSMonitorCode,
} from './adaptive-renderer';

import {
  generatePerformanceDetectionCode,
  generatePerformanceControlUI,
  generateMobileTouchOptimization,
  generateCompletePerformanceTemplate,
  injectPerformanceCode,
  injectPerformanceUI,
  injectMobileOptimization,
} from './performance-template';

// 测试函数
export function testPerformanceModule() {
  console.log('=== Performance Module Test ===');

  // 1. 测试设备检测
  console.log('\n1. Device Detection:');
  console.log('Device Type:', detectDeviceType());
  console.log('Memory:', detectMemory(), 'GB');
  console.log('Network:', detectNetwork());

  // 2. 测试性能分级
  console.log('\n2. Performance Tier:');
  const profile = calculatePerformanceTier();
  console.log('Tier:', profile.tier);
  console.log('Reason:', profile.reason);
  console.log('GPU Score:', profile.gpuScore);
  console.log('CPU Score:', profile.cpuScore);

  // 3. 测试渲染配置
  console.log('\n3. Render Config:');
  const config = getRenderConfig(profile.tier);
  console.log('Antialias:', config.antialias);
  console.log('Pixel Ratio:', config.pixelRatio);
  console.log('Max Particles:', config.maxParticles);
  console.log('Target FPS:', config.targetFPS);

  // 4. 测试代码生成
  console.log('\n4. Code Generation:');
  const rendererCode = generateRendererCode(config);
  console.log('Renderer Code Length:', rendererCode.length);

  const geometryCode = generateGeometryCode(config, 'sphere');
  console.log('Geometry Code:', geometryCode);

  // 5. 测试 HTML 注入
  console.log('\n5. HTML Injection:');
  const sampleHTML = `
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
<script>
console.log('test');
</script>
</body>
</html>
  `.trim();

  const injectedHTML = injectPerformanceCode(sampleHTML);
  console.log('Injected HTML Length:', injectedHTML.length);
  console.log('Contains Performance Code:', injectedHTML.includes('detectDevicePerformanceTier'));

  console.log('\n=== Test Complete ===');
}

// 导出测试函数
export default testPerformanceModule;
