/**
 * Content Moderation Tests
 *
 * 简单的测试用例，验证审核功能是否正常工作
 */

import { moderateInput, moderateOutput } from '@/shared/lib/moderation/content-moderator';

// 测试输入审核
console.log('=== 测试输入审核 ===\n');

// 测试 1: 正常内容
const test1 = moderateInput('牛顿第二定律');
console.log('测试 1 - 正常内容:');
console.log('  输入: "牛顿第二定律"');
console.log('  结果:', test1);
console.log('  ✅ 预期: passed=true, status=pass\n');

// 测试 2: 高严重性敏感词
const test2 = moderateInput('这是一个暴力的内容');
console.log('测试 2 - 高严重性敏感词:');
console.log('  输入: "这是一个暴力的内容"');
console.log('  结果:', test2);
console.log('  ✅ 预期: passed=false, status=reject\n');

// 测试 3: 英文敏感词
const test3 = moderateInput('This is about violence');
console.log('测试 3 - 英文敏感词:');
console.log('  输入: "This is about violence"');
console.log('  结果:', test3);
console.log('  ✅ 预期: passed=false, status=reject\n');

// 测试输出审核
console.log('=== 测试输出审核 ===\n');

// 测试 4: 安全的 HTML
const safeHtml = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"></script>
  <style>
    body { margin: 0; }
  </style>
</head>
<body>
  <script>
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  </script>
</body>
</html>
`;

const test4 = moderateOutput(safeHtml);
console.log('测试 4 - 安全的 HTML:');
console.log('  结果:', test4);
console.log('  ✅ 预期: passed=true, status=pass\n');

// 测试 5: 包含事件处理器
const unsafeHtml1 = '<div onclick="alert(1)">Click me</div>';
const test5 = moderateOutput(unsafeHtml1);
console.log('测试 5 - 包含事件处理器:');
console.log('  输入: "<div onclick=\\"alert(1)\\">Click me</div>"');
console.log('  结果:', test5);
console.log('  ✅ 预期: passed=false, status=reject\n');

// 测试 6: 包含非白名单脚本
const unsafeHtml2 = '<script src="https://evil.com/malware.js"></script>';
const test6 = moderateOutput(unsafeHtml2);
console.log('测试 6 - 包含非白名单脚本:');
console.log('  输入: "<script src=\\"https://evil.com/malware.js\\"></script>"');
console.log('  结果:', test6);
console.log('  ✅ 预期: passed=false, status=reject\n');

// 测试 7: 包含 javascript: 协议
const unsafeHtml3 = '<a href="javascript:alert(1)">Click</a>';
const test7 = moderateOutput(unsafeHtml3);
console.log('测试 7 - 包含 javascript: 协议:');
console.log('  输入: "<a href=\\"javascript:alert(1)\\">Click</a>"');
console.log('  结果:', test7);
console.log('  ✅ 预期: passed=false, status=reject\n');

// 测试 8: 包含 localStorage 访问
const unsafeHtml4 = '<script>localStorage.setItem("key", "value");</script>';
const test8 = moderateOutput(unsafeHtml4);
console.log('测试 8 - 包含 localStorage 访问:');
console.log('  输入: "<script>localStorage.setItem(\\"key\\", \\"value\\");</script>"');
console.log('  结果:', test8);
console.log('  ✅ 预期: passed=false, status=reject\n');

console.log('=== 测试完成 ===');
