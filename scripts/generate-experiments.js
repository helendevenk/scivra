#!/usr/bin/env node

/**
 * 批量生成科学实验 HTML 文件
 * 使用 MiniMax API 和 UPG System Prompt
 */

const fs = require('fs');
const path = require('path');

// 读取实验清单
const experimentList = JSON.parse(
  fs.readFileSync('docs/experiments/experiment-list.json', 'utf8')
);

// 要生成的实验 ID
const experimentIds = [9, 1, 8, 3, 10];

// 实验 Prompt 模板
function generateExperimentPrompt(experiment) {
  const prompts = {
    1: `创建一个交互式的"力与运动"实验（小学 3-5 年级）。

要求：
1. 3D 场景展示推力和拉力如何改变物体运动
2. 包含一个小球，可以通过滑块调整施加的力的大小和方向
3. 展示平衡力（物体静止）和不平衡力（物体运动）的区别
4. 控制面板：力的大小、力的方向、摩擦力系数
5. 公式：F = ma（牛顿第二定律）、摩擦力 f = μN
6. 知识卡片：推力、拉力、平衡力、不平衡力、摩擦力
7. 测验题：关于力与运动的基础概念

适合小学生理解，使用简单的语言和直观的可视化。`,

    3: `创建一个交互式的"光的传播"实验（小学 1-4 年级）。

要求：
1. 3D 场景展示光的直线传播、反射和折射
2. 包含光源、镜子、透明/不透明物体
3. 可以调整光源位置、镜子角度、物体材质
4. 控制面板：光源强度、镜子角度、物体透明度
5. 公式：反射定律（入射角 = 反射角）、折射定律（斯涅尔定律简化版）
6. 知识卡片：直线传播、反射、折射、透明、不透明、半透明
7. 测验题：关于光的传播和反射的基础概念

使用明亮的颜色和动画效果，让小学生容易理解。`,

    8: `创建一个交互式的"昼夜与季节"实验（小学 K-5 年级）。

要求：
1. 3D 场景展示地球自转（昼夜）和公转（季节）
2. 包含太阳、地球（带地轴倾斜）、月球
3. 可以控制地球自转速度、公转位置、观察视角
4. 控制面板：自转速度、公转位置（春夏秋冬）、地轴倾角
5. 公式：地球自转周期 24 小时、公转周期 365 天
6. 知识卡片：自转、公转、地轴倾斜、太阳高度角、四季变化
7. 测验题：关于昼夜和季节形成的基础概念

使用太空主题的深色背景，地球要有纹理和光照效果。`,

    9: `创建一个交互式的"月相变化"实验（小学 1-5 年级）。

要求：
1. 3D 场景展示太阳-地球-月球系统
2. 月球绕地球公转，展示不同位置的月相（新月、上弦月、满月、下弦月等）
3. 可以控制月球公转位置、观察视角
4. 控制面板：月球公转位置、观察角度、时间流速
5. 公式：月相周期约 29.5 天
6. 知识卡片：新月、上弦月、满月、下弦月、月相周期、光照角度
7. 测验题：关于月相变化和形成原因的基础概念

使用太空主题，月球要有真实的表面纹理和光照效果。`,

    10: `创建一个交互式的"能量转换"实验（小学 4-5 年级）。

要求：
1. 3D 场景展示多种能量形式的转换（动能、势能、热能、光能、声能）
2. 包含一个过山车或摆锤系统，展示动能和势能的相互转换
3. 可以调整初始高度、质量、摩擦力
4. 控制面板：初始高度、物体质量、摩擦系数、能量损失
5. 公式：动能 KE = ½mv²、势能 PE = mgh、能量守恒定律
6. 知识卡片：动能、势能、热能、光能、声能、能量守恒、能量转换
7. 测验题：关于能量转换和守恒的基础概念

使用彩色的能量条和动画效果，直观展示能量的流动和转换。`
  };

  return prompts[experiment.id] || `创建一个关于"${experiment.title}"的交互式科学实验。`;
}

console.log('准备生成 5 个实验...\n');

experimentIds.forEach(id => {
  const experiment = experimentList.elementary.p0.find(e => e.id === id);
  if (experiment) {
    console.log(`${id}. ${experiment.title} (${experiment.grade})`);
    console.log(`   文件名: ${experiment.filename}`);
    console.log(`   Prompt: ${generateExperimentPrompt(experiment).substring(0, 100)}...`);
    console.log('');
  }
});

console.log('\n提示：由于需要调用 MiniMax API，请手动执行以下步骤：');
console.log('1. 访问 http://localhost:3000/zh/upg');
console.log('2. 依次输入上述 5 个实验的 Prompt');
console.log('3. 生成后下载 HTML 文件');
console.log('4. 将文件保存到 public/experiments/elementary/ 目录');
console.log('\n或者，使用 API 直接调用（需要配置 MINIMAX_API_KEY）');
