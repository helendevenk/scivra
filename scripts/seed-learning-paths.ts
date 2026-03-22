/**
 * Seed script: insert sample learning paths for NeonPhysics v2
 * Run: npx tsx scripts/seed-learning-paths.ts
 */

import { eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { learningPath, learningPathNode } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

async function main() {

  const paths = [
    {
      slug: 'newton-mechanics-beginner',
      titleEn: "Newton's Laws of Motion",
      titleZh: '牛顿运动定律',
      descriptionEn:
        'Master the three laws of motion through interactive simulations. Aligned with NGSS HS-PS2 and AP Physics 1.',
      descriptionZh:
        '通过互动模拟掌握三大运动定律，与 NGSS HS-PS2 和 AP 物理 1 课标对齐。',
      category: 'mechanics',
      level: 'beginner',
      isPublished: true,
      nodes: [
        {
          titleEn: "Newton's First Law — Inertia",
          titleZh: '牛顿第一定律 — 惯性',
          descriptionEn:
            'Objects at rest stay at rest; objects in motion stay in motion unless acted on by a net force.',
          descriptionZh: '静止的物体保持静止，运动的物体保持运动，除非受到合外力。',
          experimentSlug: 'newtons-laws-of-motion',
          quizQuestion: JSON.stringify({
            question_en: 'What does Newton\'s First Law describe?',
            question_zh: '牛顿第一定律描述的是什么？',
            options_en: ['Inertia', 'F=ma', 'Action-Reaction', 'Gravity'],
            options_zh: ['惯性', 'F=ma', '作用力与反作用力', '重力'],
            correct_index: 0,
            explanation_en: 'Newton\'s First Law describes inertia — an object\'s resistance to change in motion.',
            explanation_zh: '牛顿第一定律描述惯性——物体对运动状态改变的抵抗。',
          }),
        },
        {
          titleEn: "Newton's Second Law — F = ma",
          titleZh: '牛顿第二定律 — F = ma',
          descriptionEn:
            'Explore the relationship between force, mass, and acceleration.',
          descriptionZh: '探索力、质量与加速度之间的定量关系。',
          experimentSlug: 'newtons-laws-of-motion',
          quizQuestion: JSON.stringify({
            question_en: 'If mass doubles and force stays the same, what happens to acceleration?',
            question_zh: '若质量加倍而力不变，加速度如何变化？',
            options_en: ['Doubles', 'Halves', 'Stays the same', 'Quadruples'],
            options_zh: ['加倍', '减半', '不变', '变为四倍'],
            correct_index: 1,
            explanation_en: 'From F=ma, a = F/m. If m doubles, a halves.',
            explanation_zh: '由 F=ma 得 a=F/m，m 加倍则 a 减半。',
          }),
        },
        {
          titleEn: "Newton's Third Law — Action & Reaction",
          titleZh: '牛顿第三定律 — 作用力与反作用力',
          descriptionEn:
            'Every action has an equal and opposite reaction.',
          descriptionZh: '每个作用力都有等大反向的反作用力。',
          experimentSlug: null,
          quizQuestion: JSON.stringify({
            question_en: 'When you push a wall, the wall pushes back with:',
            question_zh: '当你推墙时，墙以什么力推回你？',
            options_en: ['Less force', 'More force', 'Equal force', 'No force'],
            options_zh: ['更小的力', '更大的力', '等大的力', '没有力'],
            correct_index: 2,
            explanation_en: 'Newton\'s Third Law: action and reaction forces are equal in magnitude.',
            explanation_zh: '牛顿第三定律：作用力与反作用力大小相等。',
          }),
        },
      ],
    },
    {
      slug: 'projectile-motion-intermediate',
      titleEn: 'Projectile Motion',
      titleZh: '抛体运动',
      descriptionEn:
        'Understand 2D kinematics and projectile trajectories with interactive visualizations.',
      descriptionZh: '通过互动可视化理解二维运动学和抛体轨迹。',
      category: 'mechanics',
      level: 'intermediate',
      isPublished: true,
      nodes: [
        {
          titleEn: 'Horizontal & Vertical Components',
          titleZh: '水平分量与竖直分量',
          descriptionEn:
            'Decompose projectile motion into independent horizontal and vertical components.',
          descriptionZh: '将抛体运动分解为独立的水平分量和竖直分量。',
          experimentSlug: null,
          quizQuestion: JSON.stringify({
            question_en: 'In projectile motion, horizontal velocity is:',
            question_zh: '在抛体运动中，水平速度是：',
            options_en: ['Increasing', 'Decreasing', 'Constant', 'Zero'],
            options_zh: ['增大', '减小', '不变', '为零'],
            correct_index: 2,
            explanation_en: 'No horizontal force acts, so horizontal velocity remains constant (ignoring air resistance).',
            explanation_zh: '没有水平力作用，所以水平速度保持不变（忽略空气阻力）。',
          }),
        },
        {
          titleEn: 'Launch Angle & Range',
          titleZh: '发射角与射程',
          descriptionEn:
            'Discover how launch angle affects range, height, and time of flight.',
          descriptionZh: '发现发射角如何影响射程、高度和飞行时间。',
          experimentSlug: 'projectile-motion',
          quizQuestion: JSON.stringify({
            question_en: 'At what launch angle is the range maximized (on flat ground)?',
            question_zh: '在平地上，什么发射角射程最大？',
            options_en: ['30°', '45°', '60°', '90°'],
            options_zh: ['30°', '45°', '60°', '90°'],
            correct_index: 1,
            explanation_en: '45° maximizes range because it balances horizontal velocity and time of flight.',
            explanation_zh: '45° 射程最大，因为它在水平速度和飞行时间之间取得平衡。',
          }),
        },
        {
          titleEn: 'Real-World Applications',
          titleZh: '现实应用',
          descriptionEn:
            'Apply projectile concepts to sports, engineering, and space missions.',
          descriptionZh: '将抛体概念应用于体育、工程和航天任务中。',
          experimentSlug: null,
          quizQuestion: JSON.stringify({
            question_en: 'A ball is thrown horizontally from a cliff. What determines how far it travels?',
            question_zh: '一个球从悬崖水平抛出，什么决定它飞行多远？',
            options_en: ['Only initial speed', 'Only height', 'Both speed and height', 'Neither'],
            options_zh: ['只有初速度', '只有高度', '速度和高度都影响', '都不影响'],
            correct_index: 2,
            explanation_en: 'Range = v₀ × t, where t depends on height. Both initial speed and height matter.',
            explanation_zh: '射程 = v₀ × t，t 取决于高度，因此初速度和高度都有影响。',
          }),
        },
      ],
    },
    {
      slug: 'energy-conservation-advanced',
      titleEn: 'Energy Conservation',
      titleZh: '能量守恒',
      descriptionEn:
        'Explore kinetic and potential energy transformations through roller coaster physics.',
      descriptionZh: '通过过山车物理探索动能与势能的转化。',
      category: 'energy',
      level: 'advanced',
      isPublished: true,
      nodes: [
        {
          titleEn: 'Kinetic & Potential Energy',
          titleZh: '动能与势能',
          descriptionEn:
            'Define KE = ½mv² and PE = mgh, explore their interconversion.',
          descriptionZh: '定义 KE = ½mv² 和 PE = mgh，探索两者之间的相互转化。',
          experimentSlug: null,
          quizQuestion: JSON.stringify({
            question_en: 'At the top of a roller coaster loop, which energy form dominates?',
            question_zh: '在过山车环形轨道顶点，哪种能量形式占主导？',
            options_en: ['Kinetic energy', 'Potential energy', 'Thermal energy', 'Sound energy'],
            options_zh: ['动能', '势能', '热能', '声能'],
            correct_index: 1,
            explanation_en: 'At the top, height is maximum so potential energy PE = mgh is at its peak.',
            explanation_zh: '在顶点，高度最大，所以势能 PE = mgh 达到峰值。',
          }),
        },
        {
          titleEn: 'Roller Coaster Energy Analysis',
          titleZh: '过山车能量分析',
          descriptionEn:
            'Track energy transformations at every point of a roller coaster loop.',
          descriptionZh: '追踪过山车环形轨道每个节点处的能量转化。',
          experimentSlug: 'roller-coaster-energy',
          quizQuestion: JSON.stringify({
            question_en: 'In an ideal (frictionless) roller coaster, total mechanical energy is:',
            question_zh: '在理想（无摩擦）过山车中，总机械能：',
            options_en: ['Increasing', 'Decreasing', 'Conserved', 'Zero'],
            options_zh: ['增大', '减小', '守恒', '为零'],
            correct_index: 2,
            explanation_en: 'Without friction, no energy is lost to heat, so total mechanical energy is conserved.',
            explanation_zh: '没有摩擦，能量不转化为热，所以总机械能守恒。',
          }),
        },
        {
          titleEn: 'Friction & Energy Loss',
          titleZh: '摩擦力与能量损耗',
          descriptionEn:
            'Understand how friction converts mechanical energy to thermal energy.',
          descriptionZh: '理解摩擦力如何将机械能转化为热能。',
          experimentSlug: null,
          quizQuestion: JSON.stringify({
            question_en: 'A roller coaster with friction reaches a lower final height than its starting height because:',
            question_zh: '有摩擦的过山车最终高度低于起始高度，原因是：',
            options_en: ['Gravity increased', 'Energy was lost to heat', 'Mass changed', 'Velocity increased'],
            options_zh: ['重力增大了', '能量以热能形式散失', '质量变化了', '速度增大了'],
            correct_index: 1,
            explanation_en: 'Friction converts mechanical energy to thermal energy, reducing the total available for height.',
            explanation_zh: '摩擦将机械能转化为热能，减少了可用于升高的总能量。',
          }),
        },
      ],
    },
  ];

  for (const pathData of paths) {
    const { nodes, ...pathFields } = pathData;

    // Check if already exists
    const existing = await db()
      .select()
      .from(learningPath)
      .where(eq(learningPath.slug, pathFields.slug));

    if (existing.length > 0) {
      console.log(`⏭  Skipping "${pathFields.slug}" (already exists)`);
      continue;
    }

    const pathId = getUuid();
    await db().insert(learningPath).values({
      id: pathId,
      ...pathFields,
      nodeCount: nodes.length,
    });
    console.log(`✅ Created learning path: ${pathFields.titleEn}`);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      await db().insert(learningPathNode).values({
        id: getUuid(),
        pathId,
        orderIndex: i,
        titleEn: node.titleEn,
        titleZh: node.titleZh,
        descriptionEn: node.descriptionEn,
        descriptionZh: node.descriptionZh,
        experimentSlug: node.experimentSlug ?? null,
        quizQuestion: node.quizQuestion,
      });
      console.log(`   └─ Node ${i + 1}: ${node.titleEn}`);
    }
  }

  console.log('\n🎉 Seed complete!');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
