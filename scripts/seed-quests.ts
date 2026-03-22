/**
 * Quest & Achievement Seed Script
 *
 * Seeds 3 quests with full step definitions and 5 achievements.
 *
 * Usage:
 *   npx tsx scripts/seed-quests.ts
 */

import { db } from '@/core/db';
import { quest, questStep, achievement } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

const QUESTS = [
  {
    slug: 'newtons-second-law-explorer',
    titleEn: "Newton's Second Law Explorer",
    titleZh: '牛顿第二定律探索者',
    descriptionEn:
      'Explore the relationship between force, mass, and acceleration through the Predict-Observe-Explain model.',
    descriptionZh:
      '通过预测-观察-解释模型，探索力、质量和加速度之间的关系。',
    category: 'mechanics',
    difficulty: 'beginner',
    tier: 'free',
    estimatedMinutes: 15,
    experimentId: 'forces-motion-basics',
    steps: [
      {
        orderIndex: 0,
        stepType: 'knowledge',
        titleEn: 'Understanding Force and Motion',
        titleZh: '理解力与运动',
        contentEn:
          "Newton's Second Law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. The formula is F = ma, where F is force (Newtons), m is mass (kg), and a is acceleration (m/s²).\n\nKey concepts:\n- Force is measured in Newtons (N)\n- 1 Newton = 1 kg·m/s²\n- Doubling the force doubles the acceleration\n- Doubling the mass halves the acceleration",
        contentZh:
          '牛顿第二定律指出，物体的加速度与作用在其上的净力成正比，与其质量成反比。公式为 F = ma，其中 F 是力（牛顿），m 是质量（千克），a 是加速度（米/秒²）。\n\n关键概念：\n- 力的单位是牛顿（N）\n- 1牛顿 = 1千克·米/秒²\n- 力增加一倍，加速度增加一倍\n- 质量增加一倍，加速度减半',
        config: null,
        maxPoints: 10,
      },
      {
        orderIndex: 1,
        stepType: 'predict',
        titleEn: 'Predict the Acceleration',
        titleZh: '预测加速度',
        contentEn:
          'A 2 kg box is pushed with a force of 10 N on a frictionless surface. What acceleration do you predict?',
        contentZh:
          '一个 2 千克的箱子在无摩擦表面上受到 10 牛顿的推力。你预测加速度是多少？',
        config: JSON.stringify({
          predictionType: 'numeric',
          numericTarget: 5,
          numericUnit: 'm/s²',
          numericTolerance: 10,
        }),
        maxPoints: 20,
      },
      {
        orderIndex: 2,
        stepType: 'experiment',
        titleEn: 'Run the Experiment',
        titleZh: '运行实验',
        contentEn:
          'Set the mass to 2 kg and apply a force of 10 N. Observe the acceleration value shown in the simulation.',
        contentZh:
          '将质量设置为 2 千克，施加 10 牛顿的力。观察模拟中显示的加速度值。',
        config: JSON.stringify({
          experimentSlug: 'forces-motion-basics',
          suggestedParameters: { mass: 2, force: 10 },
          observationTargets: ['acceleration'],
          minTimeSeconds: 10,
        }),
        maxPoints: 10,
      },
      {
        orderIndex: 3,
        stepType: 'compare',
        titleEn: 'Compare Results',
        titleZh: '对比结果',
        contentEn:
          'Compare your predicted acceleration with the observed value from the experiment. How close was your prediction?',
        contentZh:
          '将你预测的加速度与实验观察到的值进行比较。你的预测有多接近？',
        config: JSON.stringify({
          showChart: true,
          feedbackEn:
            'The acceleration should be exactly 5 m/s² (F/m = 10/2 = 5). Small deviations are normal in simulations.',
          feedbackZh:
            '加速度应该恰好是 5 米/秒²（F/m = 10/2 = 5）。模拟中的微小偏差是正常的。',
        }),
        maxPoints: 15,
      },
      {
        orderIndex: 4,
        stepType: 'explain',
        titleEn: 'Explain Your Findings',
        titleZh: '解释你的发现',
        contentEn:
          'Why does doubling the force on an object double its acceleration?',
        contentZh: '为什么将物体上的力加倍会使其加速度也加倍？',
        config: JSON.stringify({
          explanationType: 'multiple_choice',
          options_en: [
            'Because acceleration is directly proportional to force (a = F/m)',
            'Because the mass decreases when force increases',
            'Because the object moves faster so friction decreases',
            'Because energy is conserved',
          ],
          options_zh: [
            '因为加速度与力成正比（a = F/m）',
            '因为力增加时质量减小',
            '因为物体运动更快所以摩擦力减小',
            '因为能量守恒',
          ],
          correctIndex: 0,
          referenceEn:
            "According to Newton's Second Law (F = ma), acceleration is directly proportional to force when mass remains constant. Rearranging: a = F/m. So if F doubles, a doubles.",
          referenceZh:
            '根据牛顿第二定律（F = ma），当质量保持不变时，加速度与力成正比。变形后：a = F/m。所以如果 F 加倍，a 也加倍。',
        }),
        maxPoints: 15,
      },
    ],
  },
  {
    slug: 'conservation-of-energy',
    titleEn: 'Conservation of Energy',
    titleZh: '能量守恒',
    descriptionEn:
      'Discover how energy transforms between kinetic and potential forms using a skate park simulation.',
    descriptionZh:
      '使用滑板公园模拟，发现能量如何在动能和势能之间转换。',
    category: 'mechanics',
    difficulty: 'intermediate',
    tier: 'free',
    estimatedMinutes: 20,
    experimentId: 'energy-skate-park-basics',
    steps: [
      {
        orderIndex: 0,
        stepType: 'knowledge',
        titleEn: 'Energy Basics',
        titleZh: '能量基础',
        contentEn:
          "The Law of Conservation of Energy states that energy cannot be created or destroyed, only transformed from one form to another.\n\nIn a skate park:\n- At the top of a ramp: maximum potential energy (PE = mgh)\n- At the bottom: maximum kinetic energy (KE = ½mv²)\n- Total energy remains constant: PE + KE = constant\n\nKey variables:\n- m = mass, g = 9.8 m/s², h = height, v = velocity",
        contentZh:
          '能量守恒定律指出，能量不能被创造或消灭，只能从一种形式转化为另一种形式。\n\n在滑板公园中：\n- 在斜坡顶部：最大势能（PE = mgh）\n- 在底部：最大动能（KE = ½mv²）\n- 总能量保持不变：PE + KE = 常数\n\n关键变量：\n- m = 质量，g = 9.8 m/s²，h = 高度，v = 速度',
        config: null,
        maxPoints: 10,
      },
      {
        orderIndex: 1,
        stepType: 'predict',
        titleEn: 'Predict the Speed',
        titleZh: '预测速度',
        contentEn:
          'A 50 kg skater starts from rest at a height of 5 meters. What speed (m/s) will they reach at the bottom of the ramp? (Assume no friction)',
        contentZh:
          '一个 50 千克的滑板者从 5 米高处从静止开始。他们到达斜坡底部时的速度（米/秒）是多少？（假设无摩擦）',
        config: JSON.stringify({
          predictionType: 'numeric',
          numericTarget: 9.9,
          numericUnit: 'm/s',
          numericTolerance: 15,
        }),
        maxPoints: 20,
      },
      {
        orderIndex: 2,
        stepType: 'experiment',
        titleEn: 'Run the Skate Park',
        titleZh: '运行滑板公园',
        contentEn:
          'Place the skater at a height of 5 meters and release. Observe the speed at the bottom of the ramp. Watch how the energy bar graph changes.',
        contentZh:
          '将滑板者放在 5 米高处并释放。观察到达斜坡底部时的速度。观察能量条形图的变化。',
        config: JSON.stringify({
          experimentSlug: 'energy-skate-park-basics',
          suggestedParameters: { height: 5, mass: 50 },
          observationTargets: ['velocity', 'kinetic_energy', 'potential_energy'],
          minTimeSeconds: 15,
        }),
        maxPoints: 10,
      },
      {
        orderIndex: 3,
        stepType: 'compare',
        titleEn: 'Compare Predicted vs Observed',
        titleZh: '对比预测与观察',
        contentEn:
          'How does your predicted speed compare to the observed speed? The theoretical value is approximately 9.9 m/s (from v = sqrt(2gh)).',
        contentZh:
          '你预测的速度与观察到的速度相比如何？理论值约为 9.9 米/秒（由 v = sqrt(2gh) 得出）。',
        config: JSON.stringify({
          showChart: true,
          feedbackEn:
            'Using v = sqrt(2gh) = sqrt(2 × 9.8 × 5) ≈ 9.9 m/s. The speed depends only on height, not mass!',
          feedbackZh:
            '使用 v = sqrt(2gh) = sqrt(2 × 9.8 × 5) ≈ 9.9 m/s。速度只取决于高度，与质量无关！',
        }),
        maxPoints: 15,
      },
      {
        orderIndex: 4,
        stepType: 'explain',
        titleEn: 'Explain Energy Conservation',
        titleZh: '解释能量守恒',
        contentEn:
          'If we double the mass of the skater to 100 kg, what happens to the speed at the bottom?',
        contentZh:
          '如果我们将滑板者的质量加倍到 100 千克，底部的速度会发生什么变化？',
        config: JSON.stringify({
          explanationType: 'multiple_choice',
          options_en: [
            'The speed stays the same — mass cancels out in the energy equation',
            'The speed doubles because there is more energy',
            'The speed halves because the skater is heavier',
            'The speed increases by a factor of sqrt(2)',
          ],
          options_zh: [
            '速度保持不变——质量在能量方程中抵消了',
            '速度加倍因为有更多的能量',
            '速度减半因为滑板者更重',
            '速度增加 sqrt(2) 倍',
          ],
          correctIndex: 0,
          referenceEn:
            'Setting mgh = ½mv², the mass m cancels out: v = sqrt(2gh). Speed at the bottom depends only on height, not mass. Both a 50 kg and 100 kg skater reach the same speed from the same height.',
          referenceZh:
            '令 mgh = ½mv²，质量 m 抵消：v = sqrt(2gh)。底部的速度只取决于高度，与质量无关。50 千克和 100 千克的滑板者从相同高度到达底部的速度相同。',
        }),
        maxPoints: 15,
      },
    ],
  },
  {
    slug: 'wave-properties',
    titleEn: 'Wave Properties',
    titleZh: '波的性质',
    descriptionEn:
      'Explore the fundamental properties of waves including frequency, amplitude, and wavelength.',
    descriptionZh:
      '探索波的基本性质，包括频率、振幅和波长。',
    category: 'waves',
    difficulty: 'beginner',
    tier: 'free',
    estimatedMinutes: 15,
    experimentId: 'wave-on-string',
    steps: [
      {
        orderIndex: 0,
        stepType: 'knowledge',
        titleEn: 'Wave Fundamentals',
        titleZh: '波的基础知识',
        contentEn:
          "Waves transfer energy without transferring matter. Key properties:\n\n- **Amplitude**: Maximum displacement from equilibrium (height of wave)\n- **Wavelength (λ)**: Distance between two consecutive crests\n- **Frequency (f)**: Number of complete waves per second (Hz)\n- **Wave speed**: v = f × λ\n\nWhen you change frequency on a string, the wavelength changes but the wave speed stays roughly constant (determined by string tension and density).",
        contentZh:
          '波传递能量而不传递物质。关键性质：\n\n- **振幅**：从平衡位置的最大位移（波的高度）\n- **波长 (λ)**：两个连续波峰之间的距离\n- **频率 (f)**：每秒完整波的数量（赫兹）\n- **波速**：v = f × λ\n\n当你改变弦上的频率时，波长会改变，但波速大致保持不变（由弦的张力和密度决定）。',
        config: null,
        maxPoints: 10,
      },
      {
        orderIndex: 1,
        stepType: 'predict',
        titleEn: 'Predict the Effect',
        titleZh: '预测效果',
        contentEn:
          'If you double the frequency of a wave on a string (while keeping tension constant), what happens to the wavelength?',
        contentZh:
          '如果你将弦上波的频率加倍（同时保持张力不变），波长会发生什么变化？',
        config: JSON.stringify({
          predictionType: 'multiple_choice',
          options_en: [
            'Wavelength doubles',
            'Wavelength is halved',
            'Wavelength stays the same',
            'Wavelength becomes zero',
          ],
          options_zh: [
            '波长加倍',
            '波长减半',
            '波长保持不变',
            '波长变为零',
          ],
          correctIndex: 1,
        }),
        maxPoints: 20,
      },
      {
        orderIndex: 2,
        stepType: 'experiment',
        titleEn: 'Wave on a String',
        titleZh: '弦上的波',
        contentEn:
          'Set the frequency to 1 Hz and note the wavelength. Then change the frequency to 2 Hz. Observe how the wavelength changes.',
        contentZh:
          '将频率设置为 1 赫兹并记下波长。然后将频率改为 2 赫兹。观察波长的变化。',
        config: JSON.stringify({
          experimentSlug: 'wave-on-string',
          suggestedParameters: { frequency: 1, amplitude: 0.5 },
          observationTargets: ['wavelength', 'frequency'],
          minTimeSeconds: 15,
        }),
        maxPoints: 10,
      },
      {
        orderIndex: 3,
        stepType: 'compare',
        titleEn: 'Compare Wavelengths',
        titleZh: '对比波长',
        contentEn:
          'Compare the wavelength at 1 Hz and 2 Hz. Did the wavelength halve as predicted by v = fλ?',
        contentZh:
          '对比 1 赫兹和 2 赫兹时的波长。波长是否如 v = fλ 预测的那样减半了？',
        config: JSON.stringify({
          showChart: true,
          feedbackEn:
            'Since wave speed v is constant, doubling f means λ must halve: v = f₁λ₁ = f₂λ₂, so λ₂ = λ₁/2.',
          feedbackZh:
            '由于波速 v 是常数，频率翻倍意味着波长必须减半：v = f₁λ₁ = f₂λ₂，所以 λ₂ = λ₁/2。',
        }),
        maxPoints: 15,
      },
      {
        orderIndex: 4,
        stepType: 'explain',
        titleEn: 'Explain Wave Behavior',
        titleZh: '解释波的行为',
        contentEn:
          'Why does increasing the amplitude NOT change the wave speed?',
        contentZh: '为什么增大振幅不会改变波速？',
        config: JSON.stringify({
          explanationType: 'multiple_choice',
          options_en: [
            'Wave speed depends on the medium (tension and density), not amplitude',
            'Amplitude is measured in different units than speed',
            'Amplitude only affects the color of the wave',
            'Higher amplitude means lower frequency which cancels out',
          ],
          options_zh: [
            '波速取决于介质（张力和密度），与振幅无关',
            '振幅的单位与速度不同',
            '振幅只影响波的颜色',
            '更高的振幅意味着更低的频率，二者抵消',
          ],
          correctIndex: 0,
          referenceEn:
            'Wave speed on a string is determined by v = sqrt(T/μ), where T is tension and μ is linear mass density. Amplitude determines the energy carried by the wave, not its speed.',
          referenceZh:
            '弦上的波速由 v = sqrt(T/μ) 决定，其中 T 是张力，μ 是线密度。振幅决定了波携带的能量，而不是波速。',
        }),
        maxPoints: 15,
      },
    ],
  },
];

const ACHIEVEMENTS = [
  {
    slug: 'first-quest',
    titleEn: 'First Quest',
    titleZh: '首次挑战',
    descriptionEn: 'Complete your first physics quest',
    descriptionZh: '完成你的第一个物理挑战',
    icon: '🎯',
    category: 'quest',
    criteria: JSON.stringify({ type: 'quest_count', count: 1 }),
    rarity: 'common',
    sortOrder: 1,
  },
  {
    slug: 'physics-explorer',
    titleEn: 'Physics Explorer',
    titleZh: '物理探索者',
    descriptionEn: 'Complete 3 physics quests',
    descriptionZh: '完成 3 个物理挑战',
    icon: '🔬',
    category: 'quest',
    criteria: JSON.stringify({ type: 'quest_count', count: 3 }),
    rarity: 'rare',
    sortOrder: 2,
  },
  {
    slug: 'perfect-score',
    titleEn: 'Perfect Score',
    titleZh: '满分达成',
    descriptionEn: 'Achieve a perfect score on any quest',
    descriptionZh: '在任何挑战中获得满分',
    icon: '⭐',
    category: 'mastery',
    criteria: JSON.stringify({ type: 'perfect_score' }),
    rarity: 'epic',
    sortOrder: 3,
  },
  {
    slug: 'week-warrior',
    titleEn: 'Week Warrior',
    titleZh: '周挑战勇士',
    descriptionEn: 'Complete quests 7 days in a row',
    descriptionZh: '连续 7 天完成挑战',
    icon: '🔥',
    category: 'streak',
    criteria: JSON.stringify({ type: 'streak', days: 7 }),
    rarity: 'rare',
    sortOrder: 4,
  },
  {
    slug: 'master-physicist',
    titleEn: 'Master Physicist',
    titleZh: '物理大师',
    descriptionEn: 'Complete 10 physics quests',
    descriptionZh: '完成 10 个物理挑战',
    icon: '🏆',
    category: 'quest',
    criteria: JSON.stringify({ type: 'quest_count', count: 10 }),
    rarity: 'legendary',
    sortOrder: 5,
  },
];

async function seed() {
  console.log('Seeding quests and achievements...');

  for (const q of QUESTS) {
    const { steps, ...questData } = q;
    const questId = getUuid();

    // Insert quest
    await db()
      .insert(quest)
      .values({
        id: questId,
        ...questData,
        stepCount: steps.length,
        isPublished: true,
      })
      .onConflictDoNothing();

    console.log(`  Quest: ${q.slug} (${questId})`);

    // Insert steps
    for (const step of steps) {
      await db()
        .insert(questStep)
        .values({
          id: getUuid(),
          questId,
          ...step,
        })
        .onConflictDoNothing();
    }
    console.log(`    ${steps.length} steps inserted`);
  }

  for (const ach of ACHIEVEMENTS) {
    await db()
      .insert(achievement)
      .values({
        id: getUuid(),
        ...ach,
      })
      .onConflictDoNothing();
    console.log(`  Achievement: ${ach.slug}`);
  }

  console.log('Done!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
