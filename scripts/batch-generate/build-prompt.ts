import type { BatchPromptConfig } from './types';

/**
 * Build a highly structured prompt for batch generation.
 * Much more specific than the generic buildUserPrompt — specifies exact
 * equations, slider params, visual elements, and scenarios.
 */
export function buildBatchPrompt(config: BatchPromptConfig, language: 'en' | 'zh'): string {
  const langInstruction = language === 'zh'
    ? '所有文本内容（标题、描述、知识卡片、测验题目和选项）必须使用中文。变量名和代码注释用英文。'
    : 'All text content (title, description, knowledge cards, quiz questions and options) must be in English.';

  const upgradeNote = config.isUpgrade
    ? `\n## UPGRADE NOTE\nThis is an upgrade of an existing experiment. Focus on adding the missing features listed below while maintaining the core simulation quality.\n`
    : '';

  return `Create an interactive 3D physics simulation: "${config.title.en}"

${langInstruction}
${upgradeNote}
## PHYSICS SPECIFICATION
This simulation must demonstrate: ${config.concepts.join(', ')}

### Required Equations (render with KaTeX)
${config.equations.map((eq) => `- \\( ${eq} \\)`).join('\n')}

### Required Interactive Parameters (sliders)
${config.variables.map((v) => `- **${v.label}** (\`${v.name}\`): range ${v.min}–${v.max} ${v.unit}, default ${v.default}, step ${v.step}`).join('\n')}

### Required Visual Elements
${config.visualElements.map((v) => `- ${v}`).join('\n')}

### Preset Scenarios (for "Random Experiment" button)
${config.scenarios.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## QUALITY BENCHMARK
PhET equivalent: "${config.phetBenchmark}"
Your simulation MUST:
${config.mustExceed.map((m) => `- ${m}`).join('\n')}

## AP STANDARDS ALIGNMENT
${config.apStandards?.join(', ') || 'General physics education'}
Grade level: ${config.gradeLevel}

Output the complete HTML file now.`;
}
