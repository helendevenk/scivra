/**
 * 辅助函数
 *
 * 常用的工具函数
 */

module.exports = `
// === 辅助函数 ===

// 角度转弧度
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

// 弧度转角度
function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

// 限制数值范围
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// 线性插值
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// 映射数值范围
function map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// 随机数范围
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// 随机整数范围
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 向量长度
function vectorLength(x, y, z = 0) {
    return Math.sqrt(x * x + y * y + z * z);
}

// 向量归一化
function normalize(vector) {
    const length = vectorLength(vector.x, vector.y, vector.z);
    if (length === 0) return vector;
    return {
        x: vector.x / length,
        y: vector.y / length,
        z: vector.z / length
    };
}

// 颜色十六进制转 RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// RGB 转十六进制
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
`;
